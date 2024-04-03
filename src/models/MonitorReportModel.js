import { APIHelper } from "helpers";

export default class MonitorReportModel {
  getMonitorReportPosVersion() {
    return APIHelper.get("/monitorreport/software");
  }
  getVersioHistory(type, counterCode) {
    return APIHelper.get(`/monitorreport/software/${type}/${counterCode}`);
  }
}
