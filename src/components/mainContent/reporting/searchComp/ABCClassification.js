//Plugin
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import DateHelper from 'helpers/DateHelper';
import StringHelper from 'helpers/StringHelper';
import CommonModel from 'models/CommonModel';

import DownloadModel from 'models/DownloadModel';
import ReportingModel from 'models/ReportingModel';

import { createDataTable, removeDuplicatesArr } from 'helpers/FuncHelper';

import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag } from 'antd';
import IconDownTrend from 'images/arrow-trend-down-solid.svg';
import IconUpTrend from 'images/arrow-trend-up-solid.svg';
import SelectBox from 'utils/selectBox';
import TableCustom from 'utils/tableCustom';

export default class ABCClassification extends BaseComponent {
  constructor(props) {
    super(props);

    this.autocompleteBarcodeRef = React.createRef();
    this.idBCAutoCompleteComponent = 'autoCompleteBarcode' + StringHelper.randomKey();

    //Default data
    this.data.stores = [];
    this.lstCat = [];
    this.lstDivision = [];
    this.lstBarcode = [];
    this.lstSearchRegion = [];
    this.lstSearchCategory = [];

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        barcode: '',
        cat: '',
        class: '0',
        provinceCode: '',
        regionCode: '',
        categoryCode: '',
        days: '',
        startDate: '',
      },
      ['storeCode']
    );

    this.loading = false;

    this.isRender = true;
  }

  // handleExportBill = () => {
  //     let model = new ReportingModel();
  //     model
  //         .exportBill(
  //             this.fieldSelected.storeCode,
  //             DateHelper.displayDateFormat(this.fieldSelected.startDate),
  //             DateHelper.displayDateFormat(this.fieldSelected.endDate)
  //         )
  //         .then((response) => {
  //             if (response.status) {
  //                 let downloadModel = new DownloadModel();
  //                 downloadModel.get(response.data.downloadUrl, null, null, ".xls");
  //             } else {
  //                 this.showAlert(response.message);
  //             }
  //         });
  // };

  componentDidMount() {
    this.handleUpdateState();
  }

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData('store').then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
      }
    });

    this.refresh();
  };

  handleLoading = () => {
    this.loading = !this.loading;
    this.refresh();
  };

  handleSearch = async () => {
    if (this.fieldSelected.storeCode === '') {
      this.showAlert('Please choose store');
      return false;
    }

    if (this.fieldSelected.days === '') {
      this.showAlert('Please choose days');
      return false;
    }

    let page = 'salesbyclassification';
    let params = {
      storeCode: this.fieldSelected.storeCode,
      days: this.fieldSelected.days,
      // regionCode: this.fieldSelected.regionCode,
      // categoryCode: this.fieldSelected.categoryCode,
    };

    this.lstBarcode = [];
    this.lstCat = [];

    let model = new ReportingModel();
    await model.getListByPage(page, params).then((res) => {
      if (res.status && res.data) {
        res.data.items && (this.items = res.data.items);

        this.items.map((el) => {
          this.lstBarcode.push({
            value: el.itemCode,
            label: el.itemCode + ' - ' + el.itemName,
          });

          this.lstCat.push({
            value: el.categoryName,
            label: el.categoryName,
          });
        });

        var arrBarcode = removeDuplicatesArr(this.lstBarcode, 'value');
        this.lstBarcode = arrBarcode;

        var arrCat = removeDuplicatesArr(this.lstCat, 'value');
        this.lstCat = arrCat;
      } else {
        this.showAlert('API connect fail');
      }
    });

    this.loading = false;

    this.refresh();
  };

  handleExport = () => {
    let type = 'salesbyclassification';
    let params = {
      storeCode: this.fieldSelected.storeCode,
    };

    let model = new ReportingModel();
    model.reportingExport(type, params).then((res) => {
      if (res.status) {
        let downloadModel = new DownloadModel();
        downloadModel.get(res.data.downloadUrl, null, null, '.xls');
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleFilter = (listItem) => {
    let list = listItem;

    if (this.fieldSelected.cat !== '') {
      list = list.filter((e) => e.categoryName.toString() === this.fieldSelected.cat);
    }

    if (this.fieldSelected.barcode !== '') {
      list = list.filter((a) => a.itemCode === this.fieldSelected.barcode);
    }

    if (this.fieldSelected.class !== '0') {
      list = list.filter((a) => a.class === this.fieldSelected.class);
    }

    return list;
  };

  renderOptionBarcode = () => {
    this.fieldSelected.barcode = '';
    let items = this.handleFilter(this.items);
    this.lstBarcode = [];
    items.map((a, ia) => {
      this.lstBarcode.push({
        value: a.itemCode,
        label: a.itemCode + ' - ' + a.itemName,
      });
    });
    var arrBarcode = removeDuplicatesArr(this.lstBarcode, 'value');
    this.lstBarcode = arrBarcode;
    this.refresh();
  };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.refresh();
    }
  };

  renderComp() {
    const fields = this.fieldSelected;
    let barcode = this.lstBarcode;
    let cat = this.lstCat;

    let stores = this.data.stores;
    let storeKeys = Object.keys(stores);
    const orderStore = {};
    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });
    let storeOptions = [];
    if (storeKeys.length === 0) {
      storeOptions.push({
        value: this.data.storeCode,
        label: this.data.storeCode + ' - ' + this.data.storeName,
      });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return {
          value: stores[key].storeCode,
          label: stores[key].storeCode + ' - ' + stores[key].storeName,
        };
      });
    }

    let optClass = [
      { value: '0', label: '-- All --' },
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
    ];

    let optDays = [
      { value: 7, label: '7 days' },
      { value: 14, label: '14 days' },
    ];

    const highLightText = (item) => {
      if (item.class === 'A') {
        return ' hl-red ';
      } else if (item.class === 'B') {
        return 'hl-yellow ';
      } else {
        return '';
      }
    };

    const showIconTrend = (val, key, item) => {
      if (item.class === 'A' || item.class === 'B') {
        return <img src={IconUpTrend} alt="up trend" width={20} />;
      } else {
        return <img src={IconDownTrend} alt="down trend" width={20} />;
      }
    };

    let items = this.handleFilter(this.items);

    const columns = [
      {
        field: 'categoryName',
        label: 'Category',
        classHead: 'fs-10 ',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'itemCode',
        label: 'Item',
        classHead: 'fs-10 ',
        styleHead: {},
        colSpanHead: 2,
        classBody: 'fs-10',
        styleBody: { background: 'ivory' },
      },
      {
        field: 'itemName',
        label: '',
        classHead: 'fs-10 ',
        styleHead: {},
        colSpanHead: 0,
        classBody: 'fs-10',
        styleBody: { background: 'ivory' },
      },
      {
        field: 'class',
        label: 'Class',
        classHead: 'fs-10 text-center',
        styleHead: {},
        classBody: 'fs-10 text-center',
        funcClassBody: highLightText,
        styleBody: {},
      },
      {
        field: 'iconTrend',
        label: '',
        classHead: 'fs-10 ',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
        formatBody: showIconTrend,
      },
      {
        field: 'otpOrder',
        label: 'Suggestion order',
        classHead: 'fs-10 text-right',
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'lastDaySalesQty',
        label: 'Last day sales',
        classHead: 'fs-10 text-right',
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'totalQty',
        label: 'TT.Qty',
        classHead: 'fs-10 text-right',
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'totalAmount',
        label: 'TT.Amount',
        classHead: 'fs-10 text-right',
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
      },
    ];

    const data = createDataTable(items, columns)?.sort((a, b) => (a.class >= b.class ? 1 : -1));

    return (
      <div className="container-table">
        <div className="col-md-12">
          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={6}>
                    <label htmlFor="supplier" className="w100pc">
                      Store:
                      <SelectBox data={storeOptions} func={this.updateFilter} keyField={'storeCode'} defaultValue={fields.storeCode} isMode={''} />
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label htmlFor="days" className="w100pc">
                      Days:
                      <SelectBox data={optDays} func={this.updateFilter} keyField={'days'} defaultValue={fields.days} isMode={''} />
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label htmlFor="" className="w100pc">
                      &nbsp;
                    </label>

                    <Space>
                      <Tag
                        className="h-30 icon-search"
                        onClick={() => {
                          this.handleLoading();
                          this.handleSearch();
                        }}
                      >
                        <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                      </Tag>
                      <Tag icon={<FileExcelOutlined />} className="h-30 icon-excel" onClick={() => this.handleExport}>
                        <span className="icon-excel-detail">Export</span>
                      </Tag>
                    </Space>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          {this.items.length > 0 && (
            <Row gutter={16} className="mrt-10">
              <Col xl={24}>
                <div className="section-block">
                  <Row gutter={16}>
                    <Col xl={16}>
                      <Row gutter={16}>
                        {/* <Col xl={6}>
                                                    <label htmlFor="category" className="w100pc">
                                                        Days:
                                                        <SelectBox data={cat} func={this.updateFilter} funcCallback={this.renderOptionBarcode} keyField={'cat'} defaultValue={fields.cat} isMode={''} />
                                                    </label>
                                                </Col> */}
                        <Col xl={6}>
                          <label htmlFor="class" className="w100pc">
                            Classification:
                            <SelectBox data={optClass} func={this.updateFilter} funcCallback={this.renderOptionBarcode} keyField={'class'} defaultValue={fields.class} isMode={''} />
                          </label>
                        </Col>
                        <Col xl={6}>
                          <label htmlFor="category" className="w100pc">
                            Barcode:
                            <SelectBox data={barcode} func={this.updateFilter} keyField={'barcode'} defaultValue={fields.barcode} isMode={''} />
                          </label>
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={8}>
                      {this.items.length > 0 && (
                        <div className="cl-red bg-note">
                          <div className="form-group">
                            <label htmlFor="cat" className="w100pc">
                              From - To date: (default {this.fieldSelected.days} days)
                              <br />
                              <p
                                style={{
                                  fontSize: 16,
                                  margin: '10px 0 0',
                                  fontWeight: 'bold',
                                }}
                              >
                                {DateHelper.displayDate(this.items[0].fromDate)} - {DateHelper.displayDate(this.items[0].toDate)}
                              </p>
                            </label>
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          )}

          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <TableCustom data={data} columns={columns} isLoading={this.loading} />
              </div>
            </Col>
          </Row>
          {/* <div className="detail-tab row">
                        <div className="col-md-12">
                            {
                                this.items.length > 0 &&

                                <Row gutter={16} className="mrt-10">
                                    <Col xl={24}>
                                        <div className="section-block">
                                            <Row gutter={16}>
                                                <Col xl={16}>
                                                    <Row gutter={16}>
                                                        <Col xl={6}>
                                                            <label htmlFor="category" className="w100pc">
                                                                Days:
                                                                <SelectBox data={cat} func={this.updateFilter} funcCallback={this.renderOptionBarcode} keyField={'cat'} defaultValue={fields.cat} isMode={''} />
                                                            </label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <label htmlFor="class" className="w100pc">
                                                                Classification:
                                                                <SelectBox data={optClass} func={this.updateFilter} funcCallback={this.renderOptionBarcode} keyField={'class'} defaultValue={fields.class} isMode={''} />
                                                            </label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <label htmlFor="category" className="w100pc">
                                                                Barcode:
                                                                <SelectBox data={barcode} func={this.updateFilter} keyField={'barcode'} defaultValue={fields.barcode} isMode={''} />
                                                            </label>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xl={8}>
                                                    {
                                                        this.items.length > 0 &&
                                                        <div className="cl-red bg-note">
                                                            <div className="form-group">
                                                                <label htmlFor="cat" className="w100pc">
                                                                    From - To date: (default {this.fieldSelected.days} days)<br />
                                                                    <p style={{ fontSize: 16, margin: "10px 0 0", fontWeight: 'bold' }}>{DateHelper.displayDate(this.items[0].fromDate)} - {DateHelper.displayDate(this.items[0].toDate)}</p>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    }
                                                </Col>
                                            </Row>

                                        </div>
                                    </Col>
                                </Row>
                            }

                            <Row gutter={16} className="mrt-10">
                                <Col xl={24}>
                                    <TableCustom data={data} columns={columns} />
                                </Col>
                            </Row>

                            <div className="mrt-10">

                                <div className="row">
                                    <div className="col-md-12">
                                        <TableABCClassification items={this.items} fieldSelected={this.fieldSelected} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
        </div>
      </div>
    );
  }
}
