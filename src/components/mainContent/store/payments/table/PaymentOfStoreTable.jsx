import React from 'react';
import MainTable from 'components/common/Table/UI/MainTable';
import { TablePaymentOfStoreData } from 'data/render/table';
const PaymentOfStoreTable = ({ data, loading, onChangeAllowPromotion, isLoading }) => {
  return (
    <MainTable
      loading={loading}
      // pagination={false}
      scroll={{
        y: 'calc(100vh - 215px)',
      }}
      columns={TablePaymentOfStoreData.columns({ onChangeAllowPromotion, isLoading })}
      dataSource={data}
    />
  );
};

export default PaymentOfStoreTable;
