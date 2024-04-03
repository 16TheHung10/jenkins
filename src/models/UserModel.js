import { APIHelper } from "helpers";
class UserModel {
  getGroupUser() {
    return APIHelper.get("/common/object/Types=groupuser,store");
  }

  getAllMenu() {
    return APIHelper.get("/menu/all");
  }
  getPermissionMenu() {
    return APIHelper.get("/menu/permission");
  }
  postUser(params) {
    return APIHelper.post("/user", params);
  }
  getDetailUser(userID) {
    return APIHelper.get("/user/" + userID);
  }
  putUser(userID, params) {
    return APIHelper.put("/user/" + userID, params);
  }

  getListUser(params) {
    return APIHelper.get("/user", params);
  }

  putPermissionMenu(params) {
    return APIHelper.put("/menu/permission", params);
  }

  getAllUserOnline(params) {
    return APIHelper.post(
      "payload",
      params,
      process.env.REACT_APP_API_MESSAGE_HUB_URL,
    );
  }
  getUserOnline() {
    return APIHelper.get("/user/online", null, "https://portal.gs25.com.vn");
  }
  toggleStatus(userID) {
    return APIHelper.put(`/user/update-active/${userID}`);
  }

  getMSAccountStatus(email) {
    return APIHelper.get(`/user/microsoft/${email}`);
  }
  updateMSAccountStatus(email, AccountEnabled) {
    return APIHelper.put(`/user/microsoft/active/${email}`, { AccountEnabled });
  }
}

export default UserModel;
