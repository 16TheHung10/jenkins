import { Popover } from 'antd';
import CONSTANT from 'constant';
import Icons from 'images/icons';
import moment from 'moment';
import React from 'react';
const TableItemByFFData = {
  columns: () => [
    {
      title: 'Store',
      dataIndex: 'storeCode',
      key: 'storeCode',
      render: (text, record) => (text ? text : '-'),
    },
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text, record) => (text ? text : '-'),
    },
    {
      title: 'Item group',
      dataIndex: 'group',
      key: 'group',
      render: (text) => text || '-',
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },

    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (text) => text || '-',
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },

    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 100,
      render: (text) => text || '-',
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },

    {
      title: 'Expiration time',
      dataIndex: 'expiry',
      key: 'expiry',
      render: (text) => text || '-',

      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },

    {
      title: 'Note',
      dataIndex: 'expiryNote',
      key: 'expiryNote',
      render: (text) => text || '-',
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    // {
    //   title: 'Created by',
    //   dataIndex: 'createdBy',
    //   key: 'createdBy',
    //   width: 150,
    //   render: (value, record) => {
    //     const { createdDate } = record;
    //     return value ? (
    //       <p className="m-0 flex flex-col items-start">
    //         {value}
    //         <span className="hint">at {moment(createdDate).format('HH:mm ' + CONSTANT.FORMAT_DATE_IN_USE)}</span>
    //       </p>
    //     ) : (
    //       '-'
    //     );
    //   },
    // },
  ],
};
export default TableItemByFFData;
