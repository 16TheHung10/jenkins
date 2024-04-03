import { Col, Form, Input, Row, Select } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import DisableRangeDate2 from 'components/common/datePicker/rangePicker/DisableRangeDate2';
import SelectStoreFormField from 'components/common/selects/SelectStoreFormField';
import { useCommonOptions } from 'hooks';
import React from 'react';

const PromotionMixABMatchCSearchForm = ({ form, onSubmit }) => {
  const options = useCommonOptions();
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(value) => {
        onSubmit((prev) => ({ ...prev, ...value }));
      }}
    >
      <Row gutter={[16, 0]}>
        <Col span={6}>
          <Form.Item name="date" rules={[{ required: true, message: 'Please select apply date' }]}>
            <DisableRangeDate2
              mode="range"
              allowSelectPast
              modeSelect={['range', 'month', 'week', 'date']}
              quickDisabledRange={'month'}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="name" label="Promotion name">
            <Input placeholder="Emter promotion name" className="w-full" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="store">
            <SelectStoreFormField options={options.storeOptions()} allowSelectStoreType placeholder="Select store" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name="status" label="Status ">
            <Select
              placeholder="Status"
              className="w-full"
              options={[
                { value: 1, label: 'Active' },
                { value: 0, label: 'Inactive' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex items-center gap-10">
        <BaseButton htmlType="submit" iconName="search">
          Search
        </BaseButton>
      </div>
    </Form>
  );
};

export default React.memo(PromotionMixABMatchCSearchForm);
