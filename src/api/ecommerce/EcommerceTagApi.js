import moment from 'moment';
import { AuthApi } from '../AuthApi';

const EcommerceTagApi = {
  getTags: () => {
    return AuthApi.get('/ecommerce/tag');
  },
};

export default EcommerceTagApi;
