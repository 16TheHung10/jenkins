// import React from 'react';
import { APIHelper } from "helpers";

export default class LogisticsModel {
  getList(params = null) {
    return APIHelper.get("/purchaseorder/" + params.type, params);
  }

  getListDetail(poCode) {
    return APIHelper.get("/purchaseorder/" + poCode + "/detail");
  }

  qtyConfirm(params = null) {
    return APIHelper.post("/purchaseorder/receiptconfirm", params);
  }

  postFileImport(params = null) {
    return APIHelper.post("/purchaseorder/storeorder/createbylist", params);
  }
  postFileImportOrderSup(params = null) {
    return APIHelper.post("/purchaseorder/ordersupplier/createbylist", params);
  }

  exportSupplier(params) {
    return APIHelper.post(
      "/purchaseorder/ordersupplier/exportbylist?type=" +
        params.type +
        "&storeCode=" +
        params.storeCode +
        "&supplier=" +
        params.supplier +
        "&orderStartDate=" +
        params.orderStartDate +
        "&orderEndDate=" +
        params.orderEndDate +
        "&deliveryStartDate=" +
        params.deliveryStartDate +
        "&deliveryEndDate=" +
        params.deliveryEndDate +
        "&page=" +
        params.page,
    );
  }

  exportStoreOrder(params) {
    return APIHelper.post(
      "/purchaseorder/storeorder/exportbylist?type=" +
        params.type +
        "&storeCode=" +
        params.storeCode +
        "&orderStartDate=" +
        params.orderStartDate +
        "&orderEndDate=" +
        params.orderEndDate +
        "&deliveryStartDate=" +
        params.deliveryStartDate +
        "&deliveryEndDate=" +
        params.deliveryEndDate +
        "&page=" +
        params.page,
    );
  }
}
