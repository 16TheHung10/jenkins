import { Form } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import CONSTANT from 'constant';
import { TableItemByFFData } from 'data/render/table';
import { useImportExcel, useShowFilter } from 'hooks';
import moment from 'moment';
import ItemMasterByFFSearchForm from 'pages/itemMaster/v2/ff/form/ItemMasterByFFSearchForm';
import useItemByFFQuery from 'pages/itemMaster/v2/ff/hooks/useItemByFFQuery';
import ItemMasterByFFNav from 'pages/itemMaster/v2/ff/nav';
import React, { useCallback, useMemo, useState } from 'react';

const ItemMasterByStore = () => {
  const [searchFormValues, setSearchFormValues] = useState({});
  const [filterFormValues, setFilterFormValues] = useState({});
  const [paginationProps, setPaginationProps] = useState({ pageSize: 10 });
  const { ComponentImport, dataImported, ComponentExport, onExport } = useImportExcel();
  const { isVisible, TriggerComponent } = useShowFilter();

  const [formSearch] = Form.useForm();
  const reportItemFFQuery = useItemByFFQuery({ params: searchFormValues });
  const handleSetSearchFormValue = useCallback(
    (value) => {
      setSearchFormValues(value);
    },
    [searchFormValues]
  );
  const handleSetFilterFormValue = useCallback(
    (value) => {
      setFilterFormValues(value);
    },
    [filterFormValues]
  );

  const tableDataSource = useMemo(() => {
    return (
      [...(reportItemFFQuery.data || [])]?.filter(
        (el) => !filterFormValues.group || el.group === filterFormValues.group
      ) || []
    );
  }, [reportItemFFQuery.data, filterFormValues]);

  const exportData = useMemo(() => {
    if (tableDataSource) {
      return tableDataSource.map((item) => {
        const { itemName, group, position, qty, storeCode, createdBy, createdDate, expiry, expiryNote } = item;
        return {
          '0 .StoreCode': storeCode,
          '1 .Item': itemName,
          '2 .Group': group,
          '3 .Position': position,
          '4 .Qty': qty,
          '5 .ExpirationTime': expiry,
          '6 .Note': expiryNote,
          '7 .CreatedBy': createdBy,
          '8 .CreatedDate': moment(createdDate).format(CONSTANT.FORMAT_DATE_IN_USE_FULL),
        };
      });
    }
  }, [tableDataSource]);

  return (
    <ItemMasterByFFNav>
      <ItemMasterByFFSearchForm
        searchData={tableDataSource}
        form={formSearch}
        FilterButton={TriggerComponent}
        isShowFilter={isVisible}
        onSetSearchFormValue={handleSetSearchFormValue}
        onSetFilterFormValue={handleSetFilterFormValue}
      />
      <Block>
        <div className="w-fit" style={{ marginRight: 'auto' }}>
          <ComponentExport title="Export" data={exportData} />
        </div>
        <MainTable
          loading={reportItemFFQuery.isLoading}
          className="mt-15 w-fit"
          dataSource={tableDataSource}
          columns={TableItemByFFData.columns({})}
          scroll={{ y: 'calc(100vh - 355px)' }}
          pagination={{
            total: tableDataSource?.length,
            pageSize: paginationProps.pageSize,
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
              setPaginationProps((prev) => ({ ...prev, pageSize: size }));
            },
          }}
        />
      </Block>
    </ItemMasterByFFNav>
  );
};

export default ItemMasterByStore;
