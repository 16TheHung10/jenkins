import moment from 'moment';
import { AuthApi } from '../AuthApi';

const PaymentMethodApi = {
  getPaymentMethods: (params) => {
    return AuthApi.get('/paymentmethod', params);
  },
  getPaymentMethodByCode: (methodCode) => {
    return AuthApi.get(`/paymentmethod/${methodCode}`);
  },

  createPaymentMethods: (data) => {
    return AuthApi.post('/paymentmethod', data);
  },
  updatePaymentMethods: (maHinhThuc, data) => {
    return AuthApi.put(`/paymentmethod/${maHinhThuc}`, data);
  },
  activePaymentMethod: (maHinhThuc) => {
    return AuthApi.put(`/paymentmethod/${maHinhThuc}/status/active`);
  },

  inActivePaymentMethod: (maHinhThuc) => {
    return AuthApi.put(`/paymentmethod/${maHinhThuc}/status/inactive`);
  },
};

export default PaymentMethodApi;
