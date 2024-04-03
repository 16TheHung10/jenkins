import { Popconfirm, Switch } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { StringHelper } from 'helpers';
import Icons from 'images/icons';
import moment from 'moment';
import React from 'react';
const TableDigitalSignageMediaData = {
  columns: ({ onDeleteMedia, setDefaultMutation }) => [
    {
      title: 'name',
      dataIndex: 'mediaName',
      key: 'mediaName',
      render: (value, record) =>
        value ? (
          <div className="flex gap-10">
            <Icons.Video style={{ fontSize: 16 }} />
            <a href={record.mediaUrl} target="_blank">
              {value}
            </a>
          </div>
        ) : (
          '-'
        ),
    },
    {
      title: 'Size',
      dataIndex: 'mediaSize',
      key: 'mediaSize',
      render: (value, record) => (value ? Math.round(value / (1024 * 1024), 5) + ' MB ' : '-'),
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
          <Switch
            checkedChildren="Default"
            unCheckedChildren="Default"
            checked={record.isDefault}
            loading={setDefaultMutation.isLoading}
            onChange={(checked) => {
              setDefaultMutation.mutate(record.mediaCode);
            }}
          />
          {JSON.parse(localStorage.getItem('profile')).groupName?.toLowerCase() === 'administrator' && (
            <Popconfirm
              title="Are you sure to delete this media"
              onConfirm={() => onDeleteMedia(record.mediaCode)}
              placement="left"
            >
              <BaseButton iconName="delete" color="error" />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ],
};
export default TableDigitalSignageMediaData;
