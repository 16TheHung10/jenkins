import { StringHelper } from 'helpers';
import { Tag } from 'antd';
import React from 'react';
import moment from 'moment';
import CONSTANT from 'constant';
const TableItemHistoryChangeSellingPriceData = {
  columns: () => [
    {
      title: 'Item',
      dataIndex: 'itemCode',
      key: 'itemCode',
      render: (value, record) => {
        if (!value) return '-';
        return (
          <>
            <p className="m-0">{record.itemName}</p>
            <p className="m-0 hint">{value}</p>
          </>
        );
      },
    },
    { title: 'Store Code', dataIndex: 'storeCode', key: 'storeCode', render: (text) => text || ' - ' },
    {
      title: 'Supplier',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      render: (value, record) => {
        if (!value) return '-';
        return (
          <>
            <p className="m-0">{record.supplierName}</p>
          </>
        );
      },
    },
    {
      title: 'Division',
      dataIndex: 'divisionCode',
      key: 'divisionCode',
      render: (value, record) => {
        if (!value) return '-';
        return (
          <>
            <p className="m-0">{record.divisionName}</p>
          </>
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      render: (value, record) => {
        if (!value) return '-';
        return (
          <>
            <p className="m-0">{record.categoryName}</p>
          </>
        );
      },
    },

    {
      title: 'Applied Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      render: (text) => (text ? moment(text).format(CONSTANT.FORMAT_DATE_IN_USE) : ' - '),
    },
    {
      title: 'Selling Price Old',
      dataIndex: 'sellingPriceOld',
      key: 'sellingPriceOld',
      render: (text) => (text ? StringHelper.formatPrice(text) : ' - '),
    },
    {
      title: 'Selling Price New',
      dataIndex: 'sellingPriceNew',
      key: 'sellingPriceNew',
      render: (text) => (text ? StringHelper.formatPrice(text) : ' - '),
    },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy', render: (text) => text || ' - ' },
  ],
};
export default TableItemHistoryChangeSellingPriceData;
