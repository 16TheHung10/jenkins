import { Button, Form, Input, Select, Upload } from 'antd';
import React from 'react';
import UploadFileComponent from '../../../../components/common/upload/UploadFileComponent';
import SelectFormField from 'components/common/selects/SelectFormField';

const PaymentGroupForm = ({ paymentGroups, storeOptions }) => {
  return (
    <>
      <Form.Item
        name="paymentName"
        rules={[
          {
            type: 'string',
            required: true,
            message: 'Missing payment name',
          },
        ]}
      >
        <Input placeholder="Enter payment name" />
      </Form.Item>

      <Form.Item
        name="paymentGroup"
        rules={[
          {
            type: 'string',
            required: true,
            message: 'Missing payment group',
          },
        ]}
      >
        <Select
          disabled={!paymentGroups || Object.values(paymentGroups)?.length === 0}
          options={Object.values(paymentGroups)?.map((item) => {
            return { value: item.groupCode, label: item?.groupName };
          })}
          placeholder="Select payment group"
        />
      </Form.Item>

      <Form.Item
        name="paymentImage"
        rules={[
          {
            type: 'array',
            required: true,
            message: 'Missing payment image',
          },
        ]}
      >
        <UploadFileComponent maxCount={1} multiple={false} />
      </Form.Item>
      {storeOptions && (
        <Form.Item name="storeCodes">
          <SelectFormField
            mode="multiple"
            disabled={!paymentGroups || Object.values(paymentGroups)?.length === 0}
            options={storeOptions}
            placeholder="Select store"
            maxTagCount="responsive"
          />
        </Form.Item>
      )}

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </>
  );
};

export default PaymentGroupForm;
