import React from 'react';
import { Tag, Typography } from 'antd';
import * as yup from 'yup';
import { OptionsHelper } from 'helpers';
import moment from 'moment';
import CONSTANT from 'constant';
const LogAppEnum = {
  1: 'Inventory',
  2: 'Operation',
  3: 'Loyalty',
  4: 'POS',
  5: 'StoreOrder',
  6: 'HR',
  7: 'Ecommerce',
  8: 'PaymentTransaction',
  9: 'Portal',
  10: 'ITSystem',
  11: 'Voucher',
  12: 'DataSync',
  13: 'DataWarehouse',
  14: 'Item',
  15: 'Weather',
};
const LogginOverview = {
  fieldInputs: ({ userOptions, objectLogOptions }) => [
    {
      name: 'user',
      label: 'User',
      labelClass: 'required',
      type: 'select',
      placeholder: '--All--',
      options: userOptions,
      rules: yup.string().required('Please select user'),
      span: 6,
    },
    {
      name: 'object',
      label: 'Type',
      labelClass: 'required',
      type: 'select',
      placeholder: '--All--',
      options: objectLogOptions,
      rules: yup.string().required('Please select object'),
      span: 6,
    },

    // {
    //   name: 'action',
    //   label: 'Action',
    //   type: 'select',
    //   allowClear: true,
    //   placeholder: '-- All --',
    //   options: [
    //     {
    //       value: 0,
    //       label: 'Create',
    //     },
    //     {
    //       value: 1,
    //       label: 'Update',
    //     },
    //     {
    //       value: 2,
    //       label: 'Delete',
    //     },
    //     {
    //       value: 3,
    //       label: 'Get',
    //     },
    //   ],
    //   span: 6,
    //   allowClear: false,
    // },
  ],
  fieldInputsFilter: () => [
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'Exception',
        },
        {
          value: 1,
          label: 'TimeOut',
        },
        {
          value: 2,
          label: 'Normal',
        },
      ],
      span: 6,
    },

    {
      name: 'date',
      label: 'Request date',
      type: 'date-single',
      disabledDate: (current) => current && current > moment().endOf('day'),
      format: 'DD/MM/YYYY',
      span: 6,
    },
  ],
  columns: () => [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 50,
      render: (text) => (text ? text : '-'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 70,
      render: (text) => {
        switch (+text) {
          case 0:
            return 'Create';
          case 1:
            return 'Update';
          case 2:
            return 'Delete';
          case 3:
            return 'Get';
          default:
            return '-';
        }
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 70,
      render: (text) => {
        switch (+text) {
          case 0:
            return 'Exception';
          case 1:
            return 'Timeout';
          case 2:
            return 'Normal';
          default:
            return '-';
        }
      },
    },
    {
      title: 'App',
      dataIndex: 'app',
      key: 'app',
      width: 70,
      render: (text) => {
        return LogAppEnum[+text] || '-';
      },
    },
    {
      title: 'Request date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (text) => {
        return moment(new Date(text)).format('HH:mm - DD/MM/YYYY ');
      },
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 50,
      render: (text) => (text ? text : '-'),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text) => (text ? text : '-'),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      width: 500,
      render: (text) => (text ? text : '-'),
    },
  ],
};
export default LogginOverview;
