import { AuthApi } from "./AuthApi";

const AppApi = {
  getMenu: () => {
    return AuthApi.get("/setting/menus");
  },
};
export default AppApi;
