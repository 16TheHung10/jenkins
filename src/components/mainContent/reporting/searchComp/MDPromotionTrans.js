import Moment from 'moment';
import React from 'react';
import BaseComponent from 'components/BaseComponent';
import DateHelper from 'helpers/DateHelper';
import ProgressBarTracking from 'helpers/ProgressBarTracking';
import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';
import TableMDPromotionCombo from 'components/mainContent/reporting/tableComp/TableMDPromotionCombo';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { decreaseDate, fnObjGroup } from 'helpers/FuncHelper';
import { Col, Row, Space } from 'antd';
import RangePicker from 'utils/rangePicker';
import SelectBox from 'utils/selectBox';

export default class MDPromotion extends BaseComponent {
  constructor(props) {
    super(props);

    //Default data
    this.data.stores = [];

    this.dataPromo = [];
    this.dataTransaction = [];

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        start: Moment(decreaseDate(9)),
        date: Moment(decreaseDate(1)),
        type: '',
        invoiceCode: '',
        storeFilter: '',
      },
      ['storeCode']
    );

    // this.typeOpt = [{ value: 'itemcombo', label: 'Combo' }, { value: 'buygift', label: 'Buy gift' }];
    this.typeOpt = [];
    this.invoiceOption = [];

    this.dataExport = [];

    this.isRender = true;
  }

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

  handleSearch = async () => {
    const fields = this.fieldSelected;

    if (fields.storeCode === '') {
      this.showAlert('Please choose store');
      return false;
    }

    if (fields.start === null || fields.start === '' || fields.date === null || fields.date === '') {
      this.showAlert('Please choose date');
      return false;
    }

    let page = 'transaction/movement';
    let storeCode = fields.storeCode;

    this.dataTransaction = [];

    let model = new ReportingModel();
    let diff = DateHelper.diffDate(fields.start, fields.date);

    var result = [];
    let onePc = (100 * 100) / diff / 100;

    // for (const store of fields.storeCode) {
    ProgressBarTracking.start(onePc, diff, 0);
    for (let i = 0; i <= diff; i++) {
      // ProgressBarTracking.instance !== null && ProgressBarTracking.start(onePc, diff, i);

      let params = {
        date: (fields.start && DateHelper.displayDateFormatMinus(DateHelper.addDays(fields.start, i))) || '',
      };
      // let response = await model.getInfoReport(page, store, params)

      if (ProgressBarTracking.instance !== null) {
        let response = await model.getInfoReport(page, fields.storeCode, params);

        if (response.status && response.data) {
          if (response.data.sale) {
            ProgressBarTracking.instance !== null && ProgressBarTracking.start(onePc, diff, i);

            for (let i in response.data.sale) {
              // response.data.sale[i].storeCode = store;
              response.data.sale[i].storeCode = fields.storeCode;
            }
            result = [...result, ...response.data.sale];
          }
        } else {
          this.showAlert(response.message);
        }
      } else {
        result = [];
      }
    }
    // }

    ProgressBarTracking.hide();

    let objGroup = {};
    let lstField = {
      grossSales: 0,
      netSales: 0,
      qty: 0,
      details: [],
      invoiceCode: '',
      invoiceDate: '',
      billDiscount: 0,
      invoiceType: false,
      storeCode: '',
    };
    objGroup = fnObjGroup(result, 'invoiceCode', lstField);

    this.dataTransaction = Object.values(objGroup);

    // ProgressBarTracking.hide();
    // ProgressBarTracking.resetValue(0);
    // this.handleGetPromotion(fields.storeCode[0]);
    this.handleGetPromotion(fields.storeCode);

    this.refresh();
  };

  handleExportCombo = () => {
    const fields = this.fieldSelected;

    if (fields.type === '') {
      this.showAlert('Please choose type promotion');
      return false;
    }

    let arr = [];

    for (let k in this.dataExport) {
      let item = this.dataExport[k];
      let obj = {
        storeCode: item.storeCode,
        invoiceDate: item.invoiceDate,
        invoiceCode: item.invoiceCode,
        invoiceType: item.invoiceType,
      };

      if (fields.type === 'Buy') {
        obj.itemCodeBuy = item.itemPromotionCode;
        obj.itemNameBuy = item.itemPromotionName;
        obj.qtyBuy = item.discount1;
        obj.itemCodeGet = item.itemPromotionCodeGet;
        obj.itemNameGet = item.itemPromotionNameGet;
        obj.qtyGet = item.discount2;
      }

      if (fields.type === 'Discount') {
        obj.itemCodeBuy = item.itemPromotionCode;
        obj.itemNameBuy = item.itemPromotionName;

        obj.discount = item.discount;
      }

      if (fields.type === 'Combo') {
        obj.itemCodeBuy = item.itemPromotionCode;
        obj.itemNameBuy = item.itemPromotionName;
        obj.itemCodeGet = item.itemPromotionCodeGet;
        obj.itemNameGet = item.itemPromotionNameGet;
        obj.discount = item.discount;
      }

      arr.push(obj);
    }

    handleExportAutoField(arr, 'promotionTransactionTypeExport');
  };

  handleGetPromotion = (storeCode) => {
    if (!storeCode || storeCode === '') return false;

    this.typeOpt = [];
    this.dataPromo = [];

    let page = 'itempromotion?storeCode=' + storeCode;
    let model = new ReportingModel();

    model.getListByPage(page).then((res) => {
      if (res.status && res.data) {
        let arrItem = res.data;

        this.dataPromo = arrItem;

        let objTypePromo = {};

        for (let key in res.data) {
          let target = res.data[key];

          if (!objTypePromo[target.type] && target.type !== '' && target.type !== 'Get') {
            objTypePromo[target.type] = {};
            objTypePromo[target.type].value = target.type;
            objTypePromo[target.type].label = target.type === 'Buy' ? 'Buy 1 get 1' : target.type;
          }
        }
        this.typeOpt = Object.values(objTypePromo);

        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
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

  resetFilter = () => {
    const fields = this.fieldSelected;
    this.items = [];

    this.refresh();
  };

  handleFilter = (arr) => {
    const fields = this.fieldSelected;
    this.dataExport = [];
    let newArr = [...arr];

    let newPro = [];
    if (fields.type !== '' && this.dataPromo.length > 0) {
      if (fields.type === 'Combo' || fields.type === 'Discount') {
        newPro = this.dataPromo.length > 0 ? this.dataPromo.filter((el) => el.type === fields.type) : this.dataPromo;
      }

      if (fields.type === 'Buy') {
        newPro = this.dataPromo.length > 0 ? this.dataPromo.filter((el) => el.type === fields.type || el.type === 'Get') : this.dataPromo;
      }

      if (fields.type === 'Combo') {
        for (let i in newPro) {
          let item = newPro[i];

          for (let key in newArr) {
            let elm = newArr[key];
            let a = 0;
            let b = 0;

            if (item.itemCode1) {
              for (let k2 in elm.details) {
                let target2 = elm.details[k2];

                if (item.itemCode1 === target2.barcode) {
                  a = 1;
                }
              }
            }
            if (item.itemCode2) {
              for (let k3 in elm.details) {
                let target3 = elm.details[k3];

                if (item.itemCode2 === target3.barcode) {
                  // console.log(elm.invoiceCode + ";" + item.itemCode2 + ";" + target3.barcode)
                  b = 1;
                }
              }
            }

            if (a + b == 2 && item.itemCode1 !== item.itemCode2) {
              elm['is' + item.type] = true;
              elm.itemPromotionCode = item.itemCode1;
              elm.itemPromotionName = item.itemName1;

              elm.itemPromotionCodeGet = item.itemCode2;
              elm.itemPromotionNameGet = item.itemName2;
              elm.discount = item.common;
            }
          }
        }

        newArr = newArr.filter((el) => el['isCombo'] === true) || newArr;
      }

      if (fields.type === 'Discount') {
        for (let i in newPro) {
          let item = newPro[i];
          for (let key in newArr) {
            let elm = newArr[key];

            if (item.itemCode1) {
              for (let k2 in elm.details) {
                let target2 = elm.details[k2];

                if (item.itemCode1 === target2.barcode) {
                  elm['is' + item.type] = true;
                  elm.itemPromotionCode = item.itemCode1;
                  elm.itemPromotionName = item.itemName1;
                  elm.discount = item.common;
                }
              }
            }
          }
        }

        newArr = newArr.filter((el) => el['isDiscount'] === true) || newArr;
      }

      if (fields.type === 'Buy') {
        for (let i in newPro) {
          let item = newPro[i];

          for (let key in newArr) {
            let elm = newArr[key];

            if (item.itemCode1) {
              for (let k2 in elm.details) {
                let target2 = elm.details[k2];

                if (item.itemCode1 === target2.barcode && item.type === 'Buy') {
                  elm['is' + item.type] = true;
                  elm.itemPromotionCode = item.itemCode1;
                  elm.itemPromotionName = item.itemName1;
                  elm.discount1 = item.common;
                }

                if (item.itemCode1 === target2.barcode && item.type === 'Get') {
                  elm['is' + item.type] = true;
                  elm.itemPromotionCodeGet = item.itemCode1;
                  elm.itemPromotionNameGet = item.itemName1;
                  elm.discount2 = item.common;
                }
              }
            }
          }
        }

        newArr = newArr.filter((el) => el['isBuy'] === true && el['isGet'] === true) || newArr;
      }
    }

    newArr = fields.invoiceCode !== '' ? newArr.filter((el) => el.invoiceCode === fields.invoiceCode) : newArr;
    newArr = fields.storeFilter !== '' ? newArr.filter((el) => el.storeCode === fields.storeFilter) : newArr;

    this.dataExport = newArr;

    return newArr;
  };

  renderComp() {
    const fields = this.fieldSelected;

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
      });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return {
          value: stores[key].storeCode,
          label: stores[key].storeCode + ' - ' + stores[key].storeName,
        };
      });
    }

    let typeOption = this.typeOpt || [];

    let items = this.handleFilter(this.dataTransaction);

    let objInvoice = {};

    for (let key in items) {
      let target = items[key];

      if (!objInvoice[target.invoiceCode]) {
        objInvoice[target.invoiceCode] = {};
        objInvoice[target.invoiceCode].value = target.invoiceCode;
        objInvoice[target.invoiceCode].label = target.invoiceCode;
      }
    }
    let invoiceOption = Object.values(objInvoice);

    let dates = [fields.start, fields.date];

    return (
      <div>
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={16}>
                  <Row gutter={16}>
                    <Col xl={8}>
                      <label htmlFor="storeCode" className="w100pc">
                        Store:
                        <SelectBox
                          data={storeOptions}
                          func={this.updateFilter}
                          keyField={'storeCode'}
                          defaultValue={fields.storeCode}
                          // isMode={'multiple'}
                        />
                      </label>
                    </Col>
                    <Col xl={8}>
                      {/* <label htmlFor="date" className="w100pc">
                                                    Date:
                                                    <div>
                                                        <DatePickerComp
                                                            date={fields.date}
                                                            minDate={decreaseDate(62)}
                                                            maxDate={decreaseDate(1)}
                                                            func={this.updateFilter}
                                                            keyField={'date'}
                                                        />
                                                    </div>
                                                </label> */}
                      <label htmlFor="date" className="w100pc">
                        Date:
                        <div>
                          <RangePicker dates={dates} range={9} minDate={decreaseDate(152)} maxDate={decreaseDate(0)} func={this.handleUpdateDate} />
                        </div>
                      </label>
                    </Col>
                    <Col xl={8}>
                      <label htmlFor="date" className="w100pc">
                        &nbsp;
                      </label>
                      <Space size={'small'}>
                        <button onClick={this.handleSearch} type="button" className="btn btn-danger h-30">
                          Search
                        </button>
                        <button onClick={this.handleExportCombo} type="button" className="btn btn-danger h-30">
                          Export
                        </button>
                      </Space>
                    </Col>
                  </Row>

                  <Row gutter={16} className="mrt-5">
                    <Col xl={8}>
                      <label htmlFor="type" className="w100pc">
                        Type promotion:
                        <SelectBox data={typeOption} func={this.updateFilter} funcCallback={this.resetFilter} keyField={'type'} defaultValue={fields.type} isMode={''} />
                      </label>
                    </Col>
                    <Col xl={8}>
                      <label htmlFor="type" className="w100pc">
                        Invoice:
                        <SelectBox data={invoiceOption} func={this.updateFilter} funcCallback={this.resetFilter} keyField={'invoiceCode'} defaultValue={fields.invoiceCode} isMode={''} />
                      </label>
                    </Col>
                    <Col xl={8}>
                      <label htmlFor="type" className="w100pc">
                        Store filter:
                        <SelectBox data={storeOptions} func={this.updateFilter} funcCallback={this.resetFilter} keyField={'storeFilter'} defaultValue={fields.storeFilter} isMode={''} />
                      </label>
                    </Col>
                  </Row>
                </Col>
                <Col xl={8}>
                  <div className="bg-note cl-red">
                    <strong>Lưu ý:</strong>
                    <br />
                    <p>- Bước 1: Thực hiện chức năng tìm kiếm lấy danh sách sản phẩm.</p>
                    <p>- Bước 2: chọn promotion để lấy thông tin phiếu export</p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <div className="section-block mt-15">
          <div className="detail-tab row" id="reporting-comboitem">
            <div className="col-md-12">
              <div className="row mrt-10">
                <div clasName="section-block">
                  <div className="col-md-12">
                    <TableMDPromotionCombo items={items} fieldSelected={this.fieldSelected} dataPromo={this.dataPromo} />
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
