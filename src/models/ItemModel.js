import { APIHelper } from "helpers";

class ItemModel {
  getInfo(itemID, storeCode) {
    return APIHelper.get(
      "/item/info?storeCode=" + storeCode + "&itemID=" + itemID,
    );
  }

  getBarcodeItems(params) {
    return APIHelper.get("/item/printtemp", params);
  }

  getBarcodePrint(params) {
    return APIHelper.post("/item/print", params);
  }

  importBarcode(codeId, params) {
    return APIHelper.post("/item/storeitems?storecode=" + codeId, params);
  }

  getItems(params) {
    return APIHelper.get("/item", params);
  }
  getItemDetail(itemCode) {
    return APIHelper.get("/item/" + itemCode);
  }

  getDisposalItems(params) {
    return APIHelper.get("/item/disposal", params);
  }

  getReturnItems(params) {
    return APIHelper.get("/item/return", params);
  }

  getTransferItems(params) {
    return APIHelper.get("/item/transfer", params);
  }

  getAllItems(storeCode = "", rootUrl = null, cacheAge = 15) {
    return APIHelper.get(
      "/item/all" + (storeCode ? "?storeCode=" + storeCode : ""),
      null,
      rootUrl,
      cacheAge,
    );
  }

  createTypes(params) {
    return APIHelper.post("/productorder/createdtype", params);
  }

  updateTypes(typeID, params) {
    return APIHelper.put("/productorder/" + typeID + "/updatetype", params);
  }

  updateMenu(typeID, params) {
    return APIHelper.put("/setting/foodmenu/" + typeID, params);
  }

  getData(type) {
    return APIHelper.get("/common/object/types=" + type);
  }
}

export default ItemModel;
