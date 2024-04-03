import { Popconfirm, Spin, Tag } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { StringHelper } from 'helpers';
import moment from 'moment';
import React from 'react';
const TableDigitalSignageGroupData = {
  columns: ({ onOpenFormEdit, typeQuery, deleteGroupMutation }) => [
    {
      title: 'Group',
      dataIndex: 'groupCode',
      key: 'groupCode',
      render: (value, record) =>
        value ? (
          <div>
            <p className="m-0">{record.groupName}</p>
            <p className="hint">{value}</p>
          </div>
        ) : (
          '-'
        ),
    },

    {
      title: 'Type',
      dataIndex: 'groupType',
      key: 'groupType',
      render: (value, record) =>
        value ? (
          typeQuery.isLoading ? (
            <Spin />
          ) : (
            <p className="m-0">{typeQuery.data?.find((el) => el.typeCode === value)?.typeName}</p>
          )
        ) : (
          '-'
        ),
    },
    {
      title: 'Mode',
      dataIndex: 'groupMode',
      key: 'groupMode',
      render: (value, record) =>
        value === 'REPEAT' ? <Tag color="green">Repeat</Tag> : <Tag color="blue">Schedule</Tag>,
    },

    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (text, record) =>
        (
          <div>
            <p className="m-0">{text}</p>
            <p className="hint">{record.createdDate ? moment(record.createdDate).format('DD/MM/YYYY HH:mm') : null}</p>
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
            <p className="hint">{record.updatedDate ? moment(record.updatedDate).format('DD/MM/YYYY HH:mm') : null}</p>
          </div>
        ) || '-',
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
      render: (text, record) => (
        <div className="flex gap-10">
          <BaseButton iconName="edit" onClick={() => onOpenFormEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this group"
            onConfirm={() => deleteGroupMutation.mutate(record.groupCode)}
            placement="left"
          >
            <BaseButton loading={deleteGroupMutation.isLoading} iconName="delete" color="error" />
          </Popconfirm>
        </div>
      ),
    },
  ],
};
export default TableDigitalSignageGroupData;
