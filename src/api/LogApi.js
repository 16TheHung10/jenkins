import { AuthApi } from "./AuthApi";

const LogApi = {
  postLog: (params) => {
    return AuthApi.post("/logging/internal", params, null, "");
  },
  getLogs: (params) => {
    return AuthApi.getAndSetUrl("/logging/filter", params);
  },
  addLog: (data) => {
    return AuthApi.post("/staff/checkin/addlog", data);
  },
};
export default LogApi;
