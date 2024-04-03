import { APIHelper } from "helpers";

class StoreModel {
  getListStore(params) {
    return APIHelper.get("/store", params);
  }
  getListOperationStore(params) {
    return APIHelper.get("/store/op", params);
  }
  getStoreOPHistory(storeCode) {
    return APIHelper.get(`/store/history/status/${storeCode}`);
  }

  getStoreByCode(storeCode) {
    return APIHelper.get("/store/" + storeCode);
  }

  postStore(params) {
    return APIHelper.post("/store", params);
  }
  putStore(params) {
    return APIHelper.put("/store/" + params.StoreCode, params);
  }
  getCounters() {
    return APIHelper.put("/portal/common/object/Types=counters");
  }
}

export default StoreModel;
