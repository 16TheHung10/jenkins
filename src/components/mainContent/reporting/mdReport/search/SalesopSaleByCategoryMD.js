//Plugin
import React from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import $ from 'jquery';
import Moment from 'moment';

import DateHelper from 'helpers/DateHelper';
import StringHelper from 'helpers/StringHelper';
import { decreaseDate, changeTab, fnObjGroup, createListOption, fnSum } from 'helpers/FuncHelper';

import BaseComponent from 'components/BaseComponent';

import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';

import TableSalesByCategoryMD from 'components/mainContent/reporting/mdReport/table/TableSalesByCategoryMD';
import StoreSelect from 'components/mainContent/store/StoreSelect';

import { Col, Row, Space, Tag, message } from 'antd';
import SelectBox from 'utils/selectBox';
import RangePicker from 'utils/rangePicker';
import ModelExportDataMultiple from 'modelComponent/export/ModelExportDataMultiple';
import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';

export default class SalesopSaleByCategory extends BaseComponent {
  constructor(props) {
    super(props);
    this.type = this.props.type || '';
    this.title = '';

    this.idStoreShowExport = 'ppStoreExport' + StringHelper.randomKey();
    this.idStoreShowExportDetail = 'ppStoreExportDetail' + StringHelper.randomKey();

    //Default data
    this.data.stores = {};
    this.allStore = [];

    this.defaultDate = decreaseDate(1);

    //Data Selected

    this.resultSbc = [];

    this.fieldSelected = this.assignFieldSelected(
      {
        date: Moment(decreaseDate(1)),
        start: Moment(decreaseDate(8)),

        dateSbc: this.defaultDate,
        startDateSbc: decreaseDate(8),
        dateDetailEx: this.defaultDate,

        dateSbcEx: this.defaultDate,
        startDateSbcEx: '',

        storeCodeCateExport: '',
      },
      ['storeCode']
    );

    this.page = 1;

    this.storeCodeCateExport = [];

    this.isRender = true;

    this.isOpenDrawerExport = false;
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

    fileds.start = Moment(decreaseDate(8));
    fileds.date = Moment(decreaseDate(1));

    fileds.dateSbc = this.defaultDate;
    fileds.startDateSbc = '';
    fileds.dateDetailEx = this.defaultDate;

    fileds.dateSbcEx = this.defaultDate;
    fileds.startDateSbcEx = '';

    this.resultSbc = [];

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

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    commonModel.getData('store').then((res) => {
      if (res.status) {
        this.data.stores = res.data.stores || [];
      }
      this.refresh();
    });
  };

  handleSearchSalesbyCategory = async () => {
    if (this.fieldSelected.date === null || this.fieldSelected.date === '') {
      this.showAlert('Please choose date for sales by store');
      return false;
    }

    this.fieldSelected.storeCodeCateExport = '';
    this.storeCodeCateExport = [];

    let storeCode = this.fieldSelected.storeCode;

    let params = {
      start:
        DateHelper.displayDateFormatMinus(this.fieldSelected.date) ===
        DateHelper.displayDateFormatMinus(this.fieldSelected.start)
          ? ''
          : DateHelper.displayDateFormatMinus(this.fieldSelected.start),
      date: DateHelper.displayDateFormatMinus(this.fieldSelected.date) ?? '',
    };

    let result = [];

    let model = new ReportingModel();

    model.getDataStore(storeCode, 'item/top/daily', params).then((res) => {
      if (res.status && res.data) {
        result = res.data.sale || [];
        this.resultSbc = result.filter((el) => el.itemQty !== 0);

        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleUpdateStoreCodeCateExport = (value) => {
    this.storeCodeCateExport = [];
    this.storeCodeCateExport = value;
    this.refresh();
  };

  handleExportStoreCate = () => {
    $('#' + this.idStoreShowExport).show();
    this.fieldSelected.storeCodeCateExport = '';
    this.storeCodeCateExport = [];
    this.refresh();
  };

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

  // ----------------------------------------------------

  renderComp() {
    let fields = this.fieldSelected;
    let stores = this.data.stores;
    let isStore = false;

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
        openedDate: DateHelper.displayDateFormatMinus(decreaseDate(1)),
      });
      this.allStore.push(this.data.storeCode);
      storeOptionsCate = storeOptions;
      isStore = true;
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
      <div>
        <div>
          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={19}>
                    <Row gutter={16}>
                      <Col xl={8}>
                        <label htmlFor="storeCode" className="w100pc">
                          Store:
                          <SelectBox
                            data={storeOptions}
                            func={this.updateFilter}
                            funcCallback={this.onChangeStoreCode}
                            keyField={'storeCode'}
                            defaultValue={fields.storeCode}
                            isMode={''}
                          />
                        </label>
                      </Col>
                      <Col xl={8}>
                        <label htmlFor="date" className="w100pc">
                          Date:
                          <div>
                            <RangePicker
                              dates={dates}
                              range={32}
                              minDate={decreaseDate(92)}
                              maxDate={decreaseDate(0)}
                              func={this.handleUpdateDate}
                            />
                          </div>
                        </label>
                      </Col>
                      <Col xl={8}>
                        <label className="w100pc op-0">.</label>
                        <Space size={'small'}>
                          {/* <button
                                                        onClick={this.handleSearchSalesbyCategory}
                                                        type="button"
                                                        className="btn btn-danger h-30"
                                                    >
                                                        Search
                                                    </button> */}
                          <Tag className="h-30 icon-search" onClick={this.handleSearchSalesbyCategory}>
                            <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                          </Tag>
                          {/* <button
                                                        // onClick={this.handleExportStoreCate}
                                                        onClick={() => { this.isOpenDrawerExport = true; this.refresh() }}
                                                        type="button"
                                                        className="btn btn-danger btn-showpp h-30"
                                                    >
                                                        Export multi
                                                    </button> */}
                          <Tag
                            icon={<FileExcelOutlined />}
                            className="h-30 icon-excel"
                            onClick={() => {
                              this.isOpenDrawerExport = true;
                              this.refresh();
                            }}
                          >
                            <span className="icon-excel-detail">Export multi</span>
                          </Tag>
                        </Space>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={5}></Col>
                </Row>
              </div>
            </Col>
          </Row>
          <div id="sbc" className="detail-tab row mrt-10">
            <div className="col-md-12">
              <div>
                {/* <div className="wrap-block-table css-detail-tab" style={{ borderColor: 'rgb(0,154,255)' }}> */}
                {/* <div className="row">
                                    <div className="col-md-12">
                                        <div className="row mrt-5">
                                            <section id={this.idStoreShowExport} className='popup-form' style={{ minHeight: 300, minWidth: 500, maxWidth: '65%', width: 'auto' }}>
                                                <div className="row" style={{ paddingTop: 10 }}>
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label htmlFor="storeCodeCateExport" className="w100pc">
                                                                Store export:
                                                            </label>
                                                            <Select
                                                                isClearable
                                                                classNamePrefix="select"
                                                                maxMenuHeight={260}
                                                                placeholder="-- Store --"
                                                                value={groupStore.filter((option) => option.value === this.fieldSelected.storeCodeCateExport)}
                                                                options={groupStore}
                                                                onChange={(e) => this.handleChangeFieldCustom("storeCodeCateExport", e ? e.value : "")}
                                                                isDisabled={isStore}
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 ">
                                                        <div className="form-group">
                                                            <label className="w100pc">Start date:</label>
                                                            <DatePicker
                                                                placeholderText="Start date"
                                                                selected={this.fieldSelected.startDateSbcEx}
                                                                onChange={(value) => this.handleChangeFieldCustom("startDateSbcEx", value)}
                                                                dateFormat="dd/MM/yyyy"
                                                                maxDate={decreaseDate(1, this.fieldSelected.dateSbcEx)}
                                                                minDate={decreaseDate(60, this.fieldSelected.dateSbcEx)}
                                                                className="form-control"
                                                                autoComplete="off"
                                                                isClearable={this.fieldSelected.startDateSbcEx ? true : false}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label className="w100pc">Date:</label>
                                                            <DatePicker
                                                                placeholderText="Date"
                                                                selected={this.fieldSelected.dateSbcEx}
                                                                onChange={(value) => this.handleChangeFieldCustom("dateSbcEx", value, () => { this.fieldSelected.startDateSbcEx = "" })}
                                                                dateFormat="dd/MM/yyyy"
                                                                maxDate={decreaseDate(1)}
                                                                minDate={decreaseDate(90)}
                                                                className="form-control"
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label className="w100pc op-0">.</label>
                                                        <Space size={'small'}>

                                                            <button
                                                                onClick={this.handleExportAllStoreToMail}
                                                                type="button"
                                                                className="btn btn-danger"
                                                                style={{ height: "38px" }}
                                                            >
                                                                Send
                                                            </button>
                                                            <button
                                                                onClick={() => { $("#" + this.idStoreShowExport).hide(); this.fieldSelected.storeCodeCateExport = ""; this.refresh() }}
                                                                type="button"
                                                                className="btn btn-danger"
                                                                style={{ height: "38px", marginRight: 0 }}
                                                            >
                                                                Close
                                                            </button>
                                                        </Space>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <StoreSelect
                                                            date={this.fieldSelected.dateDetailEx}
                                                            isStore={isStore}
                                                            store={isStore ? this.storeShowExport[1] : (this.storeShowExport[this.fieldSelected.storeCodeCateExport] || [])}
                                                            updateStoreCodeExport={this.handleUpdateStoreCodeCateExport} />
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div> */}

                <ModelExportDataMultiple
                  type="saleitem"
                  isOpenDrawerExport={this.isOpenDrawerExport}
                  updateIsOpen={(val) => {
                    this.isOpenDrawerExport = val;
                    this.refresh();
                  }}
                />

                <div className="row">
                  <div className="col-md-12">
                    <TableSalesByCategoryMD
                      data={this.resultSbc}
                      type={this.type}
                      storeCode={this.fieldSelected.storeCode}
                    />
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
