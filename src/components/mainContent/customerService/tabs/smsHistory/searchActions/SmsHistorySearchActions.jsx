import { Col, Select } from "antd";
import React from "react";

const SmsHistorySearchActions = ({ onChange }) => {
  return (
    <Col span={6}>
      <label htmlFor="">Source</label>
      <Select
        className="w-full"
        onChange={(value) => {
          onChange(value, "source");
        }}
        placeholder="--ALL--"
        options={[
          {
            value: 0,
            label: "Default sms",
          },
          {
            value: 1,
            label: "Loyalty member sms",
          },
          {
            value: 2,
            label: "Loyalty lottery sms",
          },
          {
            value: 3,
            label: "Auto system",
          },
          {
            value: 4,
            label: "Order",
          },
        ]}
      />
    </Col>
  );
};

export default SmsHistorySearchActions;
