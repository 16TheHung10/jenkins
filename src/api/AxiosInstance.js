import axios from 'axios';
import moment from 'moment';
import qs from 'qs';

const validPath = ['/item/master'];

const baseUrl = process.env.REACT_APP_API_EXT_URL;
// const keyLang = localStorage.getItem('i18nextLng');
const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'content-type': 'application/json',
    // 'X-localization': keyLang,
  },
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});
// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
const handleLog = async ({ method, objectID, path, data, headers }) => {
  if (method.toUpperCase() === 'GET') {
    return;
  }

  let allowLog = headers.AllowLog;
  if (!allowLog) {
    for (let item of validPath) {
      if (path.includes(item)) {
        allowLog = true;
      }
    }
  }

  if (allowLog) {
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
      const logApiResponse = await axiosInstance.post(
        logApiUrl,
        {
          Action: action,
          Type: 2,
          App: 10,
          Date: moment().clone().format('YYYY-MM-DD'),
          Level: 1,
          ObjectID: objectID,
          Title: path,
          Msg: data,
        },
        {
          baseURL: 'https://api.gs25.com.vn:8091',
        }
      );
    } catch (error) {
      if (process.env.REACT_APP_ENVIRONMENT) {
        console.log({ error });
      }
    }
  }
};
// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    handleLog({
      method: response?.config?.method?.toUpperCase(),
      objectID: 1,
      path: response?.config?.url?.replace(response?.config?.baseURL, ''),
      data: response?.config?.method === 'get' ? response?.config?.params : response?.config?.data,
      headers: response?.config.headers,
    });
    return response;
  },
  function (error) {
    if (process.env.REACT_APP_ENVIRONMENT === 'DEV') {
      console.log({ error });
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
