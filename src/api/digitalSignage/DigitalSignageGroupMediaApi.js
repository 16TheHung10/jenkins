import moment from 'moment';
import { AuthApi } from '../AuthApi';

const DigitalSignageGroupMediaApi = {
  getGroups: (params) => {
    return AuthApi.get(`/digitalsignagegroup`, params);
  },
  getGroupByID: (groupCode) => {
    return AuthApi.get(`/digitalsignagegroup/${groupCode}`);
  },
  deleteGroup: (groupCode) => {
    return AuthApi.delete(`/digitalsignagegroup/${groupCode}`);
  },
  createGroup: (data) => {
    return AuthApi.post(`/digitalsignagegroup`, data);
  },
  updateGroup: (groupCode, data) => {
    return AuthApi.put(`/digitalsignagegroup/${groupCode}`, data);
  },
  updateGroupMedia: (groupCode, data) => {
    return AuthApi.put(`/digitalsignagegroup/${groupCode}/media`, data);
  },
};

export default DigitalSignageGroupMediaApi;
