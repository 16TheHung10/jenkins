import { AuthApi } from './AuthApi';

const LoyaltyApi = {
  // item Redeem
  getItemRedeems(params = null) {
    return AuthApi.get('/loyaltyItemRedeem', params);
  },
  getItemRedeemDetails(itemCode) {
    return AuthApi.get(`/loyaltyItemRedeem/${itemCode}`);
  },
  createItemRedeem(data) {
    return AuthApi.post(`/loyaltyItemRedeem`, data);
  },

  updateItemRedeem(itemCode, data) {
    return AuthApi.put(`/loyaltyItemRedeem/${itemCode}`, data);
  },

  uploadItemRedeemBanner(itemCode, data) {
    return AuthApi.post(`/upload/loyalty/ItemRedeem/${itemCode}/banner`, data, null, process.env.REACT_APP_API_EXT_MEDIA);
  },
  uploadItemRedeemLogo(itemCode, data) {
    return AuthApi.post(`/upload/loyalty/ItemRedeem/${itemCode}/logo`, data, null, process.env.REACT_APP_API_EXT_MEDIA);
  },
  getList(params = null) {
    return AuthApi.get('/loyalty/search/member', params);
  },

  getItemDetail(memberCode) {
    return AuthApi.get('/loyalty/search/member/' + memberCode);
  },
  getItemDetailByPhoneNumber(phoneNumber) {
    return AuthApi.get('/loyalty/search/customer/' + phoneNumber);
  },

  createMember(params = null) {
    return AuthApi.post('/loyalty/profile/register', params);
  },

  changePhone(params = null) {
    return AuthApi.put('/loyalty/profile/' + params.memberCode + '/phone/' + params.phone);
  },

  changeDiscount(params = null) {
    return AuthApi.put('/loyalty/profile/' + params.memberCode + '/discount/' + params.discount);
  },

  activeMember(params = null) {
    return AuthApi.put('/loyalty/profile/' + params.memberCode + '/active');
  },

  lockMember(params = null) {
    return AuthApi.put('/loyalty/profile/' + params.memberCode + '/lock');
  },

  updateInfo(params = null) {
    return AuthApi.put('/loyalty/profile/' + params.memberCode + '/basicinfo', params.body);
  },

  mergePoint(params = null) {
    return AuthApi.post('/loyalty/profile/' + params.memberCode + '/merge', params.body);
  },

  getPoint(memberCode) {
    return AuthApi.get('/loyalty/profile/' + memberCode + '/point');
  },

  addPoint(params = null) {
    return AuthApi.post('/loyalty/profile/' + params.memberCode + '/addpoint/' + params.point);
  },

  getLogDetail(memberCode, params = null) {
    return AuthApi.get('/loyalty/profile/' + memberCode + '/log/recent', params);
  },

  getPaymentTransDetail(memberCode, params = null) {
    return AuthApi.get('/loyalty/profile/' + memberCode + '/paymenttransaction', params);
  },

  reportTransaction(params = null) {
    return AuthApi.get('/reporting/loyalty/transaction/top', params);
  },
  exportReportTransaction(params = null) {
    return AuthApi.post('/reporting/loyalty/transaction/top/export?startDate=' + params.startDate + '&endDate=' + params.endDate + '&top=' + params.top);
  },

  getListMember(params = null) {
    return AuthApi.get('/reporting/loyalty/profile/top', params);
  },

  exportListMember(params = null) {
    return AuthApi.post('/reporting/loyalty/profile/top/export?startDate=' + params.startDate + '&endDate=' + params.endDate, params);
  },

  getTransLogReport(params = null) {
    return AuthApi.get('/reporting/loyalty/transactionlog/top', params);
  },

  exportTransLogReport(params = null) {
    return AuthApi.post('/reporting/loyalty/transactionlog/top/export?startDate=' + params.startDate + '&endDate=' + params.endDate, params);
  },

  getHighestPoint(params = null) {
    return AuthApi.get('/reporting/loyalty/point/top', params);
  },

  exportHighestPoint(params = null) {
    return AuthApi.post('/reporting/loyalty/point/top/export?startDate=' + params.startDate + '&endDate=' + params.endDate, params);
  },

  getMemberService(params) {
    return AuthApi.get('/loyalty/profile/' + params.memberCode + '/' + params.service + '/all');
  },

  checkVoucherRedeem(params) {
    return AuthApi.get('/voucher/' + params.phone + '/check');
  },

  lockVoucher(params) {
    return AuthApi.post('/voucher/lock', params);
  },

  updateExpiredDateDeposit({ memberCode, VoucherCodeEncrypt, expiredDate }) {
    // Tủ lạnh
    return AuthApi.put(`/loyalty/profile/${memberCode}/deposit/update-expired/${VoucherCodeEncrypt}`, {
      expiredDate,
    });
  },
  updateExpiredDateVoucher({ memberCode, VoucherCodeEncrypt, expiredDate }) {
    // Tủ quà tặng
    return AuthApi.put(`/loyalty/profile/${memberCode}/voucher/update-expired/${VoucherCodeEncrypt}`, {
      expiredDate,
    });
  },
  blockUserForever(memberCode, reason) {
    const payload = {
      AccountEnabled: true,
      Note: reason,
    };
    return AuthApi.put(`/loyalty/account/${memberCode}/delete`, payload);
  },
};
export default LoyaltyApi;
