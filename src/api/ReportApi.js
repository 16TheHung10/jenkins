import { AuthApi } from './AuthApi';

const ReportApi = {
  getReport(params) {
    return AuthApi.get('/reporting/object', params);
  },
  getReportSMS(params) {
    return AuthApi.getAndSetUrl('/sms', params);
  },
  getTopPromotionItemSummary(promotionCode, params = null) {
    return AuthApi.get(
      `/promotion/item/summary/${promotionCode}`,
      params,
      null,
      process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL
    );
  },
  getItemFFReport(params) {
    return AuthApi.get(`/posservice/ffonsitelog`, params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
  },
};

export default ReportApi;
