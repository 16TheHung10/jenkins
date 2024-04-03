import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SelectFormField from 'components/common/selects/SelectFormField';
import CONSTANT from 'constant';
import { ArrayHelper, ObjectHelper } from 'helpers';
import { useCommonOptions } from 'hooks';
import AppMessage from 'message/reponse.message';
import moment from 'moment';
import React, { Fragment, useMemo } from 'react';

const ItemMasterByFFSearchForm = ({
  form,
  searchData,
  FilterButton,
  isShowFilter,
  onSetSearchFormValue,
  onSetFilterFormValue,
}) => {
  const optionsHooks = useCommonOptions();
  const itemGroupOptions = useMemo(() => {
    let res = [];
    for (let item of Object.values(ArrayHelper.convertArrayToObject(searchData || [], 'group'))) {
      if (item.group) res.push({ value: item.group, label: item.group });
    }
    return res;
  }, [searchData]);
  return (
    <Block>
      <Form
        form={form}
        layout="vertical"
        onFinish={(value) => {
          onSetSearchFormValue(value);
        }}
      >
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item name="date" label="Apply date" rules={[{ required: true, message: 'Missing apply date' }]}>
              <DatePicker
                className="w-full"
                format={CONSTANT.FORMAT_DATE_IN_USE}
                disabledDate={(current) => current && current > moment().startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="storeCode" label="Store">
              <SelectFormField options={optionsHooks.storeOptions()} placeholder="Select store" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="flex gap-10">
              <BaseButton iconName="search" htmlType="submit">
                Search
              </BaseButton>
              <FilterButton />
            </div>
          </Col>
        </Row>
      </Form>
      {isShowFilter ? (
        <Form
          className="mt-15"
          form={form}
          layout="vertical"
          onValuesChange={(value) => {
            onSetFilterFormValue(value);
          }}
        >
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <Form.Item name="group" label="Item's group">
                <SelectFormField options={itemGroupOptions} placeholder="Select store" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : null}
    </Block>
  );
};

export default ItemMasterByFFSearchForm;
