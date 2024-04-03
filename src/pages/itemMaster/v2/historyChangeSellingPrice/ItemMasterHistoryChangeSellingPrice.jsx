import { Form } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import { TableItemHistoryChangeSellingPriceData } from 'data/render/table';
import { useGetItemMasterHistoryChangeSellingPriceQuery, useImportExcel } from 'hooks';
import ItemMasterHistoryChangeSellingPriceForm from 'pages/itemMaster/v2/historyChangeSellingPrice/form/ItemMasterHistoryChangeSellingPriceForm';
import React, { useCallback, useState } from 'react';

const ItemMasterHistoryChangeSellingPrice = () => {
  const { ComponentImport, ComponentExport, dataImported } = useImportExcel();
  const [searchParams, setSearchParams] = useState({});
  const [paginationProps, setPaginationProps] = useState({ pageSize: 10 });
  const [searchForm] = Form.useForm();
  const searchQuery = useGetItemMasterHistoryChangeSellingPriceQuery({ searchParams });
  const handleSetSearchParams = useCallback(
    (value) => {
      setSearchParams(value);
    },
    [searchParams]
  );
  return (
    <div>
      <ItemMasterHistoryChangeSellingPriceForm
        searchForm={searchForm}
        onSetSearchParams={handleSetSearchParams}
        ComponentExport={() => (
          <ComponentExport title="Export" data={searchQuery.data} loading={searchQuery.isLoading} />
        )}
      />
      <Block>
        <MainTable
          pagination={{
            total: searchQuery.data?.length,
            pageSize: paginationProps.pageSize,
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
              setPaginationProps((prev) => ({ ...prev, pageSize: size }));
            },
            position: ['bottomCenter'],
            style: {
              marginTop: '30px',
              display: `${searchQuery.data?.length >= 10 ? '' : 'none'}`,
            },
          }}
          scroll={{
            y: 'calc(100vh - 435px)',
          }}
          loading={searchQuery.isLoading}
          className="w-full"
          dataSource={searchQuery.data || []}
          columns={TableItemHistoryChangeSellingPriceData.columns({})}
        />
      </Block>
    </div>
  );
};

export default ItemMasterHistoryChangeSellingPrice;
