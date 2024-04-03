import Axios from "axios";

import Loading from "helpers/Loading";
import { AlertHelper } from "helpers";
import requestApi from "helpers/CheckTokenExpired";

let AuthAPIHelper = {
  getHeaders() {
    return {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "000C741D556271C7712100546B80571E",
    };
  },

  async hanldeCheckToken(rootUrl, url, params, type) {
    switch (type) {
      case "GET":
        return await requestApi(
          AuthAPIHelper.returnAxiosGet(rootUrl, url, params),
        );
      case "POST":
        return await requestApi(
          AuthAPIHelper.returnAxiosPost(rootUrl, url, params),
        );
      case "PUT":
        return await requestApi(
          AuthAPIHelper.returnAxiosPut(rootUrl, url, params),
        );
      case "DELETE":
        return await requestApi(
          AuthAPIHelper.returnAxiosDelete(rootUrl, url, params),
        );
      default:
        return;
    }
  },

  get(url, params = null, rootUrl = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_GSLOYALTY;
    }

    return AuthAPIHelper.hanldeCheckToken(rootUrl, url, params, "GET");
  },

  download(url, filename, params = null, type = null) {
    Loading.showLoading(true);

    return Axios.get(url, {
      params: params,
      responseType: "blob",
      headers: AuthAPIHelper.getHeaders(),
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          filename + (type === null ? ".pdf" : type),
        );
        document.body.appendChild(link);
        link.click();
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  put(url, params = null, rootUrl = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_GSLOYALTY;
    }

    return AuthAPIHelper.hanldeCheckToken(rootUrl, url, params, "PUT");
  },

  post(url, params = null, rootUrl = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_GSLOYALTY;
    }

    return AuthAPIHelper.hanldeCheckToken(rootUrl, url, params, "POST");
  },

  delete(url, params = null, rootUrl = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_GSLOYALTY;
    }

    return AuthAPIHelper.hanldeCheckToken(rootUrl, url, params, "DELETE");
  },

  err(error) {
    if (error.response !== undefined) {
      if (error.response.data.statusCode === 401) {
        if (AuthAPIHelper.callBack401 !== undefined) {
          AuthAPIHelper.callBack401();
        }

        AlertHelper.showAlert(error.response.data.message, "error");
        return error.response.data;
      }
    }
    return {
      status: 0,
      message: error.response ? error.response.data.message : "System error!",
    };
  },

  postAuth(url, authToken, rootUrl = null, params = null) {
    if (rootUrl === null) {
      rootUrl = process.env.REACT_APP_API_EXT_GSLOYALTY;
    }
    Loading.showLoading(true);
    return Axios.post(rootUrl + url, params, {
      headers: AuthAPIHelper.getHeaders(authToken),
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return AuthAPIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  returnAxiosGet(rootUrl, url, params) {
    Loading.showLoading(true);

    return Axios.get(rootUrl + url, {
      params: params,
      headers: AuthAPIHelper.getHeaders(),
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return AuthAPIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  returnAxiosPost(rootUrl, url, params) {
    Loading.showLoading(true);

    return Axios.post(rootUrl + url, params, {
      headers: AuthAPIHelper.getHeaders(),
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return AuthAPIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  returnAxiosPut(rootUrl, url, params) {
    Loading.showLoading(true);

    return Axios.put(rootUrl + url, params, {
      headers: AuthAPIHelper.getHeaders(),
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return AuthAPIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },

  returnAxiosDelete(rootUrl, url, params) {
    Loading.showLoading(true);

    return Axios.delete(rootUrl + url, {
      data: params,
      headers: AuthAPIHelper.getHeaders(),
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return AuthAPIHelper.err(error);
      })
      .finally(function () {
        Loading.showLoading(false);
      });
  },
};

export default AuthAPIHelper;
