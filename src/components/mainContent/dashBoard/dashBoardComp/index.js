import BaseComponent from 'components/BaseComponent';
import React from 'react';
import {
  faChartPie,
  faExternalLinkAlt,
  faFileAlt,
  faHourglassHalf,
  faLock,
  faMoneyBill,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Row, Space, Spin } from 'antd';
import IconProduct from 'images/logo.png';
import DateHelper from 'helpers/DateHelper';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { decreaseDate } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';
import AreaChart from 'components/mainContent/dashBoard/dashBoardComp/areaChartComp';
import CustomStackColumnLineComp from 'components/mainContent/dashBoard/dashBoardComp/customStackColumnLine';
import PieChartComp from 'components/mainContent/dashBoard/dashBoardComp/pieChartComp';
import EstimateStockTab from 'components/mainContent/dashBoard/items/estimateStockTabPending';
import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';
import ModelGroupStore from 'modelComponent/ModelGroupStore';
import CheckboxComp from 'utils/checkbox';
import TableComp from 'utils/table';
import CONSTANT from '../../../../constant';

export default class DashBoardMain extends BaseComponent {
  constructor(props) {
    super(props);

    this.data.stores = [];

    this.data.LastSaleDay = {};
    this.data.LastSaleDay3Days = {};
    this.data.LastSaleDay7Days = {};
    this.summary = [];
    this.summaryCurrent = {
      grossSales: 0,
      customerCount: 0,
      billCount: 0,
      qty: 0,
      waitRcv: 0,
      lockPo: 0,
    };
    this.yesterdayKey = DateHelper.getDateKey(decreaseDate(1));

    this.fieldSelected = this.assignFieldSelected({}, ['storeCode']);

    this.isRunActiveClass = false;
    this.isActiveSale = 14;
    this.result = [];
    this.resultFilter = [];

    this.dataOrderByChannel = [];

    this.storeCheckList = {};
    this.storeCheckList.storeCode = this.fieldSelected.storeCode;
    this.storeCheckList['06-14'] = false;
    this.storeCheckList['14-22'] = false;
    this.storeCheckList['22-06'] = false;

    this.newItems = [];
    this.dataTableAdd = [];
    this.dataADS = [];
    this.dataADS1 = [];
    this.dataADS2 = [];

    this.groupPendingFloatBtn = [];
    this.groupLockFloatBtn = [];
    this.objPending = {};
    this.objLock = {};
    this.data.pending = [];
    this.data.locked = [];
    this.itemReportPending = [];
    this.itemReportLock = [];
    this.url = 'https://gs25.com.vn/';
    this.isRender = false;
  }

  componentDidMount() {
    this.handleCheckStatus([
      this.handleGetStore,
      this.handleGetCurrentSale,
      this.handleGetSummary,
      this.handleSearchSalesbyCategory,
      this.handleGetStoreCheckList,
      this.handleGetNewItemOrder,
      this.handleGetAdsCate,
      this.handleGetListWaiting,
    ]);
  }

  handleCheckStatus = async (arrfunc) => {
    let storeCode = this.fieldSelected.storeCode;
    let date = DateHelper.displayDateFormatMinus(decreaseDate(1));
    if (arrfunc) {
      for (let i in arrfunc) {
        arrfunc[i]();
      }
    }
  };

  handleGetStoreCheckList = async (storeCode = this.fieldSelected.storeCode) => {
    this.storeCheckList = {};
    this.storeCheckList.storeCode = storeCode;
    this.storeCheckList['06-14'] = false;
    this.storeCheckList['14-22'] = false;
    this.storeCheckList['22-06'] = false;

    let params = {
      storeCode,
      // date: DateHelper.displayDateFormatMinus(new Date())
      date: DateHelper.displayDateFormatMinus(decreaseDate(1)),
    };

    let page = 'storechecklist';

    let model = new ReportingModel();
    if (storeCode !== '') {
      await model.getListByPage(page, params).then((res) => {
        if (res.status && res.data) {
          let objs = {};

          for (let index in res.data) {
            let item = res.data[index];
            if (!objs[item.storeCode]) {
              objs[item.storeCode] = {};
              objs[item.storeCode].storeCode = item.storeCode;
              objs[item.storeCode]['06-14'] =
                new Date(item.createdDate).getHours() >= 6 && new Date(item.createdDate).getHours() < 14 ? true : false;
              objs[item.storeCode]['14-22'] =
                new Date(item.createdDate).getHours() >= 14 && new Date(item.createdDate).getHours() < 22
                  ? true
                  : false;
              objs[item.storeCode]['22-06'] =
                (new Date(item.createdDate).getHours() >= 22 && new Date(item.createdDate).getHours() <= 24) ||
                (new Date(item.createdDate).getHours() >= 0 && new Date(item.createdDate).getHours() < 6)
                  ? true
                  : false;
            }
          }

          this.storeCheckList = Object.values(objs)[0];
          this.refresh();
        }
      });
    }
  };

  handleGetNewItemOrder = (storeCode = this.fieldSelected.storeCode) => {
    let model = new ReportingModel();
    let store = storeCode;
    let page = 'newitem';

    this.dataTableAdd = [];

    model.getDataStoreCurrent(store, page).then((res) => {
      if (res.status && res.data) {
        if (res.data.sale) {
          let arr = [];
          for (let key in res.data.sale) {
            let item = res.data.sale[key];

            if (!item.itemCode) {
              item.key = parseInt(key) + 1;
              item.itemCode = item.code;
              item.itemName = item.name;
              item.isNew = true;
              item.subCategory = item.subCategoryCode;
            }

            arr.push(item);
          }

          this.dataTableAdd = arr.sort((a, b) => b.itemQty - a.itemQty);
        }

        this.refresh();
      }
    });
  };

  hanldeGetExportNewItemDetail = async () => {
    const fields = this.fieldSelected;

    let storeCode = fields.storeCode;
    let page = 'newitemstore';

    let arr = [];

    let model = new ReportingModel();
    await model.getDataStoreCurrent(storeCode, page).then((res) => {
      if (res.status && res.data) {
        let objs = res.data.sale;

        for (let key in objs) {
          let item = objs[key];

          for (let i in item) {
            let el = {};
            el = { itemCode: item[i].code, itemName: item[i].name, ...item[i] };

            let target = {};
            target = { storeCode: key, ...el };
            delete target.itemID;
            delete target.code;
            delete target.name;
            delete target.divisionCode;
            delete target.divisionName;
            delete target.categoryCode;
            delete target.categoryName;
            delete target.subCategoryCode;
            delete target.subCategoryName;
            delete target.supplierCode;
            delete target.supplierName;
            delete target.costPrice;
            delete target.salePrice;
            delete target.moq;
            delete target.mov;
            delete target.orderDays;
            delete target.grossSales;
            delete target.netSales;
            delete target.itemDiscount;
            delete target.unitPrice;
            delete target.vatAmount;
            arr.push(target);
          }
        }

        handleExportAutoField(
          arr.sort(function (a, b) {
            return a.storeCode === b.storeCode ? 0 : a.storeCode > b.storeCode ? 1 : -1;
          }),
          'newItemLauchingExportDetail'
        );
      }
    });
  };

  handleGetAdsCate = async (storeCode = this.fieldSelected.storeCode) => {
    let arr = [];
    let params = {
      date: DateHelper.displayDateFormatMinus(decreaseDate(1)),
      top: 30,
    };

    let model = new ReportingModel();
    model.getInfoReport('/category/top/weekly', storeCode, params).then((res) => {
      if (res.status && res.data) {
        arr = res.data.sale || [];

        let data1 = {};
        let data2 = {};

        for (let index in arr) {
          let item = arr[index];

          if (!data1[item.categoryCode] && index < 30) {
            data1[item.categoryCode] = {};
            data1[item.categoryCode].name = item.categoryName;
            data1[item.categoryCode].type = item.categoryName;
            // data1[item.categoryCode].grossSales = item.grossSales;
            data1[item.categoryCode].value = item.grossSales;
            data1[item.categoryCode].qty = item.itemQty;
          }
          if (!data2[item.categoryCode] && index < 30) {
            data2[item.categoryCode] = {};
            data2[item.categoryCode].name = item.categoryName;
            data2[item.categoryCode].qty = item.itemQty;
          }
        }

        this.dataADS = Object.values(data1);
        this.dataADS1 = Object.values(data1);
        this.dataADS2 = Object.values(data2);
        this.refresh();
      }
    });
  };

  handleGetStore = async () => {
    if (this.fieldSelected.storeCode !== '') {
      return;
    }
    let commonModel = new CommonModel();
    await commonModel.getDataV2('storeuser').then((res) => {
      if (res.status) {
        this.data.stores = res.data.stores || [];
      }
      // this.refresh();
    });
  };

  handleGetSummary = async (storeCode = this.fieldSelected.storeCode) => {
    this.data.LastSaleDay = {};
    this.data.LastSaleDay3Days = {};
    this.data.LastSaleDay7Days = {};
    this.data.LastSaleDay14Days = {};
    this.summary = [];

    let params = {
      date: DateHelper.displayDateFormatMinus(decreaseDate(1)),
      start: DateHelper.displayDateFormatMinus(decreaseDate(22)),
    };

    let model = new ReportingModel();
    await model.getInfoReport('/summary', storeCode, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.sale) {
          var result = res.data.sale.sort((a, b) => b.dateKey - a.dateKey);

          var dateStepChartdays = 1;
          var max = 28;
          while (max > 0) {
            var dateCaldays = decreaseDate(dateStepChartdays);

            var dateKeydays = DateHelper.getDateKey(dateCaldays);
            this.data.LastSaleDay[dateKeydays] = {
              totalSale: 0,
              date: DateHelper.displayDateFormat(dateKeydays),
              customer: 0,
              billCount: 0,
            };
            dateStepChartdays += 1;

            max--;
          }

          for (var i = 0; i < result.length; i++) {
            var item = result[i];

            if (this.summary[item.dateKey] === undefined) {
              this.summary[item.dateKey] = item;
            }

            if (i < 14) {
              if (this.data.LastSaleDay[item.dateKey] !== undefined) {
                this.data.LastSaleDay[item.dateKey].totalSale = item.grossSales;
                this.data.LastSaleDay[item.dateKey].customer = item.customerCount;
                this.data.LastSaleDay[item.dateKey].billCount = item.billCount;

                if (i < 3) {
                  if (!this.data.LastSaleDay3Days[item.dateKey]) {
                    this.data.LastSaleDay3Days[item.dateKey] = {};
                    this.data.LastSaleDay3Days[item.dateKey].totalSale = item.grossSales;
                    this.data.LastSaleDay3Days[item.dateKey].customer = item.customerCount;
                    this.data.LastSaleDay3Days[item.dateKey].billCount = item.billCount;
                    this.data.LastSaleDay3Days[item.dateKey].date = this.data.LastSaleDay[item.dateKey].date;
                  }
                }
                if (i < 7) {
                  if (!this.data.LastSaleDay7Days[item.dateKey]) {
                    this.data.LastSaleDay7Days[item.dateKey] = {};
                    this.data.LastSaleDay7Days[item.dateKey].totalSale = item.grossSales;
                    this.data.LastSaleDay7Days[item.dateKey].customer = item.customerCount;
                    this.data.LastSaleDay7Days[item.dateKey].billCount = item.billCount;
                    this.data.LastSaleDay7Days[item.dateKey].date = this.data.LastSaleDay[item.dateKey].date;
                  }
                }
                if (!this.data.LastSaleDay14Days[item.dateKey]) {
                  this.data.LastSaleDay14Days[item.dateKey] = {};
                  this.data.LastSaleDay14Days[item.dateKey].totalSale = item.grossSales;
                  this.data.LastSaleDay14Days[item.dateKey].customer = item.customerCount;
                  this.data.LastSaleDay14Days[item.dateKey].billCount = item.billCount;
                  this.data.LastSaleDay14Days[item.dateKey].date = this.data.LastSaleDay[item.dateKey].date;
                }
              }
            }
          }
        }
      } else {
        this.showAlert(res.message);
      }
      // this.refresh();
    });
  };

  handleSearchSalesbyCategory = async (storeCode = this.fieldSelected.storeCode) => {
    let params = {
      date: DateHelper.displayDateFormatMinus(new Date()),
      top: 30,
    };

    let result = [];
    this.result = [];

    let model = new ReportingModel();
    if (storeCode === '') {
      let page = '/realtimesale/store/transaction/item';
      await model.getAllReviewSale(page, params).then((res) => {
        if (res.status && res.data) {
          result = res.data.sale || [];
          this.resultFilter = result.filter((el) => el.itemQty !== 0);

          this.refresh();
        } else {
          this.showAlert(res.message);
        }
      });
    } else {
      await model.getDataStoreCurrent(storeCode, 'transaction/item', params).then((res) => {
        if (res.status && res.data) {
          result = res.data.sale || [];
          this.resultFilter = result.filter((el) => el.itemQty !== 0);

          this.refresh();
        } else {
          this.showAlert(res.message);
        }
      });
    }
  };

  hanldeActiveLastSale = (e, name, days) => {
    if (this.isRunActiveClass) {
      return;
    }
    this.isRunActiveClass = true;
    let elm = document.querySelectorAll('.' + name);
    elm.forEach((el) => {
      if (el.classList.contains('active')) el.classList.remove('active');
    });
    e.target.closest('.' + name).classList.add('active');

    this.isActiveSale = days;
    this.isRunActiveClass = false;
    this.refresh();
  };

  handleGetCurrentSale = async (store = this.fieldSelected.storeCode) => {
    let date = DateHelper.displayDateFormatMinus(new Date());
    let model = new ReportingModel();

    await model.checkStatusAPIsale(store, date).then((res) => {
      if (res.status && res.data.storeStatus) {
        let fnIsRun = async () => {
          await this.handleGetData();
        };

        fnIsRun();
      }
    });
  };

  handleGetData = async (storeCode) => {
    let page = '';
    let params = {
      date: new Date() || '',
    };
    if (localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).isGetAllStore) {
      page = '/realtimesale/store/transaction/summary';
      await this.handleChartDetail(page, params);
    } else if (storeCode) {
      page = '/realtimestoresale/' + storeCode + '/transaction/summary2';
      await this.handleFunctionCallApiOneStore(page, params);
    }
  };

  handleFunctionCallApiOneStore = async (page, params) => {
    let model = new ReportingModel();
    await model.getAllReviewSale(page, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.sale) {
          let arr = res.data.sale || [];

          for (let i in arr) {
            let item = arr[i];
            this.summaryCurrent.grossSales += item.grossSales;
            this.summaryCurrent.customerCount += item.customerCount;
            this.summaryCurrent.billCount += item.billCount;
            this.summaryCurrent.qty += item.qty;
          }
          this.refresh();
        }
      } else {
        this.showAlert('API connect fail');
      }
    });
  };

  handleChartDetail = async (page, params) => {
    let model = new ReportingModel();
    let obj = {};
    this.summaryCurrent = {
      grossSales: 0,
      customerCount: 0,
      billCount: 0,
      qty: 0,
    };

    await model.getAllReviewSale(page, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.sale) {
          let arr = res.data.sale || [];

          for (let i in arr) {
            let item = arr[i];
            this.summaryCurrent.grossSales += item.grossSales;
            this.summaryCurrent.customerCount += item.customerCount;
            this.summaryCurrent.billCount += item.billCount;
            this.summaryCurrent.qty += item.qty;
          }
          this.refresh();
        }
      } else {
        this.showAlert('API connect fail');
      }
    });
  };

  handleGetListWaiting = (storeCode = this.fieldSelected.storeCode) => {
    this.summaryCurrent.waitRcv = 0;
    this.summaryCurrent.lockPo = 0;
    this.data.pending = [];
    this.data.locked = [];

    let paramsPending = {
      type: 'estimatedatapending',
      storeCode,
      itemCode: '',
    };
    let modelPending = new ReportingModel();
    modelPending.getEstimateStock(paramsPending).then((res) => {
      if (res.status && res.data) {
        if (res.data) {
          if (res.data.pending) {
            let num = 0;
            res.data.pending.forEach((el) => {
              num++;
            });

            this.summaryCurrent.waitRcv = num;
            this.refresh();
          }
          if (res.data.pending) {
            this.data.pending = res.data.pending === '' ? [] : res.data.pending;
            let num = 0;
            this.data.pending.forEach((el) => {
              num++;
            });
            this.fieldSelected.countNumPending = num;

            this.handleListType(this.data.pending, 'pending');
          }
        }
      } else {
        // this.showAlert("System busy!");
      }
    });

    let paramsLock = {
      type: 'estimatedatalock',
      storeCode: this.fieldSelected.storeCode,
      itemCode: '',
    };
    let modelLock = new ReportingModel();
    modelLock.getEstimateStock(paramsLock).then((res) => {
      if (res.status && res.data) {
        if (res.data) {
          if (res.data.locked) {
            this.data.locked = res.data.locked === '' ? [] : res.data.locked;
            let num = 0;
            res.data.locked.forEach((el) => {
              num++;
            });

            this.summaryCurrent.lockPo = num;
            this.refresh();

            this.handleListType(this.data.locked, 'lock');
          }
        }
      } else {
        // this.showAlert("System busy!");
      }
    });
    this.isRender = true;
    this.refresh();
  };

  handleReturnData = (objs, name) => {
    let arr = [];
    for (let i in objs) {
      let item = objs[i];
      let newOb1 = {
        date: DateHelper.displayDateDateMonth(item.date),
        value: item[name],
        type: name,
      };

      arr.push(newOb1);
    }

    return arr;
  };

  returnDataTopCate = (arr, top) => {
    let newArr = [];
    let obj = {};
    for (let i in arr) {
      let item = arr[i];
      if (!obj[item.categoryCode]) {
        obj[item.categoryCode] = {};
        obj[item.categoryCode].type = item.categoryName;
        obj[item.categoryCode].value = 0;
      }
      obj[item.categoryCode].value += item.itemQty;
    }
    let abc = Object.values(obj);

    newArr = abc.slice(0, top);
    return newArr;
  };

  handleListType = (arr, type) => {
    if (arr) {
      arr &&
        arr.forEach((element) => {
          if (type === 'pending') {
            if (!this.groupPendingFloatBtn.includes(element.type)) {
              this.groupPendingFloatBtn.push(element.type);
            }
          }

          if (type === 'lock') {
            if (!this.groupLockFloatBtn.includes(element.type)) {
              this.groupLockFloatBtn.push(element.type);
            }
          }
        });

      if (type === 'pending') {
        let result = arr.reduce(function (r, a) {
          let key = a.type;
          r[key] = r[key] || [];
          r[key].push(a);
          return r;
        }, Object.create(null));

        this.objPending = result;
      }

      if (type === 'lock') {
        let resultLock = arr.reduce(function (r, a) {
          let key = a.type;
          r[key] = r[key] || [];
          r[key].push(a);
          return r;
        }, Object.create(null));

        this.objLock = resultLock;
      }
    } else {
      this.objPending = [];
      this.objLock = [];
      this.groupPendingFloatBtn = [];
      this.groupLockFloatBtn = [];
    }
    this.refresh();
  };

  handleClickFloatingBtn = (id) => {
    if (id === this.idTabLockComponent) {
      if (this.data.locked && this.data.locked.length <= 0) {
        this.showAlert('No items are locked');
        return;
      }
    }

    if (id === this.idTabPendingComponent) {
      if (this.data.pending && this.data.pending.length <= 0) {
        this.showAlert('No items are pending');
        return;
      }
    }

    this.handleShowPp(id);
  };
  hanldeWeather = () => {
    let js = document.createElement('script');
    let fjs = document.getElementsByTagName('script')[0];
    js.id = 'weatherwidget-io-js';
    js.src = 'https://weatherwidget.io/js/widget.min.js';
    fjs.parentNode.insertBefore(js, fjs);
  };

  compWeather = () => {
    return (
      <a
        className="weatherwidget-io"
        href="https://forecast7.com/en/10d82106d63/ho-chi-minh-city/"
        data-label_1="HỒ CHÍ MINH"
        data-label_2="WEATHER"
        data-theme="original"
        data-icons="Climacons Animated"
        // data-mode="Current"
        // data-days="3"
      >
        HỒ CHÍ MINH WEATHER
      </a>
    );
  };
  renderComp() {
    const iframe = '<iframe src="' + this.url + '" style="width: 100%;" ></iframe>';

    const data14daysSale = this.handleReturnData(this.data.LastSaleDay14Days, 'totalSale');
    const data14daysCustomer = this.handleReturnData(this.data.LastSaleDay14Days, 'customer');

    const data7daysSale = this.handleReturnData(this.data.LastSaleDay7Days, 'totalSale');
    const data7daysCustomer = this.handleReturnData(this.data.LastSaleDay7Days, 'customer');

    const data3daysSale = this.handleReturnData(this.data.LastSaleDay3Days, 'totalSale');
    const data3daysCustomer = this.handleReturnData(this.data.LastSaleDay3Days, 'customer');

    const dataLastSales =
      this.isActiveSale === 14 ? data14daysSale : this.isActiveSale === 7 ? data7daysSale : data3daysSale;
    const dataLastCustomer =
      this.isActiveSale === 14 ? data14daysCustomer : this.isActiveSale === 7 ? data7daysCustomer : data3daysCustomer;

    let dataTopSalesCate = this.returnDataTopCate(
      this.resultFilter.sort((a, b) => b.itemQty - a.itemQty),
      30
    );

    dataTopSalesCate.sort((a, b) => b.value - a.value);

    let dataOrderByChannel = this.dataOrderByChannel;

    this.dataCICOcurrent = [
      {
        title: DateHelper.displayDate(new Date()),
        ranges: [100],
        measures: [30, 50],
        target: 100,
      },
    ];

    this.dataCICOyesterday = [
      {
        title: DateHelper.displayDate(decreaseDate(1)),
        ranges: [100],
        measures: [30, 50],
        target: 100,
      },
    ];

    // STORE START
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
    // STORE END

    let storeCheckList = this.storeCheckList || {};
    // https://api.gs25.com.vn:8091/ext/media/item/image/8852001831075.jpg?w=400&h=400
    const columnsTableAdd = [
      {
        title: 'New item lauching (14 days)',
        dataIndex: 'itemCode',
        key: 'itemCode',
        align: 'left',
        colSpan: 3,
        width: 120,
        render: (val) => (
          <div className="pos-relative">
            <b>{val.split(',')[0]} </b>
          </div>
        ),
      },
      {
        title: '',
        dataIndex: 'itemCode',
        key: 'itemCode',
        align: 'center',
        colSpan: 0,
        width: 60,
        render: (val) => (
          <div className="">
            <span
              className="d-inline-block pos-relative br-2 pd-2"
              style={{ width: 35, height: 35, background: '#e6f0ff' }}
            >
              <img
                src={val ? `${process.env.REACT_APP_API_EXT_MEDIA_GET}/item/image/${val}.jpg?w=50&h=50` : IconProduct}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = IconProduct;
                }}
                alt={'Item'}
                width={'100%'}
                className="d-inline-block pos-absolute"
                style={{ verticalAlign: 'text-bottom', left: 0, top: '50%', transform: 'translate(0px,-50%)' }}
              />
            </span>
          </div>
        ),
      },
      {
        title: '',
        dataIndex: 'itemName',
        key: 'itemName',
        colSpan: 0,
        align: 'left',
        ellipsis: true,
      },
      {
        title: 'Supplier',
        dataIndex: 'supplierName',
        key: 'supplierName',
        align: 'left',
        // width: '27%',
        ellipsis: true,
      },
      {
        title: 'Qty sell',
        dataIndex: 'itemQty',
        key: 'itemQty',
        align: 'right',
        // width: '27%',
        ellipsis: true,
        render: (val) => StringHelper.formatValue(val),
      },
      {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        align: 'center',
      },
    ];

    let dataTableAdd = this.dataTableAdd;

    let dataADS = this.dataADS;
    let dataADS1 = this.dataADS1;
    let dataADS2 = this.dataADS2;

    return (
      <section className="dashboard-wrapper mt-0">
        <div className="dashboard-weather w-full m-auto">
          {this.compWeather()}
          {this.hanldeWeather()}
        </div>
        {localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).isGetAllStore ? null : (
          <>
            <div className="section-block mt-10">
              <Row>
                <Col lg={24} xl={7}>
                  <div className="text-left" style={{ padding: '5px 10px' }}>
                    <ModelGroupStore
                      groupStore={this.fieldSelected.storeCode}
                      allowClear={false}
                      setGroupStore={(val) => {
                        // Nếu không được phép get all store thì lấy theo từng store code
                        console.log({ val });
                        if (
                          localStorage.getItem('profile') &&
                          !JSON.parse(localStorage.getItem('profile')).isGetAllStore
                        ) {
                          if (val) {
                            this.handleGetData(val);
                            this.handleGetCurrentSale(val);
                            this.handleGetSummary(val);
                            this.handleSearchSalesbyCategory(val);
                            this.handleGetNewItemOrder(val);
                            this.handleGetAdsCate(val);
                            this.handleGetListWaiting(val);
                          }
                        }
                        this.fieldSelected.storeCode = val;
                        // this.handleGetStoreCheckList(true);
                        this.handleGetStoreCheckList(val);
                        this.refresh();
                      }}
                      title={'Apply Store'}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div className="section-block mt-10 flex gap-10 items-center">
              <p className="m-0">Store check list:</p>
              <Row gutter={16} className="flex-1">
                <Col lg={8} xl={8}>
                  <CheckboxComp
                    checked={storeCheckList['06-14'] || false}
                    disabled={true}
                    label="06:00 - 14:00 hours"
                  />
                </Col>
                <Col lg={8} xl={8}>
                  <CheckboxComp
                    checked={storeCheckList['14-22'] || false}
                    disabled={true}
                    label="14:00 - 22:00 hours"
                  />
                </Col>
                <Col lg={8} xl={8}>
                  <CheckboxComp
                    checked={storeCheckList['22-06'] || false}
                    disabled={true}
                    label="22:00 - 06:00 hours"
                  />
                </Col>
              </Row>
            </div>
          </>
        )}
        <Row gutter={[8, 8]} className="mrt-10 wiki_el">
          <Col flex="auto" className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.CURRENT_SALE}>
            <div className="statistics-card pos-relative">
              <div className="statistics-card__icon statistics-card__icon--blue">
                <FontAwesomeIcon icon={faMoneyBill} />
              </div>
              <p className="statistics-card__info statistics-card__info--blue">
                {StringHelper.formatValue(this.summaryCurrent.grossSales)}
              </p>
              <h3 className="statistics-card__title ">Current sales</h3>
            </div>
          </Col>
          {/* <Col xl={4} xxl={3}> */}
          <Col flex="auto" className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.TOTAL_MEMBERS}>
            <div className="statistics-card pos-relative">
              <div className="statistics-card__icon statistics-card__icon--blue">
                <FontAwesomeIcon icon={faUserFriends} />
              </div>
              <p className="statistics-card__info statistics-card__info--blue">
                {StringHelper.formatValue(this.summaryCurrent.customerCount)}
              </p>
              <h3 className="statistics-card__title wiki_el">Total member</h3>
            </div>
          </Col>
          {/* <Col xl={5} xxl={3}> */}
          <Col flex="auto" className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.TOTAL_BILL}>
            <div className="statistics-card pos-relative">
              <div className="statistics-card__icon statistics-card__icon--blue">
                <FontAwesomeIcon icon={faFileAlt} />
              </div>
              <p className="statistics-card__info statistics-card__info--blue">
                {StringHelper.formatValue(this.summaryCurrent.billCount)}
              </p>
              <h3 className="statistics-card__title ">Total bill</h3>
            </div>
          </Col>
          {/* <Col xl={5} xxl={4}> */}
          <Col flex="auto" className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.BASKET_AVG_VALUE}>
            <div className="">
              <div className="statistics-card pos-relative">
                <div className="statistics-card__icon statistics-card__icon--blue">
                  <FontAwesomeIcon icon={faChartPie} />
                </div>
                <p className="statistics-card__info statistics-card__info--blue">
                  {StringHelper.formatValue(this.summaryCurrent.grossSales / this.summaryCurrent.billCount)}
                </p>
                <h3 className="statistics-card__title ">Basket Avg.value</h3>
              </div>
            </div>
          </Col>
          {/* <Col xl={5} xxl={3}> */}
          <Col flex="auto" className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.BASKET_AVG_QTY}>
            <div className="statistics-card pos-relative">
              <div className="statistics-card__icon statistics-card__icon--blue">
                <FontAwesomeIcon icon={faChartPie} />
              </div>
              <p className="statistics-card__info statistics-card__info--blue">
                {StringHelper.formatValue(this.summaryCurrent.qty / this.summaryCurrent.billCount)}
              </p>
              <h3 className="statistics-card__title ">Basket Avg.qty</h3>
            </div>
          </Col>

          {/* <Col xl={5} xxl={3}> */}
          <Col flex="auto" className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.WAIT_RECEIVING}>
            <div className="statistics-card pos-relative">
              <div className="statistics-card__icon statistics-card__icon--red">
                <FontAwesomeIcon icon={faHourglassHalf} />
              </div>
              <p className="statistics-card__info statistics-card__info--red">
                {StringHelper.formatValue(this.summaryCurrent.waitRcv)}
              </p>
              <h3 className="statistics-card__title ">
                Wait Receiving
                {this.groupPendingFloatBtn &&
                  this.groupPendingFloatBtn.map((el, i) => (
                    <span
                      key={i}
                      className="mrl-10 cursor btn-showpp"
                      onClick={() => this.handleClickFloatingBtn('pending-' + el)}
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </span>
                  ))}
              </h3>
            </div>
          </Col>
          {/* <Col xl={6} xxl={4}> */}
          <Col flex="auto" className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.PO_LOCKED}>
            <div className="statistics-card pos-relative">
              <div className="statistics-card__icon statistics-card__icon--red">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <p className="statistics-card__info statistics-card__info--red">
                {StringHelper.formatValue(this.summaryCurrent.lockPo)}
              </p>
              <h3 className="statistics-card__title ">
                PO Locked(late delivery)
                {this.groupLockFloatBtn &&
                  this.groupLockFloatBtn.map((el, i) => (
                    <span
                      key={i}
                      className="mrl-10 cursor btn-showpp"
                      onClick={() => this.handleClickFloatingBtn('lock-' + el)}
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </span>
                  ))}
              </h3>
            </div>
          </Col>
        </Row>

        <Row gutter={16} className="mt-10 mb-10">
          <Col lg={24} xl={10} xxl={8} className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.CURRENT_SALE_BY_CATE}>
            <div className="section-block p-0" style={{ height: 370 }}>
              <h2 className="name-target fs-14 mrb-0 text-center w-full">Current sales qty by Cate</h2>
              <div className="pos-relative h-full">
                <div className="dashboard-bar-chart text-center pd-10" style={{ boxShadow: 'none' }}>
                  {dataTopSalesCate.length === 0 && (
                    <div
                      className="text-center"
                      style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
                    >
                      <Spin tip="Loading..."></Spin>
                    </div>
                  )}
                  <div className="" style={{ height: 323 }}>
                    <PieChartComp data={dataTopSalesCate} nHeight={361} />
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xl={14} xxl={16} className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.EXPORT_DETAIL}>
            <div className="pos-relative section-block" style={{ height: 370 }}>
              <div className="text-center">
                <Row className="pos-absolute" style={{ left: 10, top: 30 }}>
                  <Col>
                    <button onClick={this.hanldeGetExportNewItemDetail} type="button" className="btn btn-danger h-30">
                      Export detail
                    </button>
                  </Col>
                </Row>
                <Row className="mrt-5">
                  <Col>
                    <TableComp
                      columns={columnsTableAdd}
                      dataSource={dataTableAdd}
                      // newRow={this.newRow}
                      funcCallback={this.handleUpdateGroupPromo}

                      // page={true}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={16} className="mrt-10 mb-10">
          <Col lg={24} xl={24} xxl={24} className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.ADS_CATE_7_DAYS}>
            <div className="pos-relative">
              <div className="dashboard-bar-chart text-center pd-10" style={{ minHeight: 200 }}>
                <h2 className="name-target fs-14 mrb-0">ADS category 7 days</h2>
                {dataADS1.length === 0 && (
                  <div
                    className="text-center"
                    style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
                  >
                    <Spin tip="Loading..."></Spin>
                  </div>
                )}
                {dataADS1.length !== 0 ? (
                  <CustomStackColumnLineComp
                    nHeight={300}
                    data1={dataADS1}
                    data2={dataADS2}
                    xField={'name'}
                    yField={['value', 'qty']}
                  />
                ) : null}
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-10">
          <Col span={24}>
            <Row className="">
              <Col span={8}>
                <h2 className="name-target fs-14 mrb-0">History sales</h2>
              </Col>
              <Col span={8} offset={8} className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.HISTORY_DAY_OPTIONS}>
                <Row justify="end">
                  <Space>
                    <Button
                      type="dashed"
                      primary="true"
                      className={'btn-lastsales mrr-5  ' + (this.isActiveSale === 3 ? 'active' : '')}
                      onClick={(e) => this.hanldeActiveLastSale(e, 'btn-lastsales', 3)}
                    >
                      3 days
                    </Button>
                    <Button
                      type="dashed"
                      primary="true"
                      className={'btn-lastsales mrr-5  ' + (this.isActiveSale === 7 ? 'active' : '')}
                      onClick={(e) => this.hanldeActiveLastSale(e, 'btn-lastsales', 7)}
                    >
                      7 days
                    </Button>
                    <Button
                      type="dashed"
                      primary="true"
                      className={'btn-lastsales mrr-5  ' + (this.isActiveSale === 14 ? 'active' : '')}
                      onClick={(e) => this.hanldeActiveLastSale(e, 'btn-lastsales', 14)}
                    >
                      14 days
                    </Button>
                  </Space>
                </Row>
              </Col>
            </Row>

            <Row gutter={16} className="mrt-5">
              <Col span={12} className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.HISTORY_TOTAL_SALE}>
                <div className="pos-relative">
                  <div className="dashboard-bar-chart">
                    <div className="pd-10">
                      {/* <ColumnChart data={dataLastSales} xField={'date'} yField={'value'} type={'type'} color={'rgb(130, 202, 157)'} /> */}
                      <AreaChart
                        data={dataLastSales}
                        xField={'date'}
                        yField={'value'}
                        type={'type'}
                        color={'rgb(130, 202, 157)'}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12} className="wiki_el" data-wiki-id={CONSTANT.WIKI.DASHBOARD.HISTORY_CUSTOMER}>
                <div className="pos-relative">
                  <div className="dashboard-bar-chart">
                    <div className="pd-10">
                      {/* <ColumnChart data={dataLastCustomer} xField={'date'} yField={'value'} type={'type'} color={'rgb(255, 198, 88)'} /> */}
                      <AreaChart
                        data={dataLastCustomer}
                        xField={'date'}
                        yField={'value'}
                        type={'type'}
                        color={'rgb(255, 198, 88)'}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {this.groupPendingFloatBtn.map((el, i) => (
          <EstimateStockTab
            idComponent={'pending-' + el}
            items={this.objPending[el]}
            key={i}
            type={el}
            lock={''}
            report={this.itemReportPending}
          />
        ))}

        {this.groupLockFloatBtn.map((el, i) => (
          <EstimateStockTab
            idComponent={'lock-' + el}
            items={this.objLock[el]}
            key={i}
            type={el}
            lock={'lock'}
            report={this.itemReportLock}
          />
        ))}

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
      </section>
    );
  }
}
