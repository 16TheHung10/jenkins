import { APIHelper } from "helpers";

class VoucherModel {
  getListVoucher(params) {
    return APIHelper.get("/voucher", params);
  }

  postListVoucher(params) {
    return APIHelper.post("/voucher", params);
  }

  postVoucherCondition(params) {
    return APIHelper.post("/storecheckin/qrcode", params);
  }
}

export default VoucherModel;
