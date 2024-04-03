import { AuthApi } from './AuthApi';

const StoreApi = {
  getCountersOfAllStore: () => {
    return AuthApi.get('/common/object/Types=counters');
  },
  getCountersOnline: () => {
    return AuthApi.get('/pos/online', null, null, 'https://portal.gs25.com.vn');
  },
  exportStore: (data) => {
    return AuthApi.post('/store/export', data);
  },
  // Counter
  getCounters: (storeCode) => {
    return AuthApi.get(`/store/${storeCode}/counter`, null);
  },
  updateAllowPromotionCounter: (storeCode, counterCode, AllowPromotion) => {
    return AuthApi.put(`/store/${storeCode}/counter/${counterCode}/allowPromotion`, { AllowPromotion });
  },

  createCounter: (storeCode, requestBody) => {
    return AuthApi.post(`/store/${storeCode}/counter`, requestBody);
  },
  updateCounter: (storeCode, requestBody) => {
    return AuthApi.put(`/store/${storeCode}/counter/${requestBody.counterCode}`, requestBody);
  },

  // Sys call
  allowSysCall: (storeCode, counter, isAllow) => {
    return AuthApi.put(`/store/${storeCode}/counter/${counter}/allowRungOrder`, {
      AllowRungOrder: isAllow,
    });
  },

  // Payment
  getPayments: (storeCode) => {
    return AuthApi.get(`/store/${storeCode}/payment`, null);
  },
  updatePaymentMethodOfStore: (storeCode, data) => {
    return AuthApi.put(`/store/${storeCode}/payment/${data.paymentCode}/active`, data);
  },
  createPaymentMethodOfStore: (storeCode, data) => {
    return AuthApi.post(`/store/${storeCode}/payment`, data);
  },
  getMoreStoreInfo: (storeCode) => {
    return AuthApi.get(`/store/${storeCode}/infor`);
  },
  updateMoreStoreInfo: (storeCode, data) => {
    return AuthApi.put(`/store/${storeCode}/infor`, { storeInfors: data });
  },

  // Target KPI
  getStoreTargetKPI: (params) => {
    return AuthApi.get(`/storetargetads`, params);
  },
  updateStoreTargetKPI: (targetID, data) => {
    return AuthApi.put(`/storetargetads/${targetID}`, data);
  },
  createStoreTargetKPI: (data) => {
    return AuthApi.post(`/storetargetads`, data);
  },
  importStoreTargetKPI: (data) => {
    return AuthApi.post(`/storetargetads/import`, { importedData: data });
  },
};

export default StoreApi;
