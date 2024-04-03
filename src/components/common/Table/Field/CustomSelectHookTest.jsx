import React, { useEffect, useMemo, useState } from "react";
import { OptionsHelper } from "helpers";
import { Checkbox, Select } from "antd";
import { INPUT_SIZE } from "constant";

const CustomSelectTestHook = ({
  data,
  valueKey,
  labelKey,
  value,
  onChange,
  ...props
}) => {
  const [isSelectAll, setIsSelectAll] = useState(false);
  const options = () => {
    const optionsResponse = OptionsHelper.convertDataToOptions(
      data,
      valueKey,
      labelKey,
    );
    if (props.mode === "multiple") {
      return [
        {
          value: -1,
          label: (
            <Checkbox
              onChange={(e) => {
                setIsSelectAll(e.target.checked);
                if (e.target.checked) {
                  onChange(
                    options()
                      ?.map((item) => item.value)
                      .slice(1),
                    valueKey,
                  );
                } else {
                  onChange([], valueKey);
                }
              }}
              checked={isSelectAll}
            >
              Select all
            </Checkbox>
          ),
          disabled: true,
        },
        ...optionsResponse,
      ];
    }
    return optionsResponse;
  };

  useEffect(() => {
    if (value?.length < options()?.length - 1) {
      setIsSelectAll(false);
    }
    if (value?.length === options()?.length - 1) {
      setIsSelectAll(true);
    }
  }, [value, options]);

  const selectProps = {
    style: { width: "100%" },
    size: INPUT_SIZE,
    value: value,
    allowClear: true,
    options: options(),
    onChange: (value) => {
      if (value?.length < options()?.length) {
        setIsSelectAll(false);
      } else if (value?.length === options()?.length) {
        setIsSelectAll(true);
      }
      onChange(value, valueKey);
    },
    ...props,
  };
  return <Select {...selectProps} />;
};

export default CustomSelectTestHook;
