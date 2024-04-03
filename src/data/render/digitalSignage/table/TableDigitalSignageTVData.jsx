import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import moment from 'moment';
import React from 'react';
import { Checkbox } from 'antd';
import { Popconfirm, Popover, Spin, Tag } from 'antd';
import OnlineOfflineStatus from 'components/common/status/OnlineOfflineStatus';
import Icons from 'images/icons';
const TableDigitalSignageTVData = {
  columns: ({ onOpenFormUpdate, onDeleteTV, tvsOnline, typeQuery, tvStatus, role, lastDayLog }) => {
    const tvChildren = [
      {
        title: 'Name',
        dataIndex: 'tvCode',
        key: 'tvCode',
        width: 100,
        render: (tvCode, record) => (
          <div className="flex gap-10 items-center">
            <span>
              {tvsOnline?.[tvCode] ? <OnlineOfflineStatus type="online" /> : <OnlineOfflineStatus type="offline" />}
            </span>
            <div className="">
              <p className="m-0 color-primary">{record.tvName ? record.tvName : '-'}</p>
              <p className="hint" style={{ color: record.isReport ? '' : 'red' }}>
                {tvCode}
              </p>
            </div>
          </div>
        ),
      },
      role !== 'admin'
        ? {
            title: 'Type',
            dataIndex: 'tvType',
            key: 'tvType',
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
          }
        : null,
      role === 'admin'
        ? {
            title: 'Received date',
            dataIndex: 'receivedDate',
            key: 'receivedDate',
            render: (value, record) => {
              const html = Object.values(tvStatus?.[record.tvCode] || {})?.map((item, index) => {
                return (
                  <p className="m-0" key={index}>
                    {item.taskReceivedDate ? moment(item.taskReceivedDate).format('DD/MM/YYYY HH:mm:ss') : null}
                  </p>
                );
              });
              return (
                <div className="" style={{ fontSize: 10, minWidth: 100 }}>
                  {html}
                </div>
              );
            },
          }
        : null,
      role === 'admin'
        ? {
            title: 'Task finish date',
            dataIndex: 'taskFinishDate',
            key: 'taskFinishDate',
            render: (value, record) => {
              const html = Object.values(tvStatus?.[record.tvCode] || {})?.map((item, index) => {
                return (
                  <p className="m-0" key={index}>
                    {item.taskFinishDate ? moment(item.taskFinishDate).format('DD/MM/YYYY HH:mm:ss') : '-'}
                  </p>
                );
              });
              return (
                <div className="" style={{ fontSize: 10, minWidth: 100 }}>
                  {html}
                </div>
              );
            },
          }
        : null,
      role === 'admin'
        ? {
            title: 'Task feedback',
            dataIndex: 'tvStatus',
            key: 'tvStatus',
            render: (value, record) => {
              const html = Object.values(tvStatus?.[record.tvCode] || {})?.map((item, index) => {
                return (
                  <p className="m-0" key={index}>
                    {item.taskFeedback}
                  </p>
                );
              });
              return (
                <div className="" style={{ fontSize: 10, minWidth: 100 }}>
                  {html}
                </div>
              );
            },
          }
        : null,

      role === 'admin'
        ? {
            title: 'Media feedbacck',
            dataIndex: 'mediaStatus',
            key: 'mediaStatus',
            render: (tvStatus, record) => (
              <div>
                {tvStatus === 1 ? (
                  <Tag color="blue">Created</Tag>
                ) : tvStatus === 2 ? (
                  <Tag color="orange">Processing</Tag>
                ) : tvStatus === 3 ? (
                  <Tag color="green">Success</Tag>
                ) : tvStatus === 4 ? (
                  <Tag color="red">Fail</Tag>
                ) : (
                  <p style={{ width: 100 }}></p>
                )}
                <p className="hint m-0 " style={{ marginTop: 5 }}>
                  {record.tvUpdateUpdatedDate ? moment(record.tvUpdateUpdatedDate).format('DD/MM/YYYY HH:mm') : '-'}
                </p>
              </div>
            ),
          }
        : null,
      role === 'admin'
        ? {
            title: 'Software Status',
            dataIndex: 'softwareStatus',
            key: 'softwareStatus',
            render: (tvStatus, record) => (
              <div className="w-fit">
                {tvStatus === 1 ? (
                  <Tag color="blue">Created</Tag>
                ) : tvStatus === 2 ? (
                  <Tag color="orange">Processing</Tag>
                ) : tvStatus === 3 ? (
                  <Tag color="green">Success</Tag>
                ) : tvStatus === 4 ? (
                  <Tag color="red">Fail</Tag>
                ) : (
                  <p style={{ width: 100 }}></p>
                )}
                <p className="hint m-0 " style={{ marginTop: 5 }}>
                  {record.tvUpdateUpdatedDate ? moment(record.tvUpdateUpdatedDate).format('DD/MM/YYYY HH:mm') : '-'}
                </p>
              </div>
            ),
          }
        : null,

      role !== 'admin'
        ? {
            title: 'Serial',
            dataIndex: 'tvSerial',
            key: 'tvSerial',
            render: (value, record) => (value ? value : '-'),
          }
        : null,
      role !== 'admin'
        ? {
            title: 'Model',
            dataIndex: 'tvModel',
            key: 'tvModel',
            render: (value, record) => (value ? value : '-'),
          }
        : null,
    ];
    const cols = [
      {
        title: 'Store',
        dataIndex: 'storeCode',
        key: 'storeCode',
        width: 300,
        render: (value, record) => (
          <div style={{ minWidth: 130 }}>{value ? value + ' - ' + record.storeName : '-'}</div>
        ),
        onCell: (record, index) => {
          return {
            colSpan: record.colSpan,
            rowSpan: record.rowSpan,
          };
        },
      },
      {
        title: 'TV',
        children: tvChildren.filter((el) => el != null),
      },

      role !== 'admin'
        ? {
            title: 'Created date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (createdDate, record) =>
              createdDate ? moment(createdDate).format('DD/MM/YYYY HH:mm') : null || <div style={{ width: 100 }}></div>,
          }
        : null,
      role !== 'admin'
        ? {
            title: 'Updated by',
            dataIndex: 'updatedBy',
            key: 'updatedBy',
            render: (text, record) =>
              (
                <div>
                  <p className="m-0">{text}</p>
                  <p className="hint">
                    {record.updatedDate ? moment(record.updatedDate).format('DD/MM/YYYY HH:mm') : null}
                  </p>
                </div>
              ) || <div style={{ width: 100 }}></div>,
          }
        : null,
      {
        title: 'Action',
        dataIndex: '',
        key: '',
        fixed: 'right',
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
            {role === 'admin' ? (
              record.active ? (
                <Popconfirm
                  placement="topLeft"
                  title={
                    <p>
                      <span>Are you sure to lock TV </span>
                      <span className="font-bold color-primary">
                        {record.tvCode}-{record.tvName} ?
                      </span>{' '}
                      <span className="cl-red font-bold">forever </span>
                    </p>
                  }
                  onConfirm={() => onDeleteTV(record.tvCode)}
                  okText="Yes"
                  cancelText="No"
                >
                  <BaseButton icon={<Icons.Lock />} color="error" />
                </Popconfirm>
              ) : (
                <Popover content="This TV is not available" placement="left">
                  <Icons.EyeClose style={{ color: 'gray', width: '100%', height: '32px', cursor: 'not-allowed' }} />
                </Popover>
              )
            ) : record.active ? (
              <BaseButton iconName="edit" onClick={() => onOpenFormUpdate(record)} />
            ) : (
              <Popover content="This TV is not available" placement="left">
                <Icons.EyeClose style={{ color: 'gray', width: '100%', height: '32px', cursor: 'not-allowed' }} />
              </Popover>
            )}
          </div>
        ),
      },
    ];

    return cols.filter((el) => el !== null);
  },
};
export default TableDigitalSignageTVData;
