import { Tag } from 'antd';
import React from 'react';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { routerRef } from '../../../../App';
import moment from 'moment';
const TableEcommerceGroupData = {
  columns: () => [
    { title: 'Group Name', dataIndex: 'groupName', key: 'groupName', render: (text, record) => (text ? record.groupID + '-' + text : ' - ') },
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
      width: 50,
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
      render: (text) =>
        text ? (
          <Tag style={{ margin: 0 }} color="green">
            Active
          </Tag>
        ) : (
          <Tag style={{ margin: 0 }} color="red">
            InActive
          </Tag>
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
      render: (text, record) => <BaseButton iconName="edit" onClick={() => routerRef.current.history.push(`/ecommerce/groups/details/${record.groupID}`)} />,
    },
  ],
};
export default TableEcommerceGroupData;
