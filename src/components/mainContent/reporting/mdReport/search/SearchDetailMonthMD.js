//Plugin
import React from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

//Custom
import BaseComponent from 'components/BaseComponent';
import PageHelper from 'helpers/PageHelper';
import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';

import DateHelper from 'helpers/DateHelper';
import StringHelper from 'helpers/StringHelper';

import TableListDetailBill from 'components/mainContent/reporting/mdReport/table/TableListDetailBillMD';
import TableListDetailBillCancel from 'components/mainContent/reporting/mdReport/table/TableListDetailBillCancelMD';

import CheckBillItems from 'components/mainContent/common/checkBill';
import DownloadModel from 'models/DownloadModel';

import { changeTab, decreaseDate, fnSum } from 'helpers/FuncHelper';

import { handleExportAutoField } from 'helpers/ExportHelper';
import { createListOption, fnObjGroup } from 'helpers/FuncHelper';
import { Col, Row, Space, message } from 'antd';
import SelectBox from 'utils/selectboxAndCheckbox';
import RangePicker from 'utils/rangePicker';
import DatePickerComp from 'utils/datePicker';

export default class SearchDetailMonthMD extends BaseComponent {
  constructor(props) {
    super(props);

    //Event
    this.idCheckBillItemsComponent = 'checkBilltemPopup' + StringHelper.randomKey();
    this.idCheckBillItemsComponentRef = React.createRef();

    //Default data
    this.data.stores = [];

    // Sales by store
    this.dataDetailSbs = [];

    this.totalAmount = 0;
    this.totalAmountFilter = 0;

    this.defaultDate = decreaseDate(1);

    // new domain start
    this.detailBill = [];
    this.objGroupDetail = {};
    this.total = 0;

    this.detailBillCancel = [];
    this.itemsCancel = [];
    // new domain end

    //Data Selected

    this.objItems = {};
    this.objFilInvoice = {};
    this.objFilEmployee = {};
    this.objFilPayment = {};
    this.objCounter = {};
    this.objStatusInvoice = {};

    this.optFilInvoiceCancel = [];
    this.optFilEmployeeCancel = [];

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

    this.optCustomer = [
      {
        value: '0',
        label: 'Non member in bill',
      },
      {
        value: '1',
        label: 'Member in bill',
      },
    ];

    this.resultSbc = [];

    this.fieldSelected = this.assignFieldSelected(
      {
        employeecodeBillDetail: '',
        invoiceBillDetail: '',
        methodcodeBill: '',
        starSbs: '',
        startDateSbs: this.defaultDate,
        startDateSoh: this.defaultDate,
        start: '',
        dateGroup: this.defaultDate,
        startDate: this.defaultDate,
        customerNumber: '',
        invoiceType: '',
        counterF: '',
        note: '',
        noteDetail: '',
        starCancel: '',
        dateCancel: this.defaultDate,
        employeecodeBillDetailCancel: '',
        invoiceBillDetailCancel: '',
        noteDetailCancel: '',
        pageDetail: 1,
      },
      ['storeCode']
    );

    this.page = 1;

    if (
      this.fieldSelected.storeCode === undefined ||
      this.fieldSelected.storeCode === '' ||
      this.data.storeCode === undefined
    ) {
      this.fieldSelected.storeCode = 'VN0001';
    }

    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      // if (filters["startDate"]) {
      //     filters["startDate"] = new Date(filters["startDate"]);
      // }

      return true;
    });

    this.searchBill = false;
    this.countBillCancel = 0;
    this.countBillTru = 0;

    this.resultLog = [];
    this.itemsLog = [];

    this.isRender = true;
  }

  handleCount = (objItems) => {
    // let objGroupTru = {};
    // let objGroupHuy = {};
    let arTruHang = [];
    // let arHuy = [];

    for (var k in objItems) {
      var item = objItems[k];
      // objGroupTru[k] = item;
      // objGroupHuy[k] = item;
    }

    for (let item in this.resultLog) {
      let target = this.resultLog[item];
      for (let itemLog in target.log) {
        let target2 = target.log[itemLog];
        if (target2.action == '0' || target2.action == '3') {
          arTruHang.push(target.invoiceCode);
        }
        // if (target2.action == '3') {
        //     arHuy.push(target.invoiceCode);
        // }
      }
    }
    const uniqueArrTru = arTruHang.filter((value, index, self) => self.indexOf(value) === index);
    // const uniqueArrHuy = arHuy.filter((value, index, self) => self.indexOf(value) === index);

    // this.countBillCancel = uniqueArrHuy?.length ?? 0;
    this.countBillTru = uniqueArrTru?.length ?? 0;
  };

  handleCheckBill = (invoiceId) => {
    this.idCheckBillItemsComponentRef.current.handleLoadItemsResult(invoiceId);
  };

  componentDidMount() {
    this.handleCheckStatus();
  }

  handleCheckStatus = async () => {
    let storeCode = this.fieldSelected.storeCode;
    let date = DateHelper.displayDateFormatMinus(decreaseDate(1));
    let model = new ReportingModel();
    await model.checkStatusAPIsale(storeCode, date).then((res) => {
      if (res.status && res.data.storeStatus) {
        this.handleUpdateState(true, true, true, true, false);
        if (res.data.note) {
          this.fieldSelected.note = res.data.note;

          if (res.data.note !== '') {
            var mask = document.querySelectorAll('.mask-content-error');
            mask.forEach((el) => {
              el.innerHTML =
                'Dữ liệu chưa cập nhật đầy đủ, ' +
                '<br/>' +
                'vui lòng khởi động lại phần mềm bán hàng để cập nhật dữ liệu sale. ' +
                '<br/>' +
                ' Sau 30 phút sẽ được cập nhật hoặc liên hệ bộ phận IT để hỗ trợ';
            });
          }
        }
        this.refresh();
      } else {
        var elUpdating = document.getElementById('content-updating');
        elUpdating.classList.remove('d-none');
      }
    });
  };

  onChangeStoreCode = (value) => {
    this.fieldSelected.note = '';
    this.fieldSelected.storeCode = value;
    this.fieldSelected.startDate = null;
    this.fieldSelected.endDate = null;

    this.totalAmount = 0;
    this.totalAmountFilter = 0;

    let storeCode = value;
    let date = DateHelper.displayDateFormatMinus(decreaseDate(1));
    let model = new ReportingModel();
    model.checkStatusAPIsale(storeCode, date).then((res) => {
      if (res.status && res.data.storeStatus) {
        this.handleUpdateState(false, true, true, true, false);
        if (res.data.note) {
          this.fieldSelected.note = res.data.note;

          if (res.data.note !== '') {
            var mask = document.querySelectorAll('.mask-content-error');
            mask.forEach((el) => {
              el.innerHTML =
                'Dữ liệu chưa cập nhật đầy đủ, ' +
                '<br/>' +
                'vui lòng khởi động lại phần mềm bán hàng để cập nhật dữ liệu sale. ' +
                '<br/>' +
                ' Sau 30 phút sẽ được cập nhật hoặc liên hệ bộ phận IT để hỗ trợ';
            });
          }
        }
        this.refresh();
      } else {
        var elUpdating = document.getElementById('content-updating');
        elUpdating.classList.remove('d-none');
      }
    });
  };

  handleUpdateState = async (
    isCommon = true,
    isChart = true,
    isReportChart = true,
    isBillDetail = true,
    isTableDetail = false
  ) => {
    if (isCommon) {
      let commonModel = new CommonModel();
      commonModel.getData('store').then((res) => {
        if (res.status) {
          this.data.stores = res.data.stores || [];
        }
        this.refresh();
      });
    }

    if (isChart) {
      // this.handleGetReportChartTopItemsSale();
      // this.handleGetReportChartBestSalesInMonth();
      // this.handleGetReportTopDelivery();
      // this.handleGetSummary();
      // this.handleGetPaymentMethod();
      // this.handleCicoReport();
    }

    if (isReportChart) {
    }

    this.refresh();
  };

  // ----------------------------------------------------SEARCH DETAIL BILL
  handleExportDetailBill = () => {
    const fields = this.fieldSelected;

    let data = [...this.detailBill];
    let payment = [];
    for (let i in data) {
      let item = data[i];

      delete item.invoiceType;
      delete item.employeeCode;
      delete item.supplierCode;
      delete item.categoryCode;
      delete item.categoryName;
      delete item.subCategoryCode;
      delete item.subCategoryName;
      delete item.divisionCode;
      delete item.divisionName;
      delete item.vatAmount;
      delete item.discount;
      delete item.returnPaid;
      delete item.timeKey;
      delete item.regionCode;
      delete item.regionName;
      delete item.unit;

      for (let i2 in item.listpayment) {
        let item2 = item.listpayment[i2];
        if (!payment.includes(item2.paymentMethodName)) {
          payment.push(item2.paymentMethodName);
        }
      }
    }

    for (let index in data) {
      let item = data[index];

      for (let index2 in payment) {
        let method = payment[index2];

        for (let index3 in item.listpayment) {
          let item3 = item.listpayment[index3];

          if (method === item3.paymentMethodName) {
            item[method] = item3.amount;
          } else {
            item[method] = 0;
          }
        }
      }
    }

    handleExportAutoField(data, 'detailTransExport' + DateHelper.displayDateFormatMinus(fields.dateGroup), [
      'listpayment',
    ]);
  };

  handleSearchAllDetailBill = async () => {
    const fields = this.fieldSelected;

    if (fields.storeCode === '') {
      this.showAlert('Please choose store');
      return false;
    }

    let page = 'transaction/movement';
    let storeCode = this.fieldSelected.storeCode;
    let params = {
      date: (this.fieldSelected.dateGroup && DateHelper.displayDateFormatMinus(this.fieldSelected.dateGroup)) || '',
    };

    this.fieldSelected.invoiceBillDetail = '';
    this.fieldSelected.counterF = '';
    this.fieldSelected.employeecodeBillDetail = '';
    this.fieldSelected.methodcodeBill = '';
    this.fieldSelected.customerNumber = '';
    this.fieldSelected.invoiceType = '';
    this.fieldSelected.noteDetail = '';
    this.fieldSelected.pageDetail = 1;

    let objGroupDetail = {};
    let objFilInvoice = {};
    let objFilEmployee = {};
    let objFilPayment = {};
    let objCounter = {};
    let objStatusInvoice = {};
    this.searchBill = false;

    let model = new ReportingModel();

    await model.getInfoReport(page, storeCode, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.sale) {
          this.detailBill = res.data.sale || [];

          for (var index in this.detailBill) {
            let item = this.detailBill[index];

            if (!objGroupDetail[item.invoiceCode.trim()]) {
              objGroupDetail[item.invoiceCode.trim()] = {
                invoiceDate: item.invoiceDate,
                invoiceType: item.invoiceType,
                storeCode: item.storeCode,
                storeName: item.storeName,
                employeeCode: item.employeeCode,
                employeeName: item.employeeName,
                returnPaid: item.returnPaid,
                discount: item.discount,
                listpayments: {},
                listpaymentsValue: {},
                listpayment: item.listpayment,
                customerCode: item.customerCode,
                totalAmount: 0,
                payCustomer: item.returnPaid,
                netSalesAfter: 0,
                billGrossSales: item.billGrossSales,
                invoiceCode: item.invoiceCode.trim(),
                counter: item.invoiceCode.trim().slice(0, 8),
              };
            }

            objGroupDetail[item.invoiceCode].payCustomer += item.grossSales;
            objGroupDetail[item.invoiceCode].totalAmount = item.billGrossSales + item.discount;
            objGroupDetail[item.invoiceCode].netSalesAfter += item.netSalesAfter;

            if (!objGroupDetail[item.invoiceCode].details) {
              objGroupDetail[item.invoiceCode].details = [];
            }

            let obj = {
              itemCode: item.barcode,
              itemName: item.itemName,
              qty: item.qty,
              itemDiscount: item.itemDiscount,
              grossSales: item.grossSales,
              vat: item.vat,
              vatAmount: item.vatAmount,
              supplierCode: item.supplierCode,
              divisionCode: item.divisionCode,
              divisionName: item.divisionName,
              categoryCode: item.categoryCode,
              categoryName: item.categoryName,
            };
            objGroupDetail[item.invoiceCode].details.push(obj);

            if (!objCounter[item.invoiceCode.toString().trim().slice(0, 8)]) {
              objCounter[item.invoiceCode.toString().trim().slice(0, 8)] = item.invoiceCode
                .toString()
                .trim()
                .slice(0, 8);
            }

            if (!objFilInvoice[item.invoiceCode.trim()]) {
              objFilInvoice[item.invoiceCode.trim()] = item.invoiceCode.trim();
            }

            if (!objFilEmployee[item.employeeCode]) {
              objFilEmployee[item.employeeCode] = {
                value: item.employeeCode,
                label: item.employeeCode + ' - ' + item.employeeName,
              };
            }

            if (!objStatusInvoice[item.invoiceType]) {
              objStatusInvoice[item.invoiceType] = {
                value: item.invoiceType,
                label: this.handleReturnStatusInvoiceType(item.invoiceType),
              };
            }

            for (let index2 in objGroupDetail[item.invoiceCode].listpayment) {
              let item2 = objGroupDetail[item.invoiceCode].listpayment[index2];

              if (!objFilPayment[item2.paymentMethodCode]) {
                objFilPayment[item2.paymentMethodCode] = {
                  value: item2.paymentMethodCode,
                  label: item2.paymentMethodCode + ' - ' + item2.paymentMethodName,
                };
              }

              if (!objGroupDetail[item.invoiceCode].listpayments[item2.paymentMethodCode]) {
                objGroupDetail[item.invoiceCode].listpayments[item2.paymentMethodCode] = true;
              }

              if (!objGroupDetail[item.invoiceCode].listpaymentsValue[item2.paymentMethodCode]) {
                objGroupDetail[item.invoiceCode].listpaymentsValue[item2.paymentMethodCode] = item2.amount;
              }
            }
          }

          this.objGroupDetail = objGroupDetail;
          this.objFilInvoice = objFilInvoice;
          this.objCounter = objCounter;
          this.objFilEmployee = objFilEmployee;
          this.objFilPayment = objFilPayment;
          this.objStatusInvoice = objStatusInvoice;

          this.handleFilterBill(this.objGroupDetail);
        } else {
          this.showAlert('Empty data!');
        }
      } else {
        // this.showAlert("System busy!");
      }
    });

    this.resultLog = [];
    this.itemsLog = [];

    let paramsLog = {
      date: this.fieldSelected.dateGroup ? DateHelper.displayDateFormatMinus(this.fieldSelected.dateGroup) : '',
    };

    let pageLog = 'salelog';

    await model.getInfoReport(pageLog, storeCode, paramsLog).then((res) => {
      if (res.status && res.data) {
        if (res.data.sale) {
          this.resultLog = res.data.sale;
          // this.refresh();
        }
      } else {
        message.error(res.message);
      }
    });

    let dateDetail =
      (this.fieldSelected.dateGroup && DateHelper.displayDateFormatMinus(this.fieldSelected.dateGroup)) || '';
    model.checkStatusAPIsale(storeCode, dateDetail).then((response) => {
      if (response && response.data && response.data.storeStatus) {
        this.searchBill = true;
        if (response.data.note) {
          this.fieldSelected.noteDetail = response.data.note;
        }
        this.refresh();
      }
    });

    this.refresh();
  };

  handleSearchAllDetailBillCancel = async () => {
    let storeCode = this.fieldSelected.storeCode;
    if (storeCode === '') {
      this.showAlert('Please choose store');
      return false;
    }

    let page = '/storesale/' + storeCode + '/transaction/void';
    let params = {
      start: (this.fieldSelected.starCancel && DateHelper.displayDateFormatMinus(this.fieldSelected.starCancel)) || '',
      date: (this.fieldSelected.dateCancel && DateHelper.displayDateFormatMinus(this.fieldSelected.dateCancel)) || '',
    };

    this.fieldSelected.invoiceBillDetail = '';
    this.fieldSelected.counterF = '';
    this.fieldSelected.employeecodeBillDetail = '';
    this.fieldSelected.methodcodeBill = '';
    this.fieldSelected.customerNumber = '';
    this.fieldSelected.invoiceType = '';
    this.fieldSelected.noteDetail = '';
    this.itemsCancel = [];

    this.sumBill = 0;
    this.sumItemBill = 0;

    this.searchBill = false;

    let model = new ReportingModel();

    await model.getAllReviewSale(page, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.sale) {
          this.detailBillCancel = res.data.sale || [];

          let arrItemsCancel = [];
          let obj = {};

          let result = [...res.data.sale];

          for (let k in result) {
            let item = result[k];

            if (item.items) {
              for (let k2 in item.items) {
                let item2 = item.items[k2];

                if (item2.qty < 0) {
                  let o = {
                    invoiceCode: item.invoiceCode,
                    invoiceDate: item.invoiceDate,
                    employeeCode: item.employeeCode,
                    employeeName: item.employeeName,
                    customerCode: item.customerCode,
                    type: 'item cancel',
                  };
                  Object.assign(o, item2);

                  arrItemsCancel.push(o);
                } else {
                  if (!obj[item.invoiceCode]) {
                    obj[item.invoiceCode] = {
                      invoiceCode: item.invoiceCode,
                      invoiceDate: item.invoiceDate,
                      employeeCode: item.employeeCode,
                      employeeName: item.employeeName,
                      customerCode: item.customerCode,
                      type: 'bill cancel',
                    };

                    let ac = item2;

                    // for (let a in ac) {
                    //     ac[a] = "";
                    // }

                    Object.assign(obj[item.invoiceCode], ac);
                  }
                }
              }
            }
          }

          let ar = Object.values(obj);

          if (ar.length > 0) {
            this.itemsCancel = [].concat(ar, arrItemsCancel);
          }

          this.optFilInvoiceCancel = createListOption(this.detailBillCancel, 'invoiceCode');
          this.optFilEmployeeCancel = createListOption(this.detailBillCancel, 'employeeCode', 'employeeName');
        } else {
          message.error('Empty data!');
        }
      } else {
        // this.showAlert("System busy!");
      }
    });

    let dateDetail =
      (this.fieldSelected.dateCancel && DateHelper.displayDateFormatMinus(this.fieldSelected.dateCancel)) || '';
    model.checkStatusAPIsale(storeCode, dateDetail).then((response) => {
      if (response && response.data && response.data.storeStatus) {
        if (response.data.note) {
          this.fieldSelected.noteDetailCancel = response.data.note;
          this.refresh();
        }
      }
    });

    this.refresh();
  };

  handleReturnStatusInvoiceType = (type) => {
    if (type === 0) {
      return 'Fail';
    }
    if (type === 1) {
      return 'Completed';
    }
    if (type === 3) {
      return 'Refund';
    }
    if (type === 4) {
      return 'Disposal';
    }
  };

  handleFilterBill = (objItems) => {
    let objGroup = {};
    this.total = 0;
    let total = 0;
    let totalBill = 0;

    for (var k in objItems) {
      var item = objItems[k];

      if (
        (this.fieldSelected.invoiceBillDetail === '' || k.indexOf(this.fieldSelected.invoiceBillDetail) !== -1) &&
        (this.fieldSelected.counterF === '' || item.counter.indexOf(this.fieldSelected.counterF) !== -1) &&
        (this.fieldSelected.employeecodeBillDetail === '' ||
          item.employeeCode.toString().indexOf(this.fieldSelected.employeecodeBillDetail) !== -1) &&
        (this.fieldSelected.methodcodeBill === '' || item.listpayments[this.fieldSelected.methodcodeBill]) &&
        (this.fieldSelected.customerNumber === '' ||
          (this.fieldSelected.customerNumber === '0' && item.customerCode === '') ||
          (this.fieldSelected.customerNumber === '1' && item.customerCode !== '')) &&
        (this.fieldSelected.invoiceType === '' ||
          item.invoiceType.toString().indexOf(parseInt(this.fieldSelected.invoiceType)) !== -1)
        // this.isFilterDetailValid(item.listpayment)
      ) {
        objGroup[k] = item;

        totalBill += 1;

        if (this.fieldSelected.methodcodeBill !== '') {
          total += item.listpaymentsValue[this.fieldSelected.methodcodeBill];
        } else {
          for (let key in item.listpaymentsValue) {
            let target = item.listpaymentsValue[key];

            total += target;
          }
        }
      }
    }

    this.total = total;
    this.totalBill = totalBill;

    let ar = [];
    // console.log(this.fieldSelected.action)
    if (this.fieldSelected.action !== '') {
      for (let k in this.resultLog) {
        let item = this.resultLog[k];
        for (let k2 in item.log) {
          let item2 = item.log[k2];
          let typeOpt = this.fieldSelected.action == 5 ? 0 : this.fieldSelected.action;
          if (item2.action == typeOpt) {
            ar.push(item.invoiceCode);
          }
        }
      }
    }
    if (ar.length > 0) {
      let pickedEntries = Object.entries(objGroup).filter(([key]) => ar.includes(key));
      objGroup = Object.fromEntries(pickedEntries);
    } else {
      if (ar.length == 0 && this.fieldSelected.action == 3) {
        message.warning('không tìm thấy hàng xóa');
      }
    }

    this.handleCount(objItems);

    return objGroup;
  };

  handleFilterBillCancel = (lst) => {
    let arr = [];

    arr =
      lst.length > 0 && this.fieldSelected.invoiceBillDetailCancel !== ''
        ? lst.filter((a) => a.invoiceCode === this.fieldSelected.invoiceBillDetailCancel)
        : lst;
    arr =
      arr.length > 0 && this.fieldSelected.employeecodeBillDetailCancel !== ''
        ? arr.filter((a) => a.employeeCode === this.fieldSelected.employeecodeBillDetailCancel)
        : arr;

    return arr;
  };

  // ----------------------------------------------------
  handleSearchSalesbystore = async () => {
    if (this.fieldSelected.startDateSbs === null || this.fieldSelected.startDateSbs === '') {
      this.showAlert('Please choose date for sales by store');
      return false;
    }

    let storeCode = this.fieldSelected.storeCode;

    let params = {
      date: this.fieldSelected.startDateSbs ? DateHelper.displayDateFormatMinus(this.fieldSelected.startDateSbs) : '',
      start: this.fieldSelected.starSbs ? DateHelper.displayDateFormatMinus(this.fieldSelected.starSbs) : '',
    };

    this.dataDetailSbs = [];
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

    let resultModel = new ReportingModel();
    await resultModel.getDataSalesByStoreReview(storeCode, params).then((res) => {
      if (res.status && res.data && res.data.sale) {
        this.dataDetailSbs = res.data.sale || [];

        this.handleSumSaleByStore(this.dataDetailSbs);

        this.refresh();
      } else {
        // this.showAlert("System busy!");
      }
    });
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
    }
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  handleResetLog = () => {
    this.invoiceSelected = '';
    this.itemsLog = [];
  };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.handleResetLog();
      this.refresh();
    }
  };

  renderComp() {
    const fields = this.fieldSelected;

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
      storeOptions.push({ value: this.data.storeCode, label: this.data.storeCode + ' - ' + this.data.storeName });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return { value: stores[key].storeCode, label: stores[key].storeCode + ' - ' + stores[key].storeName };
      });
    }

    // OPTION FILTER
    let objGroupDetailShow = this.handleFilterBill(this.objGroupDetail);

    let optInvoice = Object.keys(this.objFilInvoice).map((key) => {
      return { value: key, label: key };
    });

    let optCounter = Object.keys(this.objCounter)
      .sort()
      .map((key) => {
        return { value: key, label: key };
      });

    let optEmployee = Object.keys(this.objFilEmployee).map((key) => {
      return { value: key, label: this.objFilEmployee[key].label };
    });

    let optMethod = Object.keys(this.objFilPayment).map((key) => {
      return { value: key, label: this.objFilPayment[key].label };
    });

    let optStatusInvoice = Object.keys(this.objStatusInvoice).map((key) => {
      return { value: key, label: this.objStatusInvoice[key].label };
    });

    // Disposal data

    return (
      <div>
        <div>
          <CheckBillItems idComponent={this.idCheckBillItemsComponent} ref={this.idCheckBillItemsComponentRef} />

          <Row className="mrt-10">
            <Col xl={12}>
              <div className="tt-tbtab" style={{ padding: 0, backgroundColor: 'transparent' }}>
                <button
                  className="btn-title-sub-tab active"
                  style={{ background: 'linear-gradient(180deg, rgb(0, 154, 255), transparent)' }}
                  onClick={(e) => changeTab('detail-sub-tab', 'reporting-sub-detail', e, 'btn-title-sub-tab')}
                >
                  Detail
                </button>
                <button
                  className="btn-title-sub-tab"
                  style={{ background: 'linear-gradient(180deg, rgb(0,212,233), transparent)' }}
                  onClick={(e) => changeTab('detail-sub-tab', 'reporting-sub-cancel', e, 'btn-title-sub-tab')}
                >
                  Cancel
                </button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <label htmlFor="storeCode" className="w100pc">
                Store:
                <SelectBox
                  data={storeOptions}
                  func={this.updateFilter}
                  funcCallback={() => this.onChangeStoreCode(fields.storeCode)}
                  keyField={'storeCode'}
                  defaultValue={fields.storeCode}
                  isMode={''}
                />
              </label>
            </Col>
          </Row>
          <Row>
            <Col xl={24}>
              <div id="reporting-sub-detail" className="detail-sub-tab">
                <Row gutter={16} className="mrt-10">
                  <Col xl={24}>
                    <div className="section-block">
                      <Row gutter={16}>
                        <Col xl={6}>
                          <label htmlFor="dateGroup" className="w100pc">
                            Date:
                            <div>
                              <DatePickerComp
                                date={fields.dateGroup}
                                minDate={decreaseDate(62)}
                                maxDate={decreaseDate(1)}
                                func={this.updateFilter}
                                keyField={'dateGroup'}
                              />
                            </div>
                          </label>
                        </Col>
                        <Col xl={6}>
                          <label className="w100pc">&nbsp;</label>
                          <Space size={'small'}>
                            <button
                              onClick={this.handleSearchAllDetailBill}
                              type="button"
                              className="btn btn-danger h-30"
                            >
                              Search
                            </button>

                            <button onClick={this.handleExportDetailBill} type="button" className="btn btn-danger h-30">
                              Export
                            </button>
                          </Space>
                        </Col>
                        {/* <Col xl={12}>
                                                    <Row gutter={16}>
                                                        <Col>
                                                            <label htmlFor="methodcode" className="w100pc">
                                                                Gross sales:
                                                            </label>
                                                            <strong>{StringHelper.formatQty(this.total) || 0}</strong>
                                                        </Col>
                                                        {
                                                            this.fieldSelected.noteDetail !== "" ?
                                                                <Col>
                                                                    <div className="bg-note cl-red">
                                                                        {this.fieldSelected.noteDetail}
                                                                    </div>
                                                                </Col> : null
                                                        }

                                                      
                                                    </Row>

                                                </Col> */}
                        <Col xl={12}>
                          <Row gutter={16}>
                            {this.fieldSelected.noteDetail !== '' ? (
                              <Col>
                                <div className="bg-note cl-red">{this.fieldSelected.noteDetail}</div>
                              </Col>
                            ) : (
                              <>
                                {this.searchBill ? (
                                  <>
                                    <Col>
                                      <label htmlFor="methodcode" className="w100pc">
                                        Gross sales:
                                      </label>
                                      <strong>{StringHelper.formatQty(this.total) || 0}</strong>
                                    </Col>
                                    <Col>
                                      <label htmlFor="methodcode" className="w100pc">
                                        Canceled bill:
                                      </label>
                                      <strong>{StringHelper.formatQty(this.countBillCancel)}</strong>
                                    </Col>
                                    <Col>
                                      <label htmlFor="methodcode" className="w100pc">
                                        - items/bill:
                                      </label>
                                      <strong>{StringHelper.formatQty(this.countBillTru)}</strong>
                                    </Col>
                                  </>
                                ) : null}
                              </>
                            )}
                          </Row>
                        </Col>
                      </Row>

                      <Row gutter={16} className="mrt-10">
                        <Col xl={6}>
                          <label htmlFor="invoiceBillDetail" className="w100pc">
                            Invoice code:
                            <SelectBox
                              data={optInvoice}
                              func={this.updateFilter}
                              funcCallback={() => (this.fieldSelected.pageDetail = 1)}
                              keyField={'invoiceBillDetail'}
                              defaultValue={fields.invoiceBillDetail}
                              isMode={''}
                            />
                          </label>
                        </Col>
                        <Col xl={6}>
                          <label htmlFor="employeecodeBillDetail" className="w100pc">
                            Employee:
                            <SelectBox
                              data={optEmployee}
                              func={this.updateFilter}
                              funcCallback={() => (this.fieldSelected.pageDetail = 1)}
                              keyField={'employeecodeBillDetail'}
                              defaultValue={fields.employeecodeBillDetail}
                              isMode={''}
                            />
                          </label>
                        </Col>
                        <Col xl={6}>
                          <label htmlFor="methodcodeBill" className="w100pc">
                            Method:
                            <SelectBox
                              data={optMethod}
                              func={this.updateFilter}
                              funcCallback={() => (this.fieldSelected.pageDetail = 1)}
                              keyField={'methodcodeBill'}
                              defaultValue={fields.methodcodeBill}
                              isMode={''}
                            />
                          </label>
                        </Col>
                        <Col xl={6}>
                          <label htmlFor="customerNumber" className="w100pc">
                            Customer:
                            <SelectBox
                              data={this.optCustomer}
                              func={this.updateFilter}
                              funcCallback={() => (this.fieldSelected.pageDetail = 1)}
                              keyField={'customerNumber'}
                              defaultValue={fields.customerNumber}
                              isMode={''}
                            />
                          </label>
                        </Col>
                        <Col xl={6}>
                          <label htmlFor="counterF" className="w100pc">
                            Counter:
                            <SelectBox
                              data={optCounter}
                              func={this.updateFilter}
                              funcCallback={() => (this.fieldSelected.pageDetail = 1)}
                              keyField={'counterF'}
                              defaultValue={fields.counterF}
                              isMode={''}
                            />
                          </label>
                        </Col>
                        <Col xl={6}>
                          <label htmlFor="invoiceType" className="w100pc">
                            Status:
                            <SelectBox
                              data={optStatusInvoice}
                              func={this.updateFilter}
                              funcCallback={() => (this.fieldSelected.pageDetail = 1)}
                              keyField={'invoiceType'}
                              defaultValue={fields.invoiceType}
                              isMode={''}
                            />
                          </label>
                        </Col>
                        {/* <Col xl={6}>
                                        <label htmlFor="actionType" className="w100pc">
                                            Item action:
                                            <SelectBox data={optItemAction} func={this.updateFilter} funcCallback={() => this.fieldSelected.pageDetail = 1} keyField={'action'} defaultValue={fields.action} isMode={''} />
                                        </label>
                                    </Col> */}
                      </Row>
                    </div>
                  </Col>
                </Row>

                <Row className="mrt-10">
                  <Col xl={24}>
                    <TableListDetailBill
                      updateFilter={this.updateFilter}
                      page={fields.pageDetail}
                      objItems={objGroupDetailShow}
                      checkBill={this.handleCheckBill}
                      isShowLog={false}
                    />
                  </Col>
                </Row>
              </div>

              <div id="reporting-sub-cancel" className="row detail-sub-tab d-none">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-3 col-lg-2">
                      <div className="form-group">
                        <label className="w100pc">Start date:</label>
                        <DatePicker
                          placeholderText="Start date"
                          selected={this.fieldSelected.starCancel}
                          onChange={(value) => this.handleChangeFieldCustom('starCancel', value)}
                          dateFormat="dd/MM/yyyy"
                          maxDate={decreaseDate(1, this.fieldSelected.dateCancel)}
                          minDate={decreaseDate(60, this.fieldSelected.dateCancel)}
                          className="form-control"
                          autoComplete="off"
                          isClearable={this.fieldSelected.starCancel ? true : false}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-2">
                      <div className="form-group">
                        <label className="w100pc">Date:</label>
                        <DatePicker
                          placeholderText="Start date"
                          selected={this.fieldSelected.dateCancel}
                          onChange={(value) => this.handleChangeFieldCustom('dateCancel', value)}
                          maxDate={decreaseDate(1)}
                          minDate={decreaseDate(60)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="w100pc op-0">.</label>
                      <Space size={'small'}>
                        <button
                          onClick={this.handleSearchAllDetailBillCancel}
                          type="button"
                          className="btn btn-danger"
                          style={{ height: '38px' }}
                        >
                          Search
                        </button>

                        <button
                          onClick={() => handleExportAutoField(this.itemsCancel, 'exportItemCancel')}
                          type="button"
                          className="btn btn-danger"
                          style={{ height: '38px', marginRight: 0 }}
                        >
                          Export
                        </button>
                      </Space>
                    </div>

                    {this.fieldSelected.noteDetailCancel !== '' ? (
                      <div className="col-md-3">
                        <div className="bg-note cl-red">{this.fieldSelected.noteDetailCancel}</div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-3 col-lg-3">
                      <label htmlFor="invoiceBillDetailCancel" className="w100pc">
                        Invoice code
                      </label>
                      <Select
                        isClearable
                        classNamePrefix="select"
                        name="invoiceBillDetailCancel"
                        maxMenuHeight={260}
                        placeholder="--"
                        value={this.optFilInvoiceCancel.filter(
                          (option) => option.value === this.fieldSelected.invoiceBillDetailCancel
                        )}
                        options={this.optFilInvoiceCancel}
                        onChange={(e) => this.handleChangeFieldCustom('invoiceBillDetailCancel', e ? e.value : '')}
                      />
                    </div>

                    <div className="col-md-3 col-lg-3">
                      <div className="form-group">
                        <label htmlFor="employeecodeBillDetailCancel" className="w100pc">
                          Employee
                        </label>

                        <Select
                          isClearable
                          classNamePrefix="select"
                          name="employeecodeBillDetailCancel"
                          maxMenuHeight={260}
                          placeholder="--"
                          value={this.optFilEmployeeCancel.filter(
                            (option) => option.value === this.fieldSelected.employeecodeBillDetailCancel
                          )}
                          options={this.optFilEmployeeCancel}
                          onChange={(e) =>
                            this.handleChangeFieldCustom('employeecodeBillDetailCancel', e ? e.value : '')
                          }
                        />
                      </div>
                    </div>

                    {/* <div className="col-md-4">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="bg-block">
                                                                    <h5 className="mrt-0 text-center">Total bill:</h5>
                                                                    <div className=" text-center" style={{fontWeight:'bold',color:'chocolate'}}>{StringHelper.formatValue(this.sumBill)}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="bg-block">
                                                                    <h5 className="mrt-0 text-center">Total item:</h5>
                                                                    <div className=" text-center" style={{fontWeight:'bold',color:'chocolate'}}>{StringHelper.formatValue(this.sumItemBill)}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <TableListDetailBillCancel items={this.handleFilterBillCancel(this.detailBillCancel)} />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <div
            id="content-updating"
            className="detail-tab row d-none pos-absolute"
            style={{ width: '100%', height: '100%', top: 0, bottom: 0, background: 'white' }}
          >
            <h6 className="cl-red pos-relative" style={{ padding: '0 15px' }}>
              Dữ liệu đang được cập nhật, vui lòng quay lại sau.{' '}
              <button onClick={() => super.back('/')} type="button" className="btn btn-back">
                Back
              </button>
            </h6>
          </div>
        </div>
      </div>
    );
  }
}
