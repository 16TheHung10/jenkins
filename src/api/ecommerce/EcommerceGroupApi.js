import moment from 'moment';
import { AuthApi } from '../AuthApi';

const EcommerceGroupApi = {
  createGroup: (data) => {
    return AuthApi.post('/ecommerce/group', data);
  },
  updateGroup: (groupID, data) => {
    return AuthApi.put(`/ecommerce/group/${groupID}`, data);
  },
  getGroups: (params) => {
    return AuthApi.get('/ecommerce/group', params);
  },
  getGroupByID: (groupId) => {
    return AuthApi.get(`/ecommerce/group/${groupId}`);
  },
  addItemToGroup: (groupID, data) => {
    return AuthApi.post(`/ecommerce/group/${groupID}/items`, data);
  },
  uploadGroupLogo: (groupId, base64) => {
    return AuthApi.post(`/upload/ecommerce/group/${groupId}/logo`, { image: base64 }, null, process.env.REACT_APP_API_EXT_MEDIA);
  },
  uploadGroupBanner: (groupId, base64) => {
    return AuthApi.post(`/upload/ecommerce/group/${groupId}/banner`, { image: base64 }, null, process.env.REACT_APP_API_EXT_MEDIA);
  },
};

export default EcommerceGroupApi;
