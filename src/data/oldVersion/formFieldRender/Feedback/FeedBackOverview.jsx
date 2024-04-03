import { Tag, Tooltip } from 'antd';
import CONSTANT from 'constant';
import moment from 'moment';
import React from 'react';
import Icons from '../../../../images/icons';

const FeedBackOverview = {
  columns: ({ onOpenModal, getColumnSearchProps, onClickImage, stores }) => {
    return [
      {
        title: 'Store',
        dataIndex: 'storeCode',
        key: 'storeCode',
        width: 200,
        // ...getColumnSearchProps('storeCode'),
        render: (value) => {
          return value ? stores?.[value].storeCode + ' - ' + stores?.[value].storeName : '-';
        },
      },

      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 500,
        // ...getColumnSearchProps('description'),
        render: (value, record) => {
          return value ? (
            <p className="m-0 flex items-center gap-10">
              {record.image?.length > 0 ? (
                <Tooltip placement="top" title="Attached image">
                  <Icons.Attach
                    onClick={() => {
                      onOpenModal();
                      onClickImage(record);
                    }}
                    style={{
                      color: 'var(--primary-color)',
                      cursor: 'pointer',
                      fontSize: '20px',
                      rotate: '45deg',
                    }}
                  />
                </Tooltip>
              ) : null}
              {value}
            </p>
          ) : (
            '-'
          );
        },
      },
      {
        title: 'Type',
        dataIndex: 'errorType',
        key: 'errorType',
        width: 100,
        render: (value) => {
          return value === 'software' ? <Tag color="orange">Software</Tag> : <Tag color="green">Hardware</Tag>;
        },
      },
      {
        title: 'Created by',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: 100,
        render: (value, record) => {
          const { createdDate } = record;
          return value ? (
            <p className="m-0 flex flex-col items-start">
              {value}
              <span className="hint">at {moment(createdDate).format('HH:mm ' + CONSTANT.FORMAT_DATE_IN_USE)}</span>
            </p>
          ) : (
            '-'
          );
        },
      },
    ];
  },
};
export default FeedBackOverview;
