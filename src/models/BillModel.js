import { APIHelper } from "helpers";

export default class BillModel {
  searchBill(params) {
    // return APIHelper.get("/ext/marketing/bill/" + params.billCode, null, "https://api.gs25.com.vn:8091");
    return APIHelper.get("/bill/" + params.billCode, null, null);
  }

  cancelBill(params) {
    return APIHelper.put("/bill/cancel/" + params.billCode);
  }
}
