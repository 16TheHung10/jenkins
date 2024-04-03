import moment from 'moment';
import * as yup from 'yup';

const FieldsRequestCancelAccountData = {
  fieldInputs: () => [
    {
      name: 'date',
      label: 'Apply date',
      labelClass: 'required',
      type: 'date-range',
      disabledDate: (current) => {
        return current && current > moment().endOf('day');
      },
      rules: yup.array().required('Apply date code is required'),
    },
  ],
  fieldInputsFilter: ({ memberCodeOptions }) => [
    {
      name: 'memberCode',
      label: 'Member code',
      type: 'select',
      options: memberCodeOptions || [],
      placeholder: '-- All --',
      span: 8,
    },
    {
      name: 'deleted',
      label: 'Status',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'Processing',
        },
        {
          value: 1,
          label: 'Approved',
        },
      ],
      placeholder: '-- Processing/Done --',
      span: 8,
    },
  ],
};
export default FieldsRequestCancelAccountData;

