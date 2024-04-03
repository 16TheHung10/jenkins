//Plugin
import $ from 'jquery';
import React from 'react';
//Custom
import BaseComponent from 'components/BaseComponent';
import DateHelper from 'helpers/DateHelper';
import StringHelper from 'helpers/StringHelper';
import CommonModel from 'models/CommonModel';

import { handleExportAutoField } from 'helpers/ExportHelper';
import { cloneDeep, createListOption, decreaseDate, fnObjGroup, sortColumn } from 'helpers/FuncHelper';
import ReportingModel from 'models/ReportingModel';

import BarcodeComp from 'components/mainContent/reporting/autocompleteBarcode';
import TableCurrentInventory from 'components/mainContent/reporting/tableComp/TableCurrentInventory';

import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag, message } from 'antd';
import InventoryNoti from 'components/common/inventoryNoti';
import ExportMultiWorkspace from 'components/mainContent/reporting/popupComp/ExportMultiWorkspace';
import ProgressBarTracking from 'helpers/ProgressBarTracking';
import ModelGroupStore from 'modelComponent/ModelGroupStore';
import SelectBox from 'utils/selectBox';
export default class CurrentInventory extends BaseComponent {
  constructor(props) {
    super(props);

    this.idBarcodeItemRef = React.createRef();
    this.idBarcodeItem = 'idBarcodeItem' + StringHelper.randomKey();
    this.idStoreDetail = 'ppStoreExportDetail' + StringHelper.randomKey();

    //Default data
    this.data.stores = [];
    this.lstSupplier = [];
    this.lstCat = [];
    this.lstDivision = [];
    this.lstBarcode = [];
    this.itemReport = {
      totalItem: 0,
      totalOpenStock: 0,
      totalRcvQty: 0,
      totalSaleQty: 0,
      totalDeliveryQty: 0,
      totalSOH: 0,
    };
    this.itemsOrder = {};
    this.items = [];

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        itemCode: '',
        categoryCode: '',
        supplierCode: '',
      },
      ['storeCode']
    );

    this.isRender = true;
    this.isShowCompInventoryComp = false;
    this.isLoading = false;
  }

  componentDidMount() {
    // this.handleCheckInventory();
    this.handleUpdateState();
  }

  // handleCheckInventory = async () => {

  //     let model = new ReportingModel();
  //     let date = DateHelper.displayDateFormatMinus(new Date());

  //     await model.checkStatusAPIinventory(date).then(response => {
  //         if (response.status && response.data.storeStatus) {
  //             this.handleUpdateState();

  //             if (response.message) {
  //                 if (response.message !== "") {
  //                     message.error(response.message);
  //                 }
  //             }
  //         }
  //         else {
  //             this.isShowCompInventoryComp = true;
  //         }
  //     });

  //     this.refresh();
  // }

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData('store').then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
      }
    });

    this.refresh();
  };

  handleSearch = async () => {
    const fields = this.fieldSelected;

    if (fields.storeCode === '' || fields.storeCode?.length === 0 || fields.storeCode[0] === '') {
      message.error('Please choose store to search');
      return false;
    }

    let model = new ReportingModel();
    let date = DateHelper.displayDateFormatMinus(new Date());

    await model.checkStatusAPIinventory(date).then((response) => {
      if (response.status && response.data.storeStatus) {
        if (response.message) {
          if (response.message !== '') {
            message.error(response.message);
          }
        }
        this.isLoading = true;
        this.handleGetInventory();
      } else {
        message.error('Data updating');
        this.isShowCompInventoryComp = true;
      }
    });

    this.refresh();
  };

  handleGetInventory = async () => {
    const fields = this.fieldSelected;

    // let page = "/reporting/stock/";

    let keyPage = '/store';

    this.lstBarcode = [];
    this.lstCat = [];
    this.lstSupplier = [];
    this.itemsOrder = {};
    this.items = [];

    let model = new ReportingModel();

    let diff = fields.storeCode.length;

    var result = [];
    let onePc = (100 * 100) / diff / 100;
    ProgressBarTracking.start(onePc, diff, 0);
    for (let i = 0; i < diff; i++) {
      let page = '/inventory/stock/' + fields.storeCode[i];

      if (ProgressBarTracking.instance !== null) {
        let response = await model.getInventoryReport(page, fields.storeCode[i], keyPage, null, process.env.REACT_APP_INVENTORY_REPORT_ROOT_URL);
        ProgressBarTracking.instance !== null && ProgressBarTracking.start(onePc, diff, i + 1);

        if (response.status && response.data) {
          if (response.data.stocks) {
            ProgressBarTracking.instance !== null && ProgressBarTracking.start(onePc, diff, i + 1);

            result = [...result, ...response.data.stocks];
          }
        } else {
          message.error(response.message);
        }
      } else {
        result = [];
      }
    }
    ProgressBarTracking.hide();
    this.items = result;
    this.isLoading = false;
    this.handleSum(result);
    this.lstBarcode = createListOption(result, 'itemCode', 'itemName');
    this.lstCat = createListOption(result, 'categoryName');
    this.lstSupplier = createListOption(result, 'supplierName');

    let lstField = {
      itemCode: '',
      itemName: '',
    };
    this.itemsOrder = fnObjGroup(result, 'itemCode', lstField);

    // await model.getInventoryReport(page, storeCode, keyPage).then(res => {
    //     if (res.status && res.data) {
    //         if (res.data.stock) {
    //             this.items = res.data.stock || [];

    //             this.handleSum(res.data.stocks)

    //             this.lstBarcode = createListOption(this.items, "itemCode", "itemName");
    //             this.lstCat = createListOption(this.items, "categoryCode", "categoryName");
    //             this.lstSupplier = createListOption(this.items, "supplierCode", "supplierName");

    //             let lstField = {
    //                 itemCode: "",
    //                 itemName: "",
    //             }
    //             this.itemsOrder = fnObjGroup(this.items, "itemCode", lstField);
    //         }
    //     }
    //     else {
    //         this.showAlert("API connect fail");
    //     }
    // });
    this.refresh();
  };

  // handleExport = () => {
  //     let type = "salesbyclassification";
  //     let params = {
  //         storeCode: this.fieldSelected.storeCode
  //     }

  //     let model = new ReportingModel();
  //     model.reportingExport(type, params).then(res => {
  //         if (res.status) {
  //             let downloadModel = new DownloadModel();
  //             downloadModel.get(res.data.downloadUrl, null, null, ".xls");
  //         } else {
  //             this.showAlert(res.message);
  //         }
  //     });
  // }

  handleFilter = (listItem) => {
    let list = listItem;

    if (this.fieldSelected.supplierCode !== '') {
      // list = list.filter(e => e.supplierCode === this.fieldSelected.supplierCode);
      list = list.filter((e) => e.supplierName === this.fieldSelected.supplierCode);
    }

    if (this.fieldSelected.categoryCode !== '') {
      // list = list.filter(e => e.categoryCode === this.fieldSelected.categoryCode);
      list = list.filter((e) => e.categoryName === this.fieldSelected.categoryCode);
    }

    if (this.fieldSelected.itemCode !== '') {
      list = list.filter((a) => a.itemCode === this.fieldSelected.itemCode);
    }

    this.handleSum(list);

    return list;
  };

  handleSum = (list) => {
    this.itemReport = {
      totalItem: 0,
      totalOpenStock: 0,
      totalRcvQty: 0,
      totalSaleQty: 0,
      totalDeliveryQty: 0,
      totalSOH: 0,
    };

    for (let k in list) {
      let item = list[k];
      this.itemReport.totalItem += 1;
      this.itemReport.totalOpenStock += parseFloat(item.openStock);
      this.itemReport.totalRcvQty += parseFloat(item.rcvQty);
      this.itemReport.totalSaleQty += parseFloat(item.saleQty);
      this.itemReport.totalDeliveryQty += parseFloat(item.deliveryQty);
      this.itemReport.totalSOH += parseFloat(item.soh);
    }
  };

  handleUpdateFilterBarcode = (itemCode, isFilter) => {
    if (isFilter) {
      this.fieldSelected.itemCode = itemCode;
      this.refresh();
    }
  };

  // updateFilter = (val, key) => {
  //     if (key) {
  //         this.fieldSelected[key] = val;
  //         this.refresh();
  //     }
  // }

  handleExport = () => {
    let dataClone = cloneDeep(this.items);
    let colSort = ['storeCode', 'supplierName', 'categoryName', 'itemCode', 'itemName', 'openStock', 'rcvQty', 'saleQty', 'deliveryQty', 'soh'];
    let dataExport = sortColumn(dataClone, colSort);
    handleExportAutoField(dataExport, 'inventoryByStore');
  };

  handleExportDetail = () => {
    $('#' + this.idStoreDetail).show();
    this.refresh();
  };

  renderComp() {
    const fields = this.fieldSelected;
    let isStore = false;
    let catetoryOpt = this.lstCat;
    let supplierOpt = this.lstSupplier;

    let stores = this.data.stores;
    // let storeKeys = Object.keys(stores);
    const orderStore = {};
    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });
    let storeOptions = [];
    if (Object.keys(stores).length === 0) {
      storeOptions.push({ value: this.data.storeCode, label: this.data.storeCode + ' - ' + this.data.storeName, openedDate: DateHelper.displayDateFormatMinus(decreaseDate(1)) });
      isStore = true;
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return { value: stores[key].storeCode, label: stores[key].storeCode + ' - ' + stores[key].storeName, openedDate: stores[key].openedDate };
      });
    }
    // --------------------------------
    let objStore = {};
    let optStore = [];
    if (Object.keys(stores).length === 0) {
      optStore.push({ value: this.data.storeCode, label: this.data.storeCode + ' - ' + this.data.storeName, openedDate: DateHelper.displayDateFormatMinus(decreaseDate(1)) });
    } else {
      objStore['Store FC'] = [];
      objStore['Store Direct'] = [];
      Object.keys(orderStore).map((key) => {
        if (stores[key].fcModel !== '') {
          objStore['Store FC'].push({ value: stores[key].storeCode, label: stores[key].storeCode + ' - ' + stores[key].storeName, openedDate: stores[key].openedDate });
        } else {
          objStore['Store Direct'].push({ value: stores[key].storeCode, label: stores[key].storeCode + ' - ' + stores[key].storeName, openedDate: stores[key].openedDate });
        }
      });

      for (let key in objStore) {
        let item = objStore[key];

        let obj = {
          name: key,
          children: item,
        };
        optStore.push(obj);
      }
    }
    // --------------------------------

    let items = this.handleFilter(this.items);

    return (
      <div
      // className="container-table"
      >
        <div>
          <>
            {this.isShowCompInventoryComp ? (
              <InventoryNoti />
            ) : (
              <>
                <Row gutter={16} className="mrt-10">
                  <Col xl={24}>
                    <div className="section-block">
                      <Row gutter={16}>
                        <Col xl={16}>
                          <Row gutter={16}>
                            <Col xl={13}>
                              {/* <label htmlFor="storeCode" className="w100pc">
                                                                    Store:
                                                                    <SelectboxAndCheckbox data={optStore} func={this.updateFilter} keyField={'storeCode'} defaultValue={fields.storeCode} isMode={'multiple'} />
                                                                </label> */}
                              <ModelGroupStore
                                // groupStore={fields.storeCode}
                                setGroupStore={(val) => {
                                  fields.storeCode = val;
                                  this.refresh();
                                }}
                                mode="multiple"
                                // maxChoose={5}
                              />
                            </Col>
                          </Row>
                          <Row gutter={16} className="mrt-10">
                            <Col xl={24}>
                              <Space size={'small'}>
                                <Tag className="h-30 icon-search" onClick={this.handleSearch}>
                                  <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                                </Tag>
                                <Tag icon={<FileExcelOutlined />} className="h-30 icon-excel" onClick={this.handleExport}>
                                  <span className="icon-excel-detail">Export</span>
                                </Tag>
                                <Tag icon={<FileExcelOutlined />} className="h-30 icon-excel btn-showpp" onClick={this.handleExportDetail}>
                                  <span className="icon-excel-detail">Export detail</span>
                                </Tag>
                              </Space>
                            </Col>
                          </Row>
                          {this.items.length > 0 && (
                            <Row gutter={16} className="mrt-10">
                              <Col xl={8}>
                                <label htmlFor="supplierCode" className="w100pc">
                                  Supplier:
                                  <SelectBox data={supplierOpt} func={this.updateFilter} keyField={'supplierCode'} defaultValue={fields.supplierCode} isMode={''} />
                                </label>
                              </Col>
                              <Col xl={8}>
                                <label htmlFor="categoryCode" className="w100pc">
                                  Category:
                                  <SelectBox data={catetoryOpt} func={this.updateFilter} keyField={'categoryCode'} defaultValue={fields.categoryCode} isMode={''} />
                                </label>
                              </Col>
                              <Col xl={8}>
                                <label htmlFor="itemCode" className="w100pc">
                                  Barcode:
                                </label>
                                {/* <ModelInputSuggestItem getBarcode={(val) => { fields.itemCode = val; this.refresh() }} /> */}
                                <BarcodeComp
                                  idComponent={this.idBarcodeItem}
                                  ref={this.idBarcodeItemRef}
                                  barCodes={this.itemsOrder}
                                  AddBarcode={this.handleAddBarcode}
                                  updateFilter={this.handleUpdateFilterBarcode}
                                  style={{ padding: '5px 12px', height: 30 }}
                                />
                              </Col>
                            </Row>
                          )}
                        </Col>
                        <Col xl={8}>
                          <div className="cl-red bg-note d-inline-block text-left">
                            Lưu ý:
                            <br />
                            - Phiếu hủy phải thực hiện trong ngày. <br />
                            - Các phiếu hủy chưa hoàn thành sẽ tự động xóa vào cuối ngày
                            <br />
                            - Auto lock receiving trong thời gian kiểm kê (dự kiến trong 4 giờ) <br />
                            - Internal transfer chưa xác nhận trước kỳ kiểm kê sẽ bị lock <br />- Hàng raw phải qua ngày mới được quy đổi
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                <Row className="mrt-10">
                  <Col xl={24}>
                    <TableCurrentInventory items={items} fieldSelected={this.fieldSelected} itemReport={this.itemReport} isLoading={this.isLoading} />
                  </Col>
                </Row>

                <ExportMultiWorkspace id={this.idStoreDetail} storeOptions={storeOptions} type="detail/invbystore" />

                {/* <div id="content-updating" className="detail-tab row d-none pos-absolute" style={{ width: '100%', height: '100%', top: 0, bottom: 0, background: 'white' }}>
                                        <h6 className="cl-red pos-relative" style={{ padding: '0 15px' }}>Dữ liệu đang được cập nhật, vui lòng quay lại sau. <button onClick={() => super.back('/')} type="button" className="btn btn-back">Back</button></h6>
                                    </div> */}
              </>
            )}
          </>
        </div>
      </div>
    );
  }
}
