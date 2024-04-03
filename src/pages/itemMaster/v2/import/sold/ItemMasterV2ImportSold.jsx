import { Col, Form, Row } from 'antd';
import { ItemsMasterApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { useGetCommonQuery, useGetItemMasterQuery, useImportExcel } from 'hooks';
import AppMessage from 'message/reponse.message';
import ImportItemPriceSelectStore from 'pages/itemMaster/v2/import/order/importItemPriceSelectStore/ImportItemPriceSelectStore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ImportItemSoldForm from './form/ImportItemSoldForm';

const ItemMasterV2ImportSold = () => {
  const [checkedStores, setCheckedStores] = useState([]);
  const commonQuery = useGetCommonQuery({ type: 'region,stv1' });
  const itemsQuery = useGetItemMasterQuery({});
  const [mapedRegionWithStore, setMapedRegionWithStore] = useState([]);
  const [formImport] = Form.useForm();
  const { ComponentImport, ComponentExport, dataImported } = useImportExcel();
  const handleCheckedStores = useCallback(
    (value) => {
      setCheckedStores(value);
    },
    [checkedStores]
  );

  const formatedDataImport = useMemo(() => {
    if (dataImported && itemsQuery.data) {
      const itemsObject = itemsQuery.data;
      return dataImported?.map((item) => {
        return {
          ...item,
          isValidItem: Boolean(itemsObject[item.ItemCode]),
          isValidLockWH: typeof item.LockWH === 'boolean',
          itemName: itemsObject[item.ItemCode]?.itemName,
        };
      });
    }
    return [];
  }, [dataImported, itemsQuery.data]);

  const handleImport = async (value) => {
    if (dataImported?.length <= 0) {
      AppMessage.info('Please import data');
      return null;
    }
    if (checkedStores?.length <= 0) {
      AppMessage.info('Please select store');
      return null;
    }
    const filteredStore = checkedStores.filter((el) => el.startsWith('Store'));
    const applyAllStore = Object.values(commonQuery.data?.stores)?.length === filteredStore?.length;
    const payload = {
      applyAllStore,
      itemApply: dataImported?.map((item) => ({
        ItemCode: item.ItemCode,
      })),
      storeApply: applyAllStore ? [] : filteredStore?.map((item) => ({ storeCode: item.replace('Store-', '') })),
    };
    const res = await ItemsMasterApi.changeStoreItemSold(payload);
    if (res.status) {
      AppMessage.success('Import successfully');
    } else {
      AppMessage.error(res.message);
    }
  };

  useEffect(() => {
    const mappedData = new Map();
    const stores = Object.values(commonQuery.data?.stores || {});
    const regions = commonQuery.data?.regions || [];
    const regionMap = new Map();
    for (let index in regions) {
      const region = regions[index];
      if (!regionMap.has(region.regionCode)) {
        regionMap.set(region.regionCode, { ...region, index });
      }
    }
    for (let index in stores) {
      const store = stores[index];
      const region = regionMap.get(store.regionCode);
      const storeTreeValue = {
        title: `${store.storeCode} - ${store.storeName}`,
        key: store.storeCode,
        parentKey: region.regionCode,
      };
      const regionTreeValue = {
        title: region.regionName,
        key: region.regionCode,
      };
      if (!mappedData.has(store.regionCode)) {
        mappedData.set(store.regionCode, { children: [storeTreeValue], ...regionTreeValue });
      } else {
        const currentStores = mappedData.get(store.regionCode).children;
        const newStores = [...currentStores, storeTreeValue];
        mappedData.set(store.regionCode, { children: newStores, ...regionTreeValue });
      }
    }
    setMapedRegionWithStore(Object.values(Object.fromEntries(mappedData)));
  }, [commonQuery.data]);

  return (
    <PageWithNav
      actionLeft={[
        {
          name: 'Import sold items',
          pathName: `/item-master/v2/sold/import`,
          actionType: 'link',
        },
      ]}
    >
      <Row gutter={[16, 0]}>
        <Col span={8}>
          <Block style={{ maxHeight: 'calc(100vh - 115px)', overflow: 'auto', paddingTop: 0 }}>
            <h4 style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, paddingTop: 10 }}>
              Select region
            </h4>
            <ImportItemPriceSelectStore
              treeData={mapedRegionWithStore}
              onCheck={handleCheckedStores}
              disabled={commonQuery.isLoading}
            />
          </Block>
        </Col>
        <Col span={16}>
          <Block>
            <ImportItemSoldForm
              form={formImport}
              ImportButton={(props) => <ComponentImport {...props} loading={itemsQuery.isLoading} />}
              onImport={handleImport}
            />

            <MainTable
              className="w-full"
              pagination={null}
              dataSource={formatedDataImport}
              columns={[
                {
                  title: 'Item code',
                  dataIndex: 'ItemCode',
                  key: 'ItemCode',
                  render: (text, record) => {
                    return (
                      <div>
                        <p className="m-0">{record.itemName || 'Invalid item'}</p>
                        <p className="hint">{text}</p>
                      </div>
                    );
                  },
                  onCell: (record) => {
                    return {
                      style: {
                        color: record.isValidItem ? 'black' : 'red',
                      },
                    };
                  },
                },
              ]}
            />
          </Block>
        </Col>
      </Row>
    </PageWithNav>
  );
};

export default ItemMasterV2ImportSold;
