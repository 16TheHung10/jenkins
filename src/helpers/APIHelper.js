import { message } from 'antd';
import AccountState from 'helpers/AccountState';
import requestApi from 'helpers/CheckTokenExpired';
import Loading from 'helpers/Loading';
import UrlHelper from './UrlHelper';
import axiosInstance from 'api/AxiosInstance';
import Axios from 'axios';

let APIHelper = {
  async withParams(paramsObj, fn) {
    const res = await fn();
    if (res.status) {
      const searchParams = UrlHelper.setSearchParamsFromObject(paramsObj);
    }
    return res;
  },

  getHeaders(accessToken = null, cacheAge = 0, rest) {
    if (accessToken == null) {
      accessToken = AccountState.getInstance().getAccessToken();
    }
    let a = {};
    if (cacheAge === 0) {
      a = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: accessToken ? 'Bearer ' + accessToken : null,
        ...rest,
      };
    } else {
      a = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'max-age=' + cacheAge,
        Authorization: accessToken ? 'Bearer ' + accessToken : null,
        ...rest,
      };
    }
    return a;
  },

  getStoreHash(url, params) {
    const regexGetStoreCode = /VN\d{4}/;
    let StoreHash = '';
    let storeCode = '';

    if (params?.storeCode) {
      storeCode = params?.storeCode;
    } else if (params?.StoreCode) {
      storeCode = params?.StoreCode;
    } else {
      const match = url.match(regexGetStoreCode);
      if (match) storeCode = match[0];
    }
    const localDataJSON = localStorage.getItem('cachedData');
    if (storeCode) {
      StoreHash = localDataJSON ? JSON.parse(localDataJSON)?.data?.stores?.[storeCode]?.storeHash : '';
    }
    return StoreHash;
  },

  async hanldeCheckToken(rootUrl, url, params, type, cacheAge = 0, maxTimeout = 15000, extraHeaders = null) {
    extraHeaders = { ...extraHeaders, StoreHash: APIHelper.getStoreHash(url, params) };
    switch (type) {
      case 'GET':
        return await requestApi(APIHelper.returnAxiosGet(rootUrl, url, params, cacheAge, maxTimeout, extraHeaders));
      case 'POST':
        return await requestApi(APIHelper.returnAxiosPost(rootUrl, url, params, extraHeaders, maxTimeout));
      case 'PUT':
        return await requestApi(APIHelper.returnAxiosPut(rootUrl, url, params, extraHeaders));
      case 'DELETE':
        return await requestApi(APIHelper.returnAxiosDelete(rootUrl, url, params));
      default:
        return;
    }
  },

  get(url, params = null, rootUrl = null, cacheAge = 15, maxTimeout = 15000, extraHeaders = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_URL;
    }
    return APIHelper.hanldeCheckToken(rootUrl, url, params, 'GET', cacheAge, maxTimeout, extraHeaders);
  },

  download(url, filename, params = null, type = null) {
    Loading.showLoading(true);
    return Axios.get(url, {
      params: params,
      responseType: 'blob',
      headers: APIHelper.getHeaders(),
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename + (type === null ? '.pdf' : type));
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {})
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  downloadTxt(url, filename, params = null, type = null) {
    Loading.showLoading(true);

    return Axios.get(url, {
      params: params,
      responseType: 'blob',
      headers: APIHelper.getHeaders(),
    })
      .then(async (response) => {
        const result = await response.data.text();
        return result;
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  put(url, params = null, rootUrl = null, extraHeaders = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_URL;
    }

    return APIHelper.hanldeCheckToken(rootUrl, url, params, 'PUT', null, 15000, extraHeaders);
  },

  post(url, params = null, rootUrl = null, extraHeaders = null, timeout = 15000) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_URL;
    }

    return APIHelper.hanldeCheckToken(rootUrl, url, params, 'POST', null, timeout, extraHeaders);
  },

  delete(url, params = null, rootUrl = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_URL;
    }

    return APIHelper.hanldeCheckToken(rootUrl, url, params, 'DELETE');
  },

  err(error) {
    if (error.response !== undefined) {
      if (error.response.data.status === 0 && error.response.data.statusCode === 401) {
        // AlertHelper.showAlert(error.response.data.message, 'error');
        message.error({
          content: error.response.data.message,
          key: 'permission',
        });
        if (!window.location.pathname?.toUpperCase() === '/') {
          localStorage.removeItem('accessToken');
          setTimeout(() => {
            window.location.replace('/login');
          }, 1000);
        }

        return error.response.data;
      } else if (error.response.status === 403) {
        return { ...error.response.data, message: 'Please wait !!!' };
      } else if (error.response.status === 422) {
        return {
          ...error?.response?.data,
          message: error.response.data?.message,
        };
      } else if (error.response.data.statusCode === 404) {
        return { ...error.response.data, message: 'Feature is updating' };
      }
    }
    return {
      status: 0,
      message: error.response ? error.response.data.message : 'Hệ thống đang bận, vui lòng quay lại sau',
    };
  },

  postAuth(url, authToken, rootUrl = null, params = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_URL;
    }
    Loading.showLoading(true);
    return axiosInstance
      .post(rootUrl + url, params, {
        headers: APIHelper.getHeaders(authToken),
        timeout: 15000,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return APIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  getHeadersNoteBearer(accessToken = null) {
    if (accessToken == null) {
      accessToken = AccountState.getInstance().getAccessToken();
    }

    return {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: accessToken ? accessToken : null,
    };
  },

  getAuth(url, authToken, rootUrl = null, params = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_URL;
    }
    Loading.showLoading(true);

    return axiosInstance
      .get(rootUrl + url, {
        params: params,
        headers: APIHelper.getHeadersNoteBearer(authToken),
        timeout: 15000,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return APIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  returnAxiosGet(rootUrl, url, params, cacheAge = 0, maxTimeout = 15000, extraHeaders) {
    Loading.showLoading(true);
    return axiosInstance
      .get(rootUrl + url, {
        params: params,
        headers: { ...APIHelper.getHeaders(null, cacheAge), ...extraHeaders },
        timeout: maxTimeout,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return APIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  returnAxiosPost(rootUrl, url, params, extraHeaders = null, maxTimeout = 15000) {
    Loading.showLoading(true);
    return axiosInstance
      .post(rootUrl + url, params, {
        headers: { ...APIHelper.getHeaders(), ...extraHeaders },
        timeout: maxTimeout,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return APIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  returnAxiosPut(rootUrl, url, params, extraHeaders = null) {
    Loading.showLoading(true);

    return axiosInstance
      .put(rootUrl + url, params, {
        headers: { ...APIHelper.getHeaders(), ...extraHeaders },
        timeout: 15000,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return APIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  returnAxiosDelete(rootUrl, url, params) {
    Loading.showLoading(true);

    return axiosInstance
      .delete(rootUrl + url, {
        data: params,
        headers: APIHelper.getHeaders(),
        timeout: 15000,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return APIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },
};

export default APIHelper;
