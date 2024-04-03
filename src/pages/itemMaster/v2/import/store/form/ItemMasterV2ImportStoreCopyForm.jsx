import { Button, Form, Steps, TreeSelect } from 'antd';
import { ItemsMasterApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import SelectStoreFormField from 'components/common/selects/SelectStoreFormField';
import { StringHelper } from 'helpers';
import { useCommonOptions, useGetCommonQuery } from 'hooks';
import Icons from 'images/icons';
import AppMessage from 'message/reponse.message';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

const ItemMasterV2ImportStoreCopyForm = ({ onImport }) => {
  const [paginationProps, setPaginationProps] = useState({ pageSize: 10 });
  const [mapedRegionWithStore, setMapedRegionWithStore] = useState([]);
  const [stepFormValue, setStepFormValue] = useState({ step1: {}, step2: {} });
  const [current, setCurrent] = useState(0);
  const [sourceStoreItems, setSourceStoreItems] = useState([]);
  const [isLoadingGetStoreItems, setIsLoadingGetStoreItems] = useState(false);
  const [isLoadingCheckStoreItems, setIsLoadingCheckStoreItems] = useState(false);
  const options = useCommonOptions();
  const commonQuery = useGetCommonQuery({ type: 'region,stv1' });
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const handleCheckStoreItem = async (storeCode, type) => {
    setIsLoadingCheckStoreItems(true);
    if (!type) {
      throw new Error('Missing type');
    }
    let res;
    // Check store or region: true is region
    const regex = /^\d+$/;
    if (regex.test(storeCode)) {
      res = await ItemsMasterApi.getItemsByRegion(storeCode);
    } else {
      res = await ItemsMasterApi.checkStoreItem(storeCode);
    }
    setIsLoadingCheckStoreItems(false);
    if (res.status) {
      if (res.data.items?.length > 0) {
        if (type === 'gt') {
          setSourceStoreItems(res.data?.items);
          return true;
        }
        if (type === 'lt') return false;
      } else {
        if (type === 'gt') return false;
        if (type === 'lt') return true;
      }
    } else {
      return false;
    }
  };

  const steps = [
    {
      title: 'Select store source',
      content: (
        <Form
          className="mt-15"
          layout="vertical"
          onFinish={async (value) => {
            const isValid = await handleCheckStoreItem(value.storeSource, 'gt');
            if (isValid) {
              setStepFormValue((prev) => ({ ...prev, step1: { ...value } }));
              next();
            } else AppMessage.info('Items of store is empty');
          }}
        >
          <Form.Item name="storeSource" rules={[{ type: 'string', required: true, message: 'Missing stores' }]}>
            {/* <SelectStoreFormField label="Store source" options={options.storeOptions()} allowSelectStoreType /> */}
            <TreeSelect
              filterTreeNode={(input, option) => {
                const normalizeOptionValue = StringHelper.normalize(option.title);
                const normalizeInputValue = StringHelper.normalize(input);
                if (!normalizeOptionValue?.toLowerCase().includes(normalizeInputValue)) {
                  return (option?.title?.toString().toLowerCase() ?? '').includes(
                    input.toString().trim().toLowerCase()
                  );
                }
                return true;
              }}
              showSearch
              style={{
                width: '100%',
              }}
              dropdownStyle={{
                maxHeight: 400,
                overflow: 'auto',
              }}
              placeholder="Please select"
              allowClear
              // treeDefaultExpandAll
              treeData={mapedRegionWithStore}
              loading={commonQuery.isLoading}
            />
          </Form.Item>
          <Button loading={isLoadingCheckStoreItems} type="primary" htmlType="submit">
            Next
          </Button>
        </Form>
      ),
    },
    {
      title: 'Select store target',
      content: (
        <Form
          className="mt-15"
          layout="vertical"
          onFinish={async (value) => {
            const isValid = await handleCheckStoreItem(value.storeTarget, 'lt');
            if (isValid) {
              setStepFormValue((prev) => ({ ...prev, step2: { ...value } }));
              next();
            } else AppMessage.info('This store currently has products');
          }}
        >
          <Form.Item name="storeTarget" rules={[{ type: 'string', required: true, message: 'Missing stores' }]}>
            {/* <SelectStoreFormField loading={commonQuery.isLoading} /> */}
            <SelectStoreFormField options={options.storeOptions()} allowSelectStoreType />
          </Form.Item>
          <div className="flex gap-10">
            <Button loading={isLoadingCheckStoreItems} type="primary" htmlType="submit">
              Next
            </Button>
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          </div>
        </Form>
      ),
    },
    {
      title: 'Submit',
      content: (
        <div className="mt-15 mb-15">
          <div className="flex gap-10 items-center">
            <p className="m-0">
              Copy item of store: <span className="color-primary">{stepFormValue.step1.storeSource}</span>{' '}
            </p>
            <Icons.ArrowRight />
            <p className="m-0">
              <span className="color-primary">{stepFormValue.step2.storeTarget}</span>
            </p>
          </div>
          <MainTable
            loading={isLoadingGetStoreItems}
            className="w-full"
            pagination={{
              total: sourceStoreItems?.length,
              pageSize: paginationProps.pageSize,
              showSizeChanger: true,
              onShowSizeChange: (current, size) => {
                setPaginationProps((prev) => ({ ...prev, pageSize: size }));
              },
            }}
            dataSource={sourceStoreItems}
            columns={[
              {
                title: 'Item code',
                dataIndex: 'itemCode',
                key: 'itemCode',
                render: (text) => (text ? text : '-'),
              },
              {
                title: 'Item name',
                dataIndex: 'itemName',
                key: 'itemName',
                render: (text) => (text ? text : '-'),
              },
              {
                title: 'Sale Price',
                dataIndex: 'sellingPrice',
                key: 'sellingPrice',
                render: (text) => StringHelper.formatPrice(text) || '-',
              },
            ]}
          />
          <div className="flex gap-10">
            <Button
              type="primary"
              onClick={() => {
                onImport(sourceStoreItems, [stepFormValue.step2.storeTarget], () => setCurrent(0));
              }}
            >
              Done
            </Button>
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  useLayoutEffect(() => {
    const mappedData = new Map();
    const stores = Object.values(commonQuery.data?.stores || {}).filter((el) => el.storeCode?.startsWith('VN'));
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
        value: store.storeCode,
        parentKey: region.regionCode,
      };
      const regionTreeValue = {
        title: region.regionName,
        value: region.regionCode,
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
    <>
      <Steps current={current} items={items} />
      <div className="steps-content">{steps[current].content}</div>
    </>
  );
};

export default ItemMasterV2ImportStoreCopyForm;
