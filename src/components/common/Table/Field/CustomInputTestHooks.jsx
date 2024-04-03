import { Input, InputNumber } from "antd";
import { INPUT_SIZE } from "constant";
import React from "react";

const CustomInputTestHook = ({ valueKey, value, onChange, type, ...props }) => {
  const handleChange = (value, key) => {
    onChange(value, key);
  };
  const handleChangeNumber = (value, key) => {
    onChange(value, key);
  };

  const inputProps = {
    style: { width: "100%" },
    size: INPUT_SIZE,
    value: value,
    onChange: (event) => {
      event.persist();
      handleChange(event.target.value, valueKey);
    },
    ...props,
  };
  const inputNumberProps = {
    style: { width: "100%" },
    size: INPUT_SIZE,
    value: value,
    formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    onChange: (value) => {
      handleChangeNumber(value, valueKey);
    },
    ...props,
  };
  if (type === "number") {
    return <InputNumber {...inputNumberProps} />;
  }
  return <Input className="w-full" {...inputProps} />;
};

export default CustomInputTestHook;
