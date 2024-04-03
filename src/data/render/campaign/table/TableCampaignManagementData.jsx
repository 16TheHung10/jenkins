import { Popconfirm, Tag } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Icons from 'images/icons';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import moment from 'moment';
export const AwardIndexValue = {
  0: 'Giải đặc biệt',
  1: 'Giải nhất',
  2: 'Giải nhì',
  3: 'Giải ba',
};
export const CampaignTypeValue = {
  1: ' Mua bill được Voucher',
  2: ' Game Quay số trên App',
  3: 'Mua bill nhận mã dự thưởng',
  4: 'Claim quà (POS)',
  5: 'Scan QR',
};

const TableCampaignManagementData = {
  columns: ({ paymentmethods, excluesField }) => {
    const col = [
      {
        title: 'Campaign Code',
        dataIndex: 'campaignCode',
        key: 'campaignCode',
        render: (text) => text || '-',
      },
      {
        title: 'Campaign Name',
        dataIndex: 'campaignName',
        key: 'campaignName',
        render: (text) => text || '-',
      },

      {
        title: 'Campaign Title',
        dataIndex: 'campaignTitle',
        key: 'CampaignTitle',
        render: (text) => text || '-',
      },

      {
        title: 'MinValueValid',
        dataIndex: 'minValueValid',
        key: 'MinValueValid',
        render: (text) => text || '-',
      },
      {
        title: 'Applied total bill',
        dataIndex: 'appliedTotalBill',
        key: 'AppliedTotalBill',
        render: (text) => text || '-',
      },

      {
        title: 'Status',
        dataIndex: 'active',
        key: 'active',
        render: (text) =>
          text === 1 ? (
            <Tag color="green" className="m-0">
              Active
            </Tag>
          ) : text === 0 ? (
            <Tag title="Inactive" color="red" className="m-0">
              Inactive
            </Tag>
          ) : (
            '-'
          ),
      },

      {
        title: 'From date',
        dataIndex: 'startDateValid',
        key: 'StartDateValid',
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : '-'),
      },

      {
        title: 'To date',
        dataIndex: 'endDateValid',
        key: 'EndDateValid',
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : '-'),
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
        dataIndex: 'action',
        key: 'action',
        width: 20,
        onCell: (record, rowIndex) => {
          return {
            style: {
              textAlign: 'center',
              verticalAlign: 'center',
            },
          };
        },
        render: (text, record) => (
          <Link to={`/campaigns/details/${record.campaignCode}`}>
            <Icons.Search />
          </Link>
        ),
      },
    ];
    const res = [];
    for (let item of col) {
      if (!excluesField?.includes(item.dataIndex)) {
        res.push(item);
      }
    }
    return res;
  },
  columnAwarditem: (onDelete, items, campaignType) => {
    if (campaignType === 5) {
      return [
        {
          title: 'Item',
          dataIndex: 'itemCode',
          key: 'itemCode',
          render: (value, record) => {
            if (!value) return '-';
            return (
              <>
                <p className="m-0">{record.itemName}</p>
                <p className="m-0 hint">{value}</p>
              </>
            );
          },
        },

        {
          title: 'Qty',
          dataIndex: 'qty',
          key: 'maxStockQty',
          render: (value, record) => (+campaignType === 5 ? 1 : value || '-'),
        },
        {
          title: 'Stock Qty',
          dataIndex: 'stockQty',
          key: 'maxStockQty',
          render: (value, record) => value,
        },
        // {
        //   title: 'Max stock qty',
        //   dataIndex: 'maxStockQty',
        //   key: 'maxStockQty',
        //   render: (value, record) => value,
        // },
        {
          title: 'Actions',
          dataIndex: 'action',
          key: 'action',
          width: 50,
          render: (value, record, index) => {
            if (!onDelete) return null;
            return (
              <div className="flex gap-10">
                {/* <BaseButton iconName="edit" color="green" onClick={() => onClickUpdate({ ...record, index })} /> */}
                <Popconfirm title="Are you sure to remove this item" onConfirm={() => onDelete({ ...record, index })}>
                  <BaseButton iconName="delete" color="error" />
                </Popconfirm>
              </div>
            );
          },
        },
      ];
    }
    return [
      {
        title: 'Item',
        dataIndex: 'itemCode',
        key: 'itemCode',
        render: (value, record) => {
          if (!value) return '-';
          return (
            <>
              <p className="m-0">{items?.[value]?.itemName}</p>
              <p className="m-0 hint">{value}</p>
            </>
          );
        },
      },

      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        render: (value, record) => value || '-',
      },

      {
        title: 'Award Index',
        dataIndex: 'awardIndex',
        key: 'awardIndex',
        width: 100,
        render: (value, record) => (!value && value !== 0 ? '-' : AwardIndexValue[value]),
      },
      {
        title: 'SMS',
        dataIndex: 'sms',
        key: 'sms',
        render: (value, record) => (!value && value !== 0 ? '-' : value),
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
        width: 50,
        render: (value, record, index) => {
          if (!onDelete) return null;
          return (
            <div className="flex gap-10">
              {/* <BaseButton iconName="edit" color="green" onClick={() => onClickUpdate({ ...record, index })} /> */}
              <Popconfirm title="Are you sure to remove this item" onConfirm={() => onDelete({ ...record, index })}>
                <BaseButton iconName="delete" color="error" />
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  },
};
export default TableCampaignManagementData;
