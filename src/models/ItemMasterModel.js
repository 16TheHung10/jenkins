import { APIHelper } from 'helpers';
import BaseModel from 'models/BaseModel';

export default class ItemMasterModel extends BaseModel {
  createIM(params) {
    return APIHelper.post('/item/master', params);
  }
  importIM(params) {
    return APIHelper.post('/item/master/import', params);
  }
  importChangeCostIM(params) {
    return APIHelper.post('/item/master/cost-price/change', params);
  }
  importChangePromotionIM(params) {
    return APIHelper.post('/item/master/promotion-price/change', params);
  }
  importChangeSalePriceIM(params) {
    return APIHelper.post('/item/master/sale-price/change', params);
  }
  updateIM(code, params) {
    return APIHelper.put('/item/master/' + code, params);
  }

  getIMdetail(code) {
    return APIHelper.get('/item/master/' + code);
  }
  getPriceIM(params) {
    return APIHelper.get('/item/master/price', params);
  }
  getItems(params) {
    return APIHelper.get('/item/master', params);
  }
  getHistoryPrice(type, params) {
    return APIHelper.get('/item/master/history-price/' + type, params);
  }
  getAllItems(params) {
    return APIHelper.get('/item/all', params);
  }
  getItemsPromotionMarketing(params) {
    return APIHelper.get('/item/master/sale-price/promotion-maketing', params);
  }
  getSOH(params) {
    return APIHelper.get('/inventory-sm/stock/basic', params, 'https://api.gs25.com.vn:8091/ext');
  }
  getSOHByStore(params) {
    return APIHelper.getAuth(
      `/inventory-sm/stock/${params?.storeCode}/basic/`,
      '000C741D556F79C7792100646B80572A',
      'https://api.gs25.com.vn:8091/ext',
      null
    );
  }
}
