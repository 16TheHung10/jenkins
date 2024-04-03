// import React from 'react';
import { message } from 'antd';
import { APIHelper } from 'helpers';

export default class PromotionModel {
  getList(page, params = null, rootUrl = null) {
    return APIHelper.get(page, params, rootUrl);
  }

  getListPromotion(params) {
    return APIHelper.get(
      '/promotion/groupitem?active=' +
        params.active +
        '&startdate=' +
        params.startDate +
        '&enddate=' +
        params.endDate +
        '&code=' +
        params.promotionCode +
        '&page=' +
        params.page
    );
  }

  getDetailPage(code = null) {
    return APIHelper.get('/promotion/detail/groupitem/' + code);
  }

  getItems(params) {
    return APIHelper.get('/item', params);
  }

  createPromotion(params) {
    return APIHelper.post('/promotion/groupitem', params);
  }

  postPromotion(page, params = null) {
    return APIHelper.post('/promotion/' + page, params);
  }
  getPromotion(page, code = '', params = null) {
    return APIHelper.get('/promotion/' + page + '/' + code, params);
  }
  putPromotion(page, code = '', params = null) {
    // console.log({ page });
    // if (!page?.toUpperCase().includes('INACTIVE')) {
    //   return Promise.resolve({ status: 0, message: 'Can not active promotion', data: null });
    // }
    return APIHelper.put('/promotion/' + page + '/' + code, params);
  }

  getQrCode(params) {
    return APIHelper.get(
      '/storecheckin/qrcode?storeCode=' +
        params.storeCode +
        '&startDate=' +
        params.startDate +
        '&endDate=' +
        params.endDate +
        '&history=' +
        params.history
    );
  }

  applyPromotion(params) {
    return APIHelper.put('/storecheckin/' + params.promotionCode + '/' + params.status);
  }

  createPrimeTimeBuyGiftPromotion(data) {
    return APIHelper.post('/promotion/buygift', data);
  }
  createPrimeTimeDiscountGiftPromotion(data) {
    return APIHelper.post('/promotion/discountitem', data);
  }

  createTotalBillBuyGiftPromotion(data) {
    return APIHelper.post('/promotion/bill', data);
  }

  updatePrimeTimeBuyGiftPromotion(data, id) {
    return APIHelper.put(`/promotion/buygift/${id}`, data);
  }
  updateTotalBillDiscountPromotion(data, id) {
    return APIHelper.put(`/promotion/bill/${id}`, data);
  }
  updatePrimeTimeDiscountGiftPromotion(data, id) {
    return APIHelper.put(`/promotion/discountitem/${id}`, data);
  }

  updatePrimeTimeStatus({ status, typePromotion, promotionCode, note }) {
    if (status === 1) {
      return Promise.resolve({ status: 0, message: 'Can not active promotion', data: null });
    }
    return APIHelper.put(`/promotion/${typePromotion}/inactive/${promotionCode}`, { note });
  }

  updateTotalBillStatus({ status, promotionCode, note }) {
    if (status === 1) {
      return Promise.resolve({ status: 0, message: 'Can not active promotion', data: null });
    }
    return APIHelper.put(`/promotion/bill/inactive/${promotionCode}`, { note });
  }

  getAllGoldenTimePromotionDetails(id) {
    return APIHelper.get(`/promotion/buygift/${id}`);
  }
  getAllTotalBillPromotion(params) {
    return APIHelper.get(`/promotion/bill/search`, params);
  }

  getTotalBillDetailPromotion(id) {
    return APIHelper.get(`/promotion/bill/${id}`);
  }
  getAllGoldenTimePromotionDetailsDiscount(id) {
    return APIHelper.get(`/promotion/discountItem/${id}`);
  }
  getAllGoldenTimePromotion(params) {
    return APIHelper.get(`/promotion/primetime/search`, params);
  }

  // MIX AB MATCH C
  getMixABMatchC(params) {
    return APIHelper.get(`/promotion/mixmatchabc`, params);
  }
  getMixABMatchCDetails(promotionCode) {
    return APIHelper.get(`/promotion/mixmatchabc/${promotionCode}`);
  }
  createMixABMatchC(data) {
    return APIHelper.post(`/promotion/mixmatchabc`, data);
  }
  updateMixABMatchC(promotionCode, data) {
    return APIHelper.put(`/promotion/mixmatchabc/${promotionCode}`, data);
  }
}
