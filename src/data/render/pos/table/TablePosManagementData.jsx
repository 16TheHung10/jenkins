import { Switch, Tag } from 'antd';
import React from 'react';
import Icons from 'images/icons';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { ScanOutlined } from '@ant-design/icons';
import { ReactComponent as PosIcon } from '../../../../images/icons/pos-icon.svg';
import { ReactComponent as SelCheckoutIcon } from '../../../../images/icons/self-checkout-icon.svg';
const TablePosManagementData = {
  columns: ({ onChangeAllowPromotion, onChangeAllowSysCall, onClickEdit }) => [
    {
      title: 'Counter',
      dataIndex: 'counterCode',
      key: 'counterCode',
      render: (text, record) => {
        return text ? (
          <div className="flex items-center gap-10">
            {record.isSelfCheckout ? (
              <SelCheckoutIcon style={{ width: 35, height: 35, color: 'green' }} />
            ) : (
              <PosIcon style={{ width: 35, height: 35, color: 'var(--primary-color)' }} />
            )}{' '}
            {text + ' - ' + record.counterName}
          </div>
        ) : (
          '-'
        );
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: 'Promotion',
      dataIndex: 'allowPromotion',
      key: 'allowPromotion',
      render: (value, record, index) => {
        return (
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Active"
            checked={value}
            onChange={(checked) => onChangeAllowPromotion(record, index)}
          />
        );
      },
    },
    {
      title: 'Sys call',
      dataIndex: 'allowRungOrder',
      key: 'allowRungOrder',
      render: (value, record, index) => {
        return (
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Active"
            checked={value}
            onChange={(checked) => onChangeAllowSysCall(record, index)}
          />
        );
      },
    },

    {
      title: 'Actions',
      dataIndex: '',
      key: '',
      render: (value, record, index) => {
        return <BaseButton iconName="edit" onClick={() => onClickEdit(record)} />;
      },
    },
  ],
};
export default TablePosManagementData;
