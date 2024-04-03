//Plugin
import $ from 'jquery';
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';

import CommonModel from 'models/CommonModel';

import DateHelper from 'helpers/DateHelper';
import { cloneDeep } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';

import TableDetail from 'components/mainContent/reporting/mdReport/table/TableSalesopMD';

import { handleExportAutoField } from 'helpers/ExportHelper';
import { fetchData } from 'helpers/FetchData';
import { addMissingKeys, decreaseDate, fnObjGroup, mapData } from 'helpers/FuncHelper';
import moment from 'moment';

import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag, message } from 'antd';
import { DataContext } from 'contexts/DataContext';
import ModelExportDataMultiple from 'modelComponent/export/ModelExportDataMultipleFix';
import RangePicker from 'utils/rangePicker';
import SelectBox from 'utils/selectBox';

export default class SalesopDetailMD extends BaseComponent {
  constructor(props) {
    super(props);
    this.type = this.props.type || '';
    this.idStoreShowExport = 'ppStoreExport' + StringHelper.randomKey();
    this.idStoreShowExportDetail = 'ppStoreExportDetail' + StringHelper.randomKey();

    //Default data
    this.data.stores = {};
    this.allStore = [];
    this.resultTransSum = [];

    // Sales by store
    this.dataDetailSbs = [];
    this.dataDetailSbsExport = [];

    this.defaultDate = decreaseDate(1);

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        dateDetailEx: this.defaultDate,
        startDateDetailExport: '',
        storeCodeDetailExport: '',

        start: moment(decreaseDate(1)),
        date: moment(decreaseDate(1)),
      },
      ['storeCode']
    );

    this.page = 1;

    this.storeCodeDetailExport = [];

    // if (this.fieldSelected.storeCode === undefined || this.fieldSelected.storeCode === "" || this.data.storeCode === undefined) {
    //     this.fieldSelected.storeCode = "VN0001";
    // }

    this.itemReport = {
      totalBill: 0,
      totalItem: 0,
      totalCustomer: 0,
      totalGrossSales: 0,
      vatAmount: 0,
      billDiscount: 0,
      itemDiscount: 0,
      netSales: 0,
      totalCostPrice: 0,
    };

    this.isRender = true;

    this.isOpenDrawerExport = false;
    this.isSearch = false;
  }

  componentDidMount() {
    // this.handleUpdateState();
  }

  onChangeStoreCode = (value) => {
    if (value) {
      this.handleReset();
    }
  };

  handleReset = () => {
    let fileds = this.fieldSelected;

    fileds.dateDetailEx = this.defaultDate;
    fileds.startDateDetailExport = '';

    fileds.start = moment(decreaseDate(1));
    fileds.date = moment(decreaseDate(1));

    this.dataDetailSbs = [];
    this.dataDetailSbsExport = [];

    this.itemReport = {
      totalBill: 0,
      totalItem: 0,
      totalCustomer: 0,
      totalGrossSales: 0,
      vatAmount: 0,
      billDiscount: 0,
      itemDiscount: 0,
      netSales: 0,
      totalCostPrice: 0,
    };
    this.refresh();
  };

  // handleExportAllStoreToMailDetail = () => {
  //     let store = "";

  //     if (this.fieldSelected.storeCodeDetailExport === "") {
  //         this.showAlert("Please choose store to export");
  //         return false;
  //     }

  //     if (this.storeCodeDetailExport.length === 0) {
  //         this.showAlert("Please select at least one store to export");
  //         return false;
  //     }

  //     store = this.storeCodeDetailExport.toString();

  //     let params = {
  //         type: "salesummary",
  //         method: "email",
  //         // email: this.nameMail+"@gs25.com.vn",
  //         date: this.fieldSelected.dateDetailEx ? DateHelper.displayDateFormatMinus(this.fieldSelected.dateDetailEx) : "",
  //         start: this.fieldSelected.startDateDetailExport ? DateHelper.displayDateFormatMinus(this.fieldSelected.startDateDetailExport) : "",
  //         storeCode: store,
  //     }

  //     let model = new ReportingModel();
  //     model.exportAnalyticreport(params).then(res => {
  //         if (res.status && res.data) {
  //             let ml = res.data.receiver || "";
  //             this.showAlert("File sent successfully, please check your mail " + ml + " in 15 minutes", 'success', false);

  //             this.fieldSelected.storeCodeDetailExport = "";
  //             this.refresh();
  //         }
  //         else {
  //             this.showAlert(res.message);
  //         }
  //     });

  // }

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    commonModel.getData('store').then((res) => {
      if (res.status) {
        this.data.stores = res.data.stores || [];
      }
      this.refresh();
    });
  };

  handleIsloading = () => {
    this.isLoading = true;
    this.dataDetailSbs = [];
    this.isSearch = true;
    this.refresh();
  };

  handleSearch = () => {
    this.handleLoadDetailResult();
  };

  handleLoadDetailResult = async () => {
    const fields = this.fieldSelected;

    if (this.fieldSelected.date === null || this.fieldSelected.date === '') {
      this.showAlert('Please choose date');
      return false;
    }

    let storeCode = this.fieldSelected.storeCode;

    let params = {
      start: fields.start
        ? DateHelper.displayDateFormatMinus(fields.start) === DateHelper.displayDateFormatMinus(fields.date)
          ? ''
          : DateHelper.displayDateFormatMinus(fields.start)
        : '',
      date: fields.date ? DateHelper.displayDateFormatMinus(fields.date) : '',
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
      totalCostPrice: 0,
    };

    this.dataDetailSbs = [];
    this.dataDetailSbsExport = [];
    let obj = {};

    this.fieldSelected.storeCodeDetailExport = '';
    this.storeCodeDetailExport = [];

    try {
      if (this.isSearch === true) {
        message.warning({ key: 'search', content: 'Please await' });
        return false;
      }
      this.handleIsloading();

      const url = storeCode !== '' ? `/storesale/${storeCode}/summary` : `/sale/store/transaction/summary`;
      const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
      if (response?.status) {
        let result = response.data?.sale || [];
        this.dataDetailSbsExport = addMissingKeys(response.data?.sale) || [];

        for (let a in this.dataDetailSbsExport) {
          let d = DateHelper.convertKeyDateToYYYYMMDD(this.dataDetailSbsExport[a]?.dateKey);
          this.dataDetailSbsExport[a].openeDate = d;
        }

        result.sort((a, b) => (a.storeCode < b.storeCode ? -1 : 1));

        const cachedData = localStorage.getItem('cachedData');
        const { data } = JSON.parse(cachedData);
        const { stores } = data;

        let lstField = {
          billCount: 0,
          billDiscount: 0,
          customerCount: 0,
          dateKey: true,
          grossSales: 0,
          itemDiscount: 0,
          netSales: 0,
          qty: 0,
          regionCode: '',
          regionName: '',
          storeCode: '',
          storeName: '',
          vatAmount: 0,
          totalCostPrice: 0,
        };

        obj = fnObjGroup(result, 'storeCode', lstField);

        const arr = Object.values(obj);
        const newArrAddOpen = arr?.map((item) => {
          item.openedDate = stores?.[item.storeCode]?.openedDate || '';
          return {
            ...item,
          };
        });
        this.dataDetailSbs = newArrAddOpen;

        this.handleSumSaleByStore(this.dataDetailSbs);
      } else {
        message.error(response?.message);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      this.isLoading = false;
      this.isSearch = false;
      this.refresh();
    }

    // this.objTypeCol = {};

    // let resultModel = new ReportingModel();

    // await resultModel
    //     .getDataSalesByStoreReview(storeCode, params)
    //     .then((res) => {
    //         if (res.status && res.data && res.data.sale) {
    //             let result = res.data.sale || [];
    //             this.dataDetailSbsExport = res.data.sale || [];

    //             for (let a in this.dataDetailSbsExport) {
    //                 let d = DateHelper.convertKeyDateToYYYYMMDD(this.dataDetailSbsExport[a].dateKey);
    //                 this.dataDetailSbsExport[a].openeDate = d;
    //             }

    //             this.objTypeCol = {
    //                 billCount: 'number',
    //                 billDiscount: 'number',
    //                 customerCount: 'number',
    //                 grossSales: 'number',
    //                 itemDiscount: 'number',
    //                 netSales: 'number',
    //                 qty: 'number',
    //                 vatAmount: 'number',
    //                 totalCostPrice: 'number',
    //                 dateKey: 'number'
    //             }

    //             result.sort((a, b) => {
    //                 if (a.storeCode < b.storeCode) { return -1; }
    //                 if (a.storeCode > b.storeCode) { return 1; }
    //                 return 0;
    //             });

    //             let lstField = {
    //                 billCount: 0,
    //                 billDiscount: 0,
    //                 customerCount: 0,
    //                 dateKey: true,
    //                 grossSales: 0,
    //                 itemDiscount: 0,
    //                 netSales: 0,
    //                 qty: 0,
    //                 regionCode: "",
    //                 regionName: "",
    //                 storeCode: "",
    //                 storeName: "",
    //                 vatAmount: 0,
    //                 totalCostPrice: 0
    //             }

    //             obj = fnObjGroup(result, 'storeCode', lstField);

    //             this.dataDetailSbs = Object.values(obj);

    //             this.handleSumSaleByStore(this.dataDetailSbs);

    //             this.refresh();
    //         } else {
    //             // this.showAlert("System busy!");
    //         }
    //     });
  };

  handleSumSaleByStore = (arr) => {
    for (let k in arr) {
      let item = arr[k];

      this.itemReport.totalBill += item.billCount;
      this.itemReport.totalItem += item.qty;
      this.itemReport.totalCustomer += item.customerCount;
      this.itemReport.totalGrossSales += item.grossSales;
      this.itemReport.vatAmount += item.vatAmount;
      this.itemReport.billDiscount += item.billDiscount;
      this.itemReport.itemDiscount += item.itemDiscount;
      this.itemReport.netSales += item.netSales;
      this.itemReport.totalCostPrice += item.totalCostPrice;
    }
  };

  handleUpdateStoreCodeDetailExport = (value) => {
    this.storeCodeDetailExport = [];
    this.storeCodeDetailExport = value;
    this.refresh();
  };

  handleExportDetail = () => {
    $('#' + this.idStoreShowExportDetail).show();
    this.fieldSelected.storeCodeDetailExport = '';
    this.storeCodeDetailExport = [];
    this.refresh();
  };

  handleExport = () => {
    let data = cloneDeep(this.dataDetailSbsExport);
    let colType = {
      billCount: 'number',
      billDiscount: 'number',
      customerCount: 'number',
      dateKey: 'number',
      grossSales: 'number',
      itemDiscount: 'number',
      masterCostAmount: 'number',
      netSales: 'number',
      qty: 'number',
      vatAmount: 'number',
    };
    let nameFile = `SaleopExport`;

    const dataExport = data.map((item) => {
      const { storeCode, storeName, openeDate } = item;
      const newItem = { ...item };
      newItem.masterCostAmount = item.totalCostPrice;
      delete newItem.totalCostPrice;
      delete newItem.exceptItemActionCount;
      delete newItem.cancelBillCount;
      return newItem;
    });

    console.log({ dataExport });
    handleExportAutoField(dataExport, nameFile, null, null, colType);
    this.fieldSelected.storeCodeDetailExport = '';
    this.storeCodeDetailExport = [];
    this.refresh();
  };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.refresh();
    }
  };

  // handleUpdateDate = (arr) => {
  //     let fields = this.fieldSelected;

  //     fields.start = (arr && arr[0] !== null) ? arr[0] : null;
  //     fields.date = (arr && arr[1] !== null) ? arr[1] : null;

  //     this.refresh();
  // }

  renderComp() {
    const fields = this.fieldSelected;
    const dataContext = this.context;
    const stores = dataContext?.data?.stores || {};

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

    let dataDetail = mapData(this.dataDetailSbs, Object.values(stores), 'storeCode', ['openDate']);

    let dates = [fields.start, fields.date];

    return (
      <div
      // className="container-table"
      >
        <div
        // className='col-md-12'
        >
          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={19}>
                    <Row gutter={16}>
                      <Col xl={6}>
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
                      <Col xl={7}>
                        <label htmlFor="date" className="w100pc">
                          Date:
                          <div>
                            <RangePicker
                              dates={dates}
                              range={32}
                              minDate={decreaseDate(62)}
                              maxDate={decreaseDate(1)}
                              func={this.handleUpdateDate}
                            />
                          </div>
                        </label>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={5}></Col>
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
                      <Tag
                        icon={<FileExcelOutlined />}
                        className="h-30 icon-excel d-inline-block v-middle btn-showpp"
                        onClick={() => {
                          this.isOpenDrawerExport = true;
                          this.refresh();
                        }}
                      >
                        <span className="icon-excel-detail">Export Log</span>
                      </Tag>
                    </Space>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <TableDetail
                data={this.dataDetailSbs}
                dataResult={this.dataDetailSbs}
                itemReport={this.itemReport}
                type={this.type}
                isLoading={this.isLoading}
              />
            </Col>
          </Row>

          <ModelExportDataMultiple
            type="salesummary"
            isOpenDrawerExport={this.isOpenDrawerExport}
            updateIsOpen={(val) => {
              this.isOpenDrawerExport = val;
              this.refresh();
            }}
          />

          <div id="sales-op-detail" className="detail-tab row mrt-10">
            <div className="col-md-12">
              <div>
                {/* <section id={this.idStoreShowExportDetail} className='popup-form' style={{ minHeight: 300, minWidth: 500, maxWidth: '65%', width: 'auto' }}>
                                    <div className="row" style={{ paddingTop: 10 }}>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="storeCodeDetailExport" className="w100pc">
                                                    Store export:
                                                </label>
                                                <Select
                                                    isClearable
                                                    classNamePrefix="select"
                                                    maxMenuHeight={260}
                                                    placeholder="-- Store --"
                                                    value={groupStore.filter((option) => option.value === this.fieldSelected.storeCodeDetailExport)}
                                                    options={groupStore}
                                                    onChange={(e) => this.handleChangeFieldCustom("storeCodeDetailExport", e ? e.value : "")}
                                                    isDisabled={isStore}
                                                />

                                            </div>
                                        </div>
                                        <div className="col-md-4 ">
                                            <div className="form-group">
                                                <label className="w100pc">Start date:</label>
                                                <DatePicker
                                                    placeholderText="Start date"
                                                    selected={this.fieldSelected.startDateDetailExport}
                                                    onChange={(value) => this.handleChangeFieldCustom("startDateDetailExport", value)}
                                                    dateFormat="dd/MM/yyyy"
                                                    maxDate={decreaseDate(1, this.fieldSelected.dateDetailEx)}
                                                    minDate={decreaseDate(60, this.fieldSelected.dateDetailEx)}
                                                    className="form-control"
                                                    autoComplete="off"
                                                    isClearable={this.fieldSelected.startDateDetailExport ? true : false}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="w100pc">Date:</label>
                                                <DatePicker
                                                    placeholderText="Date"
                                                    selected={this.fieldSelected.dateDetailEx}
                                                    onChange={(value) => this.handleChangeFieldCustom("dateDetailEx", value, () => { this.fieldSelected.startDateDetailExport = "" })}
                                                    dateFormat="dd/MM/yyyy"
                                                    maxDate={decreaseDate(1)}
                                                    minDate={decreaseDate(60)}
                                                    className="form-control"
                                                    autoComplete="off"

                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Space size={'small'}>

                                                <button
                                                    onClick={this.handleExportAllStoreToMailDetail}
                                                    type="button"
                                                    className="btn btn-danger"
                                                    style={{ height: "38px" }}
                                                >
                                                    Send
                                                </button>
                                                <button
                                                    onClick={() => { $("#" + this.idStoreShowExportDetail).hide(); this.fieldSelected.storeCodeDetailExport = ""; this.refresh() }}
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
                                            <StoreSelect date={this.fieldSelected.dateDetailEx} isStore={isStore} store={isStore ? this.storeShowExport[1] : (this.storeShowExport[this.fieldSelected.storeCodeDetailExport] || [])} updateStoreCodeExport={this.handleUpdateStoreCodeDetailExport} />
                                        </div>
                                    </div>

                                </section> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SalesopDetailMD.contextType = DataContext;
