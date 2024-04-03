import { APIHelper } from "helpers";

class PosDataModel {
  getPromotion(params) {
    return APIHelper.get("/posdata/promotion", params);
  }

  getAllItems(params) {
    return APIHelper.get("/item/all", params);
  }

  getAllSuppliers(params) {
    return APIHelper.get("/common/object/Types=supplier", params);
  }

  updatePromotion(partners, params) {
    return APIHelper.put("/posdata/promotion/" + partners, params);
  }

  // Voucher
  checkVoucherData({ code }) {
    return APIHelper.post(`/pos/pospayment/voucher/${code}`);
  }
  unlockVoucher({ code }) {
    return APIHelper.post(`/pos/pospayment/voucher/${code}/unlock`);
  }
}

export default PosDataModel;
