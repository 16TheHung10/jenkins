import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { DatePicker } from 'antd';
import './style.css';

import moment from 'moment';
import { increaseDate } from 'helpers/FuncHelper';

const { RangePicker } = DatePicker;

function RangePickerCompV2({ ...props }) {
  const [dateFormat, setDateFormat] = useState(props.dateFormat || 'DD/MM/YYYY');

  const [minDate, setMinDate] = useState(props.minDate || '');
  const [maxDate, setMaxDate] = useState(props.maxDate || '');
  const [range, setRange] = useState(props.range || null);
  const [isAllowClear, setIsAllowClear] = useState(props.isAllowClear || true);

  const [dates, setDates] = useState(null);
  const [value, setValue] = useState(null);

  useEffect(() => {
    setDates(props.dates);
  }, [props.dates]);

  useEffect(() => {
    setMinDate(props.minDate);
  }, [props.minDate]);

  useEffect(() => {
    setMaxDate(props.maxDate);
  }, [props.maxDate]);

  useEffect(() => {
    setRange(props.range);
  }, [props.range]);

  useEffect(() => {
    setIsAllowClear(props.isAllowClear);
  }, [props.isAllowClear]);

  const onChange = (val) => {
    setValue(val);

    props.func(val);
    if (props.funcCallback) {
      props.funcCallback(val);
    }
  };

  const onOpenChange = (open) => {
    // if (open) {
    //     setDates([null, null]);
    // } else {
    //     setDates(null);
    // }
  };

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }

    let tooLate = dates[0] && current.diff(dates[0], 'days') > range;
    let tooEarly = dates[1] && dates[1].diff(current, 'days') > range;

    let startCheck = true;
    let endCheck = true;

    if (minDate) {
      startCheck = current && current < moment(minDate);
    }

    if (maxDate) {
      endCheck = current && current > moment(maxDate);
    }

    return !!tooEarly || !!tooLate || startCheck || endCheck;
  };

  return (
    <>
      <RangePicker
        format={dateFormat}
        value={dates || value}
        onChange={onChange}
        disabledDate={disabledDate}
        onCalendarChange={(val) => setDates(val)}
        onOpenChange={onOpenChange}
        style={{ width: '100%' }}
        allowClear={isAllowClear}
        picker={props.picker}
      />
    </>
  );
}

export default React.memo(RangePickerCompV2);
