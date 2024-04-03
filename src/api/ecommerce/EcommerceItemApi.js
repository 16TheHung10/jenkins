import moment from 'moment';
import { AuthApi } from '..//AuthApi';

const EcommerceItemApi = {
  getItems: (params) => {
    return AuthApi.get('/ecommerce/Item', params);
  },
  getItemById: (itemCode) => {
    return AuthApi.get(`/ecommerce/Item/${itemCode}`);
  },
  createItems: (data) => {
    return AuthApi.post('/ecommerce/Item', data);
  },

  importItems: (data) => {
    return AuthApi.post('/ecommerce/Item/Import', data);
  },
  checkImportItems: (data) => {
    return AuthApi.post('/ecommerce/Item/Import/CheckValid', data);
  },

  updateItems: (itemCode, data) => {
    return AuthApi.put(`/ecommerce/Item/${itemCode}`, data);
  },
  updateItemStatus: (itemCode, active) => {
    return AuthApi.put(`/ecommerce/Item/${itemCode}/Status`, { active });
  },
  uploadItemImages: (itemCode, images, currentImages = [0]) => {
    return AuthApi.post(
      `/upload/ecommerce/Item/${itemCode}`,
      { images, currentImages },
      null,
      process.env.REACT_APP_API_EXT_MEDIA
    );
  },
  deleteItemImages: (itemCode, itemName) => {
    return AuthApi.delete(`/ecommerce/Item/${itemCode}/${itemName}`, null, null, process.env.REACT_APP_API_EXT_MEDIA);
  },
  getItemRelate: (itemCode) => {
    return AuthApi.get(`/ecommerce/Item/${itemCode}/RelateItems`);
  },
  addItemRelate: (itemCode, data) => {
    return AuthApi.post(`/ecommerce/Item/${itemCode}/AddRelateItems`, data);
  },
  getItemMasterInfo: (itemCode) => {
    return AuthApi.get(`/ecommerce/Item/ItemMaster/details/${itemCode}`);
  },
};

export default EcommerceItemApi;
