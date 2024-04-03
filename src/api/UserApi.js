import { AuthApi } from "./AuthApi";

const UserApi = {
  blockForever: (params) => {
    return AuthApi.post("url", params);
  },
  getUserInfo: (userID) => {
    return AuthApi.get(
      `/hrm/employee/${userID}`,
      null,
      null,
      "https://devapi.gs25.com.vn",
    );
  },
};

export default UserApi;
