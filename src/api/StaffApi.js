import { AuthApi } from "./AuthApi";

const StaffApi = {
  getListStaff: (params) => {
    return AuthApi.get("/staff", params);
  },

  getListDepartment: (params) => {
    return AuthApi.get("/staff/department", params);
  },
  postStaff: (params) => {
    return AuthApi.post("/staff", params);
  },
  putStaff: (params) => {
    return AuthApi.put("/staff/" + params.StaffCode, params);
  },
  getCheckInHistoryOfStore: (params) => {
    return AuthApi.getAndSetUrl("/staff/checkin/history", params);
  },
  getShiftOfEmployee: (params) => {
    return AuthApi.get("/staff/shift/all", params);
  },
};

export default StaffApi;
