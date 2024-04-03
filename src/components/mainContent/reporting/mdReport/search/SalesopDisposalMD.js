//Plugin
import $ from 'jquery';
import React, { Fragment } from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';

import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';

import DateHelper from 'helpers/DateHelper';
import StringHelper from 'helpers/StringHelper';

import StoreSelect from 'components/mainContent/store/StoreSelect';

import { handleExportAutoField } from 'helpers/ExportHelper';
import { createDataTable, createListOption, decreaseDate, fnObjGroup, fnSum } from 'helpers/FuncHelper';

import { Button, Col, Row, Tag } from 'antd';
import moment from 'moment';
import RangePicker from 'utils/rangePicker';
import SelectBox from 'utils/selectBox';
import TableCustom from 'utils/tableCustom';
import { FileExcelOutlined, FileSearchOutlined, FilterOutlined } from '@ant-design/icons';
import ModelExportDataMultiple from 'modelComponent/export/ModelExportDataMultipleFix';

export default class SalesopDisposal extends BaseComponent {
  constructor(props) {
    super(props);

    this.idStoreShowExport = 'ppStoreExport' + StringHelper.randomKey();
    this.idStoreShowExportDetail = 'ppStoreExportDetail' + StringHelper.randomKey();

    //Default data
    this.data.stores = {};
    this.allStore = [];

    // Sales by store
    this.dataDetailSbs = [];

    // disposal data

    this.data.disposal = [];
    this.data.exportDis = [];
    this.groupDisposal = {};

    this.defaultDate = decreaseDate(1);

    //Data Selected

    this.resultSbc = [];

    this.fieldSelected = this.assignFieldSelected(
      {
        date: moment(decreaseDate(1)),
        start: moment(decreaseDate(1)),

        dateDetailEx: moment(decreaseDate(1)),
        startDateDetailExport: moment(decreaseDate(1)),

        storeCodeDetailExport: '',

        divisionCode: '',
        itemCode: '',
      },
      ['storeCode']
    );

    this.page = 1;

    this.storeCodeDetailExport = [];

    // if (this.fieldSelected.storeCode === undefined || this.fieldSelected.storeCode === "" || this.data.storeCode === undefined) {
    //     this.fieldSelected.storeCode = "VN0001";
    // }

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

    this.isRender = true;

    this.isFilter = false;

    this.topSum = {
      itemCode: '',
      itemName: '',
      disposalQty: 0,
      disposalPrice: 0,
    };

    this.isOpenDrawerExport = false;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  getDataDisposalDetail = async () => {
    // if (this.fieldSelected.storeCode === "" || this.fieldSelected.storeCode === undefined) {
    //     this.showAlert("Please choose store");
    //     return false;
    // }

    if (this.fieldSelected.start === null || this.fieldSelected.start === '') {
      this.showAlert('Please choose date ');
      return false;
    }

    let page = 'saledisposal';
    let storeCode = this.fieldSelected.storeCode;
    let params = {
      start:
        DateHelper.displayDateFormatMinus(this.fieldSelected.date) ===
        DateHelper.displayDateFormatMinus(this.fieldSelected.start)
          ? ''
          : DateHelper.displayDateFormatMinus(this.fieldSelected.start),
      date: DateHelper.displayDateFormatMinus(this.fieldSelected.date) ?? '',
    };

    var report = new ReportingModel();

    this.groupDisposal = {};
    this.data.disposal = [];
    this.data.exportDis = [];
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

    this.topSum = {
      itemCode: '',
      itemName: '',
      disposalPrice: 0,
      disposalQty: 0,
    };

    await report.getDataStore(storeCode, page, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.sale) {
          let items = res.data.sale;
          this.data.exportDis = res.data.sale;

          let lstF = {
            barcode: '',
            itemName: '',
            divisionCode: '',
            divisionName: '',
            categoryCode: '',
            categoryName: '',
            subCategoryCode: '',
            subCategoryName: '',
            disposalQty: 0,
            totalCostPrice: 0,
            totalSalePrice: 0,
            saleQty: 0,
            unitPrice: 0,
            grossSales: 0,
            netSales: 0,
            // storeCode: '',
            // storeName: '',
            // reason: '',
            date: '',
            disposalCode: '',
          };

          let obj = fnObjGroup(items, 'barcode', lstF);

          let abc = Object.values(obj);
          this.data.disposal = fnSum(abc, 'divisionCode', ['disposalQty', 'totalSalePrice', 'saleQty', 'grossSales']);
          if (res.data.sale.length === 0) {
            this.showAlert('Item not found');
          }

          let barcodeMap = {};

          for (let key in res.data.sale) {
            let item = res.data.sale[key];

            if (!this.groupDisposal[item.divisionCode]) {
              this.groupDisposal[item.divisionCode] = {};

              this.groupDisposal[item.divisionCode].divisionCode = item.divisionCode;
              this.groupDisposal[item.divisionCode].divisionName = item.divisionName;
              this.groupDisposal[item.divisionCode].disposalQty = 0;
              this.groupDisposal[item.divisionCode].disposalPrice = 0;
              this.groupDisposal[item.divisionCode].saleQty = 0;
              this.groupDisposal[item.divisionCode].grossSales = 0;
              this.groupDisposal[item.divisionCode].date = item.date;
              this.groupDisposal[item.divisionCode].reason = item.reason;
            }

            this.groupDisposal[item.divisionCode].disposalQty += item.disposalQty;
            this.groupDisposal[item.divisionCode].disposalPrice += item.totalSalePrice;
            this.groupDisposal[item.divisionCode].saleQty += item.saleQty;
            this.groupDisposal[item.divisionCode].grossSales += item.grossSales;

            if (!this.groupDisposal[item.divisionCode].categoryGroup) {
              this.groupDisposal[item.divisionCode].categoryGroup = {};
            }

            if (!this.groupDisposal[item.divisionCode].categoryGroup[item.categoryCode]) {
              this.groupDisposal[item.divisionCode].categoryGroup[item.categoryCode] = {};
              this.groupDisposal[item.divisionCode].categoryGroup[item.categoryCode].categoryName = item.categoryName;
              this.groupDisposal[item.divisionCode].categoryGroup[item.categoryCode].details = [];
            }

            this.groupDisposal[item.divisionCode].categoryGroup[item.categoryCode].details.push(item);

            // ===========================
            let barcode = item.barcode;
            let itemName = item.itemName;
            let disposalQty = item.disposalQty;
            let disposalPrice = item.totalSalePrice;

            if (!barcodeMap[barcode]) {
              barcodeMap[barcode] = {};
              barcodeMap[barcode].disposalQty = disposalQty;
              barcodeMap[barcode].disposalPrice = disposalPrice;
              barcodeMap[barcode].itemCode = barcode;
              barcodeMap[barcode].itemName = itemName;
            } else {
              barcodeMap[barcode].disposalQty += parseFloat(disposalQty);
              barcodeMap[barcode].disposalPrice += parseFloat(disposalPrice);
            }
          }

          if (Object.keys(barcodeMap)?.length > 0) {
            let highestQtyBarcode = Object.keys(barcodeMap).reduce((a, b) =>
              barcodeMap[a].disposalQty > barcodeMap[b].disposalQty ? a : b
            );

            this.topSum = barcodeMap[highestQtyBarcode];
          }
        }

        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  onChangeStoreCode = (value) => {
    if (value) {
      this.handleReset();
    }
  };

  handleReset = () => {
    let fileds = this.fieldSelected;
    fileds.date = moment(decreaseDate(1));
    fileds.start = moment(decreaseDate(1));

    fileds.dateDetailEx = moment(decreaseDate(1));
    fileds.startDateDetailExport = moment(decreaseDate(1));

    this.resultSbc = [];
    this.dataDetailSbs = [];

    this.data.disposal = [];
    this.groupDisposal = {};

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

    this.refresh();
  };

  handleExportAllStoreToMailDetail = () => {
    let store = '';

    if (this.fieldSelected.storeCodeDetailExport === '') {
      this.showAlert('Please choose store to export');
      return false;
    }

    // if (this.storeCodeDetailExport.length === 0) {
    //     this.showAlert("Please select at least one store to export");
    //     return false;
    // }

    store = this.storeCodeDetailExport.toString();

    let params = {
      type: 'saledisposal',
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

  handleUpdateStoreCodeDetailExport = (value) => {
    this.storeCodeDetailExport = [];
    this.storeCodeDetailExport = value;
    this.refresh();
  };

  handleExportDetail = () => {
    this.handleShowPp(this.idStoreShowExportDetail);
    // $("#" + this.idStoreShowExportDetail).show();
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

  handleUpdateDate = (arr) => {
    let fields = this.fieldSelected;

    fields.start = arr && arr[0] !== null ? arr[0] : null;
    fields.date = arr && arr[1] !== null ? arr[1] : null;

    this.refresh();
  };

  handleUpdateDateExport = (arr) => {
    let fields = this.fieldSelected;

    fields.startDateDetailExport = arr && arr[0] !== null ? arr[0] : null;
    fields.dateDetailEx = arr && arr[1] !== null ? arr[1] : null;

    this.refresh();
  };

  handleFormatValue = (val) => {
    let newVal = StringHelper.formatValue(val);
    return newVal;
  };

  handleFormatDate = (val) => {
    let newVal = DateHelper.displayDate(val);
    return newVal;
  };

  handleFilter = (arr) => {
    let fields = this.fieldSelected;
    console.log(arr);
    let oldArr = arr;
    let newArr = [];

    newArr = fields.divisionCode !== '' ? oldArr.filter((el) => el.divisionCode === fields.divisionCode) : oldArr;
    newArr = fields.itemCode !== '' ? newArr.filter((el) => el.barcode === fields.itemCode) : newArr;

    return newArr;
  };

  handleIsShowFilter = () => {
    this.isFilter = !this.isFilter;

    this.refresh();
  };

  handleClickView = (disposalCode) => {
    if (disposalCode) {
      window.open('/disposal/' + disposalCode, '_blank');
    }
  };

  renderDisposalCode = (val, key, item) => {
    let list = val.split(',');

    const result =
      list?.length > 1 ? (
        <>
          {list?.map((el, index) => (
            <Fragment className="d-inline-block" key={index}>
              <Tag color="orange" className="cursor" style={{ margin: 2 }} onClick={() => this.handleClickView(el)}>
                {el}
              </Tag>
              <br />
            </Fragment>
          ))}
        </>
      ) : (
        <Tag color="orange" className="cursor" onClick={() => this.handleClickView(val)}>
          {val}
        </Tag>
      );

    return result;
  };
  // ----------------------------------------------------

  renderComp() {
    const fields = this.fieldSelected;
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

    // Disposal data
    let dataDisposal = this.groupDisposal;

    let sumDisposalDetail = this.sumDisposalDetail;

    let dates = [fields.start, fields.date];
    let datesExport = [fields.startDateDetailExport, fields.dateDetailEx];

    let columns = [
      {
        field: 'divisionCode',
        label: 'Division',
        classHead: 'fs-10 border-none',
        styleHead: {},
        rowSpanHead: '2',
        colSpanHead: '2',
        classBody: 'fs-10',
        styleBody: {},
        isRemoveDuplicate: true,
        isKeyCheck: 'divisionCode',
      },
      {
        field: 'divisionName',
        label: '',
        classHead: 'border-none',
        styleHead: {},
        rowSpanHead: '2',
        colSpanHead: '0',
        classBody: 'fs-10 ',
        styleBody: {},
        isRemoveDuplicate: true,
        isKeyCheck: 'divisionName',
      },

      {
        field: 'categoryName',
        label: 'Category',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        rowSpanHead: '2',
        classBody: 'fs-10',
        styleBody: {},
      },

      {
        field: 'barcode',
        label: 'Item',
        classHead: 'fs-10 border-none',
        styleHead: {},
        rowSpanHead: '2',
        colSpanHead: '2',
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'itemName',
        label: '',
        classHead: 'border-none',
        styleHead: {},
        rowSpanHead: '2',
        colSpanHead: '0',
        classBody: 'fs-10',
        styleBody: {},
      },

      {
        field: '',
        label: 'Sale',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        colSpanHead: '2',
        classBody: 'fs-10',
        styleBody: {},
        children: [
          {
            field: 'saleQty',
            label: 'Qty',
            classHead: 'fs-10 text-right',
            styleHead: { border: 'none', borderTop: '1px solid orange' },
            classBody: 'fs-10 text-right',
            styleBody: { background: 'aliceblue' },
            formatBody: this.handleFormatValue,
          },
          {
            field: 'grossSales',
            label: 'Price',
            classHead: 'fs-10 text-right',
            styleHead: { border: 'none', borderTop: '1px solid orange' },
            classBody: 'fs-10 text-right',
            styleBody: { background: 'antiquewhite' },
            formatBody: this.handleFormatValue,
          },
        ],
      },

      {
        field: '',
        label: 'Disposal',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        colSpanHead: '2',
        classBody: 'fs-10',
        styleBody: {},
        children: [
          {
            field: 'disposalQty',
            label: 'Qty',
            classHead: 'fs-10 text-right',
            styleHead: { border: 'none', borderTop: '1px solid cyan' },
            classBody: 'fs-10 text-right',
            styleBody: { background: 'aliceblue' },
            formatBody: this.handleFormatValue,
            isCompare: ['disposalQty', 'saleQty'],
            styleCompare: 'bg-yellow',
          },
          {
            field: 'totalSalePrice',
            label: 'Price',
            classHead: 'fs-10 text-right',
            styleHead: { border: 'none', borderTop: '1px solid cyan' },
            classBody: 'fs-10 text-right',
            styleBody: { background: 'antiquewhite' },
            formatBody: this.handleFormatValue,
          },
        ],
      },

      // {
      //     field: '', label: 'Total sale', classHead: 'fs-10 border-none text-center', styleHead: {}, colSpanHead: '2', classBody: 'fs-10', styleBody: {}, children: [
      //         { field: 'totalsaleQty', label: 'Qty', classHead: 'fs-10 text-right', styleHead: { border: 'none', borderTop: '1px solid orange' }, classBody: 'fs-10 text-right ', styleBody: { background: 'aliceblue' }, isRemoveDuplicate: true, isKeyCheck: 'divisionCode', formatBody: this.handleFormatValue },
      //         { field: 'totalgrossSales', label: 'Price', classHead: 'fs-10 text-right', styleHead: { border: 'none', borderTop: '1px solid orange' }, classBody: 'fs-10 text-right ', styleBody: { background: 'antiquewhite' }, isRemoveDuplicate: true, isKeyCheck: 'divisionCode', formatBody: this.handleFormatValue },
      //     ]
      // },

      // {
      //     field: '', label: 'Total disposal', classHead: 'fs-10 border-none text-center', styleHead: {}, colSpanHead: '2', classBody: 'fs-10', styleBody: {}, children: [
      //         { field: 'totaldisposalQty', label: 'Qty', classHead: 'fs-10 text-right', styleHead: { border: 'none', borderTop: '1px solid cyan' }, classBody: 'fs-10 text-right ', styleBody: { background: 'aliceblue' }, isRemoveDuplicate: true, isKeyCheck: 'divisionCode', formatBody: this.handleFormatValue },
      //         { field: 'totaltotalSalePrice', label: 'Price', classHead: 'fs-10 text-right', styleHead: { border: 'none', borderTop: '1px solid cyan' }, classBody: 'fs-10 text-right ', styleBody: { background: 'antiquewhite' }, isRemoveDuplicate: true, isKeyCheck: 'divisionCode', formatBody: this.handleFormatValue },
      //     ]
      // },

      {
        field: 'date',
        label: 'Date',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        rowSpanHead: '2',
        classBody: 'fs-10',
        styleBody: {},
        formatBody: this.handleFormatDate,
      },
      {
        field: 'disposalCode',
        label: 'Disposal',
        classHead: 'fs-10',
        styleHead: {},
        rowSpanHead: '2',
        classBody: 'fs-10',
        styleBody: {},
        formatBody: this.renderDisposalCode,
      },
    ];

    let data = createDataTable(this.data.disposal, columns).sort((a, b) => {
      let keyA1 = a.divisionCode;
      let keyB1 = b.divisionCode;

      let keyA2 = new Date(a.date);
      let keyB2 = new Date(b.date);

      if (keyA1 < keyB1) return -1;
      if (keyA1 > keyB1) return 1;
      if (keyA2 < keyB2) return -1;
      if (keyA2 > keyB2) return 1;
      return 0;
    });

    let results = this.handleFilter(data);
    console.log(data);
    let totalFooterTable = {
      saleQty: 0,
      grossSales: 0,
      disposalQty: 0,
      totalSalePrice: 0,
    };

    let optDivision =
      createListOption(this.data.disposal, 'divisionCode', 'divisionName').sort((a, b) => a.value - b.value) || [];
    let itemCodeOpt = createListOption(data, 'barcode', 'itemName') || [];

    return (
      <div style={{ padding: this.props.stylePading, height: this.props.styleHeight }}>
        <div>
          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={16}>
                    <Row gutter={16}>
                      <Col xl={8} xxl={4}>
                        <label htmlFor="storeCode" className="w100pc">
                          Store:
                          <SelectBox
                            data={storeOptions}
                            func={this.updateFilter}
                            keyField={'storeCode'}
                            defaultValue={fields.storeCode}
                            isMode={''}
                          />
                        </label>
                      </Col>
                      <Col xl={8} xxl={5}>
                        <label htmlFor="date" className="w100pc">
                          Date:
                          <div>
                            <RangePicker
                              dates={dates}
                              range={7}
                              minDate={moment(decreaseDate(62))}
                              maxDate={moment(decreaseDate(1))}
                              func={this.handleUpdateDate}
                            />
                          </div>
                        </label>
                      </Col>
                    </Row>

                    <Row gutter={16} className="mrt-10">
                      <Col>
                        <Tag className="h-30 icon-search" onClick={this.getDataDisposalDetail}>
                          <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                        </Tag>
                        <Tag
                          icon={<FileExcelOutlined />}
                          className="h-30 icon-excel"
                          onClick={() => handleExportAutoField(this.data.exportDis, 'reportdisposalexport')}
                        >
                          <span className="icon-excel-detail">Export</span>
                        </Tag>
                        <Tag onClick={this.handleIsShowFilter} className="h-30 icon-orange">
                          <FilterOutlined />
                        </Tag>

                        <Button
                          // onClick={this.handleExportDetail}
                          onClick={() => {
                            this.isOpenDrawerExport = true;
                            this.refresh();
                          }}
                          className="btn btn-danger btn-showpp h-30"
                        >
                          Export multi
                        </Button>
                      </Col>
                    </Row>

                    {this.isFilter ? (
                      <Row gutter={16} className="mrt-10">
                        <Col xl={8} xxl={4}>
                          <label htmlFor="divisionCode" className="w100pc">
                            Division:
                            <SelectBox
                              data={optDivision}
                              func={this.updateFilter}
                              keyField={'divisionCode'}
                              defaultValue={fields.divisionCode}
                              isMode={''}
                            />
                          </label>
                        </Col>
                        <Col xl={8}>
                          <label htmlFor="itemCode" className="w100pc">
                            Items:
                            <SelectBox
                              data={itemCodeOpt}
                              func={this.updateFilter}
                              keyField={'itemCode'}
                              defaultValue={fields.itemCode}
                              isMode={''}
                            />
                          </label>
                        </Col>
                        <Col xl={8} xxl={4}>
                          <label htmlFor="methodcode" className="w100pc">
                            &nbsp;
                          </label>
                          <Button
                            onClick={() => handleExportAutoField(results, 'reportdisposalexport')}
                            className="btn btn-danger h-30"
                          >
                            Export filter
                          </Button>
                        </Col>
                      </Row>
                    ) : null}
                  </Col>
                  <Col xl={8} className="text-right">
                    <table className="table-hover d-inline-block" style={{ width: 'auto', overflow: 'auto' }}>
                      <thead>
                        <tr>
                          <th className="fs-10 pd-5 bd-none rule-number">Top item</th>
                          <th className="fs-10 pd-5 bd-none rule-number">Qty</th>
                          <th className="fs-10 pd-5 bd-none rule-number">Sales</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>
                            {`${this.topSum.itemCode}`}
                            <br />
                            {`${this.topSum.itemName}`}
                          </td>
                          <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>
                            {StringHelper.formatValue(this.topSum.disposalQty)}
                          </td>
                          <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>
                            {StringHelper.formatValue(this.topSum.disposalPrice)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* <Row gutter={16} className="mrt-10">
                        <Col xl={24}>
                            <div className="section-block">
                                <Row gutter={16}>
                                    <Col xl={19}>
                                        <Row gutter={16}>
                                            <Col xl={8} xxl={4}>
                                                <label htmlFor="divisionCode" className="w100pc">
                                                    Division:
                                                    <SelectBox data={optDivision} func={this.updateFilter} keyField={'divisionCode'} defaultValue={fields.divisionCode} isMode={''} />
                                                </label>
                                            </Col>
                                            <Col xl={8} xxl={4}>
                                                <label htmlFor="methodcode" className="w100pc">&nbsp;</label>
                                                <button

                                                    onClick={() => handleExportAutoField(results, "reportdisposalexport")}
                                                    type="button"
                                                    className="btn btn-danger h-30"
                                                >
                                                    Export filter
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xl={5}></Col>
                                </Row>
                            </div>
                        </Col>
                    </Row> */}

          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <TableCustom
                  data={results}
                  columns={columns}
                  fullWidth={false}
                  sumFooter={totalFooterTable}
                  isPaging={true}
                />
              </div>
            </Col>
          </Row>

          <div className="row mrt-10">
            <div className="col-md-12">
              <div>
                {/* <div className="row">
                                    <div className="col-md-12">
                                        <TableDisposalDetail
                                            data={dataDisposal}
                                            sumDisposalDetail={sumDisposalDetail}
                                            items={this.data.disposal}
                                        />
                                    </div>
                                </div> */}

                <ModelExportDataMultiple
                  type="saledisposal"
                  isOpenDrawerExport={this.isOpenDrawerExport}
                  updateIsOpen={(val) => {
                    this.isOpenDrawerExport = val;
                    this.refresh();
                  }}
                />

                {/* <section id={this.idStoreShowExportDetail} className='popup-form' style={{ minHeight: 300, minWidth: 500, maxWidth: '65%', width: 'auto' }}>
                                    <Row gutter={16}>
                                        <Col xl={8}>
                                            <label htmlFor="storeCode" className="w100pc">
                                                Store export:
                                                <SelectBox data={groupStore} func={this.updateFilter} keyField={'storeCodeDetailExport'} defaultValue={fields.storeCodeDetailExport} isMode={''} />
                                            </label>
                                        </Col>

                                        <Col xl={9}>
                                            <label htmlFor="date" className="w100pc">
                                                Date export:
                                                <div>
                                                    <RangePicker
                                                        dates={datesExport}
                                                        range={60}
                                                        minDate={decreaseDate(60)}
                                                        maxDate={decreaseDate(1)}
                                                        func={this.handleUpdateDateExport} />
                                                </div>
                                            </label>
                                        </Col>

                                        <Col xl={7}>
                                            <label htmlFor="methodcode" className="w100pc">&nbsp;</label>
                                            <button
                                                onClick={this.handleExportAllStoreToMailDetail}
                                                type="button"
                                                className="btn btn-danger h-30"
                                            >
                                                Send
                                            </button>
                                            <button
                                                onClick={() => { $("#" + this.idStoreShowExportDetail).hide(); this.fieldSelected.storeCodeDetailExport = ""; this.refresh() }}
                                                type="button"
                                                className="btn btn-danger h-30"
                                            >
                                                Close
                                            </button>
                                        </Col>

                                    </Row>
                                    <Row gutter={16}>
                                        <Col xl={24}>
                                            <StoreSelect date={DateHelper.displayDateFormatMinus(this.fieldSelected.dateDetailEx)} isStore={isStore} store={isStore ? this.storeShowExport[1] : (this.storeShowExport[this.fieldSelected.storeCodeDetailExport] || [])} updateStoreCodeExport={this.handleUpdateStoreCodeDetailExport} />
                                        </Col>
                                    </Row>
                                  

                                </section> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
