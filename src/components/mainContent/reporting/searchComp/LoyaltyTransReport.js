import BaseComponent from 'components/BaseComponent';
import BarcodeComp from 'components/mainContent/reporting/autocompleteBarcode';
import GenderChart from 'components/mainContent/reporting/chartComp/GenderChart';
import MemberChart from 'components/mainContent/reporting/chartComp/MemberChart';
import TransactionTypeChart from 'components/mainContent/reporting/chartComp/TransactionTypeChart';
import TableLoyaltyTransReport from 'components/mainContent/reporting/tableComp/TableLoyaltyTransReport';
import DateHelper from 'helpers/DateHelper';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { createListOption, decreaseDate } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';
import $ from 'jquery';
import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';
import React from 'react';

import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag } from 'antd';
import ModelExportDataMultipleFix from 'modelComponent/export/ModelExportDataMultipleFix';
import DatePickerComp from 'utils/datePicker';
import SelectBox from 'utils/selectBox';
import Block from 'components/common/block/Block';

export default class LoyaltyTransReport extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = 'listDetail' + StringHelper.randomKey();
    this.idBarcodeItemRef = React.createRef();
    this.idBarcodeItem = 'idBarcodeItem' + StringHelper.randomKey();
    this.idStoreShowExportDetail = 'ppStoreExportDetail' + StringHelper.randomKey();

    this.data.stores = [];
    this.optTrans = [];
    this.optDiscount = [];
    this.optMem = [];
    this.optPhone = [];
    this.dataTrans = [];
    this.itemsMember = {};

    this.dataExport = [];

    this.fieldSelected.dateSearch = decreaseDate(1);
    this.fieldSelected.storeCode = '';
    this.fieldSelected.transactionType = '';
    this.fieldSelected.discount = '';
    this.fieldSelected.memberCode = '';
    this.fieldSelected.phone = '';
    this.fieldSelected.dateDetailEx = decreaseDate(1);
    this.fieldSelected.startDateDetailExport = '';
    this.fieldSelected.storeCodeDetailExport = '';
    this.fieldSelected.year = new Date().getFullYear();

    this.storeCodeDetailExport = [];

    this.page = 1;

    this.allDataGender = {};

    this.dataChartTransType = [];

    this.dataReport = [];
    this.sumAllMemember = 0;
    this.sumMememberYear = 0;
    this.sumYear = 0;
    this.sumCurrentMonth = 0;
    this.isShowChartTransType = false;
  }

  componentDidMount() {
    this.handleUpdateState();
    this.handleDataChart();

    // this.handleSearch();
  }

  handleUpdateState = () => {
    let commonModel = new CommonModel();
    commonModel.getData('store').then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
      }

      this.refresh();
    });
  };

  handleDataChart = () => {
    this.sumAllMemember = 0;
    this.sumMememberYear = 0;
    this.dataReport = [];
    this.optYear = [];
    this.sumYear = 0;
    this.sumCurrentMonth = 0;
    this.allDataGender = {};
    let page = '/loyalty/summary/yearly/memberactive';

    let model = new ReportingModel();
    model.getAllReviewSale(page).then((res) => {
      if (res.status && res.data) {
        if (res.data.loyalty) {
          this.dataReport = res.data.loyalty || [];
          this.sumYear = this.handleFilterYear(new Date().getFullYear(), res.data.loyalty);
          this.sumYearPartner = this.handleFilterYearPartner(new Date().getFullYear(), res.data.loyalty);
          this.sumCurrentMonth = this.handleFilterCurrentMonth(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            res.data.loyalty
          );
          // this.sumCurrentMonthPartner = this.handleFilterCurrentMonthPartner(new Date().getFullYear(), new Date().getMonth() + 1, res.data.loyalty);

          let newObj = {};
          let gender = {};

          for (let k in res.data.loyalty) {
            let item = res.data.loyalty[k];
            this.sumAllMemember += parseFloat(item.totalNewMember);

            if (!newObj[item.yearKey]) {
              newObj[item.yearKey] = 0;
              gender[item.yearKey] = {};
              gender[item.yearKey].totalNewGenderMale = 0;
              gender[item.yearKey].totalNewGenderFemale = 0;
              gender[item.yearKey].totalNewGenderUndefined = 0;
            }

            newObj[item.yearKey] += parseFloat(item.totalNewMember);
            gender[item.yearKey].totalNewGenderMale += item.totalNewGenderMale;
            gender[item.yearKey].totalNewGenderFemale += item.totalNewGenderFemale;
            gender[item.yearKey].totalNewGenderUndefined += item.totalNewGenderUndefined;
          }
          this.optYear = createListOption(res.data.loyalty, 'yearKey');

          this.allDataGender = gender;

          this.refresh();
        }
      } else {
        this.showAlert('Member year: ' + res.message);
      }
    });
  };

  handleFilterYear = (condition = '', lst = null) => {
    this.sumYear = 0;

    if (condition !== '') {
      if (lst !== null) {
        for (let i in lst) {
          let item = lst[i];

          if (item.yearKey == condition) {
            this.sumYear += parseFloat(item.totalNewMember);
          }
        }
        return this.sumYear;
      } else {
        for (let i in this.dataReport) {
          let item = this.dataReport[i];

          if (item.yearKey == condition) {
            this.sumYear += parseFloat(item.totalNewMember);
          }
        }
        this.refresh();
      }
    } else {
      this.sumYear = this.sumAllMemember;
      this.refresh();
    }
  };

  handleFilterYearPartner = (condition = '', lst = null) => {
    this.sumYearPartner = 0;

    if (condition !== '') {
      if (lst !== null) {
        for (let i in lst) {
          let item = lst[i];

          if (item.yearKey == condition) {
            this.sumYearPartner += parseFloat(item.totalNewMemberPartner);
          }
        }
        return this.sumYearPartner;
      } else {
        for (let i in this.dataReport) {
          let item = this.dataReport[i];

          if (item.yearKey == condition) {
            this.sumYearPartner += parseFloat(item.totalNewMemberPartner);
          }
        }
        this.refresh();
      }
    } else {
      this.sumYearPartner = this.sumAllMemember;
      this.refresh();
    }
  };

  handleFilterCurrentMonth = (condition = '', condition2 = '', lst = null) => {
    this.sumCurrentMonth = 0;

    if (condition !== '') {
      if (lst !== null) {
        for (let i in lst) {
          let item = lst[i];

          if (item.yearKey == condition) {
            let abc = item.monthKey.toString().slice(-2);
            if (condition2 !== '' && condition2 == abc) {
              this.sumCurrentMonth += parseFloat(item.totalNewMember);
            }
          }
        }

        return this.sumCurrentMonth;
      } else {
        for (let i in this.dataReport) {
          let item = this.dataReport[i];

          if (item.yearKey == condition) {
            let abc = item.monthKey.toString().slice(-2);
            if (condition2 !== '' && condition2 == abc) {
              this.sumCurrentMonth += parseFloat(item.totalNewMember);
            }
          }
        }

        this.refresh();
      }
    } else {
      this.sumCurrentMonth = this.sumAllMemember;
      this.refresh();
    }
  };

  handleExportAllStoreToMailDetail = () => {
    // let store = "";

    // if (this.fieldSelected.storeCodeDetailExport === ""){
    //     this.showAlert("Please choose store to export");
    //     return false;
    // }

    // if (this.storeCodeDetailExport.length === 0){
    //     this.showAlert("Please select at least one store to export");
    //     return false;
    // }

    // store = this.storeCodeDetailExport.toString();

    let params = {
      type: 'loyaltytransactionlog',
      method: 'email',
      // email: this.nameMail+"@gs25.com.vn",
      date: this.fieldSelected.dateDetailEx ? DateHelper.displayDateFormatMinus(this.fieldSelected.dateDetailEx) : '',
      start: this.fieldSelected.startDateDetailExport
        ? DateHelper.displayDateFormatMinus(this.fieldSelected.startDateDetailExport)
        : '',
      // storeCode:  store,
    };

    let model = new ReportingModel();
    model.exportAnalyticreport(params).then((res) => {
      if (res.status && res.data) {
        let ml = res.data.receiver || '';
        this.showAlert('File sent successfully, please check your mail ' + ml + ' in 15 minutes', 'success', false);

        // this.fieldSelected.storeCodeDetailExport = "";
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleSearch = () => {
    this.isShowChartTransType = false;
    this.dataChartTransType = [];
    this.dataTrans = [];
    this.itemsMember = {};

    let page =
      this.fieldSelected.storeCode !== ''
        ? '/loyalty/' + this.fieldSelected.storeCode + '/transactionlog/monthly'
        : '/loyalty/transactionlog/monthly';

    let params = {
      date:
        this.fieldSelected.dateSearch !== '' ? DateHelper.displayDateFormatMinus(this.fieldSelected.dateSearch) : '',
    };

    let model = new ReportingModel();
    model.getAllReviewSale(page, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.loyalty) {
          this.dataTrans = res.data.loyalty;

          this.optTrans = createListOption(res.data.loyalty, 'eventName');
          this.optDiscount = createListOption(res.data.loyalty, 'discount');

          for (let k in this.optTrans) {
            let item = this.optTrans[k];
            item.label = this.eventName(item.label);
          }

          this.optMem = createListOption(res.data.loyalty, 'memberCode');
          this.optPhone = createListOption(res.data.loyalty, 'phoneClean');

          let objTransType = {};
          let objAge = {};

          for (let key in this.dataTrans) {
            let item = this.dataTrans[key];
            if (item.memberCode) {
              if (!this.itemsMember[item.memberCode]) {
                this.itemsMember[item.memberCode] = {
                  itemCode: item.memberCode,
                  itemName: item.firstName === '' || item.lastName === '' ? '#' : item.firstName + ' ' + item.lastName,
                };
              }
            }

            if (item.eventName !== '') {
              if (!objTransType[item.eventName]) {
                objTransType[item.eventName] = {};
                objTransType[item.eventName].type = item.eventName;
                objTransType[item.eventName].name = this.eventName(item.eventName);
                objTransType[item.eventName].value = 0;
              }
              objTransType[item.eventName].value += 1;
            }

            if (DateHelper.calcAge(item.birthDate) < 18) {
              if (!objAge['18-']) {
                objAge['18-'] = {};
                objAge['18-'].key = '18-';
                objAge['18-'].label = '18-';
                objAge['18-'].value = 0;
              }
              objAge['18-'].value += 1;
            }
            if (DateHelper.calcAge(item.birthDate) >= 18 && DateHelper.calcAge(item.birthDate) < 25) {
              if (!objAge['18-24']) {
                objAge['18-24'] = {};
                objAge['18-24'].key = '18-24';
                objAge['18-24'].label = '18-24';
                objAge['18-24'].value = 0;
              }
              objAge['18-24'].value += 1;
            }
            if (DateHelper.calcAge(item.birthDate) >= 25 && DateHelper.calcAge(item.birthDate) < 35) {
              if (!objAge['25-34']) {
                objAge['25-34'] = {};
                objAge['25-34'].key = '25-34';
                objAge['25-34'].label = '25-34';
                objAge['25-34'].value = 0;
              }
              objAge['25-34'].value += 1;
            }
            if (DateHelper.calcAge(item.birthDate) >= 35 && DateHelper.calcAge(item.birthDate) < 45) {
              if (!objAge['35-44']) {
                objAge['35-44'] = {};
                objAge['35-44'].key = '35-44';
                objAge['35-44'].label = '35-44';
                objAge['35-44'].value = 0;
              }
              objAge['35-44'].value += 1;
            }
            if (DateHelper.calcAge(item.birthDate) >= 45 && DateHelper.calcAge(item.birthDate) < 55) {
              if (!objAge['55-64']) {
                objAge['55-64'] = {};
                objAge['55-64'].key = '55-64';
                objAge['55-64'].label = '55-64';
                objAge['55-64'].value = 0;
              }
              objAge['55-64'].value += 1;
            }
            if (DateHelper.calcAge(item.birthDate) >= 65 && DateHelper.calcAge(item.birthDate) < 150) {
              if (!objAge['65+']) {
                objAge['65+'] = {};
                objAge['65+'].key = '65+';
                objAge['65+'].label = '65+';
                objAge['65+'].value = 0;
              }
              objAge['65+'].value += 1;
            }
            if (DateHelper.calcAge(item.birthDate) >= 150) {
              if (!objAge['undefined']) {
                objAge['undefined'] = {};
                objAge['undefined'].key = 'undefined';
                objAge['undefined'].label = 'undefined';
                objAge['undefined'].value = 0;
              }
              objAge['undefined'].value += 1;
            }
          }
          // console.log(objAge)
          this.dataChartTransType = Object.values(objTransType);
          this.isShowChartTransType = true;

          this.refresh();
        } else {
          this.showAlert('Transaction month: ' + res.message);
        }
      }
    });
  };

  eventName = (eventName) => {
    switch (eventName) {
      case 'BILL_PRINTED':
        return 'Hóa đơn';
      case 'PAYMENT':
        return 'Thanh toán';
      case 'RETURN_ITEM':
        return 'Trả hàng';
      case 'BILL_CANCEL':
        return 'Hóa đơn hủy';
      case 'ADD_REWARD':
        return 'Điểm thưởng không theo giao dịch';
      case 'ADD_REWARD_TRANSACTION':
        return 'Điểm thưởng theo giao dịch';
      case 'APP_REDEEM_DEPOSIT':
        return 'Đổi điểm';
      case 'LOCK_GIFT':
        return 'Tặng quà';
      default:
        return eventName;
    }
  };

  handleUpdateFilter = (itemCode, isFilter) => {
    if (isFilter) {
      this.fieldSelected.memberCode = itemCode;
      this.refresh();
    }
  };

  handleUpdateItemExport = (data) => {
    this.dataExport = data;
    this.refresh();
  };

  handleFilterExport = (lst) => {
    let list = [];

    list =
      this.fieldSelected.storeCode !== '' ? lst.filter((el) => el.storeCode === this.fieldSelected.storeCode) : lst;
    list =
      this.fieldSelected.transactionType !== ''
        ? list.filter((el) => el.eventName === this.fieldSelected.transactionType)
        : list;
    list = this.fieldSelected.discount !== '' ? list.filter((el) => el.discount === this.fieldSelected.discount) : list;
    list =
      this.fieldSelected.memberCode !== ''
        ? list.filter((el) => el.memberCode === this.fieldSelected.memberCode)
        : list;
    list = this.fieldSelected.phone !== '' ? list.filter((el) => el.phoneClean === this.fieldSelected.phone) : list;

    return list;
  };

  handleExportDetail = () => {
    $('#' + this.idStoreShowExportDetail).show();
    this.fieldSelected.storeCodeDetailExport = '';
    this.storeCodeDetailExport = [];
    this.refresh();
  };

  handleUpdateStoreCodeDetailExport = (value) => {
    this.storeCodeDetailExport = [];
    this.storeCodeDetailExport = value;
    this.refresh();
  };

  render() {
    const fields = this.fieldSelected;

    let data = this.dataTrans || [];

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

    let dataGender = Object.keys(this.allDataGender).length > 0 ? this.allDataGender[this.fieldSelected.year] : {};

    let arrGenderData = [];
    for (let a in dataGender) {
      let gen = dataGender[a];
      arrGenderData.push({
        type: a === 'totalNewGenderFemale' ? 'Female' : a === 'totalNewGenderMale' ? 'Male' : 'Underfined',
        value: gen,
      });
    }

    let optDiscount = this.optDiscount || [];

    return (
      <div className="container-table">
        <section id={this.idComponent}>
          {/* <div className="row"> */}
          <div className="col-md-12">
            <Block>
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <MemberChart data={this.dataReport} year={this.fieldSelected.year} />
                  </div>
                </div>
                <div className="col-md-4 pdt-10 text-center">
                  <h5 className=" fs-10">Gender member</h5>
                  <div className="d-inline-block" style={{ maxHeight: 250, maxWidth: 270 }}>
                    <GenderChart data={arrGenderData} />
                  </div>
                </div>
              </div>
            </Block>

            <Block>
              <Row gutter={16}>
                <Col xl={14}>
                  <Row gutter={16}>
                    <Col xl={12}>
                      <label htmlFor="storeCode" className="w100pc">
                        Store:
                        <SelectBox
                          data={storeOptions}
                          func={this.updateFilter}
                          funcCallback={() => {
                            this.isShowChartTransType = false;
                            this.refresh();
                          }}
                          keyField={'storeCode'}
                          defaultValue={fields.storeCode}
                          isMode={''}
                        />
                      </label>
                    </Col>
                    <Col xl={12}>
                      <label htmlFor="dateSearch" className="w100pc">
                        Date:
                        <div>
                          <DatePickerComp
                            date={fields.dateSearch}
                            minDate={decreaseDate(62)}
                            maxDate={decreaseDate(1)}
                            func={this.updateFilter}
                            keyField={'dateSearch'}
                          />
                        </div>
                      </label>
                    </Col>
                  </Row>
                  <Row gutter={16} className="mrt-10">
                    <Col xl={8}>
                      {/* <button
                                                        type="button"
                                                        onClick={this.handleSearch}
                                                        className="btn btn-danger h-30"
                                                    >
                                                        Search
                                                    </button> */}
                      <Tag className="h-30 icon-search" onClick={this.handleSearch}>
                        <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                      </Tag>
                    </Col>
                  </Row>
                  <Row gutter={16} className="mrt-10">
                    <Col xl={8}>
                      <label htmlFor="transactionType" className="w100pc">
                        Transaction type:
                        <SelectBox
                          data={this.optTrans}
                          func={this.updateFilter}
                          keyField={'transactionType'}
                          defaultValue={fields.transactionType}
                          isMode={''}
                        />
                      </label>
                    </Col>
                    <Col xl={8}>
                      <label htmlFor="discount" className="w100pc">
                        Discount:
                        <SelectBox
                          data={optDiscount}
                          func={this.updateFilter}
                          keyField={'discount'}
                          defaultValue={fields.discount}
                          isMode={''}
                        />
                      </label>
                    </Col>
                    <Col xl={8}>
                      <label htmlFor="discount" className="w100pc">
                        Member code:
                        <BarcodeComp
                          idComponent={this.idBarcodeItem}
                          ref={this.idBarcodeItemRef}
                          barCodes={this.itemsMember}
                          AddBarcode={this.handleAddBarcode}
                          updateFilter={this.handleUpdateFilter}
                          style={{ height: 30, borderRadius: 2 }}
                        />
                      </label>
                    </Col>
                  </Row>
                  <Row gutter={16} className="mrt-10">
                    <Col xl={24}>
                      <Space size={'small'}>
                        {/* <Tag className="h-30 icon-search" onClick={handleSearch}>
                                                            <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                                                        </Tag> */}
                        <Tag
                          icon={<FileExcelOutlined />}
                          className="h-30 icon-excel"
                          onClick={() => handleExportAutoField(this.handleFilterExport(data), 'loyaltyExport')}
                        >
                          <span className="icon-excel-detail">Export</span>
                        </Tag>

                        <Tag
                          icon={<FileExcelOutlined />}
                          className="h-30 icon-excel btn-showpp"
                          onClick={() => {
                            this.isOpenDrawerExport = true;
                            this.refresh();
                          }}
                        >
                          <span className="icon-excel-detail">Export multi</span>
                        </Tag>

                        {/* <button
                                                            type="button"
                                                            onClick={() => handleExportAutoField(this.handleFilterExport(data), 'loyaltyExport')}
                                                            className="btn btn-danger h-30"
                                                        >
                                                            Export
                                                        </button>
                                                        <button
                                                            onClick={this.handleExportDetail}
                                                            type="button"
                                                            className="btn btn-danger btn-showpp h-30"
                                                        >
                                                            Export multi
                                                        </button> */}
                      </Space>
                    </Col>
                  </Row>
                </Col>
                <Col xl={10}>
                  {this.isShowChartTransType && (
                    <div className="text-center">
                      <h5 className=" fs-10">
                        Transaction type {DateHelper.displayDate(this.fieldSelected.dateSearch)}
                      </h5>
                      <div className="d-inline-block" style={{ maxHeight: 200 }}>
                        <TransactionTypeChart data={this.dataChartTransType} />
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </Block>

            <TableLoyaltyTransReport
              data={data}
              storeCode={this.fieldSelected.storeCode}
              transactionType={this.fieldSelected.transactionType}
              memberCode={this.fieldSelected.memberCode}
              phone={this.fieldSelected.phone}
              discount={this.fieldSelected.discount}
            />
          </div>
          {/* </div> */}
        </section>
        <ModelExportDataMultipleFix
          type="loyaltytransactionlog"
          isShowStore={false}
          isOpenDrawerExport={this.isOpenDrawerExport}
          updateIsOpen={(val) => {
            this.isOpenDrawerExport = val;
            this.refresh();
          }}
        />
      </div>
    );
  }
}
