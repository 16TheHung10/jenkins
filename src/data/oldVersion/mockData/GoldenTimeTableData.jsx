import { Button, Tag } from 'antd';
import { TableHelper } from 'helpers';
import Icons from 'images/icons';
import moment from 'moment';
import React from 'react';

export const GoldenTimeTableData = {
  th: (dataTable) => [
    {
      field: 'Name',
      props: {
        width: 200,
        // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
        filters: TableHelper.renderFilter('promotionName', dataTable || [], ''),
        filterSearch: true,
        onFilter: (value, record) => {
          return record?.promotionName?.includes(value);
        },
      },
    },
    {
      field: 'Code',
      props: {
        width: 100,
        // sorter: (a, b) => a.promotionCode?.localeCompare(b.promotionCode),
        // filters: TableHelper.renderFilter('promotionCode', dataTable || [], ''),
        // filterSearch: true,
        // onFilter: (value, record) => {
        //   return record?.promotionCode?.includes(value);
        // },
      },
    },

    // {
    //   field: 'Store',
    //   props: {
    //     render: (value, record, index) => {
    //     },
    //   },
    // },
    {
      field: 'Status',
      props: {
        render: (value, record, index) => {
          return +value === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>;
        },
        width: 70,
      },
    },
    {
      field: 'Dept. of I&T code',
      props: {
        render: (value, record, index) => {
          return (
            <div className="flex items-center justify-end">
              {value ? value : '-'}
              {record.docLink && record.docLink !== '-' ? (
                <a href={record.docLink} target="_blank" className="flex items-center">
                  <Icons.Link style={{ fontSize: '16px' }} />
                </a>
              ) : null}
            </div>
          );
        },
        width: 70,
      },
    },
    // {
    //   field: 'Doc link',
    //   props: {
    //     render: (value, record, index) => {
    //       return value ? value : '-';
    //     },
    //     width: 70,
    //   },
    // },

    {
      field: 'Created date',
      props: {
        width: 100,

        // sorter: (a, b) => a.createdDate?.localeCompare(b.createdDate),
      },
    },
    {
      field: 'Updated date',
      props: {
        width: 100,
        // sorter: (a, b) => a.updatedDate?.localeCompare(b.updatedDate),
      },
    },
    {
      field: 'Updated by',
      props: {
        width: 100,
        // sorter: (a, b) => a.updateBy?.localeCompare(b.updateBy),
      },
    },
    {
      field: 'From date',
      props: {
        width: 100,
        // sorter: (a, b) => a.fromDate?.localeCompare(b.fromDate),
      },
    },
    {
      field: 'End date',
      props: {
        width: 100,
        // sorter: (a, b) => a.toDate?.localeCompare(b.toDate),
      },
    },
  ],

  rowKey: {
    promotionName: 'promotionName',
    promotionCode: 'promotionCode',
    // storeCode: 'storeCode',
    active: 'active',
    docCode: 'docCode',
    createdDate: 'createdDate',
    updatedDate: 'updatedDate',
    updateBy: 'updateBy',
    fromDate: 'fromDate',
    toDate: 'toDate',
    docLink: 'docLink',
  },
};
