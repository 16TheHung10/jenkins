import { APIHelper } from "helpers";

class DeviceModel {
  getDevice() {
    return APIHelper.get("/terminal");
  }

  insertDevice(params) {
    return APIHelper.post("/terminal", params);
  }

  updateDevice(id, params) {
    return APIHelper.put("/terminal/" + id, params);
  }

  deleteDevice(id) {
    return APIHelper.delete("/terminal/" + id);
  }

  getFacePay(params, rootUrl = null, cacheAge = 0) {
    // return APIHelper.post("/merchant/devices",params,rootUrl,cacheAge);
    return APIHelper.post("/wee", params, rootUrl, cacheAge);
  }
}

export default DeviceModel;
