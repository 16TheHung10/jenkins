import { DatePicker } from "antd";
import { INPUT_SIZE } from "constant";
import moment from "moment";
import React from "react";
const { RangePicker } = DatePicker;
const CustomDatePicker = ({ value, onChange, range = true, ...props }) => {
  const disabledDateSingle = (current) => {
    // Can not select days before today and today
    return current && current > moment().subtract(1, "days").endOf("day");
  };

  const handleChange = (value, valueString) => {
    // onChange([moment(value[0]).format("YYYY-DD-MM"), moment(value[1]).format("YYYY-DD-MM")]);
    onChange(value);
  };
  return (
    <>
      {range ? (
        <RangePicker
          {...props}
          size={INPUT_SIZE}
          disabledDate={props?.disabledDate || disabledDateSingle}
          value={value}
          format={props?.format || "DD/MM/YYYY"}
          onChange={handleChange}
          className="w-full"
        />
      ) : (
        <DatePicker
          size={INPUT_SIZE}
          {...props}
          disabledDate={props?.disabledDate || disabledDateSingle}
          value={value}
          className="w-full"
          format={props?.format || "DD/MM/YYYY"}
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default CustomDatePicker;
