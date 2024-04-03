import { AlertHelper, PageHelper } from "helpers";
import AccountState from "helpers/AccountState";
import AccountModel from "models/AccountModel";
import * as Msal from "msal";

class MSAzureHelper {
  static instance = null;

  static getInstance() {
    if (!MSAzureHelper.instance) {
      MSAzureHelper.instance = new MSAzureHelper();
      MSAzureHelper.instance.MSAL = new Msal.UserAgentApplication({
        auth: {
          clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
          authority: process.env.REACT_APP_AZURE_AUTHORITY,
          redirectUri: process.env.REACT_APP_AZURE_REDIRECT_URI,
          postLogoutRedirectUri: process.env.REACT_APP_AZURE_LOGOUT_URI,
          navigateToLoginRequestUrl: false,
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: true,
        },
      });
      MSAzureHelper.instance.MSAL.handleRedirectCallback(
        function (error, response) {
          if (response) {
            MSAzureHelper.getInstance().isCallbackWorked = true;
            MSAzureHelper.getInstance().accquireToken();
          }
        },
      );
    }
    return MSAzureHelper.instance;
  }

  verifyExternalToken(accessToken) {
    let userInfo = this.MSAL.getAccount();
    let accountType = 2;
    let accountModel = new AccountModel();
    accountModel
      .verifyExternalToken({
        username: userInfo["userName"],
        email: userInfo["userName"],
        externalID: userInfo["accountIdentifier"],
        accessToken: accessToken,
        accountType: accountType,
        employeeCode: "",
        storeCode: "",
      })
      .then((response) => {
        if (response.status) {
          AccountState.getInstance().updateLogin(
            {
              name: userInfo["name"],
              role: response.data.role,
              email: userInfo["userName"],
              accountType: accountType,
              accountToken: accessToken,
              storeCode: response.data.storeCode,
              storeName: response.data.storeName,
            },
            response.data.token,
            response.data.refreshToken,
          );
          MSAzureHelper.getInstance().targetDefaultPage();
        } else {
          MSAzureHelper.getInstance().targetLoginFailed();
        }
      });
  }

  MSAL = null;
  isCallbackWorked = false;
  requestConfig = {
    scopes: ["user.read"],
  };

  login() {
    if (this.MSAL.getAccount()) {
      this.accquireToken(this.accquireTokenCallback);
    } else {
      this.MSAL.loginRedirect(this.requestConfig);
    }
  }

  isLogin() {
    return this.MSAL.getAccount() ? true : false;
  }

  logout() {
    this.MSAL.logout();
  }

  accquireToken() {
    let objMe = this.MSAL;
    objMe
      .acquireTokenSilent(this.requestConfig)
      .then(function (accessTokenResponse) {
        MSAzureHelper.getInstance().verifyExternalToken(
          accessTokenResponse.accessToken,
        );
      })
      .catch(function (error) {
        if (
          error.errorMessage &&
          error.errorMessage.indexOf("interaction_required") !== -1
        ) {
          objMe
            .acquireTokenRedirect(objMe.requestConfig)
            .then(function (accessTokenResponse) {
              MSAzureHelper.getInstance().verifyExternalToken(
                accessTokenResponse.accessToken,
              );
            })
            .catch(function (error) {
              AlertHelper.showAlert("Can not login MS Azure");
              MSAzureHelper.getInstance().targetDefaultPage();
            });
        } else {
          AlertHelper.showAlert("Can not login MS Azure");
          MSAzureHelper.getInstance().targetDefaultPage();
        }
      });
  }

  targetDefaultPage() {
    PageHelper.getInstance().getValue("page").targetHome();
  }

  targetLoginFailed() {
    PageHelper.getInstance().getValue("page").targetLink("/message/loginfail");
  }
}

export default MSAzureHelper;
