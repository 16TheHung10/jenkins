//Plugin
import React from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

//Custom
import BaseComponent from 'components/BaseComponent';

import CommonModel from 'models/CommonModel';
import InternalOrderModel from 'models/InternalOrderModel';
import ReportingModel from 'models/ReportingModel';

import DateHelper from 'helpers/DateHelper';
import PageHelper from 'helpers/PageHelper';
import StringHelper from 'helpers/StringHelper';

import TableDetail from 'components/mainContent/reporting/mdReport/table/TableSaleCombineItemMD';

import CancelBill from 'components/mainContent/reporting/popupComp/CancelBill';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { decreaseDate, mapData } from 'helpers/FuncHelper';
import { Space } from 'antd';

export default class SalesopCombineItemMD extends BaseComponent {
  constructor(props) {
    super(props);

    this.idStoreShowExport = 'ppStoreExport' + StringHelper.randomKey();
    this.idStoreShowExportDetail = 'ppStoreExportDetail' + StringHelper.randomKey();
    this.idCancelBill = 'ppCancelBill' + StringHelper.randomKey();

    //Default data
    this.data.stores = {};
    this.allStore = [];

    this.items = [];

    // Sales by store
    this.dataDetailSbs = [];

    // disposal data

    this.data.disposal = [];
    this.data.exportDis = [];
    this.groupDisposal = {};
    this.data.disposalTotal = {};

    this.defaultDate = decreaseDate(0);

    //Data Selected

    this.resultSbc = [];

    this.fieldSelected = this.assignFieldSelected(
      {
        start: '',
        startDate: this.defaultDate,
        dateSbc: this.defaultDate,
        startDateSbc: decreaseDate(8),
        dateDetailEx: this.defaultDate,
        startDateDetailExport: '',
        storeCodeDetailExport: '',

        dateSbcEx: this.defaultDate,
        startDateSbcEx: '',
        starSbs: '',
        startDateSbs: this.defaultDate,
        storePaymentFilter: '',
        startSalesAcc: '',
        endSalesAcc: this.defaultDate,
        startSumByPayment: '',
        endSumByPayment: this.defaultDate,
        storeCodeCateExport: '',
      },
      ['storeCode']
    );

    this.page = 1;

    this.storeCodeCateExport = [];
    this.storeCodeDetailExport = [];

    this.detailBillCancel = [];
    this.detailBillCancelDisposal = [];
    this.detailBillCancelSBC = [];
    this.detailBillCancelPSBS = [];
    this.detailBillCancelSBP = [];

    this.isHasSOH = false;

    // if (this.fieldSelected.storeCode === undefined || this.fieldSelected.storeCode === "" || this.data.storeCode === undefined) {
    //     this.fieldSelected.storeCode = "VN0001";
    // }

    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      // if (filters["startDate"]) {
      //     filters["startDate"] = new Date(filters["startDate"]);
      // }

      return true;
    });

    this.sumDisposalDetail = {
      totalSaleQty: 0,
      totalSalePrice: 0,
      totalDisposalQty: 0,
      totalDisposalPrice: 0,
      saleQty: 0,
      salePrice: 0,
      disposalQty: 0,
      disposalPrice: 0,
    };

    this.itemReport = {
      totalBill: 0,
      totalItem: 0,
      totalCustomer: 0,
      totalGrossSales: 0,
      vatAmount: 0,
      billDiscount: 0,
      itemDiscount: 0,
      netSales: 0,
    };

    this.allTotalSales = {};
    this.listSales = [];
    this.itemsSumByPayment = [];

    this.isRender = true;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  handleGetSOH = (storeCode) => {
    let model = new InternalOrderModel();
    model.getSOH(storeCode, null, null, 'mdReportSaleCombineItem').then((res) => {
      if (res.status && res.data && res.data.storeStatus && res.data.stocks) {
        if (res.data.storeStatus) {
          if (res.data.stocks) {
            let arr = res.data.stocks;
            this.isHasSOH = true;

            this.items = mapData(this.items, arr, 'itemCode', ['soh']);
          }
        } else {
          this.showAlert('Could not get SOH', false);
        }

        this.refresh();
      } else {
        this.showAlert('Could not get SOH');
        this.isHasSOH = false;
      }
    });
  };

  getDataDetail = async () => {
    if (this.fieldSelected.startDate === null || this.fieldSelected.startDate === '') {
      this.showAlert("Please choose date for 'Sales by store'");
      return false;
    }

    this.items = [];
    let page = '';
    let storeCode = this.fieldSelected.storeCode;
    let params = {
      date: this.fieldSelected.startDate ? DateHelper.displayDateFormatMinus(this.fieldSelected.startDate) : '',
      // start: this.fieldSelected.start ? DateHelper.displayDateFormatMinus(this.fieldSelected.start) : "",
    };

    var report = new ReportingModel();

    if (
      DateHelper.displayDateFormatMinus(new Date()) === DateHelper.displayDateFormatMinus(this.fieldSelected.startDate)
    ) {
      page = 'salecombineitem';

      await report.getDataStoreCurrent(storeCode, page, params).then((res) => {
        if (res.status && res.data) {
          this.items = res.data.sale ? res.data.sale : [];
        } else {
          this.showAlert(res.message);
        }

        this.refresh();
      });
    } else {
      if (this.fieldSelected.storeCode === '' || this.fieldSelected.storeCode === undefined) {
        page = 'salecombineitem';
      } else {
        page = 'transaction/combineitem';
      }

      await report.getDataStore(storeCode, page, params).then((res) => {
        if (res.status && res.data) {
          // let results = res.data.sale ? res.data.sale : [];
          this.items = res.data.sale ? res.data.sale : [];

          // for (let i in results) {
          //     let item = results[i];
          //     item.soh = item.
          // }
        } else {
          this.showAlert(res.message);
        }

        this.refresh();
      });
    }

    this.handleGetSOH(storeCode);
  };

  onChangeStoreCode = (value) => {
    if (value) {
      this.handleReset();
    }
  };

  handleReset = () => {
    let fileds = this.fieldSelected;
    fileds.start = '';
    fileds.startDate = this.defaultDate;
    fileds.dateSbc = this.defaultDate;
    fileds.startDateSbc = '';
    fileds.dateDetailEx = this.defaultDate;
    fileds.startDateDetailExport = '';
    fileds.dateSbcEx = this.defaultDate;
    fileds.startDateSbcEx = '';
    fileds.starSbs = '';
    fileds.startDateSbs = this.defaultDate;

    this.resultSbc = [];
    this.dataDetailSbs = [];

    this.data.disposal = [];
    this.groupDisposal = {};
    this.data.disposalTotal = {};

    this.sumDisposalDetail = {
      totalSaleQty: 0,
      totalSalePrice: 0,
      totalDisposalQty: 0,
      totalDisposalPrice: 0,
      saleQty: 0,
      salePrice: 0,
      disposalQty: 0,
      disposalPrice: 0,
    };

    this.itemReport = {
      totalBill: 0,
      totalItem: 0,
      totalCustomer: 0,
      totalGrossSales: 0,
      vatAmount: 0,
      billDiscount: 0,
      itemDiscount: 0,
      netSales: 0,
    };
    this.refresh();
  };

  handleExportAllStoreToMail = () => {
    let store = '';

    if (this.fieldSelected.storeCodeCateExport === '') {
      this.showAlert('Please choose store to export');
      return false;
    }

    if (this.storeCodeCateExport.length === 0) {
      this.showAlert('Please select at least one store to export');
      return false;
    }

    store = this.storeCodeCateExport.toString();

    let params = {
      type: 'saleitem',
      method: 'email',
      // email: this.nameMail+"@gs25.com.vn",
      date: this.fieldSelected.dateSbcEx ? DateHelper.displayDateFormatMinus(this.fieldSelected.dateSbcEx) : '',
      start: this.fieldSelected.startDateSbcEx
        ? DateHelper.displayDateFormatMinus(this.fieldSelected.startDateSbcEx)
        : '',
      storeCode: store,
    };

    let model = new ReportingModel();
    model.exportAnalyticreport(params).then((res) => {
      if (res.status && res.data) {
        let ml = res.data.receiver || '';
        this.showAlert('File sent successfully, please check your mail ' + ml + ' in 15 minutes', 'success', false);

        this.fieldSelected.storeCodeCateExport = '';
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleExportAllStoreToMailDetail = () => {
    let store = '';

    if (this.fieldSelected.storeCodeDetailExport === '') {
      this.showAlert('Please choose store to export');
      return false;
    }

    if (this.storeCodeDetailExport.length === 0) {
      this.showAlert('Please select at least one store to export');
      return false;
    }

    store = this.storeCodeDetailExport.toString();

    let params = {
      type: 'salesummary',
      method: 'email',
      // email: this.nameMail+"@gs25.com.vn",
      date: this.fieldSelected.dateDetailEx ? DateHelper.displayDateFormatMinus(this.fieldSelected.dateDetailEx) : '',
      start: this.fieldSelected.startDateDetailExport
        ? DateHelper.displayDateFormatMinus(this.fieldSelected.startDateDetailExport)
        : '',
      storeCode: store,
    };

    let model = new ReportingModel();
    model.exportAnalyticreport(params).then((res) => {
      if (res.status && res.data) {
        let ml = res.data.receiver || '';
        this.showAlert('File sent successfully, please check your mail ' + ml + ' in 15 minutes', 'success', false);

        this.fieldSelected.storeCodeDetailExport = '';
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    commonModel.getData('store').then((res) => {
      if (res.status) {
        this.data.stores = res.data.stores || [];
      }
      this.refresh();
    });
  };

  // ----------------------------------------------------

  renderComp() {
    let stores = this.data.stores;

    let storeKeys = Object.keys(stores);
    const orderStore = {};
    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        if (DateHelper.diffDate(stores[key].openedDate, new Date()) > 0) {
          orderStore[key] = stores[key];
        }
      });
    let storeOptions = [];
    let storeOptionsCate = [];
    this.allStore = [];
    if (storeKeys.length === 0) {
      storeOptions.push({ value: this.data.storeCode, label: this.data.storeCode + ' - ' + this.data.storeName });
      this.allStore.push(this.data.storeCode);
      storeOptionsCate = storeOptions;
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        this.allStore.push(stores[key].storeCode);
        return {
          value: stores[key].storeCode,
          label: stores[key].storeCode + ' - ' + stores[key].storeName,
          openedDate: stores[key].openedDate,
        };
      });

      for (let key in orderStore) {
        let el = orderStore[key];
        if (el.storeCode.substring(0, 2) === 'VN') {
          storeOptionsCate.push({
            value: el.storeCode,
            label: el.storeCode + ' - ' + el.storeName,
            openedDate: el.openedDate,
          });
        }
      }
    }

    this.storeShowExport = {};
    let groupStore = [];
    let count = 1;
    const chunkSize = 100;
    for (let i = 0; i < storeOptionsCate.length; i += chunkSize) {
      const chunk = storeOptionsCate.slice(i, i + chunkSize);

      var obj = {};
      for (let a = 0; a < chunk.length; a++) {
        if (a === 0) {
          obj.value = count;
          obj.label = chunk[a].value;
          obj.openedDate = chunk[a].openedDate;
        }
        if (a === chunk.length - 1) {
          obj.label += ' - ' + chunk[a].value;
        }
      }

      this.storeShowExport[count] = chunk;

      groupStore.push(obj);

      count++;
    }

    // Disposal data
    let dataDisposal = this.groupDisposal;

    let sumDisposalDetail = this.sumDisposalDetail;

    return (
      <div>
        <CancelBill id={this.idCancelBill} items={this.detailBillCancel} />

        <div>
          <div className="row">
            <div className="col-md-12">
              <div className="row mrt-5">
                <div className="col-md-3" style={{ paddingRight: 0 }}>
                  <div className="form-group">
                    <label className="w100pc">Store:</label>
                    <Select
                      // isDisabled={storeOptions.length === 1 && !this.getAccountState().isAdmin()}
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={storeOptions.filter((option) => option.value === this.fieldSelected.storeCode)}
                      options={storeOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom('storeCode', e ? e.value : '', (e) => this.onChangeStoreCode(e))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3 col-lg-2">
                  <div className="form-group">
                    <label className="w100pc">Start date:</label>
                    <DatePicker
                      placeholderText="Start date"
                      selected={this.fieldSelected.start}
                      onChange={(value) => this.handleChangeFieldCustom('start', value)}
                      dateFormat="dd/MM/yyyy"
                      maxDate={decreaseDate(0, this.fieldSelected.startDate)}
                      minDate={decreaseDate(8, this.fieldSelected.startDate)}
                      className="form-control"
                      autoComplete="off"
                      isClearable={this.fieldSelected.start ? true : false}
                      disabled={
                        DateHelper.displayDateFormatMinus(this.fieldSelected.startDate) ===
                        DateHelper.displayDateFormatMinus(new Date())
                          ? true
                          : false
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3 col-lg-2">
                  <div className="form-group">
                    <label className="w100pc">Date</label>
                    <DatePicker
                      placeholderText="Date"
                      selected={this.fieldSelected.startDate}
                      onChange={(value) =>
                        this.handleChangeFieldCustom('startDate', value, () => {
                          this.fieldSelected.start =
                            DateHelper.displayDateFormatMinus(this.fieldSelected.startDate) ===
                            DateHelper.displayDateFormatMinus(new Date())
                              ? ''
                              : decreaseDate(8, this.fieldSelected.startDate);
                        })
                      }
                      dateFormat="dd/MM/yyyy"
                      maxDate={decreaseDate(0)}
                      minDate={decreaseDate(60)}
                      className="form-control"
                      autoComplete="off"
                      // isClearable={this.fieldSelected.startDate ? true : false}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="methodcode" className="w100pc" style={{ opacity: 0 }}>
                    .
                  </label>
                  <Space size={'small'}>
                    <button
                      onClick={this.getDataDetail}
                      type="button"
                      className="btn btn-danger"
                      style={{ height: '38px' }}
                    >
                      Search
                    </button>
                    <button
                      onClick={() => handleExportAutoField(this.items, 'reportSaleCombineItemExport')}
                      type="button"
                      className="btn btn-danger"
                      style={{ height: '38px', marginRight: 0 }}
                    >
                      Export
                    </button>
                  </Space>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <TableDetail
                // data={dataDisposal}
                // sumDisposalDetail={sumDisposalDetail}
                items={this.items}
                isHasSOH={this.isHasSOH}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
