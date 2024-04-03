import { Empty, Popover, Tag } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import Icons from 'images/icons';
import moment from 'moment';
import React from 'react';
const TableDigitalSignageTVITReportData = {
  columns: () => {
    const tvChildren = [
      {
        title: 'Name',
        dataIndex: 'tvCode',
        key: 'tvCode',
        width: 100,
        render: (tvCode, record) => (
          <div className="flex gap-10 items-center">
            <div className="">
              <p className="m-0 color-primary">{record.tvName ? record.tvName : '-'}</p>
              <p className="hint" style={{ color: record.isReport ? '' : 'red' }}>
                {tvCode}
              </p>
            </div>
          </div>
        ),
        onCell: (record, rowIndex) => {
          return {
            style: {
              background: record.isReport ? '' : '#f0f0f0',
              color: record.isReport ? '' : 'white',
            },
          };
        },
      },
      {
        title: 'Version',
        dataIndex: 'version',
        key: 'version',
        width: 100,
        render: (version, record) => version || '-',
      },

      {
        title: 'Received date',
        dataIndex: 'receivedDate',
        key: 'receivedDate',
        render: (value, record) => (
          <div className="flex flex-col gap-10">
            {value && Array.isArray(value) ? (
              value.map((item) => moment(item).format('DD/MM/YYYY HH:mm'))
            ) : (
              <div style={{ width: 100 }}></div>
            )}
          </div>
        ),
      },
    ];
    const cols = [
      {
        title: 'TV',
        children: tvChildren.filter((el) => el != null),
      },
      {
        title: 'Error',
        dataIndex: 'errorLog',
        key: 'errorLog',
        render: (text, record) => {
          return text ? (
            <Popover
              placement="right"
              trigger="click"
              content={
                <div
                  style={{ maxWidth: 900, maxHeight: 'calc(100vh - 300px)', overflow: 'auto', wordBreak: 'break-all' }}
                >
                  {text}
                </div>
              }
            >
              <div className="center">
                <BaseButton color="green" iconName="note" />
              </div>
            </Popover>
          ) : (
            '-'
          );
        },
      },
      {
        title: 'Video download',
        dataIndex: 'videoDownload',
        key: 'videoDownload',
        render: (text, record) => {
          return text ? (
            <Popover
              placement="left"
              trigger="click"
              content={
                JSON.parse(text)?.length > 0 ? (
                  JSON.parse(text).map((item) => {
                    return <p>{item}</p>;
                  })
                ) : (
                  <Empty />
                )
              }
            >
              <div className="center">
                <BaseButton icon={<Icons.VideoFolder />}>{' ' + JSON.parse(text)?.length || 0}</BaseButton>
              </div>
            </Popover>
          ) : (
            '-'
          );
        },
        onCell: (record, index) => {
          return {
            style: {
              verticalAlign: 'middle',
            },
          };
        },
      },
    ];

    return cols.filter((el) => el !== null);
  },
};
export default TableDigitalSignageTVITReportData;
