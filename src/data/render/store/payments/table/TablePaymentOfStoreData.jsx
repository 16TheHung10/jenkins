import { Switch } from 'antd';
import React from 'react';
const TablePaymentOfStoreData = {
  columns: ({ onChangeAllowPromotion, isLoading }) => {
    return [
      {
        title: 'Payment method',
        dataIndex: 'paymentName',
        key: 'paymentName',
        render: (text, record) => {
          return text ? text : '-';
        },
        width: 250,
        // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
      },
      {
        title: 'Allow',
        dataIndex: 'active',
        key: 'active',
        width: 60,
        render: (value, record, index) => {
          return (
            <Switch checkedChildren="Allow" unCheckedChildren="Allow" checked={value} onChange={(checked) => onChangeAllowPromotion(record, index)} style={{ marginBottom: 10 }} loading={isLoading} />
          );
        },
      },
    ];
  },
};
export default TablePaymentOfStoreData;
