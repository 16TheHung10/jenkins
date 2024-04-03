import APIHelper from "helpers/APIHelper";
import BaseModel from "models/BaseModel";

export default class ExportModel extends BaseModel {
  exportAutoField(params = null) {
    return APIHelper.post(
      "/export/common",
      params,
      process.env.REACT_APP_API_STORE_RESOURCES_URL,
      0,
      60000,
    );
  }

  exportWorkspaces(type = "", params = null) {
    return APIHelper.get("/export/" + type, params, null, 0, 20000);
  }

  exportWorkspacesDetail(type = "", params = null) {
    return APIHelper.get("/export/" + type, params, null, 0, 20000);
  }

  exportWorkspacesDetail2(type = "", params = null) {
    return APIHelper.post("/export/" + type, params, null, 0, 60000);
  }
}
