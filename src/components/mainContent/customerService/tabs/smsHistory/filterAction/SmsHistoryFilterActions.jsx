import { DatePicker, Select } from "antd";
import CONSTANT from "constant";
import moment from "moment";
import React from "react";

const SmsHistoryFilterActions = ({ onChange }) => {
  return (
    <div>
      <DatePicker.RangePicker
        disabledDate={(current) => {
          return (
            current &&
            (current < moment().subtract(7, "days") ||
              current > moment().endOf("day"))
          );
        }}
        onChange={(e) => {
          let value = null;
          if (!e || !e[0] || !e[1]) {
            value = null;
          } else
            value = {
              startDate: moment(e[0]).startOf("day"),
              endDate: moment(e[1]).endOf("day"),
            };
          onChange(value, "date");
        }}
        format={CONSTANT.FORMAT_DATE_IN_USE}
      />
    </div>
  );
};

export default SmsHistoryFilterActions;
