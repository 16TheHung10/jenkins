import { Col, Form, Row, Tabs } from 'antd';
import { ItemsMasterApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import ChangeCostPrice from 'components/mainContent/itemMaster/changeCostPrice';
import ChangePromotionCostPrice from 'components/mainContent/itemMaster/changePromotionCostPrice';
import ItemChangePriceNav from 'components/mainContent/itemMaster/nav/ItemChangePriceNav';
import CONSTANT from 'constant';
import { StringHelper } from 'helpers';
import { useGetCommonQuery, useImportExcel } from 'hooks';
import AppMessage from 'message/reponse.message';
import moment from 'moment';
import ImportItemPriceSelectStore from 'pages/itemMaster/v2/import/order/importItemPriceSelectStore/ImportItemPriceSelectStore';
import ImportItemPriceForm from 'pages/itemMaster/v2/import/price/form/ImportItemPriceForm';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const ItemMasterV2ImportPrice = () => {
  const changeCostRef = useRef();
  const changePromotionCostRef = useRef();
  const [checkedStores, setCheckedStores] = useState([]);
  const commonQuery = useGetCommonQuery({ type: 'region,stv1,supplier,division,group,subclass' });

  const handleCheckedStores = useCallback(
    (value) => {
      setCheckedStores(value);
    },
    [checkedStores]
  );
  const [mapedRegionWithStore, setMapedRegionWithStore] = useState([]);
  const [formImport] = Form.useForm();
  const { ComponentImport, ComponentExport, dataImported } = useImportExcel();

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
        AppliedDate: moment(item.AppliedDate, 'DD/MM/YYYY').format(CONSTANT.FORMAT_DATE_PAYLOAD),
        SellingPriceNew: +item.SellingPriceNew,
      })),
      storeApply: applyAllStore ? [] : filteredStore?.map((item) => ({ storeCode: item.replace('Store-', '') })),
    };
    const res = await ItemsMasterApi.changeStoreItemPrice(payload);
    if (res.status) {
      AppMessage.success('Import item price successfully');
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
    <ItemChangePriceNav>
      <Block>
        <Tabs
          items={[
            {
              key: '1',
              label: 'Master cost price',
              children: (
                <ChangeCostPrice
                  ref={changeCostRef}
                  suppliers={commonQuery.data?.suppliers}
                  divisions={commonQuery.data?.divisions}
                  groups={commonQuery.data?.groups}
                  categorySubClasses={commonQuery.data?.subclasses}
                  version="2"
                />
              ),
            },
            {
              key: '2',
              label: 'Promotion cost price',
              children: (
                <ChangePromotionCostPrice
                  ref={changePromotionCostRef}
                  suppliers={commonQuery.data?.supplie}
                  divisions={commonQuery.data?.divisions}
                  groups={commonQuery.data?.groups}
                  categorySubClasses={commonQuery.data?.subclasses}
                  version="2"
                />
              ),
            },
            {
              key: '3',
              label: 'Selling price',
              children: (
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
                      <ImportItemPriceForm form={formImport} ImportButton={ComponentImport} onImport={handleImport} />
                      <MainTable
                        className="w-full"
                        pagination={null}
                        dataSource={dataImported}
                        columns={[
                          {
                            title: 'ItemCode',
                            dataIndex: 'ItemCode',
                            key: 'ItemCode',
                            render: (text) => text || '-',
                          },
                          {
                            title: 'Applied date',
                            dataIndex: 'AppliedDate',
                            key: 'AppliedDate',
                            render: (text) => {
                              return text ? moment(text, 'DD/MM/YYYY').format(CONSTANT.FORMAT_DATE_IN_USE) : '-';
                            },
                          },
                          {
                            title: 'Selling PriceNew',
                            dataIndex: 'SellingPriceNew',
                            key: 'SellingPriceNew',
                            render: (text) => StringHelper.formatPrice(text) || '-',
                          },
                        ]}
                      />
                    </Block>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Block>
    </ItemChangePriceNav>
  );
};

export default ItemMasterV2ImportPrice;
