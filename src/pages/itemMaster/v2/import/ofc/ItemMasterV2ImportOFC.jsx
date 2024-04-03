import { Col, Form, Row } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { TableItemByStoreImportData } from 'data/render/table';
import { useGetItemMasterQuery, useGetStoreItemQuery, useImportExcel, useImportStoreItemMutation } from 'hooks';
import AppMessage from 'message/reponse.message';
import ItemMasterV2ImportStoreCSVForm from 'pages/itemMaster/v2/import/store/form/ItemMasterV2ImportStoreCSVForm';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const ItemMasterV2ImportOFC = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const { ComponentImport, dataImported, setDataImported } = useImportExcel();
  const [isValidDataImported, setIsValidDataImported] = useState(false);
  const [formImport] = Form.useForm();
  const itemsQuery = useGetItemMasterQuery({});
  const importMutation = useImportStoreItemMutation();
  const storeItemQuery = useGetStoreItemQuery({ storeCode: selectedStore });
  const checkValidType = (rowData) => {
    if (typeof rowData?.allowSold !== 'boolean') {
      AppMessage.error('Invalid type at "allowSold"');
      return false;
    }
    if (typeof rowData?.allowOrder !== 'boolean') {
      AppMessage.error('Invalid type at "allowOrder"');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (dataImported) {
      let validDataImported = false;
      for (let item of dataImported) {
        if (!checkValidType(item)) {
          validDataImported = false;
          break;
        } else {
          validDataImported = true;
        }
      }
      setIsValidDataImported(validDataImported);
    }
  }, [dataImported]);

  const handleImport = async (value) => {
    if (!isValidDataImported) {
      AppMessage.error('Data is invalid.Please check your data again');
    } else {
      importMutation.mutate({
        value: { storeApply: [value.storeApply] },
        dataImported,
        callback: () => {
          formImport.resetFields();
          setDataImported([]);
        },
      });
    }
  };

  const formatedDataImport = useMemo(() => {
    if (dataImported && itemsQuery.data) {
      const itemsObject = itemsQuery.data;
      return dataImported?.map((item) => {
        return {
          ...item,
          isValidItem: Boolean(itemsObject[item.itemCode]),
          isValidLockWH: typeof item.LockWH === 'boolean',
          itemName: itemsObject[item.itemCode]?.itemName,
          serverValue: storeItemQuery.data?.get(item.itemCode),
        };
      });
    }
    return [];
  }, [dataImported, itemsQuery.data, storeItemQuery.data]);

  const actionLeft = [
    {
      name: 'Import item for OP/OFC',
      pathName: `/item-master/v2/store/ofc/import`,
      actionType: 'link',
    },
  ];
  const handleGetSelectedStore = useCallback(
    (storeCode) => {
      setSelectedStore(storeCode);
    },
    [selectedStore]
  );
  return (
    <PageWithNav actionLeft={actionLeft}>
      <Block>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <ItemMasterV2ImportStoreCSVForm
              form={formImport}
              ImportButton={ComponentImport}
              onImport={handleImport}
              onSetSelectedStore={handleGetSelectedStore}
              isLoading={importMutation.isLoading}
            />
          </Col>
          <Col span={24}>
            <MainTable
              className="w-full"
              pagination={null}
              dataSource={formatedDataImport}
              columns={TableItemByStoreImportData.columns({})}
            />
          </Col>
        </Row>
      </Block>
    </PageWithNav>
  );
};

export default ItemMasterV2ImportOFC;
