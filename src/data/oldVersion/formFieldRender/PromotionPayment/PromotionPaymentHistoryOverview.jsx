import Icons from 'images/icons';
import moment from 'moment';
import React from 'react';
import * as yup from 'yup';
const sharedOnCell = (_, index) => {
  if (index === 1) {
    return {
      colSpan: 0,
    };
  }
  return {};
};
const PromotionPaymentHistoryOverview = {
  fields: () => [
    {
      name: 'date',
      label: 'Apply date',
      type: 'date-range',
      labelClass: 'required',
      rules: yup.array().required('Please select a date'),
      disabledDate: (current) => {
        return current && current > moment().endOf('day');
      },
      span: 4,
    },
  ],
  columns: ({ items }) => [
    {
      title: 'Promotion name',
      dataIndex: 'promotionName',
      key: 'promotionName',
      render: (text) => text || '-',
      onCell: (record, rowIndex) => {
        if (rowIndex === 0 || rowIndex % record.rowSpan === 0) {
          return {
            rowSpan: record.rowSpan,
            style: {
              background: record.isOdd ? '#ededed52' : 'white',
              textAlign: 'center',
              verticalAlign: 'top',
            },
          };
        } else {
          return { rowSpan: 0 };
        }
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: 'Promotion code (GS25)',
      dataIndex: 'promotionGS25',
      key: 'promotionGS25',
      render: (text, record) => {
        return text || '-';
      },
      onCell: (record, rowIndex) => {
        return {
          style: {
            background: record.isOdd ? '#ededed52' : 'white',
          },
        };
      },
    },
    {
      title: 'Promotion code (Partner)',
      dataIndex: 'promotionPartner',
      key: 'promotionPartner',
      render: (text) => text || '-',
      onCell: (record, rowIndex) => {
        return {
          style: {
            background: record.isOdd ? '#ededed52' : 'white',
          },
        };
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },

    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      render: (text) => {
        const item = items?.[text];
        return item ? item?.itemName + ' ' + item?.itemCode : '-';
      },
      onCell: (record, rowIndex) => {
        return {
          style: {
            background: record.isOdd ? '#ededed52' : 'white',
          },
        };
      },
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (text) => text || '-',
      onCell: (record, rowIndex) => {
        return {
          style: {
            background: record.isOdd ? '#ededed52' : 'white',
          },
        };
      },
    },
    {
      title: 'Allow send item to partners:',
      dataIndex: 'isOnItem',
      key: 'isOnItem',
      render: (text) =>
        text ? <Icons.Tick style={{ color: 'var(--green-color)' }} /> : <Icons.Cancel style={{ color: 'red' }} />,
      onCell: (record, rowIndex) => {
        return {
          style: {
            background: record.isOdd ? '#ededed52' : 'white',
          },
        };
      },
    },
    {
      title: 'Dept. of I&T code',
      dataIndex: 'docCode',
      key: 'docCode',
      render: (value, record) => {
        if (!value) return '-';
        return (
          <div>
            {value}{' '}
            {record.docLink ? (
              <a href={record.docLink} target="_blank">
                <Icons.Link style={{ color: 'var(--primary-color)' }} />
              </a>
            ) : null}
          </div>
        );
      },
      onCell: (record, rowIndex) => {
        return {
          style: {
            background: record.isOdd ? '#ededed52' : 'white',
          },
        };
      },
      // sorter: (a, b) => a.toDate?.localeCompare(b.toDate),
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      render: (text, record) =>
        text ? <p className="m-0">{moment(new Date(text)).format('DD/MM/YYYY HH:mm')}</p> : '-',
      onCell: (record, rowIndex) => {
        if (rowIndex === 0 || rowIndex % record.rowSpan === 0) {
          return {
            rowSpan: record.rowSpan,
            style: {
              background: record.isOdd ? '#ededed52' : 'white',
              textAlign: 'center',
              verticalAlign: 'top',
            },
          };
        } else {
          return { rowSpan: 0 };
        }
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
  ],
};
export default PromotionPaymentHistoryOverview;
