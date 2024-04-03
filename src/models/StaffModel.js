import { APIHelper } from "helpers";

class StaffModel {
  getListStaff(params) {
    return APIHelper.get("/staff", params);
  }

  getListDepartment(params) {
    return APIHelper.get("/staff/department", params);
  }

  postStaff(params) {
    return APIHelper.post("/staff", params, null, {
      StoreHash: params.StoreHash,
    });
  }
  putStaff(params) {
    return APIHelper.put("/staff/" + params.StaffCode, params, null, {
      StoreHash: params.StoreHash,
    });
  }
  getCheckInHistoryOfStore(params) {
    return APIHelper.get("/staff/checkin/history", params);
  }
  getShiftOfEmployee(params) {
    return APIHelper.get("/staff/shift/all", params);
  }
}

export default StaffModel;
