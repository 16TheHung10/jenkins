import { DatePicker, Radio } from 'antd';
import { UrlHelper } from 'helpers';
import { isEqual } from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';

const DisableRangeDate2 = ({
  value,
  lengthOfRangeToDisable = 31,
  isRequired = true,
  span = 6,
  showError = true,
  title = 'Apply date',
  allowSelectFuture = true,
  allowSelectPast = false,
  allowSelectToday = true,
  onChange,
  mode,
  label,
  modeSelect = ['date', 'week', 'month', 'range'],
  quickDisabledRange, // string: month/week: ex: if value = month then user only select value in current month
  ...props
}) => {
  const [startDate, setStartDate] = useState(null);
  const [picker, setPicker] = useState('date');
  const [format, setFormat] = useState('DD/MM/YYYY');
  const [pickerModeCheckbox, setPickerModeCheckbox] = useState('date');
  const [datePickerType, setDatePickerType] = useState('single');

  const handleSetSearchParamsUrl = (params) => {
    UrlHelper.setSearchParamsFromObject({ ...params });
  };

  const handleSetDatePicker = (value) => {
    // handleSetSearchParamsUrl({ picker: value });
    onChange(null);
    setPicker(value);
    switch (value) {
      case 'date':
        setFormat('DD/MM/YYYY');
        break;
      case 'week':
        setFormat('wo');
        break;
      case 'month':
        setFormat('MM/YYYY');
        break;
      case 'quarter':
        setFormat('DD/MM/YYYY');
        break;
      case 'year':
        setFormat('YYYY');
        break;
    }
  };

  const handleChangeDate = (e) => {
    if (e && onChange) {
      const [start, end] = e;
      const diff = moment(end).startOf('day').diff(moment(start).startOf('day'), 'days');
      if (diff >= lengthOfRangeToDisable) {
        onChange([start, moment(start).add(lengthOfRangeToDisable, 'days')]);
      } else onChange(e);
    } else {
      onChange([null, null]);
    }
  };

  const allowSelectAllSide = allowSelectFuture && allowSelectPast;
  const diffFromNow = useMemo(() => {
    return moment().diff(startDate, 'days');
  }, [startDate]);

  const ranges = () => {
    return props.showFullOptions
      ? {
          Today: () => {
            return [moment(), moment()];
          },
          'This Week': () => {
            if (allowSelectPast && !allowSelectFuture) {
              const startOfWeekFromNow = moment().diff(moment().startOf('week'), 'days');
              return [
                moment().startOf('week'),
                startOfWeekFromNow < lengthOfRangeToDisable ? moment().endOf('day') : moment().endOf('week'),
              ];
            }
            return [moment().startOf('week'), moment().endOf('week')];
          },
          'This Month': () => {
            if (allowSelectPast && !allowSelectFuture) {
              const startOfMonthFromNow = moment().diff(moment().startOf('month'), 'days');
              return [
                moment().startOf('month'),
                startOfMonthFromNow < lengthOfRangeToDisable ? moment().endOf('day') : moment().endOf('month'),
              ];
            }
            return [moment().startOf('month'), moment().endOf('month')];
          },
        }
      : {};
  };

  const isGreaterThanToday = (day) => {
    return moment().diff(day, 'days') <= 0;
  };

  const handleChagnePickerType = (value) => {
    switch (value) {
      case 'week':
        setDatePickerType('single');
        break;
      case 'month':
        setDatePickerType('single');
        break;
      case 'range':
        setDatePickerType('range');
        break;
      default:
        setDatePickerType('single');
        break;
    }
  };
  const handleChagneRadio = (value) => {
    handleChagnePickerType(value);
    switch (value) {
      case 'week':
        handleSetDatePicker('week');
        break;
      case 'month':
        handleSetDatePicker('month');
        break;
      case 'range':
        handleSetDatePicker('date');
        break;
      default:
        handleSetDatePicker('date');
        break;
    }
  };

  useEffect(() => {
    // let currentParams = UrlHelper.getSearchParamsObject();
    const pickerValue = modeSelect?.[0] || 'date';
    // setPicker(pickerValue);
    setPickerModeCheckbox(pickerValue);
    // handleSetDatePicker(pickerValue);
    // handleChagnePickerType(pickerValue);
    handleChagneRadio(pickerValue);
  }, [quickDisabledRange]);

  // Format value if user set invalid value to input
  useEffect(() => {
    let valueClone = value ? JSON.parse(JSON.stringify(value)) : null;
    let cloneLengthOfRangeToDisable = lengthOfRangeToDisable;
    valueClone = valueClone?.[0] ? [moment(valueClone?.[0]), moment(valueClone?.[1])] : null;

    if (quickDisabledRange === 'month') {
      cloneLengthOfRangeToDisable =
        moment(valueClone?.[0]).daysInMonth() > cloneLengthOfRangeToDisable
          ? cloneLengthOfRangeToDisable
          : moment(valueClone?.[0]).daysInMonth() - 1;
    }
    if (Array.isArray(valueClone) && datePickerType === 'range') {
      if (moment(value?.[1]).add(1, 'day').diff(moment(value?.[0]), 'days') > cloneLengthOfRangeToDisable) {
        valueClone = [moment(valueClone[0]), moment(valueClone[0]).add(cloneLengthOfRangeToDisable, 'days')];
      }
    }

    onChange(valueClone);
  }, [value, datePickerType, quickDisabledRange]);

  return (
    <div>
      <label htmlFor="" className="w-full">
        <Radio.Group
          className="flex"
          onChange={(e) => {
            setPickerModeCheckbox(e.target.value);
            handleChagneRadio(e.target.value);
          }}
          value={pickerModeCheckbox}
        >
          {modeSelect?.map((item) => {
            return (
              <Radio value={item} key={item}>
                <span style={{ textTransform: 'capitalize' }}>{item}</span>
              </Radio>
            );
          })}
          {/* <Radio value={'date'}>Date</Radio>
          <Radio value={'week'}>Week</Radio>
          <Radio value={'month'}>Month</Radio>
          <Radio value={'range'}>Range</Radio> */}
        </Radio.Group>
      </label>
      {datePickerType === 'range' ? (
        <DatePicker.RangePicker
          key="range"
          allowClear
          picker={picker}
          format="DD/MM/YYYY"
          className="w-full"
          onChange={handleChangeDate}
          onCalendarChange={(value) => {
            if (!value) return;
            const [start, end] = value;
            setStartDate(start);
          }}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setStartDate(null);
            }
          }}
          disabledDate={(current) => {
            if (quickDisabledRange === 'month') {
              return current && current > moment(startDate).endOf('month');
            }
            let dateAdded = 0;
            if (allowSelectAllSide) {
              dateAdded = lengthOfRangeToDisable;
            } else {
              if (allowSelectPast && !allowSelectFuture) {
                if (diffFromNow > lengthOfRangeToDisable) dateAdded = lengthOfRangeToDisable;
                else dateAdded = diffFromNow;
              } else {
                dateAdded = lengthOfRangeToDisable;
              }
            }
            // 2 - 7
            const dateLimit = moment(startDate).add(dateAdded, 'days');

            return (
              current &&
              (allowSelectAllSide
                ? current > dateLimit
                : current > dateLimit ||
                  (allowSelectPast
                    ? current > moment().endOf('day')
                    : allowSelectFuture
                    ? current < moment().endOf('day')
                    : current))
            );
          }}
          {...props}
          ranges={ranges}
          value={Array.isArray(value) ? value : null}
          // renderExtraFooter={renderExtraFooter}
        />
      ) : (
        <DatePicker
          key="single"
          allowClear
          picker={picker}
          format={format === 'wo' ? (value) => `Week ${value.format('wo')}` : format}
          className="w-full"
          disabledDate={(current) => {
            let dateAdded = 0;
            if (allowSelectAllSide) {
              dateAdded = lengthOfRangeToDisable;
            } else {
              if (allowSelectPast && !allowSelectFuture) {
                if (diffFromNow > lengthOfRangeToDisable) dateAdded = lengthOfRangeToDisable;
                else dateAdded = diffFromNow;
              } else {
                dateAdded = lengthOfRangeToDisable;
              }
            }
            // 2 - 7
            return (
              current &&
              (allowSelectAllSide
                ? null
                : allowSelectPast
                ? current > (allowSelectToday ? moment().endOf('day') : moment().subtract(1, 'day').endOf('day'))
                : allowSelectFuture
                ? current < (allowSelectToday ? moment().endOf('day').subtract(1, 'day') : moment().endOf('day'))
                : null)
            );
          }}
          {...props}
          onChange={(value) => {
            let fromDate = null;
            let toDate = null;
            if (value) {
              switch (picker) {
                case 'date':
                  fromDate = moment(value);
                  toDate = moment(value);
                  break;
                case 'week':
                  fromDate = moment(value).startOf('week');
                  toDate =
                    isGreaterThanToday(moment(value).endOf('week')) && !allowSelectFuture
                      ? moment()
                      : moment(value).endOf('week');
                  break;
                case 'month':
                  fromDate = moment(value).startOf('month');
                  toDate =
                    isGreaterThanToday(moment(value).endOf('month')) && !allowSelectFuture
                      ? moment()
                      : moment(value).endOf('month');
                  break;
              }
            }
            console.log([fromDate, toDate]);
            onChange([fromDate, toDate]);
          }}
          value={Array.isArray(value) ? value[0] : value || null}
          // renderExtraFooter={renderExtraFooter}
        />
      )}
    </div>
  );
};

export default React.memo(DisableRangeDate2, (prev, next) => {
  return isEqual(prev.value, next.value);
});
