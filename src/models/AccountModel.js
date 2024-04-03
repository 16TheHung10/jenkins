import { APIHelper } from "helpers";

class AccountModel {
  getToken(params) {
    return APIHelper.post(
      "/account/token",
      params,
      process.env.REACT_APP_API_AUTHENTICATION_URL,
    );
  }

  verifyExternalToken(params) {
    return APIHelper.post(
      "/account/external/token/verify",
      params,
      process.env.REACT_APP_API_AUTHENTICATION_URL,
    );
  }

  getAccount(authToken) {
    return APIHelper.postAuth(
      "/account/verify-token",
      authToken,
      process.env.REACT_APP_API_AUTHENTICATION_URL,
    );
  }
}

export default AccountModel;
