//Plugin
import React from 'react';
import * as XLSX from 'xlsx';
// import DatePicker from "react-datepicker";
//Custom
import BaseComponent from 'components/BaseComponent';
import { FileHelper, StringHelper, ImageHelper } from 'helpers';
import IconProduct from 'images/logo.png';

import AutocompleteBarcode from 'components/mainContent/promotion/autocompleteBarcode';

import { CaretRightOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, InputNumber, Modal, Popover, Row, Space, Tooltip, Upload, message } from 'antd';

import { AppContext } from 'contexts/AppContext';
import { createDataTable, getBase64, hasDuplicateObject } from 'helpers/FuncHelper';
import UploadMediaModel from 'models/UploadMediaModel';
import moment from 'moment';
import InputComp from 'utils/input';
import InputNumberComp from 'utils/inputNumber';
import RangePicker from 'utils/rangePicker';
import SelectBox from 'utils/selectBox';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';
import TableCustom from 'utils/tableCustom';
import Icons from 'images/icons';
import UploadImageDiscountItem from './uploadImageDiscountItem';
import UploadImageDiscountItemEdit from './uploadImageDiscountItemEdit';
import WarningNote from 'components/common/warningNote/WarningNote';

const { Panel } = Collapse;

class ControlDetailDiscountItem extends BaseComponent {
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
    console.log(this.infoPromotion.toDate);
    this.fieldSelected.endDate = !this.isCopyType
      ? this.infoPromotion.toDate
        ? new Date(this.infoPromotion.toDate)
        : moment().add(1, 'days')
      : moment().add(1, 'days');

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

    this.itemAdd.discountAmount = 0;

    this.isUpdate = false;

    this.isEditting = false;
    this.fieldSelected.itemEdit = null;
    this.fieldSelected.itemEditBase64 = null;
    this.fieldSelected.itemEditBase64Old = null;
    this.fieldSelected.isReset = false;

    this.fieldSelected.indexImgEdit = -1;
    this.fieldSelected.itemImageList = null;
    this.fieldSelected.itemImageListEdit = null;
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

  handleSeteImageOfListItem = (imageList) => {
    this.fieldSelected.itemImageList = imageList;
    this.refresh();
  };
  handleSeteImageOfListItemEdit = (imageList) => {
    this.fieldSelected.itemImageListEdit = imageList;
    this.refresh();
  };

  handleAddItemToList = () => {
    this.fieldSelected.isReset = false;

    const itemCode = this.idBarcodeItemRef.current.getBarcodeSelected();

    const discountAmount = this.itemAdd.discountAmount;

    const item = this.allItems[itemCode];

    if (itemCode === '') {
      message.error('Please insert barcode');
      return false;
    }

    for (let obj of this.dataTableAdd) {
      if (obj.itemCode === itemCode) {
        message.error('Barcode exists', 1);
        return false;
      }
    }

    if (discountAmount === undefined || discountAmount === 0) {
      message.error('Please insert discount amount');
      return false;
    }

    if (discountAmount < 1000) {
      message.error('Please insert discount amount more than 1000 VND');
      return false;
    }

    const obj = {
      key: this.dataTableAdd.length.toString(),
      itemCode: item.itemCode,
      itemName: item.itemName,
      discountAmount: discountAmount,
      imageKey: this.fieldSelected.itemImageList?.[0]?.url,
      isDelete: false,
    };

    this.dataTableAdd = [...this.dataTableAdd, obj];

    this.handleCancelAddItemToList();
  };

  handleDeleteRowTableAdd = (record) => {
    const itemCode = record.itemCode;
    const data = [...this.dataTableAdd];
    const updateData = data.filter((el) => el.itemCode !== itemCode);
    this.dataTableAdd = updateData;

    this.refresh();
  };
  handleCancelAddItemToList = () => {
    this.idBarcodeItemRef.current.setNewValue('');
    this.itemAdd.discountAmount = 0;
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

    const isDuplicate = hasDuplicateObject(this.items, this.dataTableAdd, 'itemCode');

    if (isDuplicate && !this.isUpdate) {
      message.error('Item is exist in list promotion');
      return false;
    }

    this.props.handleUpdateDataGroupPromo && this.props.handleUpdateDataGroupPromo(this.dataTableAdd, this.isUpdate);

    this.dataTableAdd = [];
    this.isUpdate = false;
    this.isShowAdd = false;

    this.refresh();
  };

  handleEditRowTableAdd = (record) => {
    const fields = this.fieldSelected;
    this.isEditting = true;
    fields.itemEdit = record;

    const itemCode = fields.itemEdit?.itemCode;
    const indexImg = this.imageList?.findIndex((el) => el.itemCode === itemCode);

    fields.indexImgEdit = indexImg;
    this.refresh();
  };

  finishUploadFile = (arr, barCodeError) => {
    let strError = barCodeError.toString().replaceAll(',', ', ');
    let config = {
      content: 'Barcode: ' + strError + ' is not exist',
      style: {
        fontSize: 10,
      },
    };

    barCodeError.length > 0 && message.error(config);

    this.handleEditItemsParent(arr);
  };

  handleImportFile = (file, callback) => {
    var reader = new FileReader();
    var f = file;
    let arr = [];
    let barCodeError = [];
    let requiredFields = {
      MaHH: 1,
      TienCK1: 1,
      TLCK1: 1,
      TienCK2: 1,
      TLCK2: 1,
    };
    var allItems = this.allItems;

    reader.onload = function (event) {
      var data = event.target.result;
      let readedData = XLSX.read(data, { type: 'binary' });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (!dataParse || dataParse.length <= 1) {
        message.error('File is invalid or empty');
        return;
      }
      for (let item of Object.keys(requiredFields)) {
        if (!dataParse[0].includes(item)) {
          message.error(`You missing required field ${item}`);
          return;
        }
      }
      for (let index in dataParse) {
        if (dataParse[index].length === 0) {
          message.error(`Your file missing data on row ${index}, Please fill data or delete this row`);
          return;
        }
      }

      var ret = [];
      if (dataParse) {
        for (var item in dataParse) {
          if (dataParse[item] != null && dataParse[item].length != 0) {
            ret.push(dataParse[item]);
          }
        }

        if (ret.length > 0) {
          for (let index in ret) {
            let item = ret[index];
            if (index != 0) {
              if (allItems && allItems[item[0]]) {
                arr.push({
                  key: arr.length.toString(),
                  itemCode: item[0],
                  itemName: allItems && allItems[item[0]] ? allItems[item[0]].itemName : '',
                  discountAmount: item[1],
                  isDelete: false,
                });
              } else {
                barCodeError.push(item[0]);
              }
            }
          }

          callback(arr, barCodeError);
        }
      } else {
        // this.finishUploadFile(null, "File excel is invalid");
        message.error('File excel is invalid');
      }
    };

    reader.readAsBinaryString(f);
    reader.onerror = FileHelper.errorHandler;
  };

  handleUpdateItem = async (item, itemBase64) => {
    const fields = this.fieldSelected;
    const data = [...this.dataTableAdd];

    const model = new UploadMediaModel();
    const itemCode = item.itemCode;
    const promotionCode = this.infoPromotion.promotionCode;
    const image = fields.itemBase64 ? StringHelper.base64Smooth(fields.itemBase64) : '';

    const payloadImage = {
      promotionCode,
      itemCode,
      image,
    };

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
        <EditOutlined onClick={() => this.handleEditRowTableAdd(item)} />
        <DeleteOutlined onClick={() => this.handleDeleteRowTableAdd(item)} style={{ color: 'red', marginLeft: 12 }} />
      </>
    );
  };

  handleRenderImage = (val, key, item) => {
    return (
      <div className="">
        <span
          className="d-inline-block pos-relative br-2 pd-2"
          style={{ width: 35, height: 35, background: '#e6f0ff' }}
        >
          <img
            src={item && item.itemCode ? (item.imageKey ? item.imageKey : IconProduct) : IconProduct}
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
    );
  };

  handleChangeUploadImg = async ({ file, fileList }) => {
    const fields = this.fieldSelected;

    const imageFile = fileList[0]?.originFileObj;
    const name = file?.name.split('.') + Date.now() + '.' + file?.name.split('.')[1];

    await getBase64(imageFile, (base64Image) => {
      let imgList = [...this.imageList];
      if (fields.indexImgEdit !== -1) {
        imgList[fields.indexImgEdit] = {
          ...imgList[fields.indexImgEdit],
          name: name,
          imageKey: base64Image,
        };
      }
      this.imageList = imgList;
      fields.itemBase64 = base64Image;

      this.refresh();
    });
  };

  renderComp() {
    let fields = this.fieldSelected;

    const contextValue = this.context;

    const { stores } = contextValue.state;
    let orderStore = {};
    let storeOptions = [];
    // console.log('props', this.props);
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

    const propsConfig = {
      // name: 'file',
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      // headers: {
      //     authorization: 'authorization-text',
      // },
      // onChange(info) {
      //     if (info.file.status !== 'uploading') {
      //         console.log(info.file, info.fileList);
      //     }
      //     if (info.file.status === 'done') {
      //         message.success(`${info.file.name} file uploaded successfully`);
      //     } else if (info.file.status === 'error') {
      //         message.error(`${info.file.name} file upload failed.`);
      //     }
      // },
    };

    const columnsTableCustom = [
      {
        field: 'itemCode',
        label: `Item ${dataTableAdd?.length > 0 ? '( ' + dataTableAdd?.length + ' items )' : ''} `,
        colSpanHead: 2,
      },
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
      { field: 'imageKey', label: 'Image', formatBody: this.handleRenderImage },
      {
        field: 'discountAmount',
        label: 'Discount amount',
        classHead: 'text-right',
        classBody: 'text-right',
        formatBody: (val) => StringHelper.formatValue(val),
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
                        <label htmlFor="promotionName" className="w100pc">
                          <span className="required">Promotion name:</span>
                          <InputComp
                            isDisable={isRunning}
                            func={this.handleUpdateField}
                            funcCallback={this.props.updatePromotionName}
                            keyField="promotionName"
                            text={fields.promotionName}
                          />
                        </label>
                      </Col>

                      <Col xl={8} xxl={6}>
                        <label htmlFor="date" className="w100pc">
                          <span className="required">Apply date:</span>
                          <div>
                            {/* <RangePicker start={fields.startDate} end={fields.endDate} func={this.handleUpdateDate} funcCallback={this.props.updateDate} disabledDate={new Date()}/> */}
                            <RangePicker
                              disabled={isRunning}
                              start={fields.startDate}
                              end={fields.endDate}
                              disabledDate={(currentDate) => currentDate && currentDate < moment().endOf('day')}
                              func={this.handleUpdateDate}
                              funcCallback={this.props.updateDate}
                            />
                          </div>
                        </label>
                      </Col>

                      <Col xl={8} xxl={6}>
                        <label htmlFor="storeCode" className="w100pc">
                          Apply store:
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
                        </label>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* Doc */}
            <Col span={24} className="section-block mt-15 ">
              <p className="mb-10">Dept. of I&T note</p>
              <Row gutter={[16, 16]}>
                <Col xl={8} xxl={4}>
                  <label htmlFor="promotionName" className="w100pc ">
                    <span className="required">Dept. of I&T code:</span>
                    <InputComp
                      isDisable={isRunning}
                      func={this.handleUpdateField}
                      funcCallback={this.props.updateDocCode}
                      keyField="docCode"
                      text={fields.docCode}
                    />
                  </label>
                </Col>
                <Col xl={8} xxl={4}>
                  <label htmlFor="promotionName" className="w100pc ">
                    <span className="">Dept. of I&T link:</span>
                    <InputComp
                      isDisable={isRunning}
                      func={this.handleUpdateField}
                      funcCallback={this.props.updateDocLink}
                      keyField="docLink"
                      text={fields.docLink}
                    />
                  </label>
                </Col>
              </Row>
            </Col>
            {/* END Doc */}
          </Row>

          <Row className="mt-15">
            {!isRunning ? (
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
                        <Col xl={12}>
                          <Row xl={24} gutter={[16, 16]}>
                            <Col span={10}>
                              <label htmlFor="itemCode" className="w100pc">
                                Barcode:
                                <AutocompleteBarcode
                                  idComponent={this.idBarcodeItem}
                                  ref={this.idBarcodeItemRef}
                                  barCodes={this.allItems}
                                />
                              </label>
                            </Col>
                            <Col span={10}>
                              <label htmlFor="discountAmount" className="w100pc">
                                Discount amount:
                                <div>
                                  <InputNumberComp
                                    value={this.itemAdd.discountAmount}
                                    minValue={1000}
                                    funcCallback={(val) => {
                                      this.itemAdd.discountAmount = val;
                                      this.refresh();
                                    }}
                                  />
                                </div>
                              </label>
                            </Col>
                            <Col style={{ alignSelf: 'end' }}>
                              {' '}
                              <Icons.Delete
                                className="cursor-pointer"
                                onClick={this.handleCancelAddItemToList}
                                style={{
                                  fontSize: '22px',
                                  alignSelf: 'end',
                                  marginBottom: '5px',
                                }}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col xl={8} style={{ marginTop: 10 }}>
                              <UploadImageDiscountItem
                                onSetListImages={this.handleSeteImageOfListItem}
                                isReset={this.fieldSelected.isReset}
                                onChangeReset={(value) => {
                                  this.fieldSelected.isReset = value;
                                  this.refresh();
                                }}
                              />
                            </Col>
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
                                <Upload
                                  {...propsConfig}
                                  accept=".xlsx,.xls"
                                  showUploadList={false}
                                  beforeUpload={(file) => {
                                    this.handleImportFile(file, this.finishUploadFile);
                                    this.refresh();
                                    return false;
                                  }}
                                >
                                  <Button
                                    icon={<UploadOutlined />}
                                    type="button"
                                    className="btn btn-success h-30"
                                    style={{ background: 'black' }}
                                  >
                                    Import file .xls .xlsx
                                  </Button>
                                </Upload>
                              </Space>
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={12}>
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
                            <Row>
                              <Col xl={24}>
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
                              </Col>
                              <Col xl={24} className="mt-10">
                                <UploadImageDiscountItemEdit
                                  onSetListImages={this.handleSeteImageOfListItemEdit}
                                  initialImageLits={[{ url: fields.itemEdit?.imageKey }]}
                                />
                              </Col>
                            </Row>
                            {/* <Row className="mrt-10">
                            <Col xl={24}>
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
                            </Col>
                          </Row> */}
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
                          scroll={200}
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
            ) : null}
          </Row>
        </div>
      </section>
    );
  }
}
export default ControlDetailDiscountItem;

ControlDetailDiscountItem.contextType = AppContext;
