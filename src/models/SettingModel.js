import BaseModel from "models/BaseModel";
import { APIHelper } from "helpers";

import AccountState from "helpers/AccountState";

class SettingModel extends BaseModel {
  getMenuList() {
    return this.cache("/setting/menus");
  }
  clearCache() {
    return APIHelper.get("/setting/cache/clear");
  }
  clearCacheByName(name, date = null) {
    return APIHelper.get(
      "/setting/cache/" + name + "/clear?date=" + (date !== null ? date : ""),
    );
  }
  getObjectByType(type) {
    return APIHelper.get("/setting/object/" + type);
  }
  getObjectPermissionByType(type, id) {
    return APIHelper.get("/setting/permission/" + type + "/" + id);
  }
  assignObjectPermission(type, id, params) {
    return APIHelper.post("/setting/permission/" + type + "/" + id, params);
  }
}

export default SettingModel;
