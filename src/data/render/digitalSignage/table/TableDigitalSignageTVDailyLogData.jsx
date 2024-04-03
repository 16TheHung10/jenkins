import CONSTANT from 'constant';
import { StringHelper } from 'helpers';
import moment from 'moment';
import React from 'react';
const TableDigitalSignageTVDailyLogData = {
  columns: ({ mediaObject }) => [
    {
      title: 'Display',
      dataIndex: 'tvName',
      key: 'tvName',
      render: (text, record) => record.storeCode + ' - ' + record.tvCode + ' - ' + text,
      onCell: (record, index) => {
        return {
          colSpan: record.colSpan,
          rowSpan: record.rowSpan,
        };
      },
    },

    {
      title: 'Media',
      dataIndex: 'videoCode',
      key: 'videoCode',
      render: (text, record) => {
        return (
          <div>
            <p className="m-0">{record.videoName}</p>
          </div>
        );
      },
    },
    {
      title: 'Number of plays',
      dataIndex: 'playCount',
      key: 'playCount',
      render: (text, record) => (text ? StringHelper.formatPrice(text) : 0),
    },
    {
      title: 'Total duration (HH:mm:ss)',
      dataIndex: 'totalDuration',
      key: 'totalDuration',
      render: (text, record) => (text ? moment.utc(text * 1000).format('HH:mm:ss') : 0),
    },
    {
      title: 'First Period Shown',
      dataIndex: 'firstPeriodShown',
      key: 'firstPeriodShown',
      render: (text, record) => (text ? moment(text).format(CONSTANT.FORMAT_DATE_IN_USE_FULL) : '-'),
    },
    {
      title: 'Last Period Shown',
      dataIndex: 'lastPeriodShown',
      key: 'lastPeriodShown',
      render: (text, record) => (text ? moment(text).format(CONSTANT.FORMAT_DATE_IN_USE_FULL) : '-'),
    },

    {
      title: 'Report Date',
      dataIndex: 'reportDate',
      key: 'reportDate',
      render: (text, record) => (text ? moment(text).format('DD/MM/YYYY') : null),
      onCell: (record, index) => {
        return {
          colSpan: record.colSpan,
          rowSpan: record.rowSpan,
        };
      },
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (text, record) => (text ? moment(text).format('DD/MM/YYYY HH:mm') : null),
    },
  ],
};
export default TableDigitalSignageTVDailyLogData;
