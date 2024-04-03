import React, { useState, useContext, useEffect, Fragment } from 'react'
import TableSalesByCategory from "components/mainContent/reporting/TableSalesByCategory";
import { Col, Row, Space, Tag, message } from 'antd';
import ModelGroupDate from 'modelComponent/ModelGroupDate';
import ModelGroupStore from 'modelComponent/ModelGroupStore';

import { fetchData } from 'helpers/FetchData';
import { createDataTable } from 'helpers/FuncHelper';
import moment from 'moment';
import { FileExcelOutlined, FileSearchOutlined, FilterOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { handleExportAutoField } from "helpers/ExportHelper";
import StringHelper from "helpers/StringHelper";
import { fetchReport } from 'helpers/FetchData';
import ModelTable from 'modelComponent/modelTable/ModelTable'

export default function SalesByTime() {

    const [storeOpt, setStoreOpt] = useState([]);

    useEffect(() => {
        if (groupStore === '') {
            if (storeOpt?.length > 0) {
                let foundObject = null;

                for (let i = 0; i < storeOpt.length; i++) {
                    const item = storeOpt[i];
                    if (item.value.startsWith("VN")) {
                        foundObject = item;
                        break;
                    }
                }

                if (foundObject) {
                    setGroupStore(foundObject.value);
                }
            }
        }

    }, [storeOpt]);

    const [groupStore, setGroupStore] = useState('');

    const [dateModel, setDateModel] = useState('date');
    const [groupDate, setGroupDate] = useState(moment().subtract(1, 'days'));

    const [result, setResult] = useState({});
    const [isFilter, setIsFilter] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleIsShowFilter = () => {
        setIsFilter(!isFilter)
    }

    const handleIsLoading = () => {
        setIsLoading(true);
        setIsSearch(true);
        setResult([]);
    }

    const handleSearch = async () => {
        // message.info({ key: 'search', content: 'Tính năng đang được bảo trì vui lòng quay lại sau.' })
        // return false;

        let storeCode = groupStore;

        if (groupDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            message.warning({ key: 'search', content: 'Vui lòng không chọn ngày hiện tại.' });
            return false;
        }

        let start = groupDate;
        let date = groupDate;

        if (dateModel === 'week') {
            start = groupDate.clone().startOf('week');
            date = (groupDate.week() == moment().week() && groupDate.year() >= moment().year()) ? moment().subtract(1, 'days') : groupDate.clone().endOf('week');
        } else if (dateModel === 'month') {
            start = groupDate.clone().startOf('month');
            date = (groupDate.month() == moment().month() && groupDate.year() >= moment().year()) ? moment().subtract(1, 'days') : groupDate.clone().endOf('month');
        }
        else {
            start = groupDate;
            date = groupDate;
        }

        const formatDate = 'YYYY-MM-DD';

        let params = {
            // start: start?.format(formatDate) === date?.format(formatDate) ? '' : start?.format(formatDate),
            date: date?.format(formatDate)
        }

        try {
            if (isSearch === true) {
                message.warning({ key: 'search', content: 'Please await' });
                return false;
            }

            handleIsLoading();

            const url = `/storesale/${storeCode}/salepaymentshift`;

            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                let result = response?.data?.sale ?? [];

                const objData = result?.reduce((acc, item) => {
                    const { employeeCode, startHour, endHour, counterCode, billStartDate, billEndDate, billDiscount, employeeName, shiftID, billCount, customerCount, qty, grossSales, netSales, amount, paymentMethodCode, paymentMethodName } = item;
                    if (!acc[`${startHour}-${endHour}`]) {
                        acc[`${startHour}-${endHour}`] = {};
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode]) {
                        acc[`${startHour}-${endHour}`][employeeCode] = { ...item };
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].couter) {
                        acc[`${startHour}-${endHour}`][employeeCode].couter = {};
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].couter[counterCode]) {
                        acc[`${startHour}-${endHour}`][employeeCode].couter[counterCode] = {};
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].couter[counterCode].billStartDate) {
                        acc[`${startHour}-${endHour}`][employeeCode].couter[counterCode].billStartDate = billStartDate;
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].couter[counterCode].billEndDate) {
                        acc[`${startHour}-${endHour}`][employeeCode].couter[counterCode].billEndDate = billEndDate;
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].payment) {
                        acc[`${startHour}-${endHour}`][employeeCode].payment = {};
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode]) {
                        acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode] = {};
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode].paymentMethodName) {
                        acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode].paymentMethodName = {};
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode].paymentMethodName.name) {
                        acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode].paymentMethodName.name = paymentMethodName;
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode].paymentMethodName.amount) {
                        acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode].paymentMethodName.amount = 0;
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].ttBillCount) {
                        acc[`${startHour}-${endHour}`][employeeCode].ttBillCount = 0;
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].ttAmount) {
                        acc[`${startHour}-${endHour}`][employeeCode].ttAmount = 0;
                    }
                    if (!acc[`${startHour}-${endHour}`][employeeCode].ttCustomerCount) {
                        acc[`${startHour}-${endHour}`][employeeCode].ttCustomerCount = 0;
                    }

                    acc[`${startHour}-${endHour}`][employeeCode].ttBillCount += billCount;
                    acc[`${startHour}-${endHour}`][employeeCode].ttAmount += amount;
                    acc[`${startHour}-${endHour}`][employeeCode].ttCustomerCount += customerCount;
                    // acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode].amount += item.amount;
                    acc[`${startHour}-${endHour}`][employeeCode].payment[paymentMethodCode].paymentMethodName.amount += amount;
                    return acc;
                }, {})
                // console.log(objData)
                setResult(objData);
            }
            else {
                message.error(response?.message);
            }
        } catch (error) {
            console.log('Error fetching data: ', error)
        } finally {
            setIsLoading(false);
            setIsSearch(false);
        }
    }

    const handleExport = () => {
        // () => handleExportAutoField(result, "salebyTime")
    }

    const renderCouter = (val, item) => {
        const { couter } = item;
        return <>{Object.keys(couter)?.map((el, index) => {
            return <div key={index} style={{ padding: 2 }}>
                <Tag color='success'>{el}</Tag>
            </div>
        })}</>;
    }
    const renderTimeBill = (val, item) => {
        const { couter } = item;
        return <>{Object.keys(couter)?.map((el, index) => {
            return <div key={index} style={{ padding: 2 }}>
                <Tag color='orange'>{moment(couter[el].billStartDate).format('HH:mm')} - {moment(couter[el].billEndDate).format('HH:mm')}</Tag>
            </div>
        })}</>;
    }

    const renderMember = (key, obj, groupMethod) => {

        const entries = Object.entries(groupMethod);
        const sortedEntries = entries.sort((a, b) => a[0].localeCompare(b[0]));
        const sortedObjectMethod = Object.fromEntries(sortedEntries);

        let sumFooter = { ttBillCount: 0, ttAmount: 0 };

        let columns = [
            { field: 'shift', label: `Shift: ${key} (hours)`, formatBody: (val, item) => item.employeeName, styleHead: { width: '30%' } },
            { field: 'couter', label: 'Couter', formatBody: renderCouter },
            { field: 'time', label: () => (<>Open bill - Closed bill <ClockCircleOutlined style={{ fontSize: 16 }} /></>), formatBody: renderTimeBill },
            { field: 'ttBillCount', label: `TT.Bill count`, styleHead: { textAlign: 'right' }, styleBody: { textAlign: 'right' }, formatBody: val => StringHelper.formatValue(val) },
            { field: 'ttAmount', label: `TT.Amount`, styleHead: { textAlign: 'right' }, styleBody: { textAlign: 'right' }, formatBody: val => StringHelper.formatValue(val) },
            { field: 'employeeName', label: ``, notShow: true },
        ];

        Object.keys(sortedObjectMethod).forEach(key => {
            const method = groupMethod[key];
            let obj = { field: method.value, label: method.label, styleHead: { textAlign: 'right' }, styleBody: { textAlign: 'right' }, formatBody: val => StringHelper.formatValue(val) };
            columns.push(obj);
        });

        let list = Object.values(obj);

        for (let item of list) {
            Object.keys(sortedObjectMethod).forEach(key => {
                const method = groupMethod[key];
                item[method.value] = 0;
            });
        }

        for (let item of list) {

            for (let method in item.payment) {
                item[method] = item.payment[method]?.paymentMethodName?.amount;
                sumFooter[method] = 0;
            }
        }


        const finalData = createDataTable(list, columns) ?? [];

        return <div style={{
            boxShadow: 'rgba(0, 124, 255, 0.16) 0px 3px 6px, rgba(0, 124, 255, 0.23) 0px 3px 6px',
            padding: '0 10px 10px',
            height: '100%',
        }}>

            <ModelTable
                data={finalData}
                columns={columns}
                isLoading={isLoading}
                showPage={false}
                footer={sumFooter}
                style={{ width: '100%' }}
                styleFooter={{ background: 'rgba(0, 85, 205,.5)' }}
            />
        </div>
    }

    const renderDetail = () => {
        const dataArray = Object.entries(result);
        dataArray.sort((a, b) => {
            const keyA = a[0].split('-')[0];
            const keyB = b[0].split('-')[0];
            return parseInt(keyA) - parseInt(keyB);
        });
        const sortedData = Object.fromEntries(dataArray);
        let groupMethod = {};
        const aaa = Object.keys(sortedData)?.map(key => {
            const item = sortedData[key];

            const bbb = Object.keys(item)?.map(keyItem => {
                const el = item[keyItem];

                const ccc = Object.keys(el.payment)?.map(keyPayment => {
                    const payment = el.payment[keyPayment];
                    if (!groupMethod[keyPayment]) {
                        groupMethod[keyPayment] = {};
                        groupMethod[keyPayment].value = keyPayment;
                        groupMethod[keyPayment].label = payment.paymentMethodName.name;
                    }
                })
            })

        })

        return <>
            <Row gutter={[16, 16]} className="mrt-10 mrb-10" >
                {
                    Object.keys(sortedData)?.map((key, index) => (
                        <Col key={index} xl={24}>
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {renderMember(key, sortedData[key], groupMethod)}
                            </div>
                        </Col>
                    ))
                }
            </Row>
        </>
    }

    const renderReport = () => {
        let dataReport = { ...result };
        let report = {};
        for (let key in dataReport) {
            let obj = dataReport[key];
            if (!report[key]) {
                report[key] = {};
                report[key].showAmount = 0;
            }

            for (let key2 in obj) {
                let obj2 = obj[key2];

                for (let key3 in obj2.payment) {
                    let obj3 = obj2.payment[key3];
                    report[key].showAmount += obj3.paymentMethodName.amount;
                }
            }
        }
        const dataArray = Object.entries(dataReport);

        dataArray.sort((a, b) => {
            const keyA = a[0].split('-')[0];
            const keyB = b[0].split('-')[0];
            return parseInt(keyA) - parseInt(keyB);
        });
        const sortedData = Object.fromEntries(dataArray);

        // console.log({ dataReport, report, sortedData })

        return <Row gutter={[16, 8]} >
            {
                Object.keys(sortedData)?.map((key, index) => (
                    <Col key={index} xl={12}>
                        <Row gutter={[16, 8]}>
                            <Col xl={12} className='text-right'>{key} (hours):</Col>
                            <Col xl={12}><b>{StringHelper.formatValue(report[key].showAmount)}</b></Col>
                        </Row>
                    </Col>
                ))
            }
        </Row>;

    }

    return (
        <>
            <Row gutter={16} >
                <Col xl={24}>
                    <div className='section-block'>
                        <Row gutter={16} >
                            <Col xl={6}>
                                <ModelGroupStore
                                    groupStore={groupStore}
                                    setGroupStore={setGroupStore}
                                    allowClear={false}
                                    setStoreOpt={setStoreOpt}
                                // mode='multiple'
                                // maxChoose={5}
                                />
                            </Col>
                            <Col xl={6}>
                                {/* <label className="w100pc">Date: </label> */}
                                <ModelGroupDate
                                    groupDate={groupDate}
                                    setGroupDate={setGroupDate}
                                    dateModel={dateModel}
                                    setDateModel={setDateModel}
                                    isCurrentDate={false}
                                    // isLabel={false}
                                    isMonth={false}
                                    isWeek={false}
                                />
                            </Col>
                            <Col xl={12}>
                                {renderReport()}
                            </Col>
                        </Row>
                        <Row gutter={16} className='mrt-10'>
                            <Col xl={6}>
                                <Space size={'small'}>
                                    <Tag className="h-30 icon-search" onClick={handleSearch}>
                                        <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                                    </Tag>
                                    {/* <Tag
                                        icon={<FileExcelOutlined />}
                                        className="h-30 icon-excel"
                                        onClick={handleExport}
                                    >
                                        <span className="icon-excel-detail">Export</span>
                                    </Tag> */}
                                    {/* <Tag
                                        onClick={handleIsShowFilter}
                                        className="h-30 icon-orange"
                                    >
                                        <FilterOutlined />
                                    </Tag> */}

                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>

            {renderDetail()}
        </>
    )
}
