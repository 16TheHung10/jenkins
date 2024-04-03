import { AuthApi } from './AuthApi';

const ItemsMasterApi = {
  getItemInfo: (itemCode) => {
    return AuthApi.get(`/item/master/infor/${itemCode}`);
  },
  getItemHistoryChangeSellingPrice: (params) => {
    return AuthApi.get(`/item/master/price/selling/history`, params);
  },
  updateItemInfo: (itemCode, data) => {
    return AuthApi.put(`/item/master/infor/${itemCode}`, data);
  },
  checkStoreItem: (storeCode) => {
    return AuthApi.get(`/item/master/${storeCode}/check`);
  },
  getItemsByRegion: (regionCode) => {
    return AuthApi.get(`/item/master/region/${regionCode}`);
  },
  importAttributeItem: (data) => {
    return AuthApi.post('/item/master/infor/import', { ItemInfors: data });
  },
  changeStoreItemPrice: (data) => {
    return AuthApi.post('/item/master/price/selling', data);
  },
  changeStoreItemOrder: (data) => {
    return AuthApi.post('/item/master/order/lock', data);
  },
  changeStoreItemSold: (data) => {
    return AuthApi.post('/item/master/sold/lock', data);
  },
  importItemByStore: (data) => {
    return AuthApi.post('/item/master/store/import', data);
  },
  getItemOfStore: (itemCode, storeCode) => {
    return AuthApi.get(`/item/master/${itemCode}/store`, { storeCode });
  },
  getItemOrderOfStore: (itemCode, storeCode) => {
    return AuthApi.get(`/item/master/${itemCode}/order`, { storeCode });
  },
  getItemCombineV2: (itemCode) => {
    return AuthApi.get(`/item/master/${itemCode}/combine`);
  },
  updateItemOfStore: (itemCode, params) => {
    return AuthApi.put(`/item/master/${itemCode}/store`, params);
  },
  getItems(params) {
    return AuthApi.get('/item/master', params);
  },
  /**
   * @summary
   * This method is useted to get all item
   */
  getItemsAll(params) {
    return AuthApi.get('/item/all', params);
  },
  getItemsDetailsV2(itemCode) {
    return AuthApi.get(`/item/master/${itemCode}/detail`);
  },
  updateItemV2: (itemCode, data) => {
    return AuthApi.put(`/item/master/${itemCode}/detail`, data);
  },
  updateItemByStoreV2: (itemCode, data) => {
    return AuthApi.put(`/item/master/${itemCode}/store`, { itemStore: [data] });
  },
  updateItemCobine: (itemCode, data) => {
    return AuthApi.put(`/item/master/${itemCode}/combine`, { itemCombine: data });
  },
  updateItemOrderByStoreV2: (itemCode, data) => {
    return AuthApi.put(`/item/master/${itemCode}/order`, { itemOrder: [data] });
  },
  getItemOptions: (keyword) => {
    return AuthApi.get(
      `/item/ItemSuggestion/filter/result`,
      { keyword },
      null,
      process.env.REACT_APP_EXT_ITEM_ROOT_URL
    );
  },
  getItemsInfo: (params) => {
    return AuthApi.get(`/item/itemmaster/`, params, null, process.env.REACT_APP_EXT_ITEM_ROOT_URL);
  },
  getOriginOfGoods: (params) => {
    return AuthApi.get('/reporting/itemmaster', params);
  },
};

export default ItemsMasterApi;
