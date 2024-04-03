import { AuthApi } from "./AuthApi";

const FcApi = {
  getAllFC: (payload) => {
    return AuthApi.get(`/FCMater`, payload);
  },
  getFCDetails: (taxCode, storeCode) => {
    return AuthApi.get(`/FCMater/${taxCode}/${storeCode}`);
  },
  getSummaryByType: () => {
    return AuthApi.get(`/FCMater/summary`);
  },
  createFC: (data) => {
    return AuthApi.post(`/FCMater`, data);
  },
  importFC: (data) => {
    return AuthApi.post(`/FCMater/import`, { fcMasters: [...data] });
  },
  getStoreFCDetails: (taxCode, storeCode) => {
    return AuthApi.get(`/FCMater/${taxCode}/store/${storeCode}`);
  },
  updateFCDetails: (taxCode, data) => {
    return AuthApi.put(`/FCMater/${taxCode}`, data);
  },
  getStoreOfFC: (taxCode) => {
    return AuthApi.get(`/FCMater/${taxCode}/store`);
  },
  addStoreOfFC: (taxCode, requestBody) => {
    return AuthApi.post(`/FCMater/${taxCode}/store`, requestBody);
  },
  deleteStoreOfFC: (taxCode, requestBody) => {
    return AuthApi.delete(`/FCMater/${taxCode}/store`, requestBody);
  },
};

export default FcApi;
