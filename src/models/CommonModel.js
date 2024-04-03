import BaseModel from 'models/BaseModel';
import { APIHelper } from 'helpers';

import AccountState from 'helpers/AccountState';

class CommonModel extends BaseModel {
  async getData(type) {
    if (type === '' || (AccountState.getInstance().getProfile('storeCode') && type === 'store')) {
      return new Promise((resolve, reject) => {
        return {};
      });
    }
    let excludedStoreType = type.replace('store', '');
    excludedStoreType = type.replace('stv1', 'store');
    let storeUserApi;
    let restApi;

    if (excludedStoreType) restApi = this.cache('/common/object/types=' + excludedStoreType);
    else {
      restApi = new Promise((resolve, reject) => {
        resolve({ data: null, status: 1, message: '' });
      });
    }
    if (type.includes('store')) storeUserApi = this.cache('/commonv2/object/types=storeuser');
    else {
      storeUserApi = new Promise((resolve, reject) => {
        resolve({ data: null, status: 1, message: '' });
      });
    }
    let [res1, res2] = await Promise.all([restApi, storeUserApi]);
    const res = {
      data: { ...(res1?.data || {}), ...(res2?.data || {}) },
      status: res1.status && res2.status,
      message: res1.message || res2.message,
    };
    return res;
  }
  getDataV2(type) {
    if (type === '' || (AccountState.getInstance().getProfile('storeCode') && type === 'store')) {
      return new Promise((resolve, reject) => {
        return {};
      });
    }
    return this.cache('/commonv2/object/types=' + type);
  }
  getConfig() {
    return this.cache('/common/config');
  }
  getDataBillDetail(storeCode, startdate, enddate, type) {
    if (type === '' || (AccountState.getInstance().getProfile('storeCode') && type === 'store')) {
      return new Promise((resolve, reject) => {
        return {};
      });
    }
    return this.cache(
      '/common/object/types=' + type + '?storeCode=' + storeCode + '&startdate=' + startdate + '&enddate=' + enddate
    );
  }
  getUserManual() {
    return this.cache('/common/usermanual-structure');
  }

  getMenuList() {
    return this.cache('/setting/menus');
  }

  getAreaStore() {
    return this.cache('/customerservice/mobileapp/addresscity');
  }

  getRegion() {
    return this.cache('/common/object/types=region');
  }
  getCampain() {
    return this.cache('/common/object/types=campaign');
  }
  getDivisions() {
    return this.cache('/common/object/types=division');
  }

  getBank() {
    return this.cache('/common/object/types=bank');
  }
}

export default CommonModel;
