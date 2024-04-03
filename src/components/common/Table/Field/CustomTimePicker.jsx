import { DatePicker, TimePicker } from "antd";
import { INPUT_SIZE } from "constant";
import moment from "moment";
import React from "react";
const { RangePicker } = DatePicker;
const CustomTimePicker = ({
  value,
  onChange,
  range = true,
  format = "HH:mm",
  ...props
}) => {
  const handleChange = (value, valueString) => {
    // if (!value) {
    //   onChange([null, null], props?.index);
    // }
    onChange(valueString, props?.index);
  };

  return (
    <>
      {range ? (
        <TimePicker.RangePicker
          format={format}
          bordered
          {...props}
          value={
            value?.startTime
              ? [
                  moment(value?.startTime, format),
                  moment(value?.endTime, format),
                ]
              : null
          }
          onChange={handleChange}
        />
      ) : (
        <TimePicker
          bordered
          {...props}
          format={format}
          value={moment(value?.startTime, format)}
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default CustomTimePicker;
