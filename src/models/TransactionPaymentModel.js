import { APIHelper } from "helpers";
import BaseModel from "models/BaseModel";

class TransactionPaymentModel extends BaseModel {
  importTransaction(params) {
    return APIHelper.post("/paymenttransaction", params);
  }
}

export default TransactionPaymentModel;
