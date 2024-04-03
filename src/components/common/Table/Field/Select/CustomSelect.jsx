import React, { useMemo } from "react";
import { OptionsHelper } from "helpers";
import { Select } from "antd";
import { INPUT_SIZE } from "constant";
const CustomSelect = ({
  data,
  valueKey,
  labelKey,
  label,
  value,
  onChange,
  ...props
}) => {
  const options = useMemo(() => {
    return OptionsHelper.convertDataToOptions(data, valueKey, labelKey);
  }, [data]);

  return (
    <Select
      size={INPUT_SIZE}
      isClearable
      value={value}
      options={[{ value: -1, label: "Select all", disabled: true }, ...options]}
      onChange={onChange}
      {...props}
    />
  );
};

export default CustomSelect;
