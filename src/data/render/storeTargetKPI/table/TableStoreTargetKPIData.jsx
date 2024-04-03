import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import CONSTANT from 'constant';
import moment from 'moment';
import React from 'react';
const TableStoreTargetKPIData = {
  columns: ({ onSetSelectedStore }) => [
    {
      title: 'Store',
      dataIndex: 'storeCode',
      key: 'storeCode',
      render: (text, record) => (text ? `${text} ${record.storeName}` : ' - '),
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (text) => text || ' - ' },
    {
      title: 'Apply month',
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (text) => (text ? moment(text).format('MM/YYYY') : ' - '),
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
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
    {
      title: 'Updated by',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 150,
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
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      width: 70,
      render: (value, record) => {
        return <BaseButton iconName="edit" onClick={() => onSetSelectedStore(record)} />;
      },
    },
  ],
};
export default TableStoreTargetKPIData;
