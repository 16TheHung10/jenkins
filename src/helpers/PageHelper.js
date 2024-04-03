import { DateHelper } from 'helpers';

class PageHelper {
  storages: null;
  history: null;
  static instance = null;

  static createInstance() {
    var object = new PageHelper();
    return object;
  }

  static getInstance() {
    if (!PageHelper.instance) {
      PageHelper.instance = PageHelper.createInstance();
      PageHelper.instance.storages = {};
      PageHelper.instance.history = {};
    }
    return PageHelper.instance;
  }

  addFetch(key, value) {
    if (value !== undefined && PageHelper.getInstance().storages[key] === undefined) {
      PageHelper.getInstance().storages[key] = value;
    }
    return PageHelper.getInstance().storages[key];
  }

  addHistory(key, value) {
    PageHelper.getInstance().history[key] = value;
  }

  getHistory(key) {
    if (!PageHelper.getInstance().history) {
      return null;
    }
    return PageHelper.getInstance().history[key];
  }

  getValue(key) {
    return PageHelper.getInstance().storages[key];
  }

  static pushHistoryState(params, value) {
    let url = window.location.href;
    if ((typeof params === 'string' || params instanceof String) && value) {
      url = PageHelper.replaceUrlParam(url, 'action', 'load');
      window.history.pushState({ urlPath: window.location.href }, '', PageHelper.replaceUrlParam(url, params, value));
    } else {
      for (var i in params) {
        if (params[i] instanceof Date) {
          url = PageHelper.replaceUrlParam(url, i, params[i] ? DateHelper.displayDateTimeFormat(params[i]) : '');
        } else {
          url = PageHelper.replaceUrlParam(url, i, params[i]);
        }
      }
      url = PageHelper.replaceUrlParam(url, 'action', 'load');
      window.history.pushState({ urlPath: window.location.href }, '', url);
    }
  }

  static logHistory(key) {
    var queryString = window.location.search.substring(1).trim();
    PageHelper.getInstance().addHistory(key, window.location.pathname + (queryString ? '?' + queryString : ''));
  }

  static updateFilters(filters, filterCallBack) {
    var s = window.location.search.substring(1);
    var pArray = s === '' ? [] : s.split('&');
    for (var i = 0; i < pArray.length; i++) {
      var pName = pArray[i].split('=');
      if (pName[0]) {
        filters[pName[0]] = pName[1] ? decodeURIComponent(pName[1]) : '';
      }
    }
    var status = true;
    if (filterCallBack !== undefined) {
      status = filterCallBack(filters);
    }
    return status && filters['action'] === 'load';
  }

  static replaceUrlParam(url, paramName, paramValue) {
    if (paramValue == null) {
      paramValue = '';
    }

    var pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)');
    if (url.search(pattern) >= 0) {
      return url.replace(pattern, '$1' + paramValue + '$2');
    }

    url = url.replace(/[?#]$/, '');
    return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
  }

  static getHashParams() {
    var hashParams = {};
    var e,
      a = /\+/g,
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) {
        return decodeURIComponent(s.replace(a, ' '));
      },
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) hashParams[d(e[1])] = d(e[2]);
    return hashParams;
  }
}

export default PageHelper;
