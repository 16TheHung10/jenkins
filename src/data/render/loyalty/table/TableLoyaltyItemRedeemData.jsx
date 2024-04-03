import { Tag } from 'antd';
import React from 'react';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { routerRef } from '../../../../App';
import { StringHelper } from 'helpers';
import moment from 'moment';
const TableLoyaltyItemRedeemData = {
  columns: () => [
    {
      title: 'Item',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <p className="m-0">{title}</p>
          <p className="hint">{record.itemCode}</p>
        </div>
      ),
    },
    {
      title: 'Point',
      dataIndex: 'point',
      key: 'point',
      render: (point, record) => (point ? <b className="font-bold color-primary">{StringHelper.formatPrice(point)}</b> : <span className="cl-red">{'In update'}</span>),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock, record) => (stock ? StringHelper.formatPrice(stock) : 'Out of stock'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type, record) => (type ? type : '-'),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (text, record) => (text ? <Tag color="green">Active</Tag> : <Tag color="red">In-active</Tag>),
      onHeaderCell: () => {
        return {
          style: {
            textAlign: 'center',
          },
        };
      },
      onCell: () => {
        return {
          style: {
            textAlign: 'center',
          },
        };
      },
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (text, record) =>
        text ? (
          <div>
            <p className="m-0">{text}</p>
            <div className="hint">{moment(record.createdDate).format('DD/MM/YYYY HH:mm')}</div>
          </div>
        ) : (
          ' - '
        ),
    },
    {
      title: 'Updated by',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      render: (text, record) =>
        text ? (
          <div>
            <p className="m-0">{text}</p>
            <div className="hint">{moment(record.updatedDate).format('DD/MM/YYYY HH:mm')}</div>
          </div>
        ) : (
          ' - '
        ),
    },

    {
      title: 'Action',
      dataIndex: '',
      key: '',
      width: 50,
      onHeaderCell: () => {
        return {
          style: {
            textAlign: 'center',
          },
        };
      },
      render: (text, record) => <BaseButton iconName="edit" onClick={() => routerRef.current.history.push(`/loyalty/item-redeems/details/${record.itemCode}`)} />,
    },
  ],
};
export default TableLoyaltyItemRedeemData;
