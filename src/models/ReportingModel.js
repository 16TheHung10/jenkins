import { APIHelper } from 'helpers';
import BaseModel from 'models/BaseModel';

class ReportingModel extends BaseModel {
  getDataStoreCurrent(storeCode, page, params = null) {
    if (storeCode === '') {
      return APIHelper.get(
        '/realtimesale/store/' + page,
        params,
        process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL,
        15,
        20000
      );
    } else {
      return APIHelper.get(
        '/realtimestoresale/' + storeCode + '/' + page,
        params,
        process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL,
        15,
        20000
      );
    }
  }
  getTransactionByType(params) {
    return APIHelper.get(`/loyalty/member/profile`, params, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL, 15, 20000);
  }
  getDataStore(storeCode, page, params = null) {
    if (storeCode === '') {
      return APIHelper.get('/sale/store/' + page, params, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
    } else {
      return APIHelper.get(
        '/storesale/' + storeCode + '/' + page,
        params,
        process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL
      );
    }
  }
  exportAnalyticreport(params = null) {
    return APIHelper.post('/export', params, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
  }
  checkStatusAPIinventory(date = '', params = null) {
    return APIHelper.get(
      '/inventory-sm/storestatus/inventory/calculate?date=' + date,
      params,
      'https://api.gs25.com.vn:8091/ext'
    );
  }
  getDataReporting(type, page = '', pageSize = '') {
    return APIHelper.get('/reporting/object?types=' + type + '&page=' + page + '&pagesize=' + pageSize);
  }
  getEstimateStock(params, rootUrl = null) {
    return APIHelper.get(
      '/reporting/' + params.type + '?storeCode=' + params.storeCode + '&itemCode=' + params.itemCode,
      null,
      rootUrl
    );
  }
  getDataSalesByStoreReview(storeCode, params = null) {
    // params = { date: ...}
    if (storeCode === '') {
      return APIHelper.get('/sale/store/transaction/summary', params, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
    } else {
      return APIHelper.get(
        '/storesale/' + storeCode + '/summary',
        params,
        process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL
      );
    }
  }
  topDelivery(params = null, rootUrl = null) {
    return APIHelper.get('/productorder/itemsales', params, rootUrl);
  }
  getAllReviewSale(page, params = null) {
    return APIHelper.get(page, params, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
  }
  getCompareSalesOfMonth(params = null) {
    return APIHelper.get(`/storestatus/comparesale/inperiod`, params, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
  }
  checkStatusAPIsale(storeCode = '', date = '', params = null) {
    // return APIHelper.get("/storestatus/sale?storecode="+storeCode+"&date="+date,params, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
    return APIHelper.get(
      '/storestatus/sale?storecode=' + storeCode + '&date=' + date,
      params,
      process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL,
      15
    );
  }
  getReport(params) {
    return APIHelper.get(
      '/reporting/object?types=' + params.type,
      null,
      'http://devapi.gs25.com.vn:8091/storemanagement'
    );
  }
  getSmsReport(params) {
    return APIHelper.get(`/reporting/sms`, params);
  }
  getReportV2(params) {
    return APIHelper.get('/reporting/object', params);
  }

  getCico(storeCode) {
    return APIHelper.get('/reporting/object?types=cico&storeCode=' + storeCode);
  }
  reportingExport(type, params = null, rootUrl = null) {
    return APIHelper.get('/reporting/export/' + type, params, rootUrl);
  }
  exportReport(params) {
    return APIHelper.post(
      '/reporting/' +
        params.type +
        '/export?startdate=' +
        params.startDate +
        '&enddate=' +
        params.endDate +
        '&voucherType=' +
        params.voucherType
    );
  }
  getListByPage(page, params = null, root = null, cacheAge = 15, timeout = 30000) {
    return APIHelper.get('/reporting/' + page, params, root, cacheAge, timeout);
  }
  getInfoReport(page = '', storeCode = '', params = null) {
    if (!storeCode) {
      return APIHelper.get('/sale/store' + page, params, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
    } else {
      return APIHelper.get(
        '/storesale/' + storeCode + '/' + page,
        params,
        process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL
      );
    }
  }
  getInfoReportV2(page = '', storeCode = '', params = null) {
    console.log({ storeCode });
    return APIHelper.get(
      '/storesale/' + storeCode + '/' + page,
      params,
      process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL
    );
  }

  getInventoryReport(page = '', storeCode = '', key = '', params = null, rootUrl = null) {
    return APIHelper.get(page + key, params, rootUrl);
  }
  getCicoReport(params) {
    return APIHelper.get(
      '/reporting/object?types=' +
        params.type +
        '&storeCode=' +
        params.storeCode +
        '&startdate=' +
        params.startDate +
        '&enddate=' +
        params.endDate +
        '&typePayment=' +
        params.typePayment
    );
  }

  exportCico(params) {
    return APIHelper.post(
      '/reporting/cico/' +
        params.type +
        '/export?startdate=' +
        params.startDate +
        '&enddate=' +
        params.endDate +
        '&storecode=' +
        params.storeCode +
        '&typePayment=' +
        params.typePayment
    );
  }
  getAllSummary(page, params = null) {
    return APIHelper.get(page, params, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL, 10, 30000);
  }
}

export default ReportingModel;
