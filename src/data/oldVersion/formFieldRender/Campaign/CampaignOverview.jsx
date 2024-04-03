import { Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import * as yup from 'yup';

const CampaignOverview = {
  fieldInputs: () => [
    {
      name: 'campaignCode',
      label: 'Campaign code',
      type: 'text',
      span: 6,
      // rules: yup.array().required('Apply date code is required'),
    },
    {
      name: 'date',
      label: 'Apply date',
      format: 'DD/MM/YYYY',
      span: 6,
      type: 'date-range',
      // rules: yup.array().required('Apply date code is required'),
    },
    // {
    //   name: 'status',
    //   label: 'Status',
    //   type: 'select',
    //   options: [
    //     {
    //       value: 0,
    //       label: 'Inactive',
    //     },
    //     {
    //       value: 1,
    //       label: 'Active',
    //     },
    //   ],
    // },
    // {
    //   name: 'campaignType',
    //   label: 'Campaign Type',
    //   type: 'select',
    //   options: [
    //     {
    //       value: 1,
    //       label: 'Buy a bill and get a voucher',
    //     },
    //     {
    //       value: 2,
    //       label: 'Apply to the app game',
    //     },
    //     {
    //       value: 3,
    //       label: 'Buy a bill and get a lottery code',
    //     },
    //   ],
    // },
  ],
  fieldInputsCreate: () => [
    {
      name: 'date',
      label: 'Apply date',
      labelClass: 'required',
      type: 'date-range',
      picker: 'month',
      rules: yup.array().required('Apply date code is required'),
    },
    {
      name: 'billAmount',
      label: 'Bill Amount',
      type: 'text',
      labelClass: 'required',
      rules: yup
        .number()
        .typeError('Bill amount must be a number')
        .required('Bill Amount code is required')
        .min(50000, 'Bill Amount must be greater than 50.000'),
    },
  ],
  columns: () => [
    {
      title: 'Name',
      width: 400,
      dataIndex: 'promotionName',
      key: 'name',
      render: (text) => <a>{text}</a>,
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: 'Code',
      dataIndex: 'promotionCode',
      key: 'promotionCode',
      // sorter: (a, b) => a.promotionCode?.localeCompare(b.promotionCode),
    },
    {
      title: 'Type',
      dataIndex: 'billPromotionType',
      key: 'type',
      render: (value, record) => {
        return value === 1 ? (
          <Tag color="green">Buy</Tag>
        ) : (
          <Tag color="blue">Get</Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (value) => {
        return value === 1 ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">InActive</Tag>
        );
      },
    },
    {
      title: 'Create date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (value) => {
        return moment(value).format('DD-MM-YYYY');
      },
    },
    {
      title: 'From date',
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (value) => {
        return moment(value).format('DD-MM-YYYY');
      },
      // sorter: (a, b) => a.fromDate?.localeCompare(b.fromDate),
    },
    {
      title: 'To date',
      dataIndex: 'toDate',
      key: 'toDate',
      render: (value) => {
        return moment(value).format('DD-MM-YYYY');
      },
      // sorter: (a, b) => a.toDate?.localeCompare(b.toDate),
    },
  ],
};
export default CampaignOverview;

