import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Space } from 'antd';
import Image from 'components/common/Image/Image';
import { OptionsHelper } from 'helpers';
import moment from 'moment';
import React from 'react';
import * as yup from 'yup';

const DataRenderFreeItem = {
  fieldInputs: (stores, disableAll) => {
    if (disableAll) {
      return [
        {
          name: 'condition',
          label: 'Bill amount (VNĐ)',
          disabled: true,
          labelClass: 'required',
          formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: (value) => value.replace(/\s?VNĐ\s?|(,*)/g, ''),
          type: 'number',
          step: 1000,
        },
        {
          name: 'promotionName',
          label: 'Promotion Name',
          placeholder: 'Promotion name',
          labelClass: 'required',
          type: 'text',
          disabled: true,
        },
        {
          name: 'date',
          label: 'Date',
          labelClass: 'required',
          type: 'date-range',
          format: 'DD/MM/YYYY',
          max: 100,
          disabled: true,
          disabledDate: (current) => {
            return current && current < moment().endOf('day');
          },
        },
        {
          name: 'storeCode',
          label: 'Store',
          type: 'select',
          options: [...OptionsHelper.convertDataToOptions(stores, 'storeCode', 'storeCode-storeName')],
          mode: 'multiple',
          maxTagCount: 'responsive',
          disabled: true,
        },
        {
          name: 'docCode',
          label: 'Doc STC code',
          placeholder: 'Doc code',
          labelClass: 'required',
          type: 'text',
          disabled: true,
        },
        {
          name: 'docLink',
          label: 'Doc STC link',
          placeholder: 'Doc link',
          labelClass: 'required',
          type: 'text',
          disabled: true,
        },
      ];
    }
    return [
      {
        name: 'condition',
        label: 'Bill amount (VNĐ)',
        placeholder: 'Bill amount',
        labelClass: 'required',
        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        parser: (value) => value.replace(/\s?VNĐ\s?|(,*)/g, ''),
        rounded: 5000,
        type: 'number',
        step: 1000,
        min: 50000,
        rules: yup.number().typeError('Bill amount must be a number').required('Bill amount is required').min(50000, 'Promotion is valid with bill amount greater than 50,000'),
      },
      {
        name: 'promotionName',
        label: 'Promotion Name',
        placeholder: 'Promotion name',
        labelClass: 'required',
        type: 'text',
        rules: yup.string().required('Promotion name is required'),
      },
      {
        name: 'date',
        label: 'Date',
        labelClass: 'required',
        type: 'date-range',
        rules: yup.array().required('Date is required'),
        disabledDate: (current) => {
          return current && current < moment().endOf('day');
        },
        format: 'DD/MM/YYYY',
        max: 100,
      },
      {
        name: 'storeCode',
        label: 'Store',
        type: 'select',
        options: [...OptionsHelper.convertDataToOptions(stores, 'storeCode', 'storeCode-storeName')],
        filterOption: (input, option) => {
          return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
        },
        mode: 'multiple',
        maxTagCount: 'responsive',
        placeholder: '--All--',
      },
      {
        name: 'docCode',
        label: 'Dept. of I&T code',
        placeholder: 'Dept. of I&T code',
        labelClass: 'required',
        rules: yup.string().required('Doc code is required'),
        type: 'text',
      },
      {
        name: 'docLink',
        label: 'Dept. of I&T link',
        placeholder: 'Dept. of I&T link',
        type: 'text',
      },
    ];
  },
  columns: ({ onEdit, onDelete, disableEdit }) => [
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemCode',
    },
    {
      title: 'Item image',
      dataIndex: 'imageUrl',
      key: 'itemImage',
      render: (value) => {
        return <Image src={Boolean(value) ? value : 'no-image'} style={{ height: '50px', aspectRatio: '16/9' }} />;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record, index) => (
        <>
          {disableEdit ? null : (
            <Space size="middle">
              <EditOutlined style={{ fontSize: 20 }} onClick={() => onEdit(record, index)} className="color-primary" />
              <Popconfirm
                title="Delete the item"
                description="Are you sure to delete this item?"
                onConfirm={() => onDelete(index)}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined style={{ fontSize: 20 }} className="color-danger cursor_pointer" />
              </Popconfirm>
            </Space>
          )}
        </>
      ),
    },
  ],
};
export default DataRenderFreeItem;
