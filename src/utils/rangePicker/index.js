import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { DatePicker } from 'antd';
import './style.css';

import moment from 'moment';

const { RangePicker } = DatePicker;

function RangePickerComp(props) {
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [start, setStart] = useState(props.start || '');
  const [end, setEnd] = useState(props.end || '');
  // const [isDisabledDate, setIsDisabledDate] = useState(props.isDisabledDate || false);

  useEffect(() => {
    setStart(props.start);
  }, [props.start]);

  useEffect(() => {
    setEnd(props.end);
  }, [props.end]);

  // useEffect(() => {
  //     setEnd(props.isDisabledDate);
  // }, [props.isDisabledDate]);

  // useEffect(() => {
  //     props.dateFormat && setDateFormat(props.dateFormat);
  // }, [props.dateFormat]);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment(new Date());
  };

  const handleUpdateData = useCallback(
    (start, end) => {
      if (props.func) {
        props.func(start, end);
      }
    },
    [props.start, props.end, props.dateFormat]
  );

  const onChange = (val) => {
    if (val) {
      setStart(new Date(val[0]));
      setEnd(new Date(val[1]));
      handleUpdateData(new Date(val[0]), new Date(val[1]));
    }
  };

  return (
    <>
      <RangePicker
        {...props}
        className="w-full"
        format={dateFormat}
        value={[moment(start), moment(end)]}
        onChange={onChange}
        disabledDate={props.disabledDate}
      />
    </>
  );
}

// export default React.memo(RangePickerComp);
export default RangePickerComp;
