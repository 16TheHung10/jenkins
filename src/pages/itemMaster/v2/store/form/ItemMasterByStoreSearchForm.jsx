import { Col, Form, Input, Row, Select } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SelectFormField from 'components/common/selects/SelectFormField';
import AppMessage from 'message/reponse.message';
import React, { Fragment } from 'react';

const ItemMasterByStoreSearchForm = ({ form, ImportButton }) => {
  const areaWatcher = Form.useWatch('area', form);
  const storeWatcher = Form.useWatch('storeCode', form);
  return (
    <Block>
      <Form
        form={form}
        layout="vertical"
        onFinish={(value) => {
          console.log({ value });
        }}
      >
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item name="area" label="Area" rules={[{ type: 'string', required: true, message: 'Missing area' }]}>
              <SelectFormField
                options={[
                  { value: '1', label: 1 },
                  { value: '2', label: 2 },
                ]}
              />
            </Form.Item>
          </Col>
          {areaWatcher ? (
            <>
              <Col span={6}>
                <Form.Item
                  name="storeCode"
                  label="Store Code"
                  rules={[{ type: 'string', required: true, message: 'Missing store code' }]}
                >
                  <SelectFormField
                    options={[
                      { value: '1', label: 1 },
                      { value: '2', label: 2 },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="itemCode" label="Item Code">
                  <Input placeholder="Item code" />
                </Form.Item>
              </Col>
            </>
          ) : null}
          <Col span={24}>
            <div className="flex gap-10">
              <BaseButton iconName="search" htmlType="submit">
                Search
              </BaseButton>
              {storeWatcher ? <ImportButton color="green" /> : null}
            </div>
          </Col>
        </Row>
      </Form>
    </Block>
  );
};

export default ItemMasterByStoreSearchForm;
