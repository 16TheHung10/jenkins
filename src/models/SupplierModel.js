import { APIHelper } from "helpers";

class SupplierModel {
  getListSupplier(params) {
    return APIHelper.get("/supplier", params);
  }

  postSupplier(params) {
    return APIHelper.post("/supplier", params);
  }
  putSupplier(supplierCode, params) {
    return APIHelper.put("/supplier/" + supplierCode, params);
  }
}

export default SupplierModel;
