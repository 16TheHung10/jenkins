import moment from 'moment';
import { AuthApi } from '../AuthApi';

const EcommerceCategoryApi = {
  getCategories: (params) => {
    return AuthApi.get('/ecommerce/Category', params);
  },
  getCategoryById: (categoryID) => {
    return AuthApi.get(`/ecommerce/Category/${categoryID}`);
  },
  updateCategory: (categoryID, data) => {
    return AuthApi.put(`/ecommerce/Category/${categoryID}`, data);
  },
  createCategory: (data) => {
    return AuthApi.post(`/ecommerce/Category/`, data);
  },
};

export default EcommerceCategoryApi;
