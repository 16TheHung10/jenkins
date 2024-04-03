import { Col, Modal, Row, Space, Tabs, Tag, message } from 'antd'
import React, { useState, useContext, useEffect } from 'react'
import StringHelper from 'helpers/StringHelper';
import { fetchData } from 'helpers/FetchData';
import { handleExportAutoField } from "helpers/ExportHelper";
import { cloneDeep, createDataTable } from 'helpers/FuncHelper';
import DateHelper from 'helpers/DateHelper';
import moment from "moment";

import { DataContext } from "context/DataContext";
import TableSumPayment from '../TableSumPayment';
import ModelGroupStore from 'modelComponent/ModelGroupStore';
import ModelGroupDate from 'modelComponent/ModelGroupDate';
import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';
import TableCustom from "utils/tableCustom";

import ModelConfirmPayment from "components/mainContent/reporting/popupComp/modalConfirmPayment";
import BarChartSales from 'components/mainContent/dashBoard/barChartSales';
import BarchartCustomer from "components/mainContent/dashBoard/barChartCustomer";
import AreaChart from "components/mainContent/dashBoard/dashBoardComp/areaChartComp"
import TopDeliveryMonthGrab from 'components/mainContent/dashBoard/chart/TopDeliveryMonthGrab';
import TopDeliveryMonthShopee from "components/mainContent/dashBoard/chart/TopDeliveryMonthShopee";
import BestSalesMonth from "components/mainContent/dashBoard/chart/BestSalesMonth";
import BestItemSalesMonth from "components/mainContent/dashBoard/chart/BestItemSalesMonth";
import DownloadModel from "models/DownloadModel";

export default function Yesterday() {
    const { data } = useContext(DataContext);
    const { stores } = data;
    const [storeOpt, setStoreOpt] = useState([]);
    const [groupStore, setGroupStore] = useState('');
    const [storeStatusSales, setStoreStatusSales] = useState(1);

    useEffect(() => {
        if (groupStore !== '') {
            handleCheckStatus();
            handleGetSummary();
            handleGetPaymentMethod();
            handleGetReportTopDelivery();
            handleGetReportChartBestSalesInMonth();
            handleGetReportChartTopItemsSale();
        }
    }, [groupStore])

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

    const [note, setNote] = useState('');
    const [summary, setSummary] = useState({});
    const [lastSaleDay, setLastSaleDay] = useState({});
    const [lastSaleDay3Days, setLastSaleDay3Days] = useState({});
    const [lastSaleDay7Days, setLastSaleDay7Days] = useState({});
    const [lastSaleDay14Days, setLastSaleDay14Days] = useState({});

    const styleSummary = { color: 'orange', marginBottom: 0 };
    const styleSectionBlock = { boxShadow: 'rgba(0, 124, 255,0.16) 0px 3px 6px, rgba(0, 124, 255,0.23) 0px 3px 6px' };

    const [paymentMethod, setPaymentMethod] = useState([]);
    const [objPaymentMethod, setObjPaymentMethod] = useState({});
    const [titleMethod, setTitleMethod] = useState({});
    const [totalMethod, setTotalMethod] = useState({});
    const [totalQty, setTotalQty] = useState(0);

    const [groupDate, setGroupDate] = useState(moment().subtract(1, 'days'));
    const [dateModel, setDateModel] = useState('date');

    const formatDateSummary = 'YYYY-MM-DD';
    const yesterdayKey = moment().subtract(1, 'days').format('YYYYMMDD');

    const handleCheckStatus = async () => {
        let storeCode = groupStore;
        let date = moment().subtract(1, 'days').format(formatDateSummary);
        let params = {
            storecode: storeCode,
            date
        }
        let elUpdating = document.getElementById("content-updating");
        setNote('');
        try {
            const url = `/storestatus/sale`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                let { note } = response?.data;
                if (response?.data.storeStatus) {
                    elUpdating && elUpdating.classList.add('d-none');
                }
                else {
                    elUpdating && elUpdating.classList.remove('d-none');
                }

                if (note !== '') {
                    // if (response?.data.storeStatus == 0) {
                    setNote(note);
                    let mask = document.querySelectorAll(".mask-content-error");
                    mask.forEach(el => {
                        // el.innerHTML = "Trên tất cả các POS vào Support => Đồng bộ Hóa đơn cửa hàng." + "<br/>" + "Nếu sau 30p vẫn chưa hiển thị doanh thu.Bạn vui lòng quay lại sau 15h";
                        el.innerHTML = note;
                    })
                }
            }
            else {
                elUpdating && elUpdating.classList.remove('d-none');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleGetSummary = async () => {

        let params = {
            date: moment().subtract(1, 'days').format(formatDateSummary),
            start: moment().subtract(22, 'days').format(formatDateSummary),
        }

        // console.log({ params });

        try {
            const url = groupStore !== '' ? `/storesale/${groupStore}/summary` : `/sale/store/summary`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);

            if (response?.status) {
                let result = response?.data?.sale?.sort((a, b) => b.dateKey - a.dateKey);

                let summary = {};
                let dateStepChartdays = 1;
                let max = 28;
                let lastSaleDay = {};
                let lastSaleDay3Days = {};
                let lastSaleDay7Days = {};
                let lastSaleDay14Days = {};

                while (max > 0) {
                    let dateCaldays = moment().subtract(dateStepChartdays, 'days');
                    let dateKeydays = dateCaldays.format('YYYYMMDD');
                    lastSaleDay[dateKeydays] = { totalSale: 0, date: dateCaldays.format('YYYY/MM/DD'), customer: 0, billCount: 0 };

                    dateStepChartdays += 1;
                    max--;
                };

                for (let i = 0; i < result.length; i++) {
                    let item = result[i];

                    if (!summary[item.dateKey]) {
                        summary[item.dateKey] = item;
                    }

                    if (i < 14) {
                        if (lastSaleDay[item.dateKey] !== undefined) {
                            lastSaleDay[item.dateKey].totalSale = item.grossSales;
                            lastSaleDay[item.dateKey].customer = item.customerCount;
                            lastSaleDay[item.dateKey].billCount = item.billCount;

                            if (i < 3) {
                                if (!lastSaleDay3Days[item.dateKey]) {
                                    lastSaleDay3Days[item.dateKey] = {};
                                }
                                lastSaleDay3Days[item.dateKey].totalSale = item.grossSales;
                                lastSaleDay3Days[item.dateKey].customer = item.customerCount;
                                lastSaleDay3Days[item.dateKey].billCount = item.billCount;
                                lastSaleDay3Days[item.dateKey].date = lastSaleDay[item.dateKey].date;
                            }

                            if (i < 7) {
                                if (!lastSaleDay7Days[item.dateKey]) {
                                    lastSaleDay7Days[item.dateKey] = {};
                                }
                                lastSaleDay7Days[item.dateKey].totalSale = item.grossSales;
                                lastSaleDay7Days[item.dateKey].customer = item.customerCount;
                                lastSaleDay7Days[item.dateKey].billCount = item.billCount;
                                lastSaleDay7Days[item.dateKey].date = lastSaleDay[item.dateKey].date;
                            }

                            if (!lastSaleDay14Days[item.dateKey]) {
                                lastSaleDay14Days[item.dateKey] = {};
                            }
                            lastSaleDay14Days[item.dateKey].totalSale = item.grossSales;
                            lastSaleDay14Days[item.dateKey].customer = item.customerCount;
                            lastSaleDay14Days[item.dateKey].billCount = item.billCount;
                            lastSaleDay14Days[item.dateKey].date = lastSaleDay[item.dateKey].date;
                        }
                    }
                }

                setSummary(summary);
                setLastSaleDay(lastSaleDay)
                setLastSaleDay3Days(lastSaleDay3Days)
                setLastSaleDay7Days(lastSaleDay7Days)
                setLastSaleDay14Days(lastSaleDay14Days)
            }
            else {
                message.error(response?.message);
            }

        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally { }
    }

    const resetMethod = () => {
        setObjPaymentMethod({});
        setTotalMethod({});
        setTitleMethod({});
        setTotalQty(0);
    }

    const handleGetPaymentMethod = async () => {
        let storeCode = groupStore;

        let params = {
            date: moment().subtract(1, 'days').format(formatDateSummary)
        }

        try {
            resetMethod();

            const url = storeCode !== '' ? `/storesale/${storeCode}/paymentMethod` : `/sale/store/paymentMethod`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                const result = response?.data?.sale ?? [];
                setPaymentMethod(result);
                // console.log(result)
                let title = {};
                let total = {};
                let totalQty = 0;
                let objPaymentMethod = {};

                for (const item of result) {
                    if (!objPaymentMethod[item.paymentMethodCode]) {
                        objPaymentMethod[item.paymentMethodCode] = {};
                    }

                    if (!objPaymentMethod[item.paymentMethodCode].paymentName) {
                        objPaymentMethod[item.paymentMethodCode].paymentName = item.paymentMethodName;
                    }

                    if (!objPaymentMethod[item.paymentMethodCode][item.storeCode]) {
                        objPaymentMethod[item.paymentMethodCode][item.storeCode] = 0;
                    }

                    if (!objPaymentMethod[item.paymentMethodCode][item.counterCode]) {
                        objPaymentMethod[item.paymentMethodCode][item.counterCode] = 0;
                    }

                    objPaymentMethod[item.paymentMethodCode][item.counterCode] += item.amount;

                    if (!objPaymentMethod[item.paymentMethodCode].countBill) {
                        objPaymentMethod[item.paymentMethodCode].countBill = 0;
                    }

                    objPaymentMethod[item.paymentMethodCode].countBill += item.billCount;

                    objPaymentMethod[item.paymentMethodCode][item.storeCode] += objPaymentMethod[item.paymentMethodCode][item.counterCode];

                    if (!title[item.storeCode]) { title[item.storeCode] = item.storeCode }
                    if (!title[item.counterCode]) { title[item.counterCode] = item.counterCode }

                    if (!total[item.storeCode]) {
                        total[item.storeCode] = 0;
                    }
                    total[item.storeCode] += objPaymentMethod[item.paymentMethodCode][item.counterCode];

                    if (!total[item.counterCode]) {
                        total[item.counterCode] = 0;
                    }
                    total[item.counterCode] += objPaymentMethod[item.paymentMethodCode][item.counterCode];
                }

                for (let key in objPaymentMethod) {
                    totalQty += objPaymentMethod[key].countBill;
                }

                setTotalMethod(total);
                setTitleMethod(title);
                setTotalQty(totalQty);
                setObjPaymentMethod(objPaymentMethod);
            }
            else {

            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally { }
    }

    const renderSumSales = () => {
        return <>
            {/* {note !== '' ? <Row gutter={[16, 16]}><Col xl={24}><div className="bg-note cl-red">{note}</div> </Col></Row> : null} */}

            <Row gutter={[16, 16]}>
                <Col xl={8}>
                    <Row gutter={16}>
                        <Col xl={24}>
                            <ModelGroupStore
                                groupStore={groupStore}
                                setGroupStore={setGroupStore}
                                allowClear={false}
                                setStoreOpt={setStoreOpt}
                            // mode='multiple'
                            // maxChoose={5}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col xl={16}>
                    <Row gutter={[16, 16]} className="pos-relative mrt-10 mrb-10">
                        <Col xl={6}>
                            <div className="section-block text-center" style={styleSectionBlock}>
                                <h5>Yesterday Sales</h5>
                                <h4 style={styleSummary}>
                                    {
                                        (Object.keys(summary)?.length > 0 && summary[yesterdayKey] && summary[yesterdayKey].grossSales)
                                            ? StringHelper.formatValue(summary[yesterdayKey].grossSales)
                                            : 0
                                    }
                                </h4>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <div className="section-block text-center" style={styleSectionBlock}>
                                <h5>Total Member/Bill</h5>
                                <h4 style={styleSummary}>
                                    {
                                        (Object.keys(summary).length > 0 && summary[yesterdayKey] && summary[yesterdayKey].customerCount)
                                            ? StringHelper.formatValue(summary[yesterdayKey].customerCount)
                                            : 0
                                    }
                                    /
                                    {
                                        (Object.keys(summary).length > 0 && summary[yesterdayKey] && summary[yesterdayKey].billCount)
                                            ? StringHelper.formatValue(summary[yesterdayKey].billCount)
                                            : 0
                                    }
                                </h4>
                            </div>
                        </Col>
                        <Col xl={6} >
                            <div className="section-block text-center" style={styleSectionBlock}>

                                <h5>Basket Avg.value</h5>
                                <h4 style={styleSummary}>
                                    {
                                        (Object.keys(summary).length > 0 && summary[yesterdayKey] && summary[yesterdayKey].grossSales && summary[yesterdayKey].billCount)
                                            ? StringHelper.formatQtyControl(summary[yesterdayKey].grossSales / summary[yesterdayKey].billCount)
                                            : 0
                                    }
                                </h4>
                            </div>
                        </Col>
                        <Col xl={6} >
                            <div className="section-block text-center" style={styleSectionBlock}>

                                <h5>Basket Avg.qty</h5>
                                <h4 style={styleSummary}>
                                    {
                                        (Object.keys(summary).length > 0 && summary[yesterdayKey] && summary[yesterdayKey].qty && summary[yesterdayKey].billCount)
                                            ? StringHelper.formatQtyControl(summary[yesterdayKey].qty / summary[yesterdayKey].billCount)
                                            : 0
                                    }
                                </h4>
                            </div>
                        </Col>
                        <div className={"mask-content " + (note !== '' ? "show" : 'hide')}>
                            <div className="mask-content-error text-center"></div>
                        </div>
                    </Row>
                </Col>
            </Row>
        </>
    }

    const [arrCico, setArrCico] = useState([]);
    const [sumCico, setSumCico] = useState({
        totalAmount: 0,
        totalCashIn: 0,
        totalCastOut: 0,
    });
    const [sumCicoYesterday, setSumCicoYesterday] = useState({
        totalAmount: 0,
        totalCashIn: 0,
        totalCastOut: 0,
        totalCashInPayoo: 0,
        totalAmountPayoo: 0
    });

    const getDataMomo = async () => {
        let params = {
            storeCode: groupStore,
            date: groupDate.format('YYYY/MM/DD') ?? "",
        }

        try {
            const url = `/paymenttransaction/cico`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL)
            if (response?.status) {
                let result = response?.data?.data ?? [];
                setArrCico(result);

                // if (groupDate.format(formatDateSummary) === moment().format(formatDateSummary)) {}

                for (const item of result) {
                    if (item.type === "Momo_cashin") {
                        let totalCashIn = sumCico?.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.amount;
                        }, 0);
                        setSumCico({ ...sumCico, totalCashIn })
                    };

                    if (item.type === "Momo_cashout") {
                        let totalCastOut = sumCico?.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.amount
                        }, 0);
                        setSumCico({ ...sumCico, totalCastOut })
                    }

                    let totalAmount = sumCico?.reduce((acc, cur) => {
                        return acc + cur.amount;
                    }, 0);

                    setSumCico({ ...sumCico, totalAmount });

                    if (groupDate.format(formatDateSummary) === moment().format(formatDateSummary)) {
                        if (item.type === "Momo_cashin") {
                            let totalCashIn = sumCicoYesterday?.reduce((acc, cur) => {
                                return acc + cur.amount;
                            }, 0);
                            setSumCicoYesterday({ ...sumCicoYesterday, totalCashIn });
                        }

                        if (item.type === "Momo_cashout") {
                            let totalCastOut = sumCicoYesterday?.reduce((acc, cur) => {
                                return acc + cur.amount;
                            }, 0);
                            setSumCicoYesterday({ ...sumCicoYesterday, totalCastOut });
                        }

                        let totalAmount = sumCicoYesterday?.reduce((acc, cur) => {
                            return acc + cur.amount;
                        }, 0);
                        setSumCicoYesterday({ ...sumCicoYesterday, totalAmount });
                    }
                }
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally { }
    }

    const [dataDetailPayoo, setDataDetailPayoo] = useState([]);

    const getDataPayoo = async () => {
        let params = {
            types: 'paymenttransaction',
            typePayment: 'Payoo',
            startdate: groupDate.format('YYYY/MM/DD') ?? '',
            enddate: groupDate.format('YYYY/MM/DD') ?? '',
            storeCode: groupStore,
        }

        try {
            const url = `/reporting/object`;
            const response = await fetchData(url, 'GET', params);

            if (response?.status) {
                const result = response?.data?.Payoo ?? [];
                setDataDetailPayoo(result);

                setSumCico({ ...sumCico, totalCashInPayoo: 0, totalAmountPayoo: 0 })

                if (groupDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                    setSumCicoYesterday({ ...sumCicoYesterday, totalCashInPayoo: 0, totalAmountPayoo: 0 })
                }

                let totalCashInPayoo = result.reduce((acc, cur) => {
                    return acc + cur.amount
                }, 0);
                setSumCico({ ...sumCico, totalCashInPayoo, totalAmountPayoo: totalCashInPayoo });

                if (groupDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                    let totalCashInPayoo = result.reduce((acc, cur) => {
                        return acc + cur.amount
                    }, 0);
                    setSumCicoYesterday({ ...sumCicoYesterday, totalCashInPayoo, totalAmountPayoo: totalCashInPayoo })
                }

            }
            else {
                message.error(response?.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally { }

    }

    const handleCicoReport = async () => {
        getDataMomo();
        getDataPayoo();
    }

    const renderTableSumPayment = () => {
        return <>
            <Row gutter={16} className='mrt-10 mrb-10'>
                <Col xl={12}>
                    <div className='section-block pos-relative' style={{ ...styleSectionBlock, height: 342, overflow: 'auto' }}>
                        <TableSumPayment objPaymentMethod={objPaymentMethod} titleMethod={titleMethod} totalMethod={totalMethod} totalQty={totalQty} note={note} summary={summary} yesterdayKey={yesterdayKey} />

                        <Row className="mrt-15">
                            <Col xl={24} className="text-right">
                                <ModelConfirmPayment storeCode={groupStore} objPaymentList={objPaymentMethod} dateCico={groupDate} sumCico={sumCicoYesterday} />
                            </Col>
                        </Row>

                        <div className={"mask-content " + (note !== '' ? "show" : 'hide')}>
                            <div className="mask-content-error text-center"></div>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className='section-block' style={{ ...styleSectionBlock, height: 342 }}>
                        {renderTabCico()}
                    </div>
                </Col>
            </Row>
        </>
    }

    const handleExportPayoo = async () => {
        let params = {
            startdate: groupDate.format('YYYY/MM/DD'),
            enddate: groupDate.format('YYYY/MM/DD'),
        };

        try {
            const queryString = new URLSearchParams(params)
            const url = `/reporting/paymenttransaction/Payoo/export?${queryString}`;
            const response = await fetchData(url, 'POST');
            if (response?.status) {
                let downloadModel = new DownloadModel();
                downloadModel.get(response.data.downloadUrl, null, null, ".xls");
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const handleExportCico = async () => {
        let params = {
            typePayment: "momo",
            storecode: groupStore,
            startdate: groupDate.format('YYYY/MM/DD'),
            endDate: groupDate.format('YYYY/MM/DD'),
        };

        try {
            const queryString = new URLSearchParams(params)
            const url = `/reporting/cico/MoMo/export?${queryString}`;
            const response = await fetchData(url, 'POST');
            if (response?.status) {
                let downloadModel = new DownloadModel();
                downloadModel.get(response.data.downloadUrl, null, null, ".xls");
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const renderTabCico = () => {
        let cicoData = cloneDeep(arrCico);
        const columnsCICO = [
            { field: 'type', label: 'Type', classHead: 'fs-10', classBody: 'fs-10', styleBody: {}, },
            { field: 'transID', label: 'Trans ID', classHead: 'fs-10', classBody: 'fs-10', styleBody: {}, },
            { field: 'amount', label: 'Amount', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: {}, formatBody: (val) => StringHelper.formatPrice(val) },
            { field: 'date', label: 'Date', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: {}, formatBody: (val) => DateHelper.displayDateTime24HM(val) },
        ];
        const dataCICO = createDataTable(cicoData, columnsCICO);

        let dataPayoo = cloneDeep(dataDetailPayoo);
        const columnsPayoo = [
            { field: 'transID', label: 'Trans ID', classHead: 'fs-10', classBody: 'fs-10', styleBody: {}, },
            { field: 'amount', label: 'Amount', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: {}, formatBody: (val) => StringHelper.formatPrice(val) },
            { field: 'date', label: 'Date', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: {}, formatBody: (val) => DateHelper.displayDateTime24HM(val) },
            { field: 'serviceName', label: 'Service name', classHead: 'fs-10', classBody: 'fs-10', styleBody: {}, },
        ];

        const dataCICOPayoo = createDataTable(dataPayoo, columnsPayoo);

        const tabList = [
            {
                label: (
                    <span>
                        PAYOO
                    </span>
                ),
                key: '1',
                children:
                    <div>
                        <Row gutter={16} >
                            <Col xl={24}>
                                <table className="table-hover d-block" style={{ width: 'auto', overflow: 'auto' }}>
                                    <thead>
                                        <tr>
                                            <th className="fs-10 pd-5 bd-none rule-number">TT.Cash in</th>
                                            <th className="fs-10 pd-5 bd-none rule-number">TT.Sales</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>{StringHelper.formatValue(sumCico.totalCashInPayoo)}</td>
                                            <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>{StringHelper.formatValue(sumCico.totalAmountPayoo)}</td>
                                            <th className='fs-10 pd-5 bd-none text-center'>
                                                <Tag
                                                    icon={<FileExcelOutlined />}
                                                    className="h-30 icon-excel d-inline-block v-middle"
                                                    onClick={handleExportPayoo}
                                                >
                                                    <span className="icon-excel-detail">Export</span>
                                                </Tag>
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>

                        <Row gutter={16} className="mrt-10">
                            <Col xl={24}>
                                <TableCustom data={dataCICOPayoo} columns={columnsPayoo} isPaging={false} fullWidth={true} />
                            </Col>
                        </Row>
                    </div>
            },
            {
                label: (
                    <span>
                        MOMO
                    </span>
                ),
                key: '2',
                children: <div>

                    <Row gutter={16} >
                        <Col xl={24}>
                            <table className="table-hover d-block" style={{ width: 'auto', overflow: 'auto' }}>
                                <thead>
                                    <tr>
                                        <th className="fs-10 pd-5 bd-none rule-number">TT.Cash in</th>
                                        <th className="fs-10 pd-5 bd-none rule-number">TT.Cash out</th>
                                        <th className="fs-10 pd-5 bd-none rule-number">TT.Sales</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>{StringHelper.formatValue(sumCico.totalCashIn)}</td>
                                        <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>{StringHelper.formatValue(sumCico.totalCastOut)}</td>
                                        <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>{StringHelper.formatValue(sumCico.totalAmount)}</td>
                                        <th className='fs-10 pd-5 bd-none text-center'>
                                            <Tag
                                                icon={<FileExcelOutlined />}
                                                className="h-30 icon-excel d-inline-block v-middle"
                                                style={{ marginRight: 0 }}
                                                onClick={handleExportCico}
                                            >
                                                <span className="icon-excel-detail">Export</span>
                                            </Tag></th>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} className="mrt-10">
                        <Col xl={24}>
                            <TableCustom data={dataCICO} columns={columnsCICO} isPaging={false} fullWidth={true} />
                        </Col>
                    </Row>
                </div>
            },

            {
                label: (
                    <Row gutter={[16, 16]}>
                        <Col xl={12}>
                            <ModelGroupDate
                                groupDate={groupDate}
                                setGroupDate={setGroupDate}
                                dateModel={dateModel}
                                setDateModel={setDateModel}
                                isCurrentDate={false}
                                isLabel={false}
                            />
                        </Col>
                        <Col xl={12}>
                            <Tag className="h-30 icon-search" onClick={handleCicoReport}>
                                <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                            </Tag>
                        </Col>
                    </Row>
                ),
                key: '3',
                disabled: true,
            }

        ];

        return <>
            <div className="card-container cicoreport" style={{ width: '100%' }}>
                <Tabs
                    defaultActiveKey="1"
                    items={tabList}
                    type="card"
                />
            </div >
            {/* <Row gutter={30}>
                
            </Row > */}
        </>
    }


    const [isShowDetailHistory, setIsShowDetailHistory] = useState(false);
    const [isActiveSale, setIsActiveSale] = useState(7);

    const handleReturnData = (objs, name) => {
        let arr = [];
        for (let i in objs) {
            let item = objs[i];
            let newOb1 = {
                date: DateHelper.displayDateDateMonth(item.date),
                value: item[name],
                type: name,
            }

            arr.push(newOb1);
        }

        return arr;
    }

    const handleShowDetailHistory = (number) => {
        setIsActiveSale(number);
        setIsShowDetailHistory(true);
    }

    const renderComparableSales = () => {
        const data7daysSale = handleReturnData(lastSaleDay7Days, 'totalSale');
        const data7daysCustomer = handleReturnData(lastSaleDay7Days, 'customer');

        const data3daysSale = handleReturnData(lastSaleDay3Days, 'totalSale');
        const data3daysCustomer = handleReturnData(lastSaleDay3Days, 'customer');

        const dataLastSales = isActiveSale === 7 ? data7daysSale : data3daysSale;
        const dataLastCustomer = isActiveSale === 7 ? data7daysCustomer : data3daysCustomer;

        const dataLastSale3Day = Object.values(lastSaleDay3Days);
        const dataLastSale7Day = Object.values(lastSaleDay7Days);

        return <>
            <Row gutter={16} className='mrt-10 mrb-10'>
                <Col xl={24}>
                    <div className='section-block' style={{ ...styleSectionBlock, height: 400 }}>
                        {renderTabComparableSales({ dataLastSale3Day, dataLastSale7Day })}
                    </div>

                    <Modal
                        title="History sales/customer"
                        centered
                        open={isShowDetailHistory}
                        onOk={() => setIsShowDetailHistory(false)}
                        onCancel={() => setIsShowDetailHistory(false)}
                        width={800}
                        footer={[]}
                    >
                        <Row>
                            <Col span={24}>
                                <Row gutter={16} className="mrt-5">
                                    <Col span={12}>
                                        <div className="pos-relative">
                                            <div className="dashboard-bar-chart">
                                                <div className="pd-10">
                                                    <AreaChart data={dataLastSales} xField={'date'} yField={'value'} type={'type'} color={'rgb(130, 202, 157)'} />
                                                </div>
                                            </div>
                                        </div>

                                    </Col>
                                    <Col span={12}>
                                        <div className="pos-relative">
                                            <div className="dashboard-bar-chart">
                                                <div className="pd-10">
                                                    <AreaChart data={dataLastCustomer} xField={'date'} yField={'value'} type={'type'} color={'rgb(255, 198, 88)'} />
                                                </div>
                                            </div>
                                        </div>

                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </Modal>
                </Col>
            </Row>
        </>
    }

    const renderTabComparableSales = ({ dataLastSale3Day, dataLastSale7Day }) => {
        const tabList = [
            {
                label: (
                    <span>
                        Comparable sales 3 days
                    </span>
                ),
                key: '1',
                children: <BarChartSales title={"Sales trend"} height={280} data={dataLastSale3Day} />
            },
            {
                label: (
                    <span>
                        Comparable sales 7 days
                    </span>
                ),
                key: '2',
                children: <BarchartCustomer title={"Customers trend"} height={280} data={dataLastSale7Day} />
            },
        ]

        return <>
            <div className="card-container " style={{ width: '100%' }}>
                <Tabs
                    defaultActiveKey="1"
                    items={tabList}
                    type="card"
                />
            </div >
        </>
    }

    const [topDelivery, setTopDelivery] = useState([]);
    const [keyActiveTopDelivery, setKeyActiveTopDelivery] = useState(1);
    const handleChangeKeyTopDelivery = (val) => {
        setKeyActiveTopDelivery(val)
    };
    const handleGetReportTopDelivery = async () => {

        try {
            const url = `/productorder/itemsales`;
            const resposne = await fetchData(url, 'GET');
            if (resposne?.status) {
                let result = resposne?.data?.items ?? [];
                setTopDelivery(result);
            }
            else {
                message.warning("Couldn't find top delivery for the month");
            }

        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally { }
    }

    const renderTopDelivery = () => {
        let dataTopDeliveryAll = topDelivery ?? [];

        const columnsTopDelivery = [
            { field: 'categoryCode', label: 'Category', colSpanHead: 2, classHead: 'fs-10', classBody: 'fs-10', styleBody: {}, },
            { field: 'categoryName', label: '', colSpanHead: 0, classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 65 }, isTooltip: true },
            { field: 'itemCode', label: 'Item', colSpanHead: 2, classHead: 'fs-10', classBody: 'fs-10', styleBody: {}, },
            { field: 'itemName', label: '', colSpanHead: 0, classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 80 }, isTooltip: true },
            { field: 'partner', label: 'Partner', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: {} },
            { field: 'qty', label: 'Qty', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { background: 'ivory' }, formatBody: (val) => StringHelper.formatValue(val) },

        ];

        const dataTopDelivery = createDataTable(dataTopDeliveryAll, columnsTopDelivery);
        const nowItems = dataTopDeliveryAll?.filter(el => el.partner == 'Now') ?? [];
        const grabItems = dataTopDeliveryAll?.filter(el => el.partner == 'Grab') ?? [];
        // ================

        const tabList = [
            {
                label: (
                    <span>
                        Grab
                    </span>
                ),
                key: '1',
                children: <TopDeliveryMonthGrab data={grabItems} height={280} />
            },
            {
                label: (
                    <span>
                        Shoppe
                    </span>
                ),
                key: '2',
                children: <TopDeliveryMonthShopee data={nowItems} height={280} />
            },
            {
                label: (
                    <Space>
                        {
                            (keyActiveTopDelivery == 1) &&
                            <Tag
                                icon={<FileExcelOutlined style={{ margin: 0 }} />}
                                className="h-30 icon-excel d-inline-block v-middle"
                                onClick={() => handleExportAutoField(grabItems, "topDeliveryGrab")}
                            >
                                <span className="icon-excel-detail">Export</span>
                            </Tag>
                        }
                        {
                            (keyActiveTopDelivery == 2) &&
                            <Tag
                                icon={<FileExcelOutlined style={{ margin: 0 }} />}
                                className="h-30 icon-excel d-inline-block v-middle"
                                onClick={() => handleExportAutoField(nowItems, "topDeliveryShopee")}
                            >
                                <span className="icon-excel-detail">Export</span>
                            </Tag>
                        }
                    </Space>
                ),
                key: '3',
                disabled: true,
            }
        ]

        return <>
            <Row className="mrt-10 mrb-10">
                <Col xl={24}>
                    <div className='section-block' style={{ ...styleSectionBlock, height: 400 }}>
                        <Row gutter={16} >
                            <Col xl={24} >
                                <span className="text-center cl-blue fw-bold" >
                                    Top delivery/ month
                                </span>
                            </Col>
                        </Row>
                        <div className="card-container" style={{ width: '100%' }}>
                            <Tabs
                                defaultActiveKey={keyActiveTopDelivery}
                                items={tabList}
                                type="card"
                                onChange={handleChangeKeyTopDelivery}
                            />
                        </div >

                    </div>

                </Col>
            </Row >
        </>
    }

    const [monthCategory, setMonthCategory] = useState([]);
    const handleGetReportChartBestSalesInMonth = async () => {
        let storeCode = groupStore;
        let params = {
            date: moment().subtract(1, 'days').format('YYYY-MM-DD')
        }

        try {
            const url = storeCode !== '' ? `/storesale/${storeCode}/category/top/monthly` : `/sale/store/category/top/monthly`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                let result = response?.data?.sale ?? [];
                setMonthCategory(result);
                if (result?.length === 0) {
                    message.warning("Couldn't find top category for the month");
                }
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const [keyActiveSalesMonth, setKeyActiveSalesMonth] = useState(1);
    const renderBestSale = () => {

        let dataMonthCategory = monthCategory;
        let data = topItemMonth ?? [];

        const renderRate = (val, key, item) => {
            return (item.sumQty && item.sumQty.value) ? (StringHelper.formatValue(item.itemQty / item.sumQty.value * 100)) : 0
        }

        const columnsTopItemMonth = [
            { field: 'itemName', label: 'Item', classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 65 }, isTooltip: true },
            { field: 'divisionName', label: 'Division', classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 65 }, isTooltip: true },
            { field: 'categoryName', label: 'Category', classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 65 }, isTooltip: true },
            { field: 'subCategoryName', label: 'Sub category', classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 80 }, isTooltip: true },
            { field: 'rate', label: 'Rate', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { background: 'ivory' }, formatBody: renderRate },
            { field: 'itemQty', label: 'Qty', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { background: 'ivory' }, formatBody: (val) => StringHelper.formatValue(val) },
            { field: 'grossSales', label: 'Gross sales', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { background: 'ivory', minWidth: 65 }, formatBody: (val) => StringHelper.formatValue(val) },
            { field: 'sumQty', label: '', colSpanHead: 0, notShow: true },
        ];

        const columnsBestSalesMonth = [
            { field: 'categoryName', label: 'Category', classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 65 }, isTooltip: true },
            { field: 'itemQty', label: 'Qty', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { background: 'ivory' }, formatBody: (val) => StringHelper.formatValue(val) },
            { field: 'grossSales', label: 'Gross sales', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { background: 'ivory' }, formatBody: (val) => StringHelper.formatValue(val) },
        ];

        const dataBestSalesMonth = createDataTable(dataMonthCategory, columnsBestSalesMonth);
        const dataTopItemMonth = createDataTable(data, columnsTopItemMonth);

        const tabList = [
            {
                label: (
                    <span>
                        Best sales/month
                    </span>
                ),
                key: '1',
                children: <><BestSalesMonth data={dataBestSalesMonth} height={280} /></>
            },
            {
                label: (
                    <span>
                        Top items sales/month
                    </span>
                ),
                key: '2',
                children: <><BestItemSalesMonth data={dataTopItemMonth} height={280} /></>
            },
            {
                label: (
                    <Space>
                        {/* {
                            keyActiveSalesMonth == 1 &&
                            <Tag
                                icon={<FileExcelOutlined />}
                                className="h-30 icon-excel d-inline-block v-middle" onClick={() => handleExportAutoField(dataMonthCategory, "salesbycategoryexport")}>
                                <span className="icon-excel-detail">Export</span>
                            </Tag>
                        }

                        {
                            keyActiveSalesMonth == 2 &&
                            <Tag
                                icon={<FileExcelOutlined />}
                                className="h-30 icon-excel d-inline-block v-middle" onClick={() => handleExportAutoField(data, "bestsaleslastdayexport", ["sumQty"])}>
                                <span className="icon-excel-detail">Export</span>
                            </Tag>
                        } */}
                    </Space>
                ),
                key: '3',
                disabled: true,
            }
        ]

        return <>
            <Row className="mrt-10 mrb-10">
                <Col xl={24}>
                    <div className='section-block' style={{ ...styleSectionBlock, height: 400 }}>
                        {/* <Row gutter={16} >
                            <Col xl={24} >
                                <span className="text-center cl-blue fw-bold" >
                                    Best sales/month &nbsp; <Tag
                                        icon={<FileExcelOutlined />}
                                        className="h-30 icon-excel d-inline-block v-middle" onClick={() => handleExportAutoField(dataMonthCategory, "salesbycategoryexport")}>
                                        <span className="icon-excel-detail">Export</span>
                                    </Tag>
                                </span>
                            </Col>
                        </Row> */}
                        <div className="card-container" style={{ width: '100%' }}>
                            <Tabs
                                defaultActiveKey={'1'}
                                items={tabList}
                                type="card"
                            />
                        </div >
                        {/* <div className="card-container" >
                            <BestSalesMonth data={dataBestSalesMonth} height={322} />
                        </div> */}
                    </div>
                </Col>
            </Row>
        </>
    }

    const [topItemMonth, setTopItemMonth] = useState([]);

    const handleGetReportChartTopItemsSale = async () => {
        let storeCode = groupStore;
        let params = {
            date: moment().subtract(1, 'days').format('YYYY-MM-DD')
        }

        try {
            const url = storeCode !== '' ? `/storesale/${storeCode}/item/top/monthly` : `/sale/store/item/top/monthly`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                let result = response?.data?.sale ?? [];
                setTopItemMonth(result);

                if (result?.length === 0) {
                    message.warning("Couldn't find top top for the month");
                }
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const renderTopItemsSale = () => {

        // Top items sales/month
        // let dataLastBestSale = this.data.LastBestSale || [];
        let data = topItemMonth ?? [];

        const renderRate = (val, key, item) => {
            return (item.sumQty && item.sumQty.value) ? (StringHelper.formatValue(item.itemQty / item.sumQty.value * 100)) : 0
        }

        const columnsTopItemMonth = [
            { field: 'itemName', label: 'Item', classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 65 }, isTooltip: true },
            { field: 'divisionName', label: 'Division', classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 65 }, isTooltip: true },
            { field: 'categoryName', label: 'Category', classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 65 }, isTooltip: true },
            { field: 'subCategoryName', label: 'Sub category', classHead: 'fs-10', classBody: 'fs-10', styleBody: { maxWidth: 80 }, isTooltip: true },
            { field: 'rate', label: 'Rate', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { background: 'ivory' }, formatBody: renderRate },
            { field: 'itemQty', label: 'Qty', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { background: 'ivory' }, formatBody: (val) => StringHelper.formatValue(val) },
            { field: 'grossSales', label: 'Gross sales', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { background: 'ivory', minWidth: 65 }, formatBody: (val) => StringHelper.formatValue(val) },
            { field: 'sumQty', label: '', colSpanHead: 0, notShow: true },
        ];

        const dataTopItemMonth = createDataTable(data, columnsTopItemMonth);

        return <>
            <Row className="mrt-10 mrb-10">
                <Col xl={24}>
                    <div className='section-block' style={{ ...styleSectionBlock, height: 352 }}>
                        <Row gutter={16} >
                            <Col xl={24} >
                                <span className="text-center cl-blue fw-bold" >
                                    Top items sales/month &nbsp; <Tag
                                        icon={<FileExcelOutlined />}
                                        className="h-30 icon-excel d-inline-block v-middle" onClick={() => handleExportAutoField(data, "bestsaleslastdayexport", ["sumQty"])}>
                                        <span className="icon-excel-detail">Export</span>
                                    </Tag>
                                </span>
                            </Col>
                        </Row>
                        <div className="card-container" >
                            <BestItemSalesMonth data={dataTopItemMonth} height={322} />
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    }

    return (
        <>
            {renderSumSales()}
            {renderTableSumPayment()}

            <Row gutter={16}>
                <Col xl={8}>
                    {renderComparableSales()}
                </Col>
                <Col xl={8}>
                    {renderTopDelivery()}
                </Col>
                <Col xl={8}>
                    {renderBestSale()}
                </Col>
            </Row>

            {/* <Row gutter={16}>
                <Col xl={12}>
                    {renderBestSale()}
                </Col>
                <Col xl={12}>
                    {renderTopItemsSale()}
                </Col>
            </Row> */}
        </>
    )
}
