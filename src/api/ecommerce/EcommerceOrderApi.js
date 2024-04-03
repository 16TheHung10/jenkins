import moment from 'moment';
import { AuthApi } from '../AuthApi';

const EcommerceOrderApi = {
  getOrders: (params) => {
    return AuthApi.get('/ecommerce/order', params);
  },
  getOrderById: (orderID) => {
    return AuthApi.get(`/ecommerce/order/${orderID}`);
  },

  updateOrder: (orderID, data) => {
    return AuthApi.put(`/ecommerce/order/${orderID}`, data);
  },
  sendMailRequestPayment: (orderID, data) => {
    return AuthApi.post(`/ecommerce/order/${orderID}/mail/request-payment`, data);
  },
};

export default EcommerceOrderApi;
