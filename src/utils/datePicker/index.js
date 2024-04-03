import React, { useMemo, useState, useEffect, useCallback } from "react";
import { DatePicker } from "antd";
// import './style.css';

import moment from "moment";

const { RangePicker } = DatePicker;

function DatePickerComp(props) {
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  const [date, setDate] = useState(props.date || "");
  const [keyField, setKeyField] = useState(props.keyField || "");
  const [isDisabled, setIsDisabled] = useState(props.isDisabled || false);

  // useEffect(() => {
  //     props.keyField && setKeyField(props.keyField);
  // }, [props.keyField]);

  // useEffect(() => {
  //     props.dateFormat && setDateFormat(props.dateFormat);
  // }, [props.dateFormat]);

  const handleUpdateData = useCallback(
    (date, keyField) => {
      if (props.func) {
        props.func(date, keyField);
      }
    },
    [date, dateFormat, keyField],
  );

  const onChange = (val) => {
    setDate(new Date(val));
    handleUpdateData(new Date(val), keyField);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <DatePicker
          format={dateFormat}
          defaultValue={moment(date)}
          onChange={onChange}
          style={{ width: "100%" }}
          disabled={isDisabled}
        />
      </>
    );
  }, [date, isDisabled, dateFormat]);

  return bodyContent;
}

export default React.memo(DatePickerComp);
