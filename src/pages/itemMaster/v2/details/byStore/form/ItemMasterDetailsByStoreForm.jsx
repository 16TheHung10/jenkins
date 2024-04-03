import { Col, Form, InputNumber, Row, Select } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import SelectFormField from 'components/common/selects/SelectFormField';
import { mainContentRef } from 'components/mainContent/MainContent';
import { FileHelper, StringHelper } from 'helpers';
import { useCommonOptions } from 'hooks';
import React, { useEffect, useRef } from 'react';

const ItemMasterDetailsByStoreForm = ({ form, onSubmit, onSearch, loading, isLoadingSearch, searchQueryStatus }) => {
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
        <Block className="m-0 section-block-reverse-bg">
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
                  label="Cost Price"
                  name="costPrice"
                  rules={[{ type: 'number', required: true, message: 'Cost Price is required' }]}
                >
                  <InputNumber
                    disabled
                    className="w-full"
                    min={1}
                    max={99999999}
                    placeholder="Cost Price"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Selling Price"
                  name="sellingPrice"
                  rules={[{ type: 'number', required: true, message: 'Selling Price is required' }]}
                >
                  <InputNumber
                    disabled
                    className="w-full"
                    min={1}
                    max={99999999}
                    placeholder="Selling Price"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Supplier Code"
                  name="supplierCode"
                  rules={[{ type: 'string', required: true, message: 'Supplier Code is required' }]}
                >
                  <SelectFormField options={options.supplierOptions()} placeholder="Supplier Code" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Allow Order"
                  name="allowOrder"
                  rules={[{ type: 'boolean', required: true, message: 'Allow Order is required' }]}
                >
                  <SelectFormField
                    options={[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                    ]}
                    placeholder="Allow Order"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Allow Sold"
                  name="allowSold"
                  rules={[{ type: 'boolean', required: true, message: 'Allow Sold is required' }]}
                >
                  <SelectFormField
                    options={[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                    ]}
                    placeholder="Allow Sold"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Allow Return"
                  name="allowReturn"
                  rules={[{ type: 'boolean', required: true, message: 'Allow Return is required' }]}
                >
                  <SelectFormField
                    options={[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                    ]}
                    placeholder="Allow Return"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Return Goods Term"
                  name="returnGoodsTerm"
                  rules={[{ type: 'number', required: true, message: 'Return Goods Term is required' }]}
                >
                  <SelectFormField
                    options={[
                      { value: 1, label: 'Yes' },
                      { value: 0, label: 'No' },
                    ]}
                    placeholder="Return Goods Term"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Allow Entry"
                  name="allowEntry"
                  rules={[{ type: 'bool', required: true, message: 'Allow Entry is required' }]}
                >
                  <Select
                    options={[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                    ]}
                    placeholder="Allow Entry"
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

export default ItemMasterDetailsByStoreForm;
