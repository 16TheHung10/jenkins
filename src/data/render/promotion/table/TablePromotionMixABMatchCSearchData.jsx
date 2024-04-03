import { routerRef } from 'App';
import { Switch, Tag } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import Icons from 'images/icons';
import moment from 'moment';
import React from 'react';
const TablePromotionMixABMatchCSearchData = {
  columns: () => {
    return [
      {
        title: 'Name',
        dataIndex: 'promotionName',
        key: 'promotionName',
        render: (text, record) => {
          return text ? (
            <div className="">
              <p className="m-0">{text}</p>
              <span className="hint">{record.promotionCode}</span>
            </div>
          ) : (
            '-'
          );
        },
        width: 250,
      },
      {
        title: 'Dept. of I&T code',
        dataIndex: 'docCode',
        key: 'docCode',
        render: (value, record, index) => {
          return (
            <div className="flex items-center  gap-10">
              {value ? value : '-'}
              {record.docLink && record.docLink !== '-' ? (
                <a href={record.docLink} target="_blank" className="flex items-center">
                  <Icons.Link style={{ fontSize: '16px' }} />
                </a>
              ) : null}
            </div>
          );
        },
      },
      {
        title: 'From date',
        dataIndex: 'fromDate',
        key: 'fromDate',
        render: (value) => {
          return moment(value).format('DD-MM-YYYY');
        },
        width: 80,
        // sorter: (a, b) => a.fromDate?.localeCompare(b.fromDate),
      },
      {
        title: 'To date',
        dataIndex: 'toDate',
        key: 'toDate',
        render: (value) => {
          return moment(value).format('DD-MM-YYYY');
        },
        width: 80,
        // sorter: (a, b) => a.toDate?.localeCompare(b.toDate),
      },
      {
        title: 'Status',
        dataIndex: 'active',
        key: 'active',
        render: (value) => {
          return value === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>;
        },
        width: 60,
      },
      {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (text, record) => {
          return text ? (
            <p className="m-0">
              <strong className="color-primary">{text}</strong>
              <span className="hint block">at {moment(new Date(record.updatedDate)).format('DD/MM/YYYY HH:mm')}</span>
            </p>
          ) : (
            '-'
          );
        },
      },
      {
        title: 'Latest update',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
        render: (text, record) => {
          return text ? (
            <p className="m-0">
              <strong className="color-primary">{text}</strong>
              <span className="hint block">at {moment(new Date(record.updatedDate)).format('DD/MM/YYYY HH:mm')}</span>
            </p>
          ) : (
            '-'
          );
        },
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: 140,
        render: (value, record) => {
          return (
            <div className="flex gap-10">
              <BaseButton
                iconName="edit"
                onClick={() =>
                  routerRef.current.history.push(`/promotion-mix-ab-match-c/details/${record.promotionCode}`)
                }
                color="green"
              />
              <BaseButton
                iconName="copy"
                onClick={() => routerRef.current.history.push(`/promotion-mix-ab-match-c/copy/${record.promotionCode}`)}
              />
            </div>
          );
        },
      },
    ];
  },
};
export default TablePromotionMixABMatchCSearchData;
