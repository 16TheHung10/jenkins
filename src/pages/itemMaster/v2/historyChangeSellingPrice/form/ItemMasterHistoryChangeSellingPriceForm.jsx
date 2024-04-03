import { Col, DatePicker, Form, Row } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import DisableRangeDate2 from 'components/common/datePicker/rangePicker/DisableRangeDate2';
import SelectFormField from 'components/common/selects/SelectFormField';
import SelectItemMaster from 'components/common/selects/SelectItemMaster';
import CONSTANT from 'constant';
import { useCommonOptions } from 'hooks';
import moment from 'moment';
import React from 'react';

const ItemMasterHistoryChangeSellingPriceForm = ({ searchForm, onSetSearchParams, ComponentExport }) => {
  const options = useCommonOptions();
  return (
    <Block>
      <Form
        form={searchForm}
        layout="vertical"
        onFinish={(value) => {
          const { date, ...params } = value;
          onSetSearchParams({
            ...params,
            fromDate: moment(value.date[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD),
            toDate: moment(value.date[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD),
          });
        }}
      >
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item name="date" rules={[{ required: true, message: 'Missing date' }]}>
              {/* <DatePicker.RangePicker className="w-full" /> */}
              <DisableRangeDate2 allowSelectFuture={false} allowSelectPast lengthOfRangeToDisable={62} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="itemCode" label="Item">
              <SelectItemMaster />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="divisionCode" label="Division">
              <SelectFormField options={options.divistionOptions()} placeholder="Division Code" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="categoryCode" label="Category">
              <SelectFormField options={options.categoryOptions()} placeholder="Category Code" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="supplierCode" label="Supplier">
              <SelectFormField options={options.supplierOptions()} placeholder="Supplier Code" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="storeCode" label="Store">
              <SelectFormField options={options.storeOptions()} placeholder="Store Code" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className="flex gap-10">
              <BaseButton iconName="search" htmlType="submit">
                Search
              </BaseButton>
              <ComponentExport />
            </div>
          </Col>
        </Row>
      </Form>
    </Block>
  );
};

export default ItemMasterHistoryChangeSellingPriceForm;
