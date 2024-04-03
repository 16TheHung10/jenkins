import { Col, DatePicker, Form, Input, Row } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import moment from 'moment';
import React, { useMemo } from 'react';
const { RangePicker } = DatePicker;

const DigitalSignageMediaFormSearch = ({ form, onOpenFormCreate, onSetSearchParams }) => {
  return (
    <Block id="mediaSearchForm">
      <Form
        className="mt-15"
        form={form}
        layout="vertical"
        onFinish={async (value) => {
          onSetSearchParams(value);
        }}
      >
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item className="w-full" name="keyword" label="Keyword">
              <Input className="w-full" placeholder="Enter value to search" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="flex gap-10">
              <BaseButton iconName="send" htmlType="submit">
                Search
              </BaseButton>{' '}
              <BaseButton iconName="plus" color="green" htmlType="button" onClick={onOpenFormCreate}>
                Upload new video
              </BaseButton>
            </div>
          </Col>
        </Row>
      </Form>
    </Block>
  );
};

export default DigitalSignageMediaFormSearch;
