import { AuthApi } from "./AuthApi";

const CustomerServiceApi = {
  getCancelAccounts: (params) => {
    return AuthApi.getAndSetUrl(
      "/customerservice/mobileapp/account/delete",
      params,
    );
  },
  approveCancelAccount(memberCode, reason) {
    const payload = {
      AccountEnabled: true,
      Note: reason,
    };
    return AuthApi.put(
      `/customerservice/mobileapp/account/${memberCode}/delete`,
      payload,
    );
  },
};

export default CustomerServiceApi;
