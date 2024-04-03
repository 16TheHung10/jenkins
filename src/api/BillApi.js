import moment from 'moment';
import { AuthApi } from './AuthApi';

const BillApi = {
  getCancelBills: (params) => {
    return AuthApi.get('/bill/invoice/cancel', params);
  },
  getCanceledBills: (params) => {
    return AuthApi.get('/bill/invoice/cancel/processed', {
      ...(params
        ? params
        : {
            date: moment(new Date()).format('YYYY-MM-DD'),
            start: moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD'),
          }),
    });
  },
  searchBill(params) {
    return AuthApi.get('/bill/' + params.billCode);
  },

  approveBill: (data) => {
    return AuthApi.put('/bill/invoice/cancel/approve', data);
  },
};

export default BillApi;

