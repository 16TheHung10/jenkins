import { APIHelper } from 'helpers';
import AccountState from 'helpers/AccountState';
import { AlertHelper } from 'helpers';

import { decodeToken } from 'react-jwt';
import axiosInstance from 'api/AxiosInstance';

export let refreshApiRequest = null;

const apiRefreshtoken = '/account/refreshtoken';

const refreshToken = (url) => {
  return new Promise((resolve, reject) => {
    let refreshToken = AccountState.getInstance().getRefreshToken();
    let obj = { refreshtoken: refreshToken };

    axiosInstance.post(process.env.REACT_APP_API_AUTHENTICATION_URL + apiRefreshtoken, obj).then((res) => {
      if (res.status && res.data) {
        resolve(res.data);
      }
    });
  });
};

const isExpiredToken = (token) => {
  if (token) {
    let decode = decodeToken(token);
    let currentDate = new Date();
    return decode && decode.exp * 1000 < currentDate.getTime();
  }
  return false;
};

const requestApi = async (func) => {
  let token = AccountState.getInstance().getAccessToken();
  if (!token) {
    if (func !== undefined) return func;
  } else {
    if (isExpiredToken(token)) {
      refreshApiRequest = refreshApiRequest
        ? refreshApiRequest
        : refreshToken().catch((error) => {
            if (error.response !== undefined) {
              if (APIHelper.callBack401 !== undefined) {
                APIHelper.callBack401();
              }

              AlertHelper.showAlert(error.response.data.message, 'error');
              return error.response.data;
            }
            return {
              status: 0,
              message: error.response ? error.response.data.message : 'System error!',
            };
          });

      let newToken = await refreshApiRequest;
      refreshApiRequest = null;

      AccountState.getInstance().hanldeUpdateProfile(newToken);
      if (func !== undefined) return func;
    } else {
      if (func !== undefined) return func;
    }
  }
};

export default requestApi;
