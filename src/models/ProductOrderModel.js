import { APIHelper } from "helpers";
import BaseModel from "models/BaseModel";

class ProductOrderModel extends BaseModel {
  getListOrder(params = null, rootUrl = null) {
    return APIHelper.get("/productorder", params, rootUrl);
  }

  getOrder(orderCode, isStatus = false, rootUrl = null) {
    return APIHelper.get("/productorder/" + orderCode, null, rootUrl);
  }

  deleteOrder(orderCode, rootUrl = null) {
    return APIHelper.delete("/productorder/" + orderCode, null, rootUrl);
  }

  cancelOrder(orderCode, params, rootUrl = null) {
    return APIHelper.put(
      "/productorder/" + orderCode + "/cancel",
      params,
      rootUrl,
    );
  }

  approveOrder(orderCode, rootUrl = null) {
    return APIHelper.put(
      "/productorder/" + orderCode + "/approve",
      null,
      rootUrl,
    );
  }

  deleteMultiOrder(params, rootUrl = null) {
    return APIHelper.delete("/productorder", params, rootUrl);
  }

  approveMultiOrder(params, rootUrl = null) {
    return APIHelper.put("/productorder/approve", params, rootUrl);
  }

  confirmCustomerOrder(orderCode, rootUrl = null) {
    return APIHelper.get(
      "/productorder/" + orderCode + "/confirm",
      null,
      rootUrl,
    );
  }

  refundOrder(orderCode, rootUrl = null) {
    return APIHelper.put(
      "/productorder/" + orderCode + "/refund",
      null,
      rootUrl,
    );
  }

  updateOrder(orderCode, params, rootUrl = null) {
    return APIHelper.put("/productorder/" + orderCode, params, rootUrl);
  }

  exportCustomOrder(params, rootUrl = null) {
    return APIHelper.post(
      "/productorder/customerorder/export?storeCode=" +
        params.storeCode +
        "&keyword=" +
        params.keyword +
        "&orderStartDate=" +
        params.orderStartDate +
        "&orderEndDate=" +
        params.orderEndDate +
        "&orderStatus=" +
        params.orderStatus +
        "&refundstatus=" +
        params.refundstatus +
        "&paymentStatus=" +
        params.paymentStatus +
        "&paymentType=" +
        params.paymentStatus +
        "&partner=" +
        params.partner,
      null,
      rootUrl,
    );
  }

  exportRefundOrder(params, rootUrl = null) {
    return APIHelper.post(
      "/productorder/customerorder/export?storeCode=" +
        params.storeCode +
        "&keyword=" +
        params.keyword +
        "&orderStartDate=" +
        params.orderStartDate +
        "&orderEndDate=" +
        params.orderEndDate +
        "&refundstatus=" +
        params.refundstatus +
        "&paymentStatus=" +
        params.paymentStatus +
        "&sortBy=" +
        params.sortBy +
        "&sortOrder=" +
        params.sortOrder +
        "&paymentType=" +
        params.paymentStatus +
        "&partner=" +
        params.partner +
        "&refund=" +
        params.refund,
      null,
      rootUrl,
    );
  }
}

export default ProductOrderModel;
