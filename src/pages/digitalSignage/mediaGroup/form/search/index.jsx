import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import moment from 'moment';
import useTVTypesQuery from 'pages/digitalSignage/tv/hooks/useTVTypesQuery';
import React, { useMemo } from 'react';
const { RangePicker } = DatePicker;

const DigitalSignageMediaGroupFormSearch = ({ form, onOpenFormCreate, onSetSearParams }) => {
  const tvType = useTVTypesQuery();
  const typeOptions = useMemo(() => {
    return tvType.data?.map((item) => {
      return { value: item.typeCode, label: item.typeName };
    });
  }, [tvType.data]);
  return (
    <Form form={form} layout="vertical" onFinish={onSetSearParams}>
      <Row gutter={[16, 0]}>
        <Col span={6}>
          <Form.Item className="w-full" name="keyword" label="Keyword">
            <Input className="w-full" placeholder="Enter keyword" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item className="w-full" name="mode" label="Mode">
            {/* <Select
              className="w-full"
              placeholder="-- ALL --"
              options={[...(typeOptions || [])]}
              loading={tvType.isLoading}
            /> */}
            <Select
              allowClear
              className="w-full"
              placeholder="-- ALL --"
              options={[
                {
                  value: 'NORMAL',
                  label: 'Schedule',
                },
                {
                  value: 'REPEAT',
                  label: 'Repeat',
                },
              ]}
              loading={tvType.isLoading}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item className="w-full" name="type" label="Type">
            <Select
              allowClear
              className="w-full"
              placeholder="-- ALL --"
              options={[...(typeOptions || [])]}
              loading={tvType.isLoading}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <div className="flex gap-10">
            <BaseButton iconName="send" htmlType="submit">
              Search
            </BaseButton>{' '}
            <BaseButton iconName="plus" color="green" htmlType="button" onClick={onOpenFormCreate}>
              Create
            </BaseButton>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default DigitalSignageMediaGroupFormSearch;
