import { CacheHelper, StringHelper } from 'helpers';
import MSAzureHelper from 'helpers/MSAzureHelper';

class AccountState {
  static instance = null;

  static createInstance() {
    var object = new AccountState();
    object.isLogin = localStorage.getItem('isLogin') || false;
    return object;
  }

  static getInstance() {
    if (!AccountState.instance) {
      AccountState.instance = AccountState.createInstance();
    }
    return AccountState.instance;
  }

  profileStorage: null;
  isLogin: false;

  hasLogon() {
    let stt = localStorage.getItem('isLogin') || false;
    let now = new Date().getTime();
    let expiredIn = StringHelper.escapeNumber(localStorage.getItem('expiredIn'));

    if (stt && expiredIn <= now) {
      localStorage.clear();
      alert('Session expired');
      return false;
    }
    let accessToken = this.getAccessToken();
    return process.env.REACT_APP_SKIP_USER_LOGIN == 1 || ((stt === 'true' || stt !== 'false') && accessToken && accessToken !== '');
  }

  updateLogin(profile, accessToken, resfreshToken, partner) {
    let expiredMiliInConfig = StringHelper.escapeNumber(process.env.REACT_APP_LIFETIME_SESSION);
    let timeExpired = new Date().getTime() + expiredMiliInConfig * 1000;
    this.setProfile(profile);
    this.isLogin = true;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('isLogin', this.isLogin);
    localStorage.setItem('expiredIn', timeExpired);
    localStorage.setItem('refreshToken', resfreshToken);
    localStorage.setItem('partner', partner);
  }

  setProfile(profile) {
    localStorage.setItem('profile', JSON.stringify(profile));
  }

  getProfileStorage() {
    if (!this.profileStorage) {
      let profile = localStorage.getItem('profile');
      this.profileStorage = profile ? JSON.parse(profile) : null;
    }
    return this.profileStorage;
  }

  destroy() {
    let accountType = this.getProfile('accountType');
    this.profileStorage = null;
    this.isLogin = false;
    localStorage.clear();
    CacheHelper.getInstance().clear();
    if (accountType === 2) {
      MSAzureHelper.getInstance().logout();
    }
  }

  getAccessToken() {
    return localStorage.getItem('accessToken') || null;
  }

  getProfile(field) {
    if (this.isLogin) {
      let profile = this.getProfileStorage();
      return field && profile ? profile[field] : profile;
    }
    return null;
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken') || null;
  }

  isAdmin() {
    return this.getProfile('role') === 'Admin';
  }

  hanldeUpdateProfile(res) {
    localStorage.setItem('accessToken', res.data.token);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    localStorage.setItem('partner', res.data.partner);
  }
}

export default AccountState;
