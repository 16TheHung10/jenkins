import { message } from 'antd';
import Axios from 'axios';
import { UrlHelper } from 'helpers';
import authMessage from 'message/auth.message';
// import React from 'react'

const gotoLogin = () => {
  localStorage.clear();
  authMessage['Unauthorized']();
  window.location.href = '/login';
};
const getStoreHash = (url, params) => {
  const regexGetStoreCode = /VN\d{4}/;
  let StoreHash = '';
  let storeCode = '';

  if (params?.storeCode) {
    storeCode = params?.storeCode;
  } else {
    const match = url.match(regexGetStoreCode);
    if (match) storeCode = match[0];
  }

  const localDataJSON = localStorage.getItem('cachedData');
  if (storeCode) {
    StoreHash = localDataJSON ? JSON.parse(localDataJSON)?.data?.stores?.[storeCode]?.storeHash : '';
  }
  return StoreHash;
};
let cancelTokenSource = Axios.CancelToken.source();
let count = 1;
const requestTracker = {};
const DefaultApi = (
  method,
  url,
  data,
  token,
  rootDomain,
  timeout = 30000,
  contentType = 'application/json',
  config = {}
) => {
  const StoreHash = getStoreHash(url, data);
  const urlRefreshtoken = '/account/refreshtoken';
  const headers = {
    'Content-Type': contentType,
    StoreHash: StoreHash,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
  }
  const apiUrl = rootDomain ? `${rootDomain}${url}` : `${process.env.REACT_APP_API_EXT_URL}${url}`;
  const options = {
    method,
    headers,
  };
  if (data) {
    if (method.toLowerCase() === 'get') {
      options.params = data;
    }
    options.data = contentType === 'application/json' ? JSON.stringify(data) : data;
  }
  let objKey = { ...(data || {}), url, rootDomain, contentType, config };
  const requestKey = JSON.stringify(objKey);
  // if (method.toLowerCase() === 'get') {
  //   if (requestTracker[requestKey]) {
  //     requestTracker[requestKey].cancel('Canceled by the latest request');
  //   }
  //   const cancelTokenSource = Axios.CancelToken.source();

  //   // Lưu trữ cancel token mới vào đối tượng theo dõi
  //   requestTracker[requestKey] = cancelTokenSource;
  // }

  const fetchPromise = Axios(apiUrl, { ...options, ...config, cancelToken: cancelTokenSource.token }).then(
    (response) => {
      if (response.status === 200) {
        delete requestTracker[requestKey];
        return response.data;
      } else if (response.status === 204) {
        return Promise.resolve();
      }
    }
  );

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);
  });
  return Promise.race([fetchPromise, timeoutPromise])
    .then((res) => res)
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 401) {
          if (count >= 2) {
            if (!window.location.pathname?.toUpperCase() === '/') {
              localStorage.removeItem('accessToken');
              setTimeout(() => {
                count = 1;
                gotoLogin();
              }, 1000);
            }
            return error.response.data;
          }
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            return Axios.post(process.env.REACT_APP_API_AUTHENTICATION_URL + urlRefreshtoken, { refreshToken })
              .then((res) => {
                const refreshData = res.data.data;
                if (refreshData.token) {
                  localStorage.setItem('accessToken', refreshData.token);
                }
                if (refreshData.refreshToken) {
                  localStorage.setItem('refreshToken', refreshData.refreshToken);
                }
                count++;
                return DefaultApi(method, url, data, refreshData.token, rootDomain, timeout);
              })
              .catch((err) => {
                gotoLogin();
                return err.response.data;
              });
          } else {
            gotoLogin();
            return error?.response?.data;
          }
        } else if (error.response.status === 403) {
          return { ...error.response.data, message: 'Please wait !!!' };
        } else if (error.response.status === 422) {
          return {
            ...error?.response?.data,
            message: error.response.data?.message,
          };
        } else {
          return { ...error?.response?.data, message: 'Feature is updating' };
        }
      } else {
        return { status: 0, message: 'Feature is updating' };
      }
    });
};
const AuthApi = {
  get: (url, data, token, rootDomain, timeout = 30000, config) => {
    return DefaultApi('GET', url, data, token, rootDomain, timeout, 'application/json', config);
  },
  getAndSetUrl: (url, data, token, rootDomain, timeout = 30000, config) => {
    UrlHelper.setSearchParamsFromObject(data);
    return DefaultApi('GET', url, data, token, rootDomain, timeout, 'application/json', config);
  },
  post: (url, data, token, rootDomain, timeout = 30000, contentType, config) => {
    return DefaultApi('POST', url, data, token, rootDomain, timeout, contentType, config);
  },
  put: (url, data, token, rootDomain, timeout = 30000, config) => {
    return DefaultApi('PUT', url, data, token, rootDomain, timeout, 'application/json', config);
  },
  delete: (url, data, token, rootDomain, timeout = 30000, config) => {
    return DefaultApi('DELETE', url, data, token, rootDomain, timeout, 'application/json', config);
  },
};
export { AuthApi };
