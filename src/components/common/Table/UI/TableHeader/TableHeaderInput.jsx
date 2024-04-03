import { Col, Input } from "antd";
import React from "react";

const TableHeaderInput = ({ field }) => {
  return (
    <Col span={8} key={field.id}>
      <label htmlFor="storeCode" className="w100pc">
        {field.label}
      </label>
      <Input
        onChange={field.onChange}
        style={{ width: "100%" }}
        placeholder={field.placeholder}
      />
    </Col>
  );
};

export default TableHeaderInput;
