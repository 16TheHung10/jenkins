import React, { useState, useEffect, useContext } from 'react'
import TableSalesByStore from "components/mainContent/reporting/TableSalesByStore";
import { Col, Row, Space, Tag, message } from 'antd';
import moment from 'moment';
import ModelGroupDate from 'modelComponent/ModelGroupDate';
import ModelGroupStore from 'modelComponent/ModelGroupStore';
import { handleExportAutoField } from "helpers/ExportHelper";
import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';

import { fetchData } from 'helpers/FetchData';


export default function SalesByStore() {

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
    const [dataDetailSbs, setDataDetailSbs] = useState([]);
    const [salesByStoreNote, setSalesByStoreNote] = useState('');
    const [itemReport, setItemReport] = useState({
        totalBill: 0,
        totalItem: 0,
        totalCustomer: 0,
        totalGrossSales: 0,
        vatAmount: 0,
        billDiscount: 0,
        itemDiscount: 0,
        netSales: 0
    });

    const [isSearch, setIsSearch] = useState(false);

    const handleIsLoading = () => {
        setIsSearch(true)
        setDataDetailSbs([]);
        setItemReport({
            totalBill: 0,
            totalItem: 0,
            totalCustomer: 0,
            totalGrossSales: 0,
            vatAmount: 0,
            billDiscount: 0,
            itemDiscount: 0,
            netSales: 0
        })
    }

    const getData = async () => {
        console.log('111111111')
        let start = groupDate;
        let date = groupDate;

        let storeCode = groupStore;
        if (groupStore === '' || groupStore?.length === 0 || groupStore[0] === '') {
            message.error('Please choose store to search')
            return false;
        }

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
            start: start?.format(formatDate) === date?.format(formatDate) ? '' : start?.format(formatDate),
            date: date?.format(formatDate)
        }

        if (groupDate.month() > moment().month() && groupDate.year() > moment().year()) {
            message.warning('There is no data available for this month');
            return false;
        }

        try {
            if (isSearch === true) {
                message.warning({ key: 'search', content: 'Please await' });
                return false;
            }

            handleIsLoading();

            const url = storeCode !== '' ? `/storesale/${storeCode}/summary` : `/sale/store/transaction/summary`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL)
            if (response?.status) {
                let result = response?.data?.sale ?? [];
                setDataDetailSbs(result);

                handleSumSaleByStore(result);
            }
        } catch (error) {
            console.log('Error fetching data: ', error)
        } finally {
            setIsSearch(false);
        }
    }

    const checkStatusAPIsale = async () => {
        let storeCode = groupStore;
        let date = groupDate.format('YYYY-MM-DD');
        let params = { storecode: storeCode, date };
        let queryString = new URLSearchParams(params);

        try {
            const url = `/storestatus/sale?${queryString}`;
            const response = await fetchData(url, 'GET', null, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status && response?.data?.storeStatus) {
                if (response?.data?.note) {
                    salesByStoreNote(response.data.note);
                }
            }
        } catch (error) {
            console.log('Error fetching data: ', error);
        }
    }

    const handleSearchSalesbystore = async () => {
        getData();
        checkStatusAPIsale();
    }

    const handleSumSaleByStore = (result) => {
        let totalBill = result?.reduce((acc, cur) => {
            return acc + (cur.billCount ?? 0);
        }, 0);
        let totalItem = result?.reduce((acc, cur) => {
            return acc + (cur.qty ?? 0);
        }, 0);
        let totalCustomer = result?.reduce((acc, cur) => {
            return acc + (cur.customerCount ?? 0);
        }, 0);
        let totalGrossSales = result?.reduce((acc, cur) => {
            return acc + (cur.grossSales ?? 0);
        }, 0);
        let vatAmount = result?.reduce((acc, cur) => {
            return acc + (cur.vatAmount ?? 0);
        }, 0);
        let billDiscount = result?.reduce((acc, cur) => {
            return acc + (cur.billDiscount ?? 0);
        }, 0);
        let itemDiscount = result?.reduce((acc, cur) => {
            return acc + (cur.itemDiscount ?? 0);
        }, 0);
        let netSales = result?.reduce((acc, cur) => {
            return acc + (cur.netSales ?? 0);
        }, 0);

        setItemReport(prev => ({ ...prev, totalBill, totalItem, totalCustomer, totalGrossSales, vatAmount, billDiscount, itemDiscount, netSales }))
    }

    return (
        <>
            <Row gutter={16}>
                <Col xl={24}>
                    <div className='section-block'>
                        <Row gutter={16}>
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
                                <ModelGroupDate
                                    groupDate={groupDate}
                                    setGroupDate={setGroupDate}
                                    dateModel={dateModel}
                                    setDateModel={setDateModel}
                                    isCurrentDate={false}
                                // isLabel={false}
                                />
                            </Col>

                        </Row>
                        <Row gutter={16} className='mrt-10'>
                            <Col xl={8}>
                                <Space size={'small'}>
                                    <Tag className="h-30 icon-search" onClick={handleSearchSalesbystore}>
                                        <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                                    </Tag>
                                    <Tag
                                        icon={<FileExcelOutlined />}
                                        className="h-30 icon-excel"
                                        onClick={() => handleExportAutoField(dataDetailSbs, "salebystore")}
                                    >
                                        <span className="icon-excel-detail">Export</span>
                                    </Tag>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row gutter={16} className='mrt-10'>
                <Col xl={24}>
                    {
                        salesByStoreNote !== "" ?
                            <div className="bg-note cl-red">Dữ liệu chưa cập nhật đầy đủ, vui lòng khởi động lại phần mềm bán hàng để cập nhật dữ liệu sale. Sau 30 phút sẽ được cập nhật hoặc liên hệ bộ phận IT để hỗ trợ</div>
                            :
                            <TableSalesByStore data={dataDetailSbs} itemReport={itemReport} />
                    }
                </Col>
            </Row>
        </>
    )
}
