// import React from 'react';
import { APIHelper } from 'helpers';

export default class LoyaltyModel {
  getList(params = null) {
    return APIHelper.get('/loyalty/search/member', params);
  }

  getItemDetail(memberCode) {
    return APIHelper.get('/loyalty/search/member/' + memberCode);
  }
  getLogDetail(memberCode, params = null) {
    return APIHelper.get('/loyalty/' + memberCode + '/log/recent', params);
  }

  createMember(params = null) {
    return APIHelper.post('/loyalty/profile/register', params);
  }

  changePhone(params = null) {
    return APIHelper.put('/loyalty/profile/' + params.memberCode + '/phone/' + params.phone);
  }

  changeDiscount(params = null) {
    return APIHelper.put('/loyalty/profile/' + params.memberCode + '/discount/' + params.discount);
  }

  activeMember(params = null) {
    return APIHelper.put('/loyalty/profile/' + params.memberCode + '/active');
  }

  lockMember(params = null) {
    return APIHelper.put('/loyalty/profile/' + params.memberCode + '/lock');
  }

  updateInfo(params = null) {
    return APIHelper.put('/loyalty/profile/' + params.memberCode + '/basicinfo', params.body);
  }

  mergePoint(params = null) {
    return APIHelper.post('/loyalty/profile/' + params.memberCode + '/merge', params.body);
  }

  getPoint(memberCode) {
    return APIHelper.get('/loyalty/profile/' + memberCode + '/point');
  }

  addPoint(params = null) {
    return APIHelper.post('/loyalty/profile/' + params.memberCode + '/addpoint/' + params.point);
  }

  getLogDetail(memberCode, params = null) {
    return APIHelper.get('/loyalty/profile/' + memberCode + '/log/recent', params);
  }

  getPaymentTransDetail(memberCode, params = null) {
    return APIHelper.get('/loyalty/profile/' + memberCode + '/paymenttransaction', params);
  }

  reportTransaction(params = null) {
    return APIHelper.get('/reporting/loyalty/transaction/top', params);
  }

  exportReportTransaction(params = null) {
    return APIHelper.post('/reporting/loyalty/transaction/top/export?startDate=' + params.startDate + '&endDate=' + params.endDate + '&top=' + params.top);
  }

  getListMember(params = null) {
    return APIHelper.get('/reporting/loyalty/profile/top', params);
  }

  exportListMember(params = null) {
    return APIHelper.post('/reporting/loyalty/profile/top/export?startDate=' + params.startDate + '&endDate=' + params.endDate, params);
  }

  getTransLogReport(params = null) {
    return APIHelper.get('/reporting/loyalty/transactionlog/top', params);
  }

  exportTransLogReport(params = null) {
    return APIHelper.post('/reporting/loyalty/transactionlog/top/export?startDate=' + params.startDate + '&endDate=' + params.endDate, params);
  }

  getHighestPoint(params = null) {
    return APIHelper.get('/reporting/loyalty/point/top', params);
  }

  exportHighestPoint(params = null) {
    return APIHelper.post('/reporting/loyalty/point/top/export?startDate=' + params.startDate + '&endDate=' + params.endDate, params);
  }

  getMemberService(params) {
    return APIHelper.get('/loyalty/profile/' + params.memberCode + '/' + params.service + '/all');
  }

  checkVoucherRedeem(params) {
    return APIHelper.get('/voucher/' + params.phone + '/check');
  }

  lockVoucher(params) {
    return APIHelper.post('/voucher/lock', params);
  }

  updateExpiredDateDeposit({ memberCode, VoucherCode, expiredDate }) {
    // Tủ lạnh
    return APIHelper.put(`/loyalty/profile/${memberCode}/deposit/update-expired/`, {
      expiredDate,
      VoucherCode,
    });
  }
  updateExpiredDateVoucher({ memberCode, VoucherCode, expiredDate }) {
    // Tủ quà tặng
    return APIHelper.put(`/loyalty/profile/${memberCode}/voucher/update-expired/`, {
      expiredDate,
      VoucherCode,
    });
  }
}
