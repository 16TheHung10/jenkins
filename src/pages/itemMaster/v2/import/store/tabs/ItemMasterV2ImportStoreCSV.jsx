import { Col, Form, Row } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SelectStoreAndRegion from 'components/common/tree/selectStoreAndRegion/SelectStoreAndRegion';
import { TableItemByStoreImportData } from 'data/render/table';
import { useGetItemMasterQuery, useImportExcel, useImportStoreItemMutation } from 'hooks';
import AppMessage from 'message/reponse.message';
import React, { useEffect, useMemo, useState } from 'react';

const ItemMasterV2ImportStoreCSV = () => {
  const { ComponentImport, dataImported, setDataImported } = useImportExcel();
  const [isValidDataImported, setIsValidDataImported] = useState(false);
  const [formImport] = Form.useForm();
  const importMutation = useImportStoreItemMutation();
  const itemsQuery = useGetItemMasterQuery({});

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
        value: {
          storeApply: value.storeApply
            ?.filter((el) => el.startsWith('Store'))
            ?.map((item) => item.replace('Store-', '')),
        },
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
        };
      });
    }
    return [];
  }, [dataImported, itemsQuery.data]);

  return (
    <Form
      onFinish={(value) => {
        handleImport(value);
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item name="storeApply" style={{ marginTop: 20 }}>
            {/* <ItemMasterByStoreImportForm form={formImport} ImportButton={ComponentImport} onImport={handleImport} /> */}

            <SelectStoreAndRegion />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Row>
            <Col span={24}>
              <div className="flex gap-10 items-end">
                <ComponentImport
                  color="green"
                  linkDownload="https://api.gs25.com.vn:8091/storemanagement/share/template/itemMaster/ImportStoreItem.xls"
                />
                <BaseButton loading={importMutation.isLoading} htmlType="submit" iconName="send">
                  Submit
                </BaseButton>
              </div>
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
        </Col>
      </Row>
    </Form>
  );
};

export default ItemMasterV2ImportStoreCSV;
