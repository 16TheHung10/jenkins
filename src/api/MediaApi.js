import { AuthApi } from './AuthApi';

const MediaApi = {
  upload: (type, data, config = {}) => {
    return AuthApi.post(
      `/upload/${type}`,
      data,
      null,
      process.env.REACT_APP_API_EXT_MEDIA_V2,
      50000,
      'multipart/form-data',
      config
    );
  },
  delete: (url) => {
    return AuthApi.delete(`/delete/${url}`, null, null, process.env.REACT_APP_API_EXT_MEDIA_V2, 30000);
  },
};

export default MediaApi;
