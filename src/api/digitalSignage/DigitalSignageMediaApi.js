import moment from 'moment';
import { AuthApi } from '../AuthApi';

const DigitalSignageMediaApi = {
  getMedias: (params) => {
    return AuthApi.get('/digitalsignagemedia', params);
  },
  deleteMedia: (mediaCode) => {
    return AuthApi.delete(`/digitalsignagemedia/${mediaCode}`);
  },
  setDefault: (mediaCode) => {
    return AuthApi.put(`/digitalsignagemedia/${mediaCode}/default`);
  },
  getTV: (tvCode) => {
    return AuthApi.get(`/digitalsignagetv/${tvCode}`);
  },
  addGroupsMedia: (tvCode, data) => {
    return AuthApi.put(`/digitalsignagetv/${tvCode}`, data);
  },
  createMedia: (data) => {
    return AuthApi.post(`/digitalsignagemedia`, data);
  },
};

export default DigitalSignageMediaApi;
