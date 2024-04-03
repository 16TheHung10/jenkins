// import React from 'react'

import React, { useState } from 'react';
import { telegramNoti } from './TelegramHelper';
import { message } from 'antd';
import moment from 'moment/moment';
import { AuthApi } from 'api/AuthApi';

const apiRoot = process.env.REACT_APP_API_STORE_MANAGEMENT_URL;
const refreshApiUrl = process.env.REACT_APP_API_AUTHENTICATION_URL;
const urlRefreshtoken = '/account/refreshtoken';

let isRefreshingToken = false;
let tokenRefreshPromise = null;

const fetchData = async (
  url,
  method,
  data,
  token,
  rootDomain,
  typePage,
  cacheControl = 'no-cache',
  timeout = 30000,
  objectID = null
) => {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': cacheControl !== 'no-cache' ? cacheControl : method.toUpperCase() === 'GET' ? 3 : cacheControl,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
  }

  const regexGetStoreCode = /VN\d{4}/;
  const match = url.match(regexGetStoreCode);

  const getStoreHash = (data, match) => {
    const storeCode = data?.storeCode || data?.storecode || match?.[0];
    const localDataJSON = localStorage.getItem('cachedData');
    const StoreHash = storeCode ? JSON.parse(localDataJSON)?.data?.stores?.[storeCode]?.storeHash : '';
    return { storeCode, StoreHash };
  };
  const { storeCode, StoreHash } = getStoreHash(data, match);
  if (storeCode) {
    headers['StoreHash'] = StoreHash;
  }

  const isParamsBodyInUrl = url.includes('?isPramsBody=true');

  let newRoot = '';
  let newApiRoot = '';
  let urlPage =
    (method.toUpperCase() === 'GET' ||
      (method.toUpperCase() === 'DELETE' && (isParamsBodyInUrl == undefined || isParamsBodyInUrl == false))) &&
    data
      ? `${url}?${new URLSearchParams(data)}`
      : url;

  if (JSON.parse(localStorage.getItem('profile'))?.storeCode == 'TR0001') {
    let role = JSON.parse(localStorage.getItem('profile'))?.role;

    if (rootDomain === process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL) {
      newRoot = process.env.REACT_APP_TRAIN_ANALYTIC_REPORT_ROOT_URL;
      newApiRoot = process.env.REACT_APP_TRAIN_ANALYTIC_REPORT_ROOT_URL;
    } else if (rootDomain === process.env.REACT_APP_API_STORE_MANAGEMENT_URL) {
      newRoot = process.env.REACT_APP_TRAIN_STORE_MANAGEMENT_URL;
      newApiRoot = process.env.REACT_APP_TRAIN_STORE_MANAGEMENT_URL;
    } else {
      newRoot = process.env.REACT_APP_TRAIN_STORE_MANAGEMENT_URL;
      newApiRoot = process.env.REACT_APP_TRAIN_STORE_MANAGEMENT_URL;
    }
  } else {
    newRoot = rootDomain;
    newApiRoot = apiRoot;
  }

  const apiUrl = rootDomain ? `${newRoot}${urlPage}` : `${newApiRoot}${urlPage}`;

  const options = {
    method,
    headers,
  };

  if (data && method.toUpperCase() !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const fetchPromise = fetch(apiUrl, options);

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);
  });

  try {
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    if (response.status === 401) {
      if (!isRefreshingToken) {
        isRefreshingToken = true;
        tokenRefreshPromise = refreshAccessToken();
      }
      await tokenRefreshPromise;
      return fetchData(url, method, data, null, newRoot, typePage, cacheControl, timeout, objectID);
    } else if (response.ok) {
      if (response.status === 204) {
        // Nếu response không có kết quả (status code 204), trả về rỗng
        return Promise.resolve({ message: 204 });
      }

      if (['POST', 'PUT', 'DELETE'].includes(method.toUpperCase()) && objectID != null) {
        await logRequest(method, url, data, token, objectID);
      }

      return response?.json();
    } else if (response.status === 503) {
      // Nếu statusCode là 503, trả về rỗng
      return Promise.resolve({ message: 503 });
    } else if (response.status === 422) {
      return response?.json();
    } else if (response.status === 404) {
      let obj = {
        errorCode: 404,
        appName: 'SM',
        url: apiUrl,
        storeCode: JSON.parse(localStorage.getItem('profile'))?.storeCode,
        name: JSON.parse(localStorage.getItem('profile'))?.name,
        typePage,
      };
      telegramNoti(obj);
      return Promise.resolve({ message: 404 });
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    console.error(error);
    return Promise.resolve();
  }
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      // Handle not having a refresh token, possibly redirect to login
      logout();
      return;
    }

    const response = await fetch(`${refreshApiUrl}${urlRefreshtoken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const { data } = await response.json();
      const { token, refreshToken } = data;
      localStorage.setItem('accessToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      isRefreshingToken = false;
    } else {
      isRefreshingToken = false;
      // Handle refresh token failure, possibly redirect to login
      logout();
    }
  } catch (error) {
    isRefreshingToken = false;
    console.error(error);
    // Handle refresh token error, possibly redirect to login
    logout();
  }
};

const logout = () => {
  window.location.href = '/user/login';
  localStorage.clear();
  message.error('Unauthorized');
};

const downloadFile = async (fileUrl, typeFile, token = null) => {
  try {
    const headers = {
      Authorization: token !== null ? `Bearer ${token}` : `Bearer ${localStorage.getItem('accessToken')}`,
    };

    const response = await fetch(fileUrl, {
      method: 'GET',
      headers,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const nameFile = url.split('/').pop();

      const a = document.createElement('a');
      a.href = url;
      a.download = 'nameFile'; // Tên tệp tải về
      a.style.display = 'none';
      a.setAttribute('download', nameFile + (typeFile === null ? '.pdf' : typeFile));
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // Xử lý lỗi nếu có
      console.error('Lỗi tải tệp:', response.statusText);
    }
  } catch (error) {
    console.error('Lỗi khi tải tệp:', error);
  }
};

const fetchReport = async (
  url,
  method,
  data,
  token,
  rootDomain,
  typePage,
  cacheControl = 'no-cache',
  timeout = 30000,
  objectID = null
) => {
  const response = await fetchData(
    url,
    method,
    data,
    token,
    process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL,
    typePage,
    (cacheControl = 'no-cache'),
    (timeout = 30000),
    objectID
  );
  return response;
};

const logRequest = async (method, url, data, token, objectID) => {
  const action =
    method.toUpperCase() === 'POST'
      ? 0
      : method.toUpperCase() === 'PUT'
      ? 1
      : method.toUpperCase() === 'DELETE'
      ? 2
      : 3;
  const logApiUrl = '/logging/internal'; // Điền URL của API log
  try {
    const logApiResponse = await AuthApi.post(
      logApiUrl,
      JSON.stringify({
        Action: action,
        Type: 2,
        App: 10,
        Date: moment().clone().format('YYYY-MM-DD'),
        Level: 1,
        ObjectID: objectID,
        Title: url,
        Msg: data,
      })
    );

    if (!logApiResponse.ok) {
      console.error('Error logging request:', logApiResponse.statusText);
    }
  } catch (error) {
    console.error('Error logging request:', error);
  }
};

const fetchWithObjectID = ({
  objectID = null,
  url,
  method,
  data,
  token,
  rootDomain,
  typePage,
  cacheControl,
  timeout,
}) => {
  return fetchData(url, method, data, token, rootDomain, typePage, cacheControl, timeout, objectID);
};

export { fetchData, downloadFile, fetchReport, fetchWithObjectID };
