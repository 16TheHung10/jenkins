import { APIHelper } from "helpers";

class StoreConfigModel {
  getStoreConfig(params) {
    return APIHelper.get("/store/store-config");
  }

  postStoreConfig(params) {
    return APIHelper.post("/store/store-config", params);
  }

  deleteStoreConfig(store) {
    return APIHelper.delete("/store/store-config/" + store);
  }
}

export default StoreConfigModel;
