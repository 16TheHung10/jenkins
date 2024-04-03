import { CaretRightOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, InputNumber, Modal, Popover, Row, Space, Tag, Tooltip, message } from 'antd';
import BaseComponent from 'components/BaseComponent';
import AutocompleteBarcode from 'components/mainContent/promotion/autocompleteBarcode';
import { AppContext } from 'contexts/AppContext';
import { ImageHelper, StringHelper } from 'helpers';
import { createDataTable, getBase64 } from 'helpers/FuncHelper';
import IconProduct from 'images/logo.png';
import moment from 'moment';
import React from 'react';
import InputComp from 'utils/input';
import InputNumberComp from 'utils/inputNumber';
import RadioComp from 'utils/radio';
import RangePicker from 'utils/rangePicker';
import SelectBox from 'utils/selectBox';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';
import TableCustom from 'utils/tableCustom';
import Icons from 'images/icons';
import UploadImageBuyOneGetOne from './uploadImageBuyOneGetOne';
import UploadImageBuyOneGetOneEdit from './uploadImageBuyOneGetOneEdit';

const { Panel } = Collapse;

export default class ControlPromotionBuyOneGetOneDetail extends BaseComponent {
  constructor(props) {
    super(props);

    this.idBarcodeItemRef = React.createRef();
    this.idBarcodeItem = 'idBarcodeItem' + StringHelper.randomKey();

    this.idQtyItemRef = React.createRef();
    this.idTypeItemRef = React.createRef();
    this.idStatusRef = React.createRef();

    this.isCopyType = this.props.type || false;

    this.isCreate = this.props.isCreate;
    this.infoPromotion = this.props.infoPromotion || {};

    this.isUpdateForm = (this.infoPromotion.poCode || '') !== '';
    this.isAllowUpdate = !this.isUpdateForm || (!this.infoPromotion.approved && !this.infoPromotion.cancel);

    this.items = this.props.items || [];

    /*----------------------------------------*/
    /*----------------------------------------*/

    this.data.stores = [];

    if (this.infoPromotion.storeCode) {
      this.fieldSelected.storeCode = this.infoPromotion.storeCode;
      this.data.storeName = this.infoPromotion.storeName;
    } else {
      this.fieldSelected.storeCode = [];
    }
    this.fieldSelected.promotionName = !this.isCopyType ? this.props.promotionName : '';
    this.fieldSelected.docLink = this.props.docLink;
    this.fieldSelected.docCode = this.props.docCode;
    this.fieldSelected.itemImageList = null;
    this.fieldSelected.itemImageListEdit = null;
    this.fieldSelected.itemImageListEditSelected = null;
    this.fieldSelected.isReset = false;
    this.fieldSelected.createdDate = !this.isCopyType
      ? this.infoPromotion.createdDate
        ? new Date(this.infoPromotion.createdDate)
        : new Date()
      : '';
    this.fieldSelected.startDate = !this.isCopyType
      ? this.infoPromotion.fromDate
        ? moment(this.infoPromotion.fromDate)
        : moment().add(1, 'days')
      : moment().add(1, 'days');
    this.fieldSelected.endDate = !this.isCopyType
      ? this.infoPromotion.toDate
        ? new Date(this.infoPromotion.toDate)
        : moment().add(1, 'days')
      : moment().add(1, 'days');

    this.fieldSelected.group = '';

    this.fieldSelected.orderStatus = !this.isCopyType
      ? this.infoPromotion.active === 0
        ? 2
        : this.infoPromotion.active
      : '';
    this.listGroup = this.props.group || [];

    /* --------- */
    this.allItems = this.props.allItems || {};
    this.dataTableAdd = [];
    this.dataTableAddOld = [];

    this.itemAdd = {};
    this.itemAdd.qty = 0;
    this.itemAdd.type = 0;

    this.dataAddGroup = [];

    this.isUpdate = false;

    this.isEditting = false;
    this.fieldSelected.itemEdit = null;
    this.fieldSelected.itemEditBase64 = null;
    this.fieldSelected.itemEditBase64Old = null;
    this.indexGroup = null;

    this.fieldSelected.indexImgEdit = -1;
    this.imageList = [];
    this.imageListOld = [];
    this.isShowAdd = false;

    this.isRender = true;
  }
  componentDidMount() {
    // this.handleUpdateState();
    this.context.onGetStoreData();
  }

  componentWillReceiveProps(newProps) {
    let isPoChange = this.props.infoPromotion !== newProps.infoPromotion;
    if (isPoChange) {
      this.infoPromotion = newProps.infoPromotion;
      this.fieldSelected.orderStatus = newProps.infoPromotion.active === 0 ? 2 : newProps.infoPromotion.active;
      this.fieldSelected.storeCode = newProps.infoPromotion.storeCode || [];
    }

    if (this.isCreate !== newProps.isCreate) {
      this.isCreate = newProps.isCreate;
    }

    if (newProps.group) {
      this.listGroup = newProps.group;
    }

    if (newProps.promotionName !== this.fieldSelected.promotionName) {
      this.fieldSelected.promotionName = newProps.promotionName;
    }
    // Doc update state
    if (newProps.docLink !== this.fieldSelected.docLink) {
      this.fieldSelected.docLink = newProps.docLink;
    }
    if (newProps.docCode !== this.fieldSelected.docCode) {
      this.fieldSelected.docCode = newProps.docCode;
    }
    // End Doc update state

    // Doc update state
    if (newProps.startDate !== this.fieldSelected.startDate) {
      this.fieldSelected.startDate = newProps.startDate;
    }
    if (newProps.endDate !== this.fieldSelected.endDate) {
      this.fieldSelected.endDate = newProps.endDate;
    }

    if (newProps.allItems !== this.allItems) {
      this.allItems = newProps.allItems;
    }

    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }

    if (newProps.imageList !== this.imageList) {
      this.imageList = newProps.imageList;
      this.imageListOld = newProps.imageList;
    }

    if (newProps.listItem !== this.items) {
      this.items = newProps.listItem;
    }

    this.refresh();
  }

  handleUpdateField = (value, key) => {
    let fields = this.fieldSelected;
    fields[key] = value;

    this.refresh();
  };

  handleUpdateDate = (start, end) => {
    let fields = this.fieldSelected;
    fields.startDate = start;
    fields.endDate = end;

    this.props.updateDate(start, end);
    this.refresh();
  };

  handleUpdateStore = (value) => {
    let fields = this.fieldSelected;
    fields.storeCode = value;

    this.refresh();
  };

  handleEditItemsParent = (list, isUpdate, indexEditParent) => {
    // const isDuplicate = hasDuplicateObject(list, this.dataTableAdd, 'itemCode');

    // if (isDuplicate) {
    //   message.error('Barcode exists', 1);
    //   return false;
    // }

    if (isUpdate) this.isUpdate = isUpdate;
    this.isShowAdd = true;
    this.dataTableAdd = [...list];
    this.dataTableAddOld = [...list];

    this.indexGroup = indexEditParent;

    this.refresh();
  };

  handleAddItemToList = () => {
    const itemCode = this.idBarcodeItemRef.current.getBarcodeSelected();

    let qty = this.itemAdd.qty;
    let type = this.itemAdd.type;

    const item = this.allItems[itemCode];

    if (itemCode === '') {
      message.error('Please insert barcode');
      return false;
    }

    if (type === undefined || type === '') {
      message.error('Please choose type');
      return false;
    }

    for (let index in this.dataTableAdd) {
      let item = this.dataTableAdd[index];

      if (type === item.type) {
        message.error('type already exists', 1);
        return false;
      }

      if (item.itemCode === itemCode && type === item.type && type === 1) {
        message.error('Barcode & type for item exists', 1);
        return false;
      }

      if (item.itemCode === itemCode && type === item.type) {
        message.error('Barcode exists', 1);
        return false;
      }
    }

    for (let index in this.items) {
      let elm = this.items[index];

      for (let index2 in elm) {
        let elm2 = elm[index2];

        if (elm2.itemCode === itemCode && type === 0 && elm2.type === 0) {
          message.error('Barcode exists in group ' + (parseFloat(index) + 1), 1);
          return false;
        }
      }
    }

    if (qty === undefined || qty === 0) {
      message.error('Please insert qty');
      return false;
    }

    let obj = {
      key: this.dataTableAdd.length.toString(),
      itemCode: item.itemCode,
      itemName: item.itemName,
      imageKey: this.itemAdd.type === 1 ? null : this.fieldSelected.itemImageList?.[0]?.url,
      qty: qty,
      type: type,
      isDelete: false,
    };

    this.dataTableAdd = [...this.dataTableAdd, obj];

    this.handleCancelAddItemToList();
  };

  handleDeleteRowTableAdd = (record) => {
    const itemCode = record?.itemCode;
    const type = record?.type;
    const data = [...this.dataTableAdd];

    let updateData = data.filter((obj) => obj.itemCode !== itemCode || obj.type !== type);

    this.dataTableAdd = updateData;

    if (updateData.length === 0) {
      this.handleClearList();
    }

    this.refresh();
  };

  handleCancelAddItemToList = () => {
    this.idBarcodeItemRef.current.setNewValue('');
    this.itemAdd.qty = 0;
    this.itemAdd.type = '';
    this.fieldSelected.itemImageList = null;
    this.fieldSelected.isReset = true;
    this.refresh();
  };

  handleClearList = () => {
    this.dataTableAdd = [];
    this.isUpdate = false;
    this.isShowAdd = false;
    // this.props.handleUpdateDataGroupPromo && this.props.handleUpdateDataGroupPromo(this.dataTableAddOld, this.isUpdate);
    this.props.handleUpdateIsEdit && this.props.handleUpdateIsEdit(false);
    this.refresh();
  };

  handleAddGroupPromotion = () => {
    if (this.dataTableAdd.length === 0) {
      message.error('Please add item to create group');
      return false;
    }

    let isBuy, isGet;
    isBuy = isGet = false;

    for (let key in this.dataTableAdd) {
      let item = this.dataTableAdd[key];

      if (item.type === 0) {
        isBuy = true;
      }

      if (item.type === 1) {
        isGet = true;
      }
    }

    if (isBuy === false) {
      message.error("Please add item 'BUY' to create group");
      return false;
    }

    if (isGet === false) {
      message.error("Please add item 'GET' to create group");
      return false;
    }
    this.props.handleUpdateDataGroupPromo && this.props.handleUpdateDataGroupPromo(this.dataTableAdd, this.indexGroup);

    this.dataTableAdd = [];
    this.isUpdate = false;
    this.isShowAdd = false;
    this.indexGroup = null;

    this.refresh();
  };

  handleEditRowTableAdd = (record) => {
    const fields = this.fieldSelected;
    // if (record?.type === 1) {
    this.isEditting = true;

    fields.itemEdit = record;

    const itemCode = fields.itemEdit?.itemCode;
    const type = fields.itemEdit?.type;
    const indexImg =
      this.indexGroup !== null
        ? this.imageList[this.indexGroup].findIndex((el) => el.itemCode === itemCode && el.type === type)
        : -1;

    fields.indexImgEdit = indexImg;
    this.fieldSelected.itemImageListEditSelected = [
      {
        url: ImageHelper.getImageUrlByPromotion(this.infoPromotion.promotionCode, record.itemCode),
      },
    ];
    this.refresh();
  };

  handleUpdateItem = async (item, itemBase64) => {
    const fields = this.fieldSelected;
    const data = [...this.dataTableAdd];

    const itemCode = item.itemCode;
    const promotionCode = this.infoPromotion.promotionCode;
    if (promotionCode !== '') {
      // const res = await model.uploadPromotionImage(payloadImage);

      // if (res.status && res.data) {
      // local
      const updateData = data?.map((obj) => {
        if (obj.itemCode === itemCode) {
          return {
            ...obj,
            discountAmount: item.discountAmount,
            imageKey: this.fieldSelected.itemImageListEdit
              ? this.fieldSelected.itemImageListEdit?.[0]?.url
              : ImageHelper.getImageUrlByPromotion(promotionCode, itemCode),
          }; // Cập nhật thuộc tính name trong đối tượng
        }
        return obj;
      });
      // local
      this.dataTableAdd = updateData;
      this.imageList = updateData;
      this.imageListOld = updateData;
      this.itemImageListEdit = null;
      this.refresh();
      // }
    } else {
    }
    fields.itemEdit = null;
    fields.itemEditBase64 = null;
  };

  handleActions = (val, key, item) => {
    return (
      <>
        {item?.type === 0 ? <EditOutlined onClick={() => this.handleEditRowTableAdd(item)} /> : null}
        <DeleteOutlined onClick={() => this.handleDeleteRowTableAdd(item)} style={{ color: 'red', marginLeft: 12 }} />
      </>
    );
  };

  handleRenderImage = (val, key, item) => {
    const img = item.imageKey
      ? item.imageKey
      : ImageHelper.getImageUrlByPromotion(this.infoPromotion.promotionCode, item.itemCode);

    return (
      <>
        {item?.type !== 1 ? (
          <div className="">
            <span
              className="d-inline-block pos-relative br-2 pd-2"
              style={{ width: 35, height: 35, background: '#e6f0ff' }}
            >
              <img
                src={item && item.itemCode ? img : IconProduct}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = IconProduct;
                }}
                alt={`${item.itemName}`}
                width={'100%'}
                className="d-inline-block pos-absolute"
                style={{
                  verticalAlign: 'text-bottom',
                  left: 0,
                  top: '50%',
                  transform: 'translate(0px,-50%)',
                }}
              />
            </span>
          </div>
        ) : (
          ''
        )}
      </>
    );
  };

  renderType = (val, key, item) => {
    return (
      <Tag color={val === 0 ? 'green' : 'geekblue'} key={val}>
        {val === 0 ? 'Buy' : 'Get'}
      </Tag>
    );
  };

  handleChangeUploadImg = async ({ file, fileList }) => {
    const fields = this.fieldSelected;

    const imageFile = fileList[0]?.originFileObj;
    const name = fileList[0]?.name.split('.') + Date.now() + '.' + fileList[0]?.name.split('.')[1];

    await getBase64(imageFile, (base64Image) => {
      let imgList = [...this.imageList];

      if (fields.indexImgEdit !== -1) {
        if (fields.itemEdit?.type === 0) {
          imgList[fields.indexImgEdit] = imgList[fields.indexImgEdit]
            ? {
                ...imgList[fields.indexImgEdit],
                name: name,
                imageKey: base64Image,
              }
            : { name: name, imageKey: base64Image };
        }
      }

      this.imageList = imgList;
      fields.itemBase64 = base64Image;

      this.refresh();
    });
  };
  handleSeteImageOfListItem = (imageList) => {
    this.fieldSelected.itemImageList = imageList;
    this.refresh();
  };
  handleSeteImageOfListItemEdit = (imageList) => {
    this.fieldSelected.itemImageListEdit = imageList;
    this.refresh();
  };
  renderComp() {
    let fields = this.fieldSelected;

    const contextValue = this.context;

    const { stores } = contextValue.state;
    let orderStore = {};
    let storeOptions = [];

    if (stores && stores !== null) {
      Object.keys(stores)
        .sort()
        .forEach(function (key) {
          orderStore[key] = stores[key];
        });

      if (Object.keys(stores).length === 0) {
        const obj = {
          value: this.data.storeCode,
          label: this.data.storeCode + ' - ' + this.data.storeName,
        };
        storeOptions.push(obj);
      } else {
        storeOptions = Object.keys(orderStore).map((key) => {
          const obj = {
            value: stores[key].storeCode,
            label: stores[key].storeCode + ' - ' + stores[key].storeName,
          };
          return obj;
        });
      }
    }

    const statusOptions = [
      { value: 1, label: 'Active' },
      { value: 2, label: 'Inactive' },
    ];

    const dataType = [
      { value: 0, label: 'Buy' },
      { value: 1, label: 'Get' },
    ];

    let dataTableAdd = this.dataTableAdd;

    const columnsTableCustom = [
      { field: 'itemCode', label: 'Item', colSpanHead: 2 },
      {
        field: 'itemName',
        label: '',
        colSpanHead: 0,
        styleBody: { maxWidth: 200 },
        formatBody: (val, key, item) => (
          <Tooltip
            overlayInnerStyle={{ fontSize: 10 }}
            arrow={{ pointAtCenter: true }}
            title={item.itemName}
            color={'black'}
          >
            {item.itemName}
          </Tooltip>
        ),
      },
      { field: 'type', label: 'Type', formatBody: this.renderType },
      {
        field: 'qty',
        label: 'Qty',
        formatBody: (val) => StringHelper.formatValue(val),
      },
      { field: 'imageKey', label: 'Image', formatBody: this.handleRenderImage },
      {
        field: 'action',
        label: 'Actions',
        classHead: 'text-right',
        classBody: 'text-right',
        formatBody: this.handleActions,
      },
    ];

    const dataTableCustom = createDataTable(dataTableAdd, columnsTableCustom);
    const isRunning = this.props.isRunning;

    return (
      <section>
        <div className="form-filter">
          <Row>
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={24}>
                    <Row gutter={16}>
                      <Col xl={8} xxl={6}>
                        <div>
                          <label htmlFor="promotionName" className="w100pc">
                            <span className="required">Promotion name:</span>
                          </label>
                          <InputComp
                            isDisable={isRunning}
                            func={this.handleUpdateField}
                            funcCallback={this.props.updatePromotionName}
                            keyField="promotionName"
                            text={fields.promotionName}
                          />
                        </div>
                      </Col>

                      <Col xl={6}>
                        <div>
                          <label htmlFor="date" className="w100pc w-full">
                            <span className="required"> Apply Date:</span>
                            {/* <RangePicker start={fields.startDate} end={fields.endDate} func={this.handleUpdateDate} funcCallback={this.props.updateDate} disabledDate={new Date()}/> */}
                          </label>
                          <RangePicker
                            disabledDate={(currentDate) => currentDate && currentDate < moment().endOf('day')}
                            disabled={isRunning}
                            start={fields.startDate}
                            end={fields.endDate}
                            func={this.handleUpdateDate}
                            funcCallback={this.props.updateDate}
                          />
                        </div>
                      </Col>

                      <Col xl={8} xxl={6}>
                        <div>
                          <label htmlFor="storeCode" className="w100pc">
                            Apply store:
                          </label>
                          {isRunning ? (
                            <Popover
                              title={`Selected store (${fields.storeCode?.length || 0})`}
                              content={
                                <ul
                                  style={{
                                    maxHeight: '500px',
                                    overflowY: 'scroll',
                                  }}
                                >
                                  {fields?.storeCode?.map((item) => {
                                    return (
                                      <li>
                                        <p>{item}</p>
                                      </li>
                                    );
                                  })}
                                </ul>
                              }
                            >
                              <SelectBox
                                isDisable={isRunning}
                                data={storeOptions}
                                placeholder={'All store'}
                                func={this.handleUpdateStore}
                                keyField="storeCode"
                                value={fields.storeCode || []}
                                isMode={'multiple'}
                                funcCallback={this.props.updateStore}
                              />
                            </Popover>
                          ) : (
                            <>
                              <SelectboxAndCheckbox
                                isDisable={isRunning}
                                data={storeOptions}
                                placeholder={'All store'}
                                func={this.handleUpdateStore}
                                keyField="storeCode"
                                value={fields.storeCode || []}
                                isMode={'multiple'}
                                funcCallback={this.props.updateStore}
                              />
                            </>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* Doc */}
            <Col span={24} className="section-block mt-15">
              <p className="mb-10">Dept. of I&T note</p>
              <Row gutter={[16, 16]}>
                <Col xl={8} xxl={4}>
                  <div>
                    <label htmlFor="docCode" className="w100pc ">
                      <span className="required">Dept. of I&T code:</span>
                    </label>
                    <InputComp
                      isDisable={isRunning}
                      func={this.handleUpdateField}
                      funcCallback={this.props.updateDocCode}
                      keyField="docCode"
                      text={fields.docCode}
                    />
                  </div>
                </Col>
                <Col xl={8} xxl={4}>
                  <div>
                    <label htmlFor="docLink" className="w100pc ">
                      <span className="">Dept. of I&T link:</span>
                    </label>
                    <InputComp
                      isDisable={isRunning}
                      func={this.handleUpdateField}
                      funcCallback={this.props.updateDocLink}
                      keyField="docLink"
                      text={fields.docLink}
                    />
                  </div>
                </Col>
              </Row>
            </Col>

            {/* END Doc */}
          </Row>
          {isRunning ? null : (
            <Row className="mt-15">
              <Col xl={24}>
                <div className="section-block">
                  <Collapse
                    bordered={false}
                    activeKey={this.isCreate || this.isShowAdd ? ['1'] : ''}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    className="site-collapse-custom-collapse"
                    onChange={() => {
                      this.isShowAdd = !this.isShowAdd;
                      this.refresh();
                    }}
                  >
                    <Panel header="Add items to the list" key="1" className="site-collapse-custom-panel">
                      <Row xl={24} gutter={16} className="fs-12">
                        <Col xl={10}>
                          <Row xl={24} gutter={16}>
                            <Col xl={16} xxl={8}>
                              <label htmlFor="itemCode" className="w100pc">
                                Type:
                                <div style={{ paddingTop: 5 }}>
                                  <RadioComp
                                    data={dataType}
                                    value={this.itemAdd.type}
                                    ref={this.idTypeItemRef}
                                    funcCallback={(val) => {
                                      this.itemAdd.type = val;
                                      this.refresh();
                                    }}
                                  />
                                </div>
                              </label>
                            </Col>
                          </Row>
                          <Row xl={24} gutter={16}>
                            <Col xl={16} xxl={8}>
                              <div>
                                <label htmlFor="itemCode" className="w100pc">
                                  Barcode:
                                </label>
                                <AutocompleteBarcode
                                  idComponent={this.idBarcodeItem}
                                  ref={this.idBarcodeItemRef}
                                  barCodes={this.allItems}
                                />
                              </div>
                            </Col>
                            <Col xl={16} xxl={8}>
                              <div>
                                <label htmlFor="qty" className="w100pc">
                                  Qty:
                                </label>
                                <InputNumberComp
                                  value={this.itemAdd.qty}
                                  funcCallback={(val) => {
                                    this.itemAdd.qty = val;
                                    this.refresh();
                                  }}
                                />
                              </div>
                            </Col>
                            <Icons.Delete
                              className="cursor-pointer"
                              onClick={this.handleCancelAddItemToList}
                              style={{
                                fontSize: '22px',
                                alignSelf: 'end',
                                marginBottom: '5px',
                              }}
                            />
                          </Row>

                          <Row className="mt-10">
                            <Col span={16}>
                              {this.itemAdd.type === 0 ? (
                                <UploadImageBuyOneGetOne
                                  onSetListImages={this.handleSeteImageOfListItem}
                                  isReset={this.fieldSelected.isReset}
                                  onChangeReset={(value) => {
                                    this.fieldSelected.isReset = value;
                                    this.refresh();
                                  }}
                                />
                              ) : null}
                            </Col>
                          </Row>
                          <Row>
                            <Col xl={24} style={{ marginTop: 10 }}>
                              <Space size={'small'}>
                                <Button
                                  type="button"
                                  className="btn btn-success h-30"
                                  style={{ background: 'black' }}
                                  onClick={this.handleAddItemToList}
                                >
                                  Add list
                                </Button>
                              </Space>
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={14}>
                          <Modal
                            title={'#' + fields.itemEdit?.itemCode + ' - ' + fields.itemEdit?.itemName}
                            open={this.isEditting}
                            okText="Update"
                            onCancel={() => {
                              this.isEditting = false;
                              fields.itemEdit = null;
                              fields.itemEditBase64 = null;
                              this.imageList = this.imageListOld;
                              this.refresh();
                            }}
                            onOk={() => {
                              this.isEditting = false;
                              this.handleUpdateItem(fields.itemEdit, fields.itemEditBase64);
                              this.refresh();
                            }}
                          >
                            <label className="w100pc">
                              Qty:
                              <div>
                                {/* <InputNumberComp func={this.handleUpdateField} funcCallback={() => console.log('')} keyField='itemEdit' value={fields.itemEdit?.discountAmount} /> */}
                                <InputNumber
                                  value={fields.itemEdit?.qty || ''}
                                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                  onChange={(e) => {
                                    let edit = fields.itemEdit && {
                                      ...fields.itemEdit,
                                      qty: e,
                                    };
                                    fields.itemEdit = edit;
                                    this.refresh();
                                  }}
                                  min={1}
                                  max={999999}
                                />
                              </div>
                            </label>
                            {fields.itemEdit?.type === 0 ? (
                              <Row className="mrt-10">
                                <UploadImageBuyOneGetOneEdit
                                  onSetListImages={this.handleSeteImageOfListItemEdit}
                                  isReset={this.fieldSelected.isReset}
                                  onChangeReset={(value) => {
                                    this.fieldSelected.isReset = value;
                                    this.refresh();
                                  }}
                                  initialImages={this.fieldSelected.itemImageListEditSelected}
                                />
                                {/* <Col xl={24}>
                                <label>
                                  Update image:
                                  <div>
                                    <Upload
                                      listType="picture"
                                      maxCount={1}
                                      beforeUpload={(file) => {
                                        const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
                                        const isAcceptedType = acceptedTypes.includes(file.type);
                                        const aspectRatio = 16 / 9;

                                        if (!isAcceptedType) {
                                          message.error('Vui lòng chỉ tải lên file có định dạng (pgn, jpeg, jpg, gif)');
                                        }

                                        const maxFileSizeInMB = 0.1953125; // Giới hạn dung lượng tệp tin là 200kb
                                        const fileSizeInMB = file.size / (1024 * 1024);
                                        if (fileSizeInMB > maxFileSizeInMB) {
                                          message.error('Dung lượng tệp tin vượt quá giới hạn 200kb!');
                                        }

                                        return false;
                                      }}
                                      onChange={this.handleChangeUploadImg}
                                      showUploadList={false}
                                    >
                                      <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                                    </Upload>

                                    {fields.indexImgEdit !== -1 && (
                                      <>
                                        <div className="w-full mt-10 list_image_uploaded">
                                          <Row gutter={16} className="h-full">
                                            <Col span={8} className="h-full">
                                              <Image
                                                src={this.imageList[fields.indexImgEdit].imageKey}
                                                style={{ height: '100%', aspectRatio: '16/9' }}
                                              />
                                            </Col>
                                            <Col span={16} className="h-full flex items-center">
                                              <p className="m-0">{this.imageList[fields.indexImgEdit].name}</p>
                                            </Col>
                                          </Row>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </label>
                              </Col> */}
                              </Row>
                            ) : null}
                          </Modal>
                          <TableCustom
                            data={dataTableCustom}
                            columns={columnsTableCustom}
                            isPaging={false}
                            fullWidth={true}
                          />
                          {/* <TableComp
                          columns={columnsTableAdd}
                          dataSource={dataTableAdd}
                          newRow={this.newRow}
                          funcCallback={this.handleUpdateGroupPromo}
                          page={false}
                        /> */}
                          {this.dataTableAdd.length > 0 && (
                            <Row>
                              <Col xl={24} style={{ marginTop: 10 }}>
                                <Space size={'small'}>
                                  {this.isUpdate ? (
                                    <Button
                                      type="button"
                                      className="btn btn-success h-30"
                                      style={{ background: 'black' }}
                                      onClick={this.handleAddGroupPromotion}
                                    >
                                      Update list bellow
                                    </Button>
                                  ) : (
                                    <Button
                                      type="button"
                                      className="btn btn-success h-30"
                                      style={{ background: 'black' }}
                                      onClick={this.handleAddGroupPromotion}
                                    >
                                      Apply promotion
                                    </Button>
                                  )}

                                  <Button
                                    type="button"
                                    className="btn btn-success h-30"
                                    style={{ background: 'black' }}
                                    onClick={this.handleClearList}
                                  >
                                    Clear all
                                  </Button>
                                </Space>
                              </Col>
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </section>
    );
  }
}

ControlPromotionBuyOneGetOneDetail.contextType = AppContext;

// {!this.isCopyType && (
//   <>
//     {!this.isCreate && (
//       <Col xl={8} xxl={4}>
//         <label htmlFor="orderStatus" className="w100pc">
//           Status:
//           {/* <Tag color={fields.orderStatus === 1 ? 'green' : 'red'}> {fields.orderStatus === 1 ? 'Active' : 'Inactive'}</Tag> */}
//           {/* <SelectBox data={statusOptions} func={this.handleUpdateField} funcCallback={this.props.updateActive} keyField={'orderStatus'} value={fields.orderStatus} isMode={''} /> */}
//           <RadioComp
//             disabled={isRunning}
//             data={statusOptions}
//             value={fields.orderStatus}
//             ref={this.idStatusRef}
//             // funcCallback={this.handleUpdateStatusApi}
//             funcCallback={this.props.updateActive}
//           />
//         </label>
//       </Col>
//     )}
//   </>
// )}
