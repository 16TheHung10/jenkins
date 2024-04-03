import { APIHelper } from "helpers";

class MenuModel {
  createMenu(params) {
    return APIHelper.post("/menu", params);
  }
  editMenu(menuID, params) {
    return APIHelper.put(`/menu/${menuID}`, params);
  }
  deleteMenu(menuID) {
    return APIHelper.delete(`/menu/${menuID}`);
  }
}

export default MenuModel;
