import { Col, DatePicker } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const DisableRangeDate = ({
  setValue,
  value,
  lengthOfRangeToDisable = 30,
  isRequired = true,
  span = 6,
  showError = true,
  title = 'Apply date',
  ...props
}) => {
  const [startDate, setStartDate] = useState(null);
  const [error, setError] = useState(null);
  const handleChangeDate = (e) => {
    if (e) {
      const [start, end] = e;
      const diff = moment(end).startOf('day').diff(moment(start).startOf('day'), 'days');
      if (diff >= lengthOfRangeToDisable) {
        setValue([start, moment(start).add(lengthOfRangeToDisable, 'days')]);
      } else setValue(e);
    } else {
      setValue([null, null]);
    }
  };
  useEffect(() => {
    if (setValue) {
      setValue([moment(), moment()]);
    }
  }, []);
  return (
    <Col span={span} className="">
      <label className={`${isRequired ? 'required' : ''}`}>{title}</label>
      <DatePicker.RangePicker
        format="DD/MM/YYYY"
        allowClear={false}
        className="w-full"
        defaultValue={[moment(), moment()]}
        onChange={handleChangeDate}
        onCalendarChange={(value) => {
          if (!value) return;
          const [start, end] = value;
          setStartDate(start);
        }}
        value={value ? value : null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setStartDate(null);
          }
        }}
        disabledDate={(current) => {
          if (!startDate) return current && current > moment().endOf('day');
          const diff = moment().diff(startDate, 'days');
          return (
            current &&
            current > moment(startDate).add(diff > lengthOfRangeToDisable ? lengthOfRangeToDisable : diff, 'days')
          );
        }}
      />
      {showError ? (
        <p className="m-0" style={{ height: '17px' }}>
          {error}
        </p>
      ) : null}
    </Col>
  );
};

export default DisableRangeDate;
