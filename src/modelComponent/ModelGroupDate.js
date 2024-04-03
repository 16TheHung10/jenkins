import { Col, DatePicker, Radio, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment';
import './styleModelGroupDate.scss'
import RangePicker from '../utils/rangePicker';
import { decreaseDate } from 'helpers/FuncHelper';

function ModelGroupDate({ ...props }) {
    const [configDate, setConfigDate] = useState({
        isDate: true,
        isWeek: true,
        isMonth: true,
        isQuarter: false,
        isYear: false,
        isRange: false,
    });

    useEffect(() => {
        if (props?.isMonth !== undefined) {
            setConfigDate(prev => ({ ...prev, isMonth: props?.isMonth }))
        }

        if (props?.isWeek !== undefined) {
            setConfigDate(prev => ({ ...prev, isWeek: props?.isWeek }))
        }

        if (props?.isDate !== undefined) {
            setConfigDate(prev => ({ ...prev, isDate: props?.isDate }))
        }

        if (props?.isRange !== undefined) {
            setConfigDate(prev => ({ ...prev, isRange: props?.isRange }))
        }

    }, [props?.isMonth, props?.isWeek, props?.isDate, props?.isRange]);

    const [dateModel, setDateModel] = useState('date');
    useEffect(() => {
        if (props?.dateModel !== undefined) {
            setDateModel(props?.dateModel)
        }
    }, [props?.dateModel]);

    // const currentDate = (props?.groupDate !== undefined && props?.groupDate) ?
    //     (
    //         props?.isCurrentDate !== undefined && !props?.isCurrentDate ?
    //             props?.groupDate?.subtract(1, 'days')
    //             : props?.groupDate
    //     )
    //     : (
    //         props?.isCurrentDate !== undefined && !props?.isCurrentDate ?
    //             moment().subtract(1, 'days')
    //             : moment()
    //     );

    const handleRadioChange = (e) => {
        const val = e.target.value ?? 'date';

        setDateModel(val);
        if (props?.setDateModel !== undefined) {
            props.setDateModel(val);

            if (val == 'week') {
                props.setGroupDate(selectedWeek);
            }
        }
    };

    // ===========================DATE
    const formatDateValue = (value) => {
        return value ? moment(value).format('DD/MM/YYYY') : null;
    };
    const [selectedDate, setSelectedDate] = useState(props.groupDate ?? moment());
    useEffect(() => {
        setSelectedDate(props.groupDate)
    }, [props.groupDate]);
    const handleDateChange = (date, dateString) => {
        // console.log('Giá trị tháng đã thay đổi:', date, dateString);
        setSelectedDate(date); // Lưu giá trị tháng vào state hoặc làm gì đó với nó

        if (props?.setGroupDate) {
            props.setGroupDate(date);
        }
    };

    const disabledDate = (current) => {
        if (props.minDate) {
            if (props.minDate !== undefined) {
                return current && (props.minDate > current);
            }
            else {
                if (props.isCurrentDate !== undefined && !props.isCurrentDate) {
                    // Nếu isCurrentDate là false, thì vô hiệu hóa tất cả các ngày sau ngày hiện tại
                    return current && (current > moment().endOf('day'));
                } else {
                    // Nếu isCurrentDate là true hoặc undefined, không vô hiệu hóa bất kỳ ngày nào

                    return false;
                }
            }
        }
        else {
            if (props.isCurrentDate !== undefined && !props.isCurrentDate) {
                // Nếu isCurrentDate là false, thì vô hiệu hóa tất cả các ngày sau ngày hiện tại
                return current && (current > moment().endOf('day'));
            } else {
                // Nếu isCurrentDate là true hoặc undefined, không vô hiệu hóa bất kỳ ngày nào
                return false;
            }
        }

    };

    const DatePickers = useCallback(() => {
        const config = {
            width: '100%',
            showToday: false,
        };
        return <DatePicker
            style={config}
            defaultValue={selectedDate}
            format={formatDateValue}
            allowClear={false}
            disabledDate={disabledDate}
            onChange={handleDateChange}
            disabled={props?.disabled}
        />;
    }, [selectedDate, props?.groupDate, props?.disabled, props?.dateModel])
    // ===========================DATE

    // ===========================WEEK
    const formatWeekValue = (value) => {
        return value
        // return value ? value.format('WW/YYYY') : null;
    };
    const [selectedWeek, setSelectedWeek] = useState(props?.groupDate ?? moment());
    const handleWeekChange = (date, dateString) => {
        setSelectedWeek(date); // Lưu giá trị tháng vào state hoặc làm gì đó với nó
        if (props?.setGroupDate) {
            // console.log({ date: date.week(), dateString })
            props.setGroupDate(date);
        }
    }
    const isInRange = (date) => {

        const startDate = date.clone().startOf('week'); // Ngày bắt đầu
        const endDate = selectedWeek.clone().week() === moment().clone().week() ?
            (props.isCurrentDate !== undefined && !props.isCurrentDate ? moment().subtract(1, 'days') : moment()) : moment().clone().endOf('week');   // Ngày kết thúc
        return date.isBetween(startDate, endDate, null, '[]');
    };

    const WeekPicker = useCallback(() => {
        const config = {
            width: '100%',
            showToday: false,
            renderExtraFooter: (mode) => `Week ${mode.week()}`,
        };
        return <DatePicker.WeekPicker
            popupClassName='modelWeekPicker'
            style={config}
            value={selectedWeek}
            // format={formatWeekValue}
            format={(date) => {
                return `Week ${date.week()}`;
            }}
            allowClear={false}
            onChange={handleWeekChange}
            dateRender={(current) => {
                if (isInRange(current)) {
                    return <div className="ant-picker-cell-inner highlight-custom-selected-week">{current.date()}</div>;
                }
                return <div className="ant-picker-cell-inner">{current.date()}</div >;
            }}
        />;
    }, [selectedWeek, props?.groupDate, props?.dateModel])

    // ===========================WEEK

    // ===========================MONTH
    const formatMonthValue = (value) => {
        return value ? moment(value).format('MM/YYYY') : null;
    };
    const [selectedMonth, setSelectedMonth] = useState(props?.groupDate ?? moment());
    const handleMonthChange = (date, dateString) => {
        // console.log('Giá trị tháng đã thay đổi:', date, dateString);
        setSelectedMonth(date); // Lưu giá trị tháng vào state hoặc làm gì đó với nó

        if (props?.setGroupDate) {
            props.setGroupDate(date);
        }
    };

    const MonthPicker = useCallback(() => {
        const config = {
            width: '100%',
            showToday: false,
        };
        return <DatePicker.MonthPicker
            style={config}
            value={selectedMonth}
            format={formatMonthValue}
            allowClear={false}
            onChange={handleMonthChange}
        />;
    }, [selectedMonth, props?.groupDate, props?.dateModel])
    // ===========================MONTH

    // ===========================QUARTER
    const [selectedQuarter, setSelectedQuarter] = useState(props?.groupDate ?? moment());
    const handleQuarterChange = (date, dateString) => {
        setSelectedQuarter(date); // Lưu giá trị tháng vào state hoặc làm gì đó với nó

        if (props?.setGroupDate) {
            props.setGroupDate(date);
        }
    }

    const QuarterPicker = useCallback(() => {
        const config = {
            width: '100%',
        };
        return <DatePicker.QuarterPicker
            style={config}
            defaultValue={selectedQuarter}
            allowClear={false}
            onChange={handleQuarterChange}
        />;
    }, [selectedQuarter, props?.groupDate, props?.dateModel])
    // ===========================QUARTER


    // ===========================YEAR
    const formatYearValue = (value) => {
        return value ? moment(value).format('YYYY') : null;
    };
    const [selectedYear, setSelectedYear] = useState(props?.groupDate ?? moment());
    const handleYearChange = (date, dateString) => {
        setSelectedYear(date); // Lưu giá trị tháng vào state hoặc làm gì đó với nó

        if (props?.setGroupDate) {
            props.setGroupDate(date);
        }
    }
    const YearPicker = useCallback(() => {
        const config = {
            width: '100%',
        };
        return <DatePicker.YearPicker
            style={config}
            defaultValue={selectedYear}
            allowClear={false}
            format={formatYearValue}
            onChange={handleYearChange}
        />;
    }, [selectedYear, props?.groupDate, props?.dateModel])

    // ===========================YEAR

    // ===========================RANGE
    const [dates, setDates] = useState(null);

    const handleUpdateDate = (date) => {
        if (date?.length > 0) {
            setDates([date[0], date[1]]);
            if (props?.setGroupDate) {
                props.setGroupDate([date[0], date[1]]);
            }
        }
    }
    const RangePickerComp = useCallback(() => {

        return <RangePicker
            dates={dates}
            range={14}
            minDate={decreaseDate(62)}
            maxDate={moment()}
            func={handleUpdateDate} />

    }, [dates, props?.groupDate, props?.dateModel])
    // ===========================RANGE

    return (
        <>
            {props.isLabel !== undefined && !props.isLabel ? null : <label htmlFor="date" className="w100pc">

                <Radio.Group onChange={handleRadioChange} value={dateModel}>
                    {configDate.isYear && <Radio value="year">Year</Radio>}
                    {configDate.isQuarter && <Radio value="quarter">Quarter</Radio>}
                    {
                        // configDate.isMonth &&
                        <Radio value="month" disabled={!configDate.isMonth}>Month</Radio>
                    }
                    {
                        // configDate.isWeek &&
                        <Radio value="week" disabled={!configDate.isWeek}>Week</Radio>
                    }
                    {
                        // configDate.isDate &&
                        <Radio value="date" disabled={!configDate.isDate} >Date</Radio>
                    }
                    {configDate.isRange && <Radio value="range">Range 14 days</Radio>}
                </Radio.Group>
            </label>}


            {dateModel === 'year' && <YearPicker />}
            {dateModel === 'quarter' && <QuarterPicker />}
            {dateModel === 'month' && <MonthPicker />}
            {dateModel === 'week' && <WeekPicker />}
            {dateModel === 'date' && <DatePickers />}
            {dateModel === 'range' && <RangePickerComp />}
        </>
    );

}
export default ModelGroupDate;