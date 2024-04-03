import moment from 'moment';
import { AuthApi } from '../AuthApi';

const EcommerceBannerApi = {
  createBanner: (data) => {
    return AuthApi.post('/ecommerce/banner', { images: data });
  },
  getBanner: () => {
    return AuthApi.get('/ecommerce/banner');
  },
};

export default EcommerceBannerApi;
