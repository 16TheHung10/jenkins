//Plugin
import $ from 'jquery';
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper, StringHelper } from 'helpers';
import { createListOption, decreaseDate } from 'helpers/FuncHelper';
import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';

import ExportMulti from 'components/mainContent/reporting/popupComp/ExportMulti';
import TableDetailComp from 'components/mainContent/reporting/tableComp/TableSaleLogDetail';

import { Col, Row, Tag } from 'antd';
import { createDataTable } from 'helpers/FuncHelper';
import DatePickerComp from 'utils/datePicker';
import SelectBox from 'utils/selectBox';
import TableCustom from 'utils/tableCustom';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';

export default class SalesLog extends BaseComponent {
  constructor(props) {
    super(props);

    this.autocompleteBarcodeRef = React.createRef();
    this.idBCAutoCompleteComponent = 'autoCompleteBarcode' + StringHelper.randomKey();
    this.idStoreDetail = 'ppStoreExportDetail' + StringHelper.randomKey();

    //Default data
    this.data.stores = {};

    this.results = [];
    this.resultsDetail = [];
    this.titleInvoice = '';
    this.invoiceCodeOpt = [];

    this.fieldSelected = this.assignFieldSelected(
      {
        date: decreaseDate(0),
        startExport: '',
        dateExport: decreaseDate(1),
        page: 1,
        invoiceCode: '',
      },
      ['storeCode']
    );

    this.isRender = true;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    commonModel.getData('store').then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
        this.refresh();
      }
    });

    this.refresh();
  };

  handleSearch = async () => {
    const fields = this.fieldSelected;
    fields.page = 1;
    await this.handleGetResult();
  };

  handleGetResult = async () => {
    const fields = this.fieldSelected;
    let storeCode = fields.storeCode;
    if (!storeCode) {
      this.showAlert('Please choose store');
      return false;
    }

    if (fields.date === null || fields.date === '') {
      this.showAlert('Please choose date');
      return false;
    }

    this.results = [];
    this.invoiceCodeOpt = [];

    let params = {
      date: fields.date ? DateHelper.displayDateFormatMinus(fields.date) : '',
    };

    let page = 'salelog';

    let model = new ReportingModel();
    await model.getInfoReport(page, storeCode, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.sale) {
          let list = res.data.sale;
          let obj = {};
          for (let key in list) {
            let item = list[key];

            obj[item.invoiceCode] = item;
          }
          this.results = Object.values(obj);
          this.invoiceCodeOpt = createListOption(list, 'invoiceCode');
          this.refresh();
        }
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleExportDetail = () => {
    $('#' + this.idStoreDetail).show();
    this.refresh();
  };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      if (key === 'invoiceCode') {
        this.resultsDetail = [];
      }
      this.refresh();
    }
  };

  updateItemLog = (list) => {
    this.resultsDetail = list;
    this.refresh();
  };

  updateTitleInvoice = (value) => {
    this.titleInvoice = value;
    this.refresh();
  };

  handleFilter = (arr) => {
    let fields = this.fieldSelected;

    let oldArr = [...arr];
    let newArr = [];

    newArr = fields.invoiceCode !== '' ? oldArr.filter((el) => el.invoiceCode === fields.invoiceCode) : oldArr;

    return newArr;
  };
  // --------------------------------------
  handleFormatBody = (val) => {
    let newVal = DateHelper.displayDate(new Date(DateHelper.convertKeyDateToYYYYMMDD(val)));
    return newVal;
  };

  handleFormatStatus = (val) => {
    if (val) {
      switch (val) {
        case 1:
          return <Tag color="green">Success</Tag>;
        case 3:
          return <Tag color="orange">Return</Tag>;
        default:
          return <Tag color="red">Cancel</Tag>;
      }
    } else {
      return <Tag color="red">{val}</Tag>;
    }
  };

  handleFormatLog = (val, item) => {
    if (val.length > 0) {
      return (
        <Tag
          color="blue"
          className="fs-9 cursor-pointer"
          onClick={() => {
            this.updateItemLog(val);
            this.updateTitleInvoice(item.invoiceCode);
          }}
        >
          View log
        </Tag>
      );
    } else {
      return <Tag className="fs-9">Updating</Tag>;
    }
  };

  // handleInputTestChange = (e, id) => {
  //     const { value } = e.target;
  //     console.log(value)
  // }

  handleFormatIpTest = (val, key, isInput = false) => {
    if (isInput) {
      return <input type="text" onChange={(e) => this.handleInputTestChange(e, key)} />;
    } else {
      return val;
    }
  };
  // --------------------------------------
  renderComp() {
    const fields = this.fieldSelected;
    let isStore = false;
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
    if (storeKeys.length === 0) {
      storeOptions.push({
        value: this.data.storeCode,
        label: this.data.storeCode + ' - ' + this.data.storeName,
        openedDate: DateHelper.displayDateFormatMinus(decreaseDate(1)),
      });
      isStore = true;
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return {
          value: stores[key].storeCode,
          label: stores[key].storeCode + ' - ' + stores[key].storeName,
          openedDate: stores[key].openedDate,
        };
      });
    }

    let invoiceOpt = this.invoiceCodeOpt;

    let results = this.handleFilter(this.results);

    let columns = [
      {
        field: 'dateKey',
        label: 'Date',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
        formatBody: this.handleFormatBody,
      },
      {
        field: 'invoiceCode',
        label: 'Invoice',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'counterCode',
        label: 'Counter',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'invoiceType',
        label: 'Status',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
        formatBody: this.handleFormatStatus,
      },
      { field: 'log', label: '', formatBody: this.handleFormatLog },
    ];

    let data = createDataTable(results, columns);

    return (
      <div className="container-table">
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={19}>
                  <Row gutter={16}>
                    <Col xl={6}>
                      <label htmlFor="storeCode" className="w100pc">
                        Store:
                        <SelectBox data={storeOptions} func={this.updateFilter} keyField={'storeCode'} defaultValue={fields.storeCode} isMode={''} />
                      </label>
                    </Col>
                    <Col xl={7}>
                      <label htmlFor="date" className="w100pc">
                        Date:
                        <div>
                          <DatePickerComp date={fields.date} minDate={decreaseDate(62)} maxDate={decreaseDate(0)} func={this.updateFilter} keyField={'date'} />
                        </div>
                      </label>
                    </Col>
                    <Col xl={6}>
                      <label htmlFor="storeCode" className="w100pc">
                        Invoice code:
                        <SelectBox data={invoiceOpt} func={this.updateFilter} keyField={'invoiceCode'} defaultValue={fields.invoiceCode} isMode={''} />
                      </label>
                    </Col>
                    <Col xl={6}>
                      <label className="w100pc">&nbsp;</label>
                      <BaseButton iconName={'search'} onClick={this.handleSearch}>
                        Search
                      </BaseButton>
                    </Col>
                  </Row>
                  <Row gutter={16} className="mrt-10"></Row>
                </Col>
                <Col xl={5}></Col>
              </Row>
            </div>
          </Col>
        </Row>

        <Row gutter={16} className="mrt-10">
          <Col xl={11} xxl={8}>
            <div className="section-block">
              <TableCustom style={{ width: '100%' }} data={data} columns={columns} />
            </div>
          </Col>
          <Col xl={13} xxl={16}>
            <div className="section-block">
              {this.resultsDetail.length > 0 && <h5>{this.titleInvoice}</h5>}
              <TableDetailComp items={this.resultsDetail} />
            </div>
          </Col>
        </Row>

        <ExportMulti id={this.idStoreDetail} storeOptions={storeOptions} type="sale" isStore={isStore} />
      </div>
    );
  }
}
