import { CaretRightOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, InputNumber, Modal, Popover, Row, Space, Tag, Tooltip, message } from 'antd';
import BaseComponent from 'components/BaseComponent';
import AutocompleteBarcode from 'components/mainContent/promotion/autocompleteBarcode';
import { AppContext } from 'contexts/AppContext';
import { ImageHelper, StringHelper } from 'helpers';
import { createDataTable, getBase64, hasDuplicateObject } from 'helpers/FuncHelper';
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
import UploadImageBuyOneGetOneEdit from '../controlPromotionBuyOneGetOneDetail/uploadImageBuyOneGetOneEdit';
import UploadImageMixAndMatch from './UploadImageMixAndMatch';
import WarningNote from 'components/common/warningNote/WarningNote';

const { Panel } = Collapse;

export default class ControlPromotionMixAndMatchDetail extends BaseComponent {
  constructor(props) {
    super(props);

    this.idBarcodeItemRef = React.createRef();
    this.idBarcodeItem = 'idBarcodeItem' + StringHelper.randomKey();
    this.idStatusRef = React.createRef();

    this.isCopyType = this.props.type || false;

    this.isCreate = this.props.isCreate;
    this.infoPromotion = this.props.infoPromotion || {};

    this.isUpdateForm = (this.infoPromotion.poCode || '') !== '';
    this.isAllowUpdate = !this.isUpdateForm || (!this.infoPromotion.approved && !this.infoPromotion.cancel);

    this.items = this.props.items || [];

    /*----------------------------------------*/
    this.fieldSelected.itemImageList = null;
    this.fieldSelected.itemImageListEdit = null;
    this.fieldSelected.isReset = false;
    this.fieldSelected.itemImageListEditSelected = null;
    /*----------------------------------------*/

    this.data.stores = [];

    if (this.infoPromotion.storeCode) {
      this.fieldSelected.storeCode = this.infoPromotion.storeCode;
      this.data.storeName = this.infoPromotion.storeName;
    }

    this.fieldSelected.promotionName = !this.isCopyType ? this.props.promotionName : '';
    this.fieldSelected.docLink = !this.isCopyType ? this.props.docLink : '';
    this.fieldSelected.docCode = !this.isCopyType ? this.props.docCode : '';

    this.fieldSelected.createdDate = !this.isCopyType
      ? this.infoPromotion.createdDate
        ? new Date(this.infoPromotion.createdDate)
        : new Date()
      : '';
    this.fieldSelected.startDate = !this.isCopyType
      ? this.infoPromotion.fromDate
        ? new Date(this.infoPromotion.fromDate)
        : moment().add(1, 'days')
      : moment().add(1, 'days');
    this.fieldSelected.endDate = !this.isCopyType
      ? this.infoPromotion.toDate
        ? new Date(this.infoPromotion.toDate)
        : moment().add(1, 'days')
      : moment().add(1, 'days');

    this.fieldSelected.qtyBuy = this.props.qtyBuy || '';
    this.fieldSelected.qtyGet = this.props.qtyGet || 1;
    this.fieldSelected.orderStatus = !this.isCopyType
      ? this.infoPromotion.active === 0
        ? 2
        : this.infoPromotion.active
      : '';

    /*----------------------------------------*/
    /* --------- */
    this.allItems = this.props.allItems || {};
    this.dataTableAdd = [];
    this.dataTableAddOld = [];

    this.itemAdd = {};

    this.itemAdd.type = 0;
    this.itemAdd.discountAmount = 0;

    this.isUpdate = false;

    this.isEditting = false;
    this.fieldSelected.itemEdit = null;
    this.fieldSelected.itemEditBase64 = null;
    this.fieldSelected.itemEditBase64Old = null;

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
      this.fieldSelected.orderStatus = this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active;
    }

    if (this.isCreate !== newProps.isCreate) {
      this.isCreate = newProps.isCreate;
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
    if (newProps.qtyBuy !== this.fieldSelected.qtyBuy) {
      this.fieldSelected.qtyBuy = newProps.qtyBuy;
    }
    if (newProps.qtyGet !== this.fieldSelected.qtyGet) {
      this.fieldSelected.qtyGet = newProps.qtyGet;
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

    this.refresh();
  }

  handleEditItemsParent = (list, isUpdate) => {
    const isDuplicate = hasDuplicateObject(list, this.dataTableAdd, 'itemCode');

    if (isDuplicate) {
      message.error('Barcode exists', 1);
      return false;
    }

    if (isUpdate) this.isUpdate = isUpdate;
    this.isShowAdd = true;
    this.dataTableAdd = [...list];
    this.dataTableAddOld = [...list];

    this.refresh();
  };
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

  handleAddItemToList = () => {
    const itemCode = this.idBarcodeItemRef.current.getBarcodeSelected();
    const discountAmount = this.itemAdd.discountAmount;
    const item = this.allItems[itemCode];
    let type = this.itemAdd.type;
    if (itemCode === '') {
      message.error('Please insert barcode', 1);
      return false;
    }

    if (type === undefined || type === '') {
      message.error('Please choose type', 1);
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
    if (type === 0 && !this.fieldSelected.qtyBuy) {
      message.error('Please insert Qty buy', 1);
      return false;
    }
    if (type !== 0 && (discountAmount === undefined || discountAmount === 0)) {
      message.error('Please insert discount amount', 1);
      return false;
    }

    if (type !== 0 && discountAmount < 1000) {
      message.error('Please insert discount amount more than 1000 VND', 1);
      return false;
    }

    let obj = {
      key: this.dataTableAdd.length.toString(),
      itemCode: item.itemCode,
      itemName: item.itemName,
      discountAmount: discountAmount,
      imageKey: this.itemAdd.type === 1 ? null : this.fieldSelected.itemImageList?.[0]?.url,
      type: type,
      qty: +type === 0 ? this.fieldSelected.qtyBuy : this.fieldSelected.qtyGet,
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
    this.itemAdd.type = '';
    this.itemAdd.discountAmount = 0;
    this.fieldSelected.itemImageList = null;
    this.fieldSelected.isReset = true;
    this.fieldSelected.qtyBuy = null;
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
      message.error("Please add item 'BUY' to create group", 1);
      return false;
    }

    if (isGet === false) {
      message.error("Please add item 'GET' to create group", 1);
      return false;
    }

    this.props.handleUpdateDataGroupPromo && this.props.handleUpdateDataGroupPromo(this.dataTableAdd, this.isUpdate);

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
    const indexImg = this.imageList?.findIndex((el) => el.itemCode === itemCode && el.type === type);

    fields.indexImgEdit = indexImg;
    // }
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
        if (obj.itemCode === itemCode && item.type === obj.type) {
          obj = {
            ...obj,
            discountAmount: item.discountAmount,
            // newne
            qty: item.qty,
            // enewne
            imageKey: this.fieldSelected.itemImageListEdit
              ? this.fieldSelected.itemImageListEdit?.[0]?.url
              : ImageHelper.getImageUrlByPromotion(promotionCode, itemCode),
          };

          return obj;
          // return {
          //   ...obj,
          //   discountAmount: item.discountAmount,
          //   // newne
          //   qty: item.qty,
          //   // enewne
          //   imageKey: this.fieldSelected.itemImageListEdit
          //     ? this.fieldSelected.itemImageListEdit?.[0]?.url
          //     : ImageHelper.getImageUrlByPromotion(promotionCode, itemCode),
          // }; // Cập nhật thuộc tính name trong đối tượng
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
        {<EditOutlined onClick={() => this.handleEditRowTableAdd(item)} />}
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
      { field: 'imageKey', label: 'Image', formatBody: this.handleRenderImage },
      // newne
      {
        field: 'qty',
        label: 'Qty',
        formatBody: (val) => {
          return val && val !== '' ? StringHelper.formatValue(val) : '-';
        },
      },
      // enewne
      {
        field: 'discountAmount',
        label: 'Discount amount',
        classHead: 'text-right',
        classBody: 'text-right',
        formatBody: (val) => {
          return val && val !== '' ? StringHelper.formatValue(val) : '-';
        },
      },
      {
        field: 'action',
        label: 'Actions',
        classHead: 'text-right',
        classBody: 'text-right',
        formatBody: this.handleActions,
      },
    ];

    const dataTableCustom = createDataTable(dataTableAdd, columnsTableCustom);
    const isRunning = this.props.isCreate || this.props.type ? false : this.props.isRunning;
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
                        <div className="">
                          <label htmlFor="promotionName" className="w100pc ">
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

                      <Col xl={8} xxl={6}>
                        <div>
                          <label htmlFor="date" className="w100pc ">
                            <span className="required"> Apply Date:</span>
                          </label>
                          <RangePicker
                            disabled={isRunning}
                            disabledDate={(current) => {
                              return current && current < moment().endOf('day');
                            }}
                            start={fields.startDate}
                            end={fields.endDate}
                            func={this.handleUpdateDate}
                            funcCallback={this.props.updateDate}
                          />
                        </div>
                      </Col>
                      <Col xl={8} xxl={6}>
                        <div className="">
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
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              {/* Doc */}
              <div className="section-block mt-15">
                <Row gutter={[16, 0]}>
                  <Col span={24}>
                    <p className="mb-10">Dept. of I&T note</p>
                  </Col>
                  <Col xl={8} xxl={6}>
                    <div>
                      <label htmlFor="promotionName" className="w100pc ">
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
                  <Col xl={8} xxl={6}>
                    <div>
                      <label htmlFor="promotionName" className="w100pc ">
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
                  {/* END Doc */}
                </Row>
              </div>
            </Col>
          </Row>
          <Row className="mt-15">
            {isRunning ? null : (
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
                      <Row xl={24} gutter={[16, 16]} className="fs-12">
                        <Col span={10}>
                          <Row xl={24} gutter={[16, 16]}>
                            <Col span={24}>
                              <div className="flex items-center gap-10">
                                <label htmlFor="itemCode" className="w-fit">
                                  Type:
                                </label>
                                <RadioComp
                                  data={dataType}
                                  value={this.itemAdd.type}
                                  ref={this.idTypeItemRef}
                                  funcCallback={(val) => {
                                    this.itemAdd.type = val;
                                    this.itemAdd.discountAmount = 0;
                                    this.refresh();
                                  }}
                                />
                              </div>
                            </Col>

                            <Col span={12}>
                              <div>
                                <label htmlFor="itemCode" className="w100pc">
                                  <span className="required">Barcode:</span>
                                </label>
                                <AutocompleteBarcode
                                  idComponent={this.idBarcodeItem}
                                  ref={this.idBarcodeItemRef}
                                  barCodes={this.allItems}
                                />
                              </div>
                            </Col>
                            {this.itemAdd.type !== 1 ? (
                              <Col span={12}>
                                <div>
                                  <label htmlFor="qtyBuy" className="w100pc ">
                                    <span className="required">Qty buy:</span>
                                  </label>
                                  <InputNumberComp
                                    isDisable={isRunning}
                                    value={fields.qtyBuy}
                                    funcCallback={this.props.updateQtyBuy}
                                    func={this.handleUpdateField}
                                    keyField={'qtyBuy'}
                                  />
                                </div>
                              </Col>
                            ) : null}
                            {this.itemAdd.type === 1 && (
                              <Col span={12}>
                                <label htmlFor="discountAmount" className="w100pc">
                                  Discount amount:
                                  <div>
                                    <InputNumberComp
                                      value={this.itemAdd.discountAmount}
                                      funcCallback={(val) => {
                                        this.itemAdd.discountAmount = val;
                                        this.refresh();
                                      }}
                                      isDisable={this.itemAdd.type === 0 ? true : false}
                                    />
                                  </div>
                                </label>
                              </Col>
                            )}

                            {this.itemAdd.type === 1 && (
                              <Col span={12}>
                                <label htmlFor="qtyGet" className="w100pc">
                                  Qty get:
                                  <div>
                                    <InputNumberComp
                                      value={fields.qtyGet}
                                      funcCallback={this.props.updateQtyGet}
                                      func={this.handleUpdateField}
                                      keyField={'qtyGet'}
                                      isDisable={true}
                                    />
                                  </div>
                                </label>
                              </Col>
                            )}

                            {this.itemAdd.type === 0 ? (
                              <Col span={12}>
                                <UploadImageMixAndMatch
                                  onSetListImages={this.handleSeteImageOfListItem}
                                  isReset={this.fieldSelected.isReset}
                                  onChangeReset={(value) => {
                                    this.fieldSelected.isReset = value;
                                    this.refresh();
                                  }}
                                />
                              </Col>
                            ) : null}
                            <Col style={{ alignSelf: 'end', padding: 8 }}>
                              <Icons.Delete
                                className="cursor-pointer"
                                onClick={this.handleCancelAddItemToList}
                                style={{
                                  fontSize: '22px',
                                  alignSelf: 'end',
                                }}
                              />
                            </Col>
                            <Col span={24} style={{ marginTop: 10 }}>
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
                        <Col span={14}>
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
                            {fields.itemEdit?.type !== 0 ? (
                              <label className="w100pc">
                                Discount amount:
                                <div>
                                  {/* <InputNumberComp func={this.handleUpdateField} funcCallback={() => console.log('')} keyField='itemEdit' value={fields.itemEdit?.discountAmount} /> */}
                                  <InputNumber
                                    value={fields.itemEdit?.discountAmount || ''}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(e) => {
                                      let edit = fields.itemEdit && {
                                        ...fields.itemEdit,
                                        discountAmount: e,
                                      };
                                      fields.itemEdit = edit;
                                      this.refresh();
                                    }}
                                    min={1000}
                                    max={999999}
                                  />
                                </div>
                              </label>
                            ) : (
                              <Row className="mrt-10">
                                {fields.itemEdit?.type === 0 ? (
                                  <>
                                    {/* new ne */}
                                    <label className="w100pc">
                                      Quantity:
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
                                          max={100}
                                        />
                                      </div>
                                    </label>
                                    {/* e new ne */}
                                    <UploadImageBuyOneGetOneEdit
                                      onSetListImages={this.handleSeteImageOfListItemEdit}
                                      isReset={this.fieldSelected.isReset}
                                      onChangeReset={(value) => {
                                        this.fieldSelected.isReset = value;
                                        this.refresh();
                                      }}
                                      initialImages={this.fieldSelected.itemImageListEditSelected}
                                    />
                                  </>
                                ) : null}
                              </Row>
                            )}
                          </Modal>
                          <TableCustom
                            data={dataTableCustom}
                            columns={columnsTableCustom}
                            isPaging={false}
                            fullWidth={true}
                          />
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
            )}
          </Row>
          {/*  */}
          <Row className="mt-15" style={{ display: 'none' }}>
            {isRunning ? null : (
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
                      <Row xl={24} gutter={[16, 16]} className="fs-12">
                        <Col span={10}>
                          <Row xl={24} gutter={[16, 16]} className="mb-15">
                            <Col xl={12} xxl={8}>
                              <div className="flex items-center gap-10">
                                <label htmlFor="itemCode" className="w-fit">
                                  Type:
                                </label>
                                <RadioComp
                                  data={dataType}
                                  value={this.itemAdd.type}
                                  ref={this.idTypeItemRef}
                                  funcCallback={(val) => {
                                    this.itemAdd.type = val;
                                    this.itemAdd.discountAmount = 0;
                                    this.refresh();
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row xl={24} gutter={[16, 16]}>
                            <Col xl={12} xxl={10}>
                              <div>
                                <label htmlFor="itemCode" className="w100pc">
                                  <span className="required">Barcode:</span>
                                </label>
                                <AutocompleteBarcode
                                  idComponent={this.idBarcodeItem}
                                  ref={this.idBarcodeItemRef}
                                  barCodes={this.allItems}
                                />
                              </div>
                            </Col>
                            {this.itemAdd.type !== 1 ? (
                              <Col xl={12} xxl={10}>
                                <div>
                                  <label htmlFor="qtyBuy" className="w100pc ">
                                    <span className="required">Qty buy:</span>
                                  </label>
                                  <InputNumberComp
                                    isDisable={isRunning}
                                    value={fields.qtyBuy}
                                    funcCallback={this.props.updateQtyBuy}
                                    func={this.handleUpdateField}
                                    keyField={'qtyBuy'}
                                  />
                                </div>
                              </Col>
                            ) : null}
                            {this.itemAdd.type === 1 && (
                              <Col xl={12} xxl={10}>
                                <label htmlFor="discountAmount" className="w100pc">
                                  Discount amount:
                                  <div>
                                    <InputNumberComp
                                      value={this.itemAdd.discountAmount}
                                      funcCallback={(val) => {
                                        this.itemAdd.discountAmount = val;
                                        this.refresh();
                                      }}
                                      isDisable={this.itemAdd.type === 0 ? true : false}
                                    />
                                  </div>
                                </label>
                              </Col>
                            )}
                            <Col style={{ alignSelf: 'end', padding: 8 }}>
                              <Icons.Delete
                                className="cursor-pointer"
                                onClick={this.handleCancelAddItemToList}
                                style={{
                                  fontSize: '22px',
                                  alignSelf: 'end',
                                }}
                              />
                            </Col>
                            {this.itemAdd.type === 1 && (
                              <Col xl={12} xxl={10}>
                                <label htmlFor="qtyGet" className="w100pc">
                                  Qty get:
                                  <div>
                                    <InputNumberComp
                                      value={fields.qtyGet}
                                      funcCallback={this.props.updateQtyGet}
                                      func={this.handleUpdateField}
                                      keyField={'qtyGet'}
                                      isDisable={true}
                                    />
                                  </div>
                                </label>
                              </Col>
                            )}
                          </Row>

                          <Row className="mt-10">
                            <Col span={24}>
                              {this.itemAdd.type === 0 ? (
                                <UploadImageMixAndMatch
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
                        <Col span={14}>
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
                            {fields.itemEdit?.type !== 0 ? (
                              <label className="w100pc">
                                Discount amount:
                                <div>
                                  {/* <InputNumberComp func={this.handleUpdateField} funcCallback={() => console.log('')} keyField='itemEdit' value={fields.itemEdit?.discountAmount} /> */}
                                  <InputNumber
                                    value={fields.itemEdit?.discountAmount || ''}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(e) => {
                                      let edit = fields.itemEdit && {
                                        ...fields.itemEdit,
                                        discountAmount: e,
                                      };
                                      fields.itemEdit = edit;
                                      this.refresh();
                                    }}
                                    min={1000}
                                    max={999999}
                                  />
                                </div>
                              </label>
                            ) : (
                              <Row className="mrt-10">
                                {fields.itemEdit?.type === 0 ? (
                                  <>
                                    {/* new ne */}
                                    <label className="w100pc">
                                      Quantity:
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
                                          max={100}
                                        />
                                      </div>
                                    </label>
                                    {/* e new ne */}
                                    <UploadImageBuyOneGetOneEdit
                                      onSetListImages={this.handleSeteImageOfListItemEdit}
                                      isReset={this.fieldSelected.isReset}
                                      onChangeReset={(value) => {
                                        this.fieldSelected.isReset = value;
                                        this.refresh();
                                      }}
                                      initialImages={this.fieldSelected.itemImageListEditSelected}
                                    />
                                  </>
                                ) : null}
                              </Row>
                            )}
                          </Modal>
                          <TableCustom
                            data={dataTableCustom}
                            columns={columnsTableCustom}
                            isPaging={false}
                            fullWidth={true}
                          />
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
            )}
          </Row>
        </div>
      </section>
    );
  }
}

ControlPromotionMixAndMatchDetail.contextType = AppContext;
