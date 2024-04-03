import { AuthApi } from './AuthApi';

const CommonApi = {
  getCommonData: (type) => {
    return AuthApi.get(`/common/object/types=${type}`);
  },
};

export default CommonApi;

