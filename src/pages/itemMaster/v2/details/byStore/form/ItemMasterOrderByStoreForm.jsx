import { Col, Form, InputNumber, Row } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import SelectFormField from 'components/common/selects/SelectFormField';
import { mainContentRef } from 'components/mainContent/MainContent';
import { FileHelper, StringHelper } from 'helpers';
import { useCommonOptions } from 'hooks';
import React, { useEffect, useRef } from 'react';

const ItemMasterOrderByStoreForm = ({ form, onSubmit, onSearch, loading, isLoadingSearch, searchQueryStatus }) => {
  const [viewByStoreForm] = Form.useForm();
  const options = useCommonOptions();

  const handleSubmit = async (value) => {
    const payload = {
      ...value,
    };
    onSubmit(payload);
  };

  const handleSearch = (value) => {
    onSearch(value);
  };

  return (
    <>
      <Form form={viewByStoreForm} onFinish={handleSearch}>
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item name="storeCode" rules={[{ type: 'string', required: true, message: 'Item name is required' }]}>
              <SelectFormField options={options.storeOptions()} placeholder="Select store" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <BaseButton iconName="search" htmlType="submit" loading={isLoadingSearch}>
              Search
            </BaseButton>
          </Col>
        </Row>
      </Form>
      {!isLoadingSearch && searchQueryStatus !== 'idle' ? (
        <Block className="m-0">
          <Form
            form={form}
            layout="vertical"
            onFinish={(value) => {
              handleSubmit(value);
            }}
          >
            <Row gutter={[16, 0]}>
              <Col span={6}>
                <Form.Item
                  label="MOQ"
                  name="moq"
                  rules={[{ type: 'number', required: true, message: 'MOQ is required' }]}
                >
                  <InputNumber
                    className="w-full"
                    min={1}
                    max={9999}
                    placeholder="MOQ"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Order Max"
                  name="orderMax"
                  rules={[{ type: 'number', required: true, message: 'Order Max is required' }]}
                >
                  <InputNumber
                    className="w-full"
                    min={1}
                    max={99999}
                    placeholder="Order Max"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="w-full">
              <SubmitBottomButton title="Submit" loading={loading} />
            </div>
          </Form>
        </Block>
      ) : null}
    </>
  );
};

export default ItemMasterOrderByStoreForm;
