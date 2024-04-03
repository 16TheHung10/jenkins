import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { routerRef } from '../../../../App';
import moment from 'moment';
import React from 'react';
import { StringHelper } from 'helpers';
import { Tag } from 'antd';
const TableEcommerceCategoryData = {
  columns: () => [
    { title: 'Category', dataIndex: 'categoryID', key: 'categoryID', render: (categoryID, record) => `${categoryID} - ${record.categoryName}` },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (text, record) =>
        (
          <div>
            <p className="m-0">{text}</p>
            <p className="hint">{record.createdDate ? moment(record.createdDate).utc().format('DD/MM/YYYY') : null}</p>
          </div>
        ) || '-',
    },
    {
      title: 'Updated by',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      render: (text, record) =>
        (
          <div>
            <p className="m-0">{text}</p>
            <p className="hint">{record.updatedDate ? moment(record.updatedDate).utc().format('DD/MM/YYYY') : null}</p>
          </div>
        ) || '-',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
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
      render: (text, record) => (text ? <Tag color="green">Active</Tag> : <Tag color="red">In-active</Tag>),
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
      render: (text, record) => <BaseButton iconName="edit" onClick={() => routerRef.current.history.push(`/ecommerce/categories/details/${record.categoryID}`)} />,
    },
    // { title: 'Status', dataIndex: 'active', key: 'active', render: (text) => (text ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>) },
  ],
};
export default TableEcommerceCategoryData;
