import moment from 'moment';
import * as yup from 'yup';
import { StringHelper } from 'helpers';
const FieldsRequestCancelBillData = {
  fieldInputs: () => [
    {
      name: 'date',
      label: 'Apply date',
      labelClass: 'required',
      type: 'date-single',
      disabledDate: (current) => {
        return current && current > moment().endOf('day');
      },
      rules: yup.string().required('Apply date code is required'),
    },
  ],
  fieldInputsFilter: ({ invoiceCodeOptions, storeOptions, statusOptions }) => [
    {
      name: 'invoiceCode',
      label: 'Invoice code',
      type: 'select',
      options: invoiceCodeOptions || [],
      placeholder: '-- All --',
      span: 8,
    },
    {
      name: 'storeCode',
      label: 'Store code',
      type: 'select',
      options: storeOptions || [],
      placeholder: '-- All --',
      span: 8,
    },
    {
      name: 'canceled',
      label: 'Status',
      type: 'select',
      options: statusOptions || [],
      placeholder: '-- Processing/Done --',
      span: 8,
    },
    // {
    //   name: 'billAmount',
    //   label: 'Bill value',
    //   type: 'slider',
    //   step: 100000,
    //   tooltip: {
    //     formatter: (value) => StringHelper.formatPrice(value),
    //     // open: true,
    //     placement: 'bottom',
    //   },
    //   max: 10000000,
    //   span: 8,
    // },
    {
      name: 'billAmountFrom',
      label: 'Bill amount from',
      type: 'number',
      min: 0,
      step: 1000,
      span: 4,
      placeholder: 'VNĐ From',
    },
    {
      name: 'billAmountTo',
      label: 'Bill amount to',
      type: 'number',
      step: 1000,
      min: 0,
      placeholder: 'VNĐ To',
      span: 4,
    },
  ],
};
export default FieldsRequestCancelBillData;

