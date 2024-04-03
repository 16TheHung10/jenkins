//Plugin
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';

import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';

import DateHelper from 'helpers/DateHelper';
import StringHelper from 'helpers/StringHelper';

import TableSumByPayment from 'components/mainContent/reporting/mktReport/table/TableSumByPayment';

import { handleExportAutoField } from 'helpers/ExportHelper';
import { decreaseDate } from 'helpers/FuncHelper';

import { Col, Row, Space } from 'antd';
import RangePicker from 'utils/rangePickerV2';
import SelectBox from 'utils/selectBox';

export default class SummaryByPayment extends BaseComponent {
  constructor(props) {
    super(props);

    this.idStoreShowExport = 'ppStoreExport' + StringHelper.randomKey();
    this.idStoreShowExportDetail = 'ppStoreExportDetail' + StringHelper.randomKey();

    //Default data
    this.data.stores = {};
    this.allStore = [];

    // disposal data

    this.data.disposal = [];
    this.data.exportDis = [];

    this.data.disposalTotal = {};

    this.defaultDate = decreaseDate(1);

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        start: null,
        date: null,
      },
      ['storeCode']
    );

    this.page = 1;

    this.itemsSumByPayment = [];

    this.isRender = true;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  onChangeStoreCode = (value) => {
    if (value) {
      this.handleReset();
    }
  };

  handleReset = () => {
    let fileds = this.fieldSelected;

    fileds.start = null;
    fileds.date = null;

    this.data.disposal = [];

    this.data.disposalTotal = {};

    this.refresh();
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

  handleSearchSumByPayment = () => {
    this.handleGetPaymentMethod();
  };

  handleGetPaymentMethod = () => {
    if (this.fieldSelected.date === null || this.fieldSelected.date === '') {
      this.showAlert('Please choose date');
      return false;
    }

    let storeCode = this.fieldSelected.storeCode;
    let params = {
      start:
        DateHelper.displayDateFormatMinus(this.fieldSelected.date) === DateHelper.displayDateFormatMinus(this.fieldSelected.start) ? '' : DateHelper.displayDateFormatMinus(this.fieldSelected.start),
      date: DateHelper.displayDateFormatMinus(this.fieldSelected.date) ?? '',
    };

    this.itemsSumByPayment = [];

    let obj = {};

    let page = !storeCode ? '/paymentMethod/summary' : 'paymentMethod/summary';
    let model = new ReportingModel();
    model.getInfoReport(page, storeCode, params).then((res) => {
      if (res.status && res.data) {
        this.itemsSumByPayment = res.data.sale || [];
        this.refresh();
      } else {
        this.showAlert('Can not get payment method');
      }
    });
  };

  // ----------------------------------------------------

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.refresh();
    }
  };

  handleUpdateDate = (arr) => {
    let fields = this.fieldSelected;

    fields.start = arr && arr[0] !== null ? arr[0] : null;
    fields.date = arr && arr[1] !== null ? arr[1] : null;

    this.refresh();
  };

  renderComp() {
    let fields = this.fieldSelected;
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
      storeOptions.push({
        value: this.data.storeCode,
        label: this.data.storeCode + ' - ' + this.data.storeName,
      });
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

    let dates = [fields.start, fields.date];

    return (
      <div className="container-table">
        <div className="col-md-12">
          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={19}>
                    <Row gutter={16}>
                      <Col xl={8}>
                        <label htmlFor="storeCode" className="w100pc">
                          Store:
                          <SelectBox data={storeOptions} func={this.updateFilter} funcCallback={this.onChangeStoreCode} keyField={'storeCode'} defaultValue={fields.storeCode} isMode={''} />
                        </label>
                      </Col>
                      <Col xl={8}>
                        <label htmlFor="date" className="w100pc">
                          Date:
                          <div>
                            <RangePicker
                              dates={dates}
                              // range={7}
                              minDate={decreaseDate(62)}
                              maxDate={decreaseDate(0)}
                              func={this.handleUpdateDate}
                            />
                          </div>
                        </label>
                      </Col>
                      <Col xl={8}>
                        <label className="w100pc op-0">.</label>
                        <Space size={'small'}>
                          <button type="button" className="btn btn-danger h-30" onClick={this.handleSearchSumByPayment}>
                            Search
                          </button>

                          <button type="button" className="btn btn-danger h-30" onClick={() => handleExportAutoField(this.itemsSumByPayment, 'summaryByPaymentExport')}>
                            Export
                          </button>
                        </Space>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={5}></Col>
                </Row>
              </div>
            </Col>
          </Row>
          <div id="report-summarybyPayment" className="detail-tab row mrt-10">
            <div className="col-md-12">
              {/* <div className="wrap-block-table css-detail-tab" style={{ borderColor: 'rgb(0,154,255)' }}> */}
              <div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="section-block">
                      <TableSumByPayment items={this.itemsSumByPayment} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
