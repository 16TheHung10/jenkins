import React from 'react';
import { Tag, Typography } from 'antd';
import * as yup from 'yup';
import { OptionsHelper } from 'helpers';
import moment from 'moment';
import Icons from 'images/icons';

const TotalBillAllDataRender = {
  fieldInputs: (stores) => [
    {
      name: 'date',
      label: 'Apply date',
      type: 'date-range',
      labelClass: 'required',
      rules: yup.array().required('Please select a apply date'),
      format: 'DD/MM/YYYY',
      span: 6,
      max: 100,
      isSelectFuture: false,
    },
    {
      name: 'name',
      label: 'Promotion Name',
      placeholder: 'Promotion name',
      type: 'text',
      span: 6,
      // rules: yup.string().required(),
    },

    {
      name: 'status',
      label: 'Status',
      type: 'select',
      span: 6,
      options: [
        {
          value: '1',
          label: 'Active',
        },
        {
          value: '0',
          label: 'Inactive',
        },
      ],
      placeholder: '--Status--',
      // rules: yup.string().required('Status is required'),
    },
    {
      name: 'storeCode',
      label: 'Store',
      type: 'select',
      mode: 'multiple',
      maxTagCount: 'responsive',
      options: [...OptionsHelper.convertDataToOptions(stores, 'storeCode', 'storeCode-storeName')],
      span: 6,
      filterOption: (input, option) => {
        return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
      },
      placeholder: '--All--',
      // rules: yup.array().required('Status is required'),
    },
  ],
  columns: ({ navigateEdit }) => [
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
        return value === 1 ? <Tag color="green">Buy</Tag> : <Tag color="blue">Get</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (value) => {
        return value === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>;
      },
    },

    {
      title: <p className="text-center m-0">Dept. of I&T code</p>,
      dataIndex: 'docCode',
      key: 'docCode',
      render: (value, record) => {
        return (
          <div className="flex items-center justify-end">
            {value ? value : '-'}
            {record.docLink ? (
              <a href={record.docLink} target="_blank" className="flex items-center">
                <Icons.Link style={{ fontSize: '16px' }} />
              </a>
            ) : null}
          </div>
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
      // sorter: (a, b) => {
      //   const dateA = new Date(a.createdDate);
      //   const dateB = new Date(b.createdDate);
      //   return dateA - dateB;
      // },
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
export default TotalBillAllDataRender;
