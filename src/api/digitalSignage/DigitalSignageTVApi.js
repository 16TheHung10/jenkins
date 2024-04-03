import AccountState from 'helpers/AccountState';
import { AuthApi } from '../AuthApi';

const DigitalSignageTVApi = {
  getTVs: (params) => {
    return AuthApi.get('/digitalsignagetv', params);
  },
  getTVsOnline: () => {
    return AuthApi.get('/tv/online', null, null, 'https://portal.gs25.com.vn');
  },

  getTVByCode: (tvCode) => {
    return AuthApi.get(`/digitalsignagetv/${tvCode}`);
  },

  getDailyLog: (params) => {
    return AuthApi.get(`/digitalsignagetv/log`, params);
  },

  getUploadMediaLog: (params) => {
    return AuthApi.get(`/digitalsignagetv/log/media`, params);
  },

  getLinkExportDailyLog: (params) => {
    return AuthApi.post(`/digitalsignagetv/log/export`, params);
  },

  deleteTV: (tvCode) => {
    return AuthApi.delete(`/digitalsignagetv/${tvCode}`);
  },
  updateTV: (tvCode, data) => {
    return AuthApi.put(`/digitalsignagetv/${tvCode}`, data);
  },
  updateNotify: (data) => {
    return AuthApi.post(`/digitalsignagetv/notify`, data);
  },
  addGroupsMedia: (tvCode, data) => {
    return AuthApi.put(`/digitalsignagetv/${tvCode}/addGroup`, data);
  },
  getTVTypes: (params) => {
    return AuthApi.get('/digitalsignagetv/type', params);
  },
  socketAction: (tvCode, objectType, message = { value: 'Hello' }) => {
    const profileJSON = localStorage.getItem('profile');
    const profile = profileJSON ? JSON.parse(profileJSON) : null;
    const payload = {
      message: message ? JSON.stringify(message) : '',
      messageType: objectType,
      objectID: 1,
      groupType: 'tv',
      id: 0,
      receivers: Array.isArray(tvCode) ? tvCode : [tvCode],
    };
    return AuthApi.post('/digitalsignagetv/task', payload);
  },
};

export default DigitalSignageTVApi;
