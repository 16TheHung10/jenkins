import APIHelper from "helpers/APIHelper";
import BaseModel from "models/BaseModel";

class InternalOrderModel extends BaseModel {
  getListIO(params = null, rootUrl = null) {
    return APIHelper.get("/internalorder", params, rootUrl);
  }

  getIO(orderCode, skipItems = true, rootUrl = null) {
    return APIHelper.get(
      "/internalorder/" + orderCode + "?skipItems=" + skipItems,
      null,
      rootUrl,
    ).then((response) => {
      if (response.status && response.data.ioItems) {
        //<Filter duplicate item>
        let itemsResponse = response.data.ioItems;
        let itemsTemp = {};
        let items = [];
        for (var index in itemsResponse) {
          let item = itemsResponse[index];
          if (itemsTemp[item.itemCode] === undefined) {
            itemsTemp[item.itemCode] = item;
          } else {
            itemsTemp[item.itemCode].qty += item.qty;
          }
        }

        for (var index in itemsTemp) {
          items.push(itemsTemp[index]);
        }
        response.data.ioItems = items;
        //</Filter duplicate item>
      }
      return response;
    });
  }

  deleteIO(orderCode, rootUrl = null) {
    return APIHelper.delete("/internalorder/" + orderCode, null, rootUrl);
  }

  approveIO(orderCode, rootUrl = null) {
    return APIHelper.put(
      "/internalorder/" + orderCode + "/approve",
      null,
      rootUrl,
    );
  }

  createIO(params, rootUrl = null) {
    return APIHelper.post("/internalorder", params, rootUrl);
  }

  updateIO(orderCode, params, rootUrl = null) {
    return APIHelper.put("/internalorder/" + orderCode, params, rootUrl);
  }

  deleteMultiIO(params, rootUrl = null) {
    return APIHelper.delete("/internalorder", params, rootUrl);
  }

  approveMultiIO(params, rootUrl = null) {
    return APIHelper.put("/internalorder/approve", params, rootUrl);
  }

  checkOrderDateIO(orderDate, storeCode, rootUrl = null) {
    return APIHelper.get(
      "/internalorder/isvalid?orderDate=" +
        orderDate +
        "&storeCode=" +
        storeCode,
      null,
      rootUrl,
    );
  }

  deleteIOByOrderDate(orderDate, storeCode, rootUrl = null) {
    return APIHelper.delete(
      "/internalorder/filter?orderDate=" +
        orderDate +
        "&storeCode=" +
        storeCode,
      null,
      rootUrl,
    );
  }

  getOrderCodeByLastWeek(storeCode, orderDate, rootUrl = null) {
    return APIHelper.get(
      "/internalorder/ordercode?orderDate=" +
        orderDate +
        "&storeCode=" +
        storeCode,
      null,
      rootUrl,
    );
  }

  importIO(storeCode, orderDate, params, rootUrl = null) {
    return APIHelper.post(
      "/internalorder/import?storeCode=" +
        storeCode +
        "&orderDate=" +
        orderDate,
      params,
      rootUrl,
    );
  }

  restoreIO(orderCode, rootUrl = null) {
    return APIHelper.put("/internalorder/restore/" + orderCode, null, rootUrl);
  }

  getItemOrder(params = null, rootUrl = null) {
    return APIHelper.get(
      "/ext/portal/item/master/new-item-order",
      params,
      "https://api.gs25.com.vn:8091",
    );
  }

  getSOH(storeCode, params = null, rootUrl = null, typePage = null) {
    // return APIHelper.getAuth('/ext/inventory-sm/stock/' + storeCode + '/basic', "000C741D556F79C7792100646B80572A" , "https://api.gs25.com.vn:8091",params);
    return APIHelper.getAuth(
      "/inventory/stock/" + storeCode + "/basic",
      "000C741D556F79C7792100646B80572A",
      process.env.REACT_APP_INVENTORY_REPORT_ROOT_URL,
      params,
      typePage,
    );
  }
}

export default InternalOrderModel;
