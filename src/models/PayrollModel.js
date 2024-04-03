import { APIHelper } from "helpers";
import BaseModel from "models/BaseModel";

class PayrollModel extends BaseModel {
  importPayroll(params) {
    return APIHelper.post("/payroll", params);
  }
}

export default PayrollModel;
