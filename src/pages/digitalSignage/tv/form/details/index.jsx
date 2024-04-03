import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Slider, message } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { ArrayHelper } from 'helpers';
import moment from 'moment';
import useTVTypesQuery from 'pages/digitalSignage/tv/hooks/useTVTypesQuery';
import React, { useMemo } from 'react';
const { RangePicker } = DatePicker;

const DigitalSignageTVFormDetails = ({ form, updateTVMutation }) => {
  const tvTypesQuery = useTVTypesQuery();
  const typeOptions = useMemo(() => {
    return (
      tvTypesQuery.data?.map((item) => {
        return { value: item.typeCode, label: item.typeName };
      }) || []
    );
  }, [tvTypesQuery.data]);
  const storeOptions = useMemo(() => {
    const cachedDataJson = localStorage.getItem('cachedData');
    if (cachedDataJson) {
      const stores = JSON.parse(cachedDataJson).data?.stores;
      return Object.keys(stores).map((storeCode) => {
        return { value: storeCode, label: `${storeCode} - ${stores[storeCode]?.storeName}` };
      });
    }
    return [];
  }, []);
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={async (value) => {
        updateTVMutation.mutate(value);
      }}
    >
      <Block style={{ margin: 0 }}>
        <Form.Item
          className="w-full"
          name="storeCode"
          label="Store code"
          rules={[{ type: 'string', required: true, message: 'Store code is required' }]}
        >
          <Select disabled placeholder="Enter tv type" options={storeOptions} />
        </Form.Item>
        <Form.Item
          className="w-full"
          name="tvCode"
          label="TV code"
          rules={[{ type: 'string', required: true, message: 'TV code is required' }]}
        >
          <Input disabled placeholder="Enter tv Code" />
        </Form.Item>
        <Form.Item
          className="w-full"
          name="tvName"
          label="TV name"
          rules={[{ type: 'string', required: true, message: 'TV name is required' }]}
        >
          <Input placeholder="Enter tv Name" />
        </Form.Item>
        <Form.Item
          className="w-full"
          name="tvType"
          label="TV type"
          rules={[{ type: 'string', required: true, message: 'TV type is required' }]}
        >
          <Select loading={tvTypesQuery.isLoading} placeholder="Enter tv type" options={typeOptions} />
        </Form.Item>
        <Form.Item
          className="w-full"
          name="tvSerial"
          label="TV serial"
          rules={[{ type: 'string', required: true, message: 'TV serial is required' }]}
        >
          <Input placeholder="Enter tv serial" />
        </Form.Item>
        <Form.Item
          className="w-full"
          name="tvModel"
          label="TV model"
          rules={[{ type: 'string', required: true, message: 'TV model is required' }]}
        >
          <Input placeholder="Enter tv model" />
        </Form.Item>
      </Block>

      {/* <BaseButton iconName="send" htmlType="submit" className="mt-15" loading={updateTVMutation.isLoading}>
        Update
      </BaseButton> */}
    </Form>
  );
};

export default DigitalSignageTVFormDetails;
