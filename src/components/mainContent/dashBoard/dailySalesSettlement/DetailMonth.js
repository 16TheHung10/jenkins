import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tabs, Tag, message } from 'antd';
import TableListDetailBill from "components/mainContent/dashBoard/TableListDetailBill";
import TableListDetailBillCancel from "components/mainContent/dashBoard/TableListDetailBillCancel";
import TableDetailLogComp from "components/mainContent/reporting/tableComp/TableSaleLogDetail";
import { handleExportAutoField } from "helpers/ExportHelper";
import { fetchData } from 'helpers/FetchData';
import { cloneDeep, createListOption } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';
import ModelGroupDate from 'modelComponent/ModelGroupDate';
import ModelGroupStore from 'modelComponent/ModelGroupStore';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';

export default function DetailMonth() {
    const refCheckbill = useRef();

    const [storeOpt, setStoreOpt] = useState([]);

    const [groupDate, setGroupDate] = useState(moment().subtract(1, 'days'));
    const [dateModel, setDateModel] = useState('date');

    const [noteDetail, setNoteDetail] = useState('');
    const [noteDetailCancel, setNoteDetailCancel] = useState('');
    const [isSearchBill, setIsSearchBill] = useState(false);
    const [detailBill, setDetailBill] = useState([]);
    const [detailBillCancel, setDetailBillCancel] = useState([]);
    const [invoiceCodeOpt, setInvoiceCodeOpt] = useState([]);
    const [employeeOpt, setEmployeeOpt] = useState([]);
    const [methodOpt, setMethodOpt] = useState([]);
    const [counterOpt, setCounterOpt] = useState([]);

    const [total, setTotal] = useState(0);
    const [countBillTru, setCountBillTru] = useState(0);
    const [pageDetail, setPageDetail] = useState(1);
    const [objGroupDetail, setObjGroupDetail] = useState({});

    const [resultLog, setResultLog] = useState([]);

    const [invoiceBillDetail, setInvoiceBillDetail] = useState('');
    const [counterF, setCounterF] = useState('');
    const [employeecodeBillDetail, setEmployeecodeBillDetail] = useState('');
    const [methodcodeBill, setMethodcodeBill] = useState('');
    const [customerNumber, setCustomerNumber] = useState('');
    const [invoiceType, setInvoiceType] = useState('');
    const [action, setAction] = useState('');
    const [itemsLog, setItemsLog] = useState([]);
    const [billAmount, setBillAmount] = useState('');

    const [groupDateCancel, setGroupDateCancel] = useState(moment().subtract(1, 'days'));
    const [itemsCancel, setItemsCancel] = useState([]);
    const [optFilInvoiceCancel, setoptFilInvoiceCancel] = useState([]);
    const [optFilEmployeeCancel, setoptFilEmployeeCancel] = useState([]);
    const [invoiceBillDetailCancel, setInvoiceBillDetailCancel] = useState('');
    const [employeecodeBillDetailCancel, setEmployeecodeBillDetailCancel] = useState('');

    const [searching, setSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const renderTab = () => {
        const tabList = [
            {
                label: (
                    <span>
                        Detail
                    </span>
                ),
                key: '1',
                children: <>{renderDetail()}</>
            },
            {
                label: (
                    <span>
                        Cancel
                    </span>
                ),
                key: '2',
                children: <>{renderCancel()}</>

            },
        ];

        return <>
            <Row gutter={30}>
                <Col xl={24}>
                    <div className='detail-tab-month-nav'>
                        <Tabs
                            defaultActiveKey="1"
                            items={tabList}
                            type="card"
                        />
                    </div>
                </Col>
            </Row >
        </>
    }

    const handleLoading = () => {
        setDetailBill([])
        setIsLoading(true);
        setSearching(true);
        setObjGroupDetail({});
    }

    const getDataBill = async () => {
        let storeCode = groupStore;
        let params = {
            date: groupDate.format('YYYY-MM-DD')
        }

        try {
            if (searching === true) {
                message.warning({ key: 'search', content: 'Please await' });
                return false;
            }

            handleLoading();

            const url = storeCode !== '' ? `/storesale/${storeCode}/transaction/movement` : `/sale/store/transaction/movement`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                let result = response?.data?.sale ?? [];

                if (result?.length === 0) {
                    message.warning("Data not found");
                }

                setIsSearchBill(true);
                setDetailBill(result);

                const uniqueInvoiceCode = [...new Set(result?.map(el => el.invoiceCode))];
                const invoiceCodeOpt = uniqueInvoiceCode?.map(invoiceCode => ({
                    value: invoiceCode,
                    label: invoiceCode
                }))
                setInvoiceCodeOpt(invoiceCodeOpt);

                const uniqueCounter = [...new Set(result?.map(el => el.invoiceCode.replaceAll(' ', '').slice(0, 8)))];
                const counterOpt = uniqueCounter?.map(counter => ({
                    value: counter,
                    label: counter
                }))
                setCounterOpt(counterOpt)

                const uniqueEmployee = [...new Set(result?.map(el => el.employeeCode))];
                const employeeOpt = uniqueEmployee.map(emp => {
                    const item = result?.find(el => el.employeeCode === emp);
                    return {
                        value: emp,
                        label: `${emp} - ${item.employeeName}`
                    }
                })
                setEmployeeOpt(employeeOpt)

                const uniqueMethod = [];
                const uniquePaymentMethodCodes = new Set();
                result.forEach(item => {
                    item.listpayment.forEach(payment => {
                        if (!uniquePaymentMethodCodes.has(payment.paymentMethodCode)) {

                            uniquePaymentMethodCodes.add(payment.paymentMethodCode);
                            uniqueMethod.push({ value: payment.paymentMethodCode, label: `${payment.paymentMethodCode} - ${payment.paymentMethodName}` });
                        }
                    });
                });
                setMethodOpt(uniqueMethod);

                let objGroupDetail = {};
                for (const item of result) {
                    let invoiceTrim = item.invoiceCode.replaceAll(' ', '');

                    if (!objGroupDetail[invoiceTrim]) {
                        objGroupDetail[invoiceTrim] = {
                            invoiceDate: item.invoiceDate,
                            invoiceType: item.invoiceType,
                            storeCode: item.storeCode,
                            storeName: item.storeName,
                            employeeCode: item.employeeCode,
                            employeeName: item.employeeName,
                            returnPaid: item.returnPaid,
                            discount: item.discount,
                            listpayments: {},
                            listpaymentsValue: {},
                            listpayment: item.listpayment,
                            customerCode: item.customerCode,
                            totalAmount: 0,
                            payCustomer: item.returnPaid,
                            netSalesAfter: 0,
                            billGrossSales: item.billGrossSales,
                            invoiceCode: invoiceTrim,
                            counter: invoiceTrim.slice(0, 8)
                        }
                    }

                    objGroupDetail[invoiceTrim].payCustomer += item.grossSales;
                    objGroupDetail[invoiceTrim].totalAmount = (item.billGrossSales + item.discount);
                    objGroupDetail[invoiceTrim].netSalesAfter += item.netSalesAfter;

                    if (!objGroupDetail[invoiceTrim].details) {
                        objGroupDetail[invoiceTrim].details = [];
                    }

                    let obj = {
                        itemCode: item.barcode,
                        itemName: item.itemName,
                        qty: item.qty,
                        itemDiscount: item.itemDiscount,
                        grossSales: item.grossSales,
                        vat: item.vat,
                        vatAmount: item.vatAmount,
                        supplierCode: item.supplierCode,
                        divisionCode: item.divisionCode,
                        divisionName: item.divisionName,
                        categoryCode: item.categoryCode,
                        categoryName: item.categoryName,
                    }

                    for (let index2 in objGroupDetail[invoiceTrim].listpayment) {
                        let item2 = objGroupDetail[invoiceTrim].listpayment[index2];

                        if (!objGroupDetail[invoiceTrim].listpayments[item2.paymentMethodCode]) {
                            objGroupDetail[invoiceTrim].listpayments[item2.paymentMethodCode] = true;
                        }

                        if (!objGroupDetail[invoiceTrim].listpaymentsValue[item2.paymentMethodCode]) {
                            objGroupDetail[invoiceTrim].listpaymentsValue[item2.paymentMethodCode] = item2.amount;
                        }
                    }

                    objGroupDetail[invoiceTrim].details.push(obj);
                }

                setObjGroupDetail(objGroupDetail);
                handleFilterBill(objGroupDetail)
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setSearching(false);
            setIsLoading(false);
        }
    }

    const getDataLog = async () => {
        let storeCode = groupStore;
        let paramsLog = {
            date: groupDate.format('YYYY-MM-DD')
        };
        setResultLog([]);
        try {
            const url = storeCode !== "" ? `/storesale/${storeCode}/salelog` : `/sale/store/salelog`;
            const response = await fetchData(url, 'GET', paramsLog, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                let result = response?.data?.sale;
                setResultLog(result);
            }
            else {
                message.error(response.message)
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const checkStatusAPIsale = async () => {
        let params = {
            storecode: groupStore,
            date: groupDate.format("YYYY-MM-DD")
        }

        try {
            const url = `/storestatus/sale`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                if (response?.data && response?.data?.storeStatus) {
                    if (response.data.note) {
                        setNoteDetail(response.data.note)
                    }
                }
                else {
                    setNoteDetail('');
                }
            }
            else {
                message.error(response.message)
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
            setIsSearchBill(true);
        }
    }

    const handleSearchDetail = async () => {
        setNoteDetail('');
        setIsSearchBill(false);
        getDataBill();
        checkStatusAPIsale();
        if (groupStore !== '') {
            getDataLog();
        }
    }

    const handleFilterBill = (objItems) => {

        let objGroupDetailShow = {};
        let total = 0;
        let totalBill = 0;
        for (var k in objItems) {
            var item = objItems[k];

            if (
                (billAmount === '' || checkConditionBillGrossSales(item, billAmount))
                &&
                (invoiceBillDetail === '' || k.indexOf(invoiceBillDetail) !== -1)
                &&
                (counterF === '' || item.counter.indexOf(counterF) !== -1)
                &&
                (employeecodeBillDetail === '' || item.employeeCode.toString().indexOf(employeecodeBillDetail) !== -1)
                &&
                (methodcodeBill === '' || item.listpayments[methodcodeBill])
                &&
                (customerNumber === '' || (customerNumber === "0" && item.customerCode === "") || (customerNumber === "1" && item.customerCode !== ""))
            ) {
                objGroupDetailShow[k] = item;

                totalBill += 1;

                if (methodcodeBill !== "") {
                    total += (item.listpaymentsValue[methodcodeBill]);
                }
                else {

                    for (let key in item.listpaymentsValue) {
                        let target = item.listpaymentsValue[key];

                        total += target;
                    }
                }
            }
        }

        let ar = [];
        if (action !== "") {
            for (let k in resultLog) {
                let item = resultLog[k];
                for (let k2 in item.log) {
                    let item2 = item.log[k2];
                    let typeOpt = action == 5 ? 0 : action;
                    if (item2.action == typeOpt) {
                        ar.push(item.invoiceCode);
                    }
                }
            }
        }
        if (ar.length > 0) {
            let pickedEntries = Object.entries(objGroupDetailShow).filter(([key]) => ar.includes(key));
            objGroupDetailShow = Object.fromEntries(pickedEntries);
        }
        else {
            if (ar.length == 0 && action == 3) {
                message.warning("không tìm thấy hàng xóa");
            }
        }
        return { objGroupDetailShow, total };
    }

    const checkConditionBillGrossSales = (elment, billAmount) => {
        let isCondition = false;
        if (billAmount != '') {
            if ((parseFloat(elment.billGrossSales) > parseFloat(billAmount) && [50000, 70000, 100000].includes(parseFloat(billAmount)))) {
                isCondition = true;
            }
            else { isCondition = false }

        }
        else {
            isCondition = true;
        }

        return isCondition;
    }

    const handleCount = () => {
        let arTruHang = [];

        for (let item in resultLog) {
            let target = resultLog[item];
            for (let itemLog in target.log) {
                let target2 = target.log[itemLog]
                if (target2.action == '0' || target2.action == '3') {
                    arTruHang.push(target.invoiceCode);
                }

            }
        }
        const uniqueArrTru = arTruHang.filter((value, index, self) => self.indexOf(value) === index);

        let countBillTru = uniqueArrTru?.length;
        return { countBillTru };
    }

    const [invoiceSelected, setInvoiceSelected] = useState('');

    const updateInvoiceSeleted = (value) => {
        setInvoiceSelected(value)

        let itemsLog = resultLog.filter(el => el.invoiceCode == value) && resultLog.filter(el => el.invoiceCode == value).length > 0 ? resultLog.filter(el => el.invoiceCode == value) : [];

        let valueCondition = itemsLog.length > 1 ? itemsLog[itemsLog.length - 1].log : (itemsLog.length !== 0 ? itemsLog[0].log : []);
        setItemsLog(valueCondition)

    }

    const handleCheckBill = (invoiceId) => {
        refCheckbill.current.handleLoadItemsResult(invoiceId);
    }

    const renderDetail = () => {
        let { objGroupDetailShow, total } = handleFilterBill(objGroupDetail);
        let { countBillTru } = handleCount();
        // let objGroupDetailShow = objGroupDetail;

        let optInvoice = invoiceCodeOpt;
        let optEmployee = employeeOpt;
        let optMethod = methodOpt;
        let optCounter = counterOpt;

        const optItemAction = [{
            value: 5, label: "Trừ hàng"
        }, {
            value: 3, label: "Xóa số lượng"
        }];

        const optCustomer = [{
            value: "0", label: "Non member in bill"
        }, {
            value: "1", label: "Member in bill"
        }];

        const billAmountOpt = [
            { value: '50000', label: '>50k' },
            { value: '70000', label: '>70k' },
            { value: '100000', label: '>100k' },
        ];

        return <>
            <Row>
                <Col xl={24}>
                    <div className="section-block">
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
                            <Col xl={7}>
                                {/* <label className="w100pc">Date: </label> */}
                                <ModelGroupDate
                                    groupDate={groupDate}
                                    setGroupDate={setGroupDate}
                                    dateModel={dateModel}
                                    setDateModel={setDateModel}
                                    isCurrentDate={false}
                                    isMonth={false}
                                    isWeek={false}
                                // isLabel={false}
                                />
                            </Col>
                            <Col xl={11}>
                                <Row gutter={16}>

                                    {
                                        noteDetail !== "" ?
                                            <Col>
                                                <div className="bg-note cl-red">
                                                    {noteDetail}
                                                </div>
                                            </Col>
                                            :
                                            <>
                                                {
                                                    isSearchBill ?
                                                        <>
                                                            <Col>
                                                                <label htmlFor="methodcode" className="w100pc cl-org">
                                                                    Gross sales:
                                                                </label>
                                                                <strong>{StringHelper.formatQty(total) || 0}</strong>
                                                            </Col>

                                                            <Col>
                                                                <label htmlFor="methodcode" className="w100pc">
                                                                    - items/bill:

                                                                </label>
                                                                <strong>{StringHelper.formatQty(countBillTru)}</strong>
                                                            </Col>
                                                        </>
                                                        : null
                                                }
                                            </>
                                    }
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mrt-10'>
                            <Col >
                                <Space size={'small'}>
                                    <Tag className="h-30 icon-search" onClick={handleSearchDetail}>
                                        <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                                    </Tag>

                                    {
                                        noteDetail !== '' ? null :
                                            <>
                                                {
                                                    isSearchBill ?
                                                        <>
                                                            <Tag
                                                                icon={<FileExcelOutlined />}
                                                                className="h-30 icon-excel d-inline-block v-middle"
                                                                onClick={handleExportDetailBill}
                                                            >
                                                                <span className="icon-excel-detail">Export</span>
                                                            </Tag>
                                                            <Tag
                                                                icon={<FileExcelOutlined />}
                                                                className="h-30 icon-excel d-inline-block v-middle"
                                                                onClick={handleExportLogBill}
                                                            >
                                                                <span className="icon-excel-detail">Export Log</span>
                                                            </Tag>



                                                        </>
                                                        : null
                                                }
                                            </>
                                    }

                                </Space>
                            </Col>
                        </Row>

                        <Row gutter={16} className="mrt-10">
                            <Col xl={6}>
                                <label htmlFor="invoiceBillDetail" className="w100pc">
                                    Invoice code:
                                    <SelectboxAndCheckbox data={optInvoice} funcCallback={(val) => { setInvoiceBillDetail(val); setPageDetail(1) }} keyField={'invoiceBillDetail'} defaultValue={invoiceBillDetail} isMode={''} />
                                </label>
                            </Col>
                            <Col xl={6}>
                                <label htmlFor="employeecodeBillDetail" className="w100pc">
                                    Employee:
                                    <SelectboxAndCheckbox data={optEmployee} funcCallback={(val) => { setEmployeecodeBillDetail(val); setPageDetail(1) }} keyField={'employeecodeBillDetail'} defaultValue={employeecodeBillDetail} isMode={''} />
                                </label>
                            </Col>
                            <Col xl={6}>
                                <label htmlFor="methodcodeBill" className="w100pc">
                                    Method:
                                    <SelectboxAndCheckbox data={optMethod} funcCallback={(val) => { setMethodcodeBill(val); setPageDetail(1) }} keyField={'methodcodeBill'} defaultValue={methodcodeBill} isMode={''} />
                                </label>
                            </Col>
                            <Col xl={6}>
                                <label htmlFor="customerNumber" className="w100pc">
                                    Customer:
                                    <SelectboxAndCheckbox data={optCustomer} funcCallback={(val) => { setCustomerNumber(val); setPageDetail(1) }} keyField={'customerNumber'} defaultValue={customerNumber} isMode={''} />
                                </label>
                            </Col>
                            <Col xl={6}>
                                <label htmlFor="counterF" className="w100pc">
                                    Counter:
                                    <SelectboxAndCheckbox data={optCounter} funcCallback={(val) => { setCounterF(val); setPageDetail(1) }} keyField={'counterF'} defaultValue={counterF} isMode={''} />
                                </label>
                            </Col>
                            <Col xl={6}>
                                <label htmlFor="actionType" className="w100pc">
                                    Item action:
                                    <SelectboxAndCheckbox data={optItemAction} funcCallback={(val) => { setAction(val); setPageDetail(1) }} keyField={'action'} defaultValue={action} isMode={''} />
                                </label>
                            </Col>
                            <Col xl={6}>
                                <label htmlFor="billAmount" className="w100pc">
                                    Bill amount:
                                    <SelectboxAndCheckbox data={billAmountOpt} funcCallback={(val) => { setBillAmount(val); setPageDetail(1) }} keyField={'billAmount'} defaultValue={billAmount} isMode={''} />
                                </label>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row gutter={16} className="mrt-10">
                <Col xl={16} >
                    <TableListDetailBill updateFilter={(page) => setPageDetail(page)} page={pageDetail} objItems={objGroupDetailShow} itemsLog={resultLog} checkBill={handleCheckBill} updateInvoiceSeleted={updateInvoiceSeleted} />

                </Col>
                {
                    itemsLog.length > 0 ?
                        <Col xl={8}>
                            <div className="section-block">
                                <Row><Col><h4>Action log</h4></Col></Row>

                                <Row gutter={16}>
                                    <Col xl={16}><h5>{invoiceSelected}</h5></Col>
                                    <Col xl={8} className='text-right'><h5>{itemsLog.length} step{itemsLog.length > 1 ? "s" : null}</h5></Col>
                                </Row>

                                <TableDetailLogComp items={itemsLog} />
                            </div>
                        </Col>
                        : null
                }

            </Row>
        </>
    }

    const handleExportDetailBill = () => {
        let data = cloneDeep(detailBill);
        let payment = [];

        for (let i in data) {
            let item = data[i];

            delete item.invoiceType;
            delete item.supplierCode;
            delete item.categoryCode;
            delete item.categoryName;
            delete item.subCategoryCode;
            delete item.subCategoryName;
            delete item.divisionCode;
            delete item.divisionName;
            delete item.vatAmount;
            delete item.discount;
            delete item.returnPaid;
            delete item.timeKey;
            delete item.regionCode;
            delete item.regionName;
            delete item.unit;

            for (let i2 in item.listpayment) {
                let item2 = item.listpayment[i2];
                if (!payment.includes(item2.paymentMethodName)) {
                    payment.push(item2.paymentMethodName);
                }
            }
        }

        for (let index in data) {
            let item = data[index];

            for (let index2 in payment) {
                let method = payment[index2];

                for (let index3 in item.listpayment) {
                    let item3 = item.listpayment[index3];

                    if (method === item3.paymentMethodName) {
                        item[method] = item3.amount;
                    }
                    else {
                        item[method] = 0;
                    }
                }
            }
        }

        handleExportAutoField(data, 'detailTransExport' + groupDate.format('YYYY-MM-DD'), ['listpayment']);
    };

    const handleExportLogBill = () => {
        const data = cloneDeep(resultLog)

        const dataExport = data.flatMap(({ counterCode, dateKey, invoiceCode, invoiceType, log }) =>
            log.map((item) => ({
                ...item,
                action: item.action === 0 ? 'Trừ hàng' : (item.action === 1 ? 'Thêm hàng' : (item.action === 2 ? 'Cập nhật số lượng' : (item.action === 3 ? 'Xóa số lượng' : item.action))),
                invoiceCode,
                invoiceType,
                counterCode,
                dateKey,
            }))
        );

        let colType = {
            dateKey: 'number',
            invoiceType: 'number',
            itemQty: 'number',
            no: 'number'
        };

        handleExportAutoField(dataExport, 'dataLogExport', null, null, colType);
    }

    const handleFilterBillCancel = (lst) => {
        let old = cloneDeep(lst);
        let arr = [];

        arr = (invoiceBillDetailCancel !== "") ? old.filter(a => a.invoiceCode === invoiceBillDetailCancel) : old;
        arr = (employeecodeBillDetailCancel !== "") ? arr.filter(a => a.employeeCode === employeecodeBillDetailCancel) : arr;

        return arr;
    }

    const handleLoadingCancel = () => {
        setDetailBillCancel([])
        // setIsLoading(true);
        setSearching(true);
        // setObjGroupDetail({});
    }

    const getDataCancel = async () => {
        let storeCode = groupStore;

        if (groupStore === '' || groupStore?.length === 0 || groupStore[0] === '') {
            message.error('Please choose store to search')
            return false;
        }

        let params = {
            date: groupDateCancel.format('YYYY-MM-DD')
        }


        try {

            if (searching === true) {
                message.warning({ key: 'search', content: 'Please await' })
                return false;
            }

            handleLoadingCancel();

            const url = `/storesale/${storeCode}/transaction/void`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                let result = response?.data?.sale ?? [];
                if (result?.length === 0) {
                    message.warning("Data not found");
                }
                setDetailBillCancel(result)

                let arrItemsCancel = [];
                let obj = {};
                for (let k in result) {
                    let item = result[k];

                    if (item.items) {
                        for (let k2 in item.items) {

                            let item2 = item.items[k2];

                            if (item2.qty < 0) {
                                let o = {
                                    invoiceCode: item.invoiceCode,
                                    invoiceDate: item.invoiceDate,
                                    employeeCode: item.employeeCode,
                                    employeeName: item.employeeName,
                                    customerCode: item.customerCode,
                                    type: "item cancel",
                                }
                                Object.assign(o, item2);

                                arrItemsCancel.push(o);
                            }

                            else {
                                if (!obj[item.invoiceCode]) {

                                    obj[item.invoiceCode] = {
                                        invoiceCode: item.invoiceCode,
                                        invoiceDate: item.invoiceDate,
                                        employeeCode: item.employeeCode,
                                        employeeName: item.employeeName,
                                        customerCode: item.customerCode,
                                        type: "bill cancel",
                                    }

                                    let ac = item2;
                                    Object.assign(obj[item.invoiceCode], ac);
                                }
                            }
                        }
                    }
                }

                let ar = Object.values(obj);

                if (ar.length > 0) {
                    // this.itemsCancel = [].concat(ar, arrItemsCancel);   
                    setItemsCancel([].concat(ar, arrItemsCancel))
                }

                let optFilInvoiceCancel = createListOption(result, 'invoiceCode');
                setoptFilInvoiceCancel(optFilInvoiceCancel)

                let optFilEmployeeCancel = createListOption(result, 'employeeCode', 'employeeName');
                setoptFilEmployeeCancel(optFilEmployeeCancel);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setSearching(false);
        }
    }

    const checkStatusAPIsaleCancel = async () => {
        let params = {
            storecode: groupStore,
            date: groupDateCancel.format("YYYY-MM-DD")
        }

        try {
            const url = `/storestatus/sale`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
            if (response?.status) {
                if (response?.data && response?.data?.storeStatus) {
                    if (response.data.note) {
                        setNoteDetailCancel(response.data.note)
                    }
                }
                else {
                    setNoteDetailCancel('');
                }
            }
            else {
                message.error(response.message)
            }
        } catch (error) {
            console.error('Error fetching data: ', error);

        }
    }

    const handleSearchAllDetailBillCancel = async () => {
        setNoteDetailCancel('');
        getDataCancel();
        checkStatusAPIsaleCancel();
    };

    const renderCancel = () => {
        return <>
            <Row >
                <Col xl={24}>
                    <div className="section-block">
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
                            <Col xl={7}>
                                {/* <label className="w100pc">Date: </label> */}
                                <ModelGroupDate
                                    groupDate={groupDateCancel}
                                    setGroupDate={setGroupDateCancel}
                                    dateModel={dateModel}
                                    setDateModel={setDateModel}
                                    isCurrentDate={false}
                                    // isLabel={false}
                                    isMonth={false}
                                    isWeek={false}
                                />
                            </Col>
                            {/* <Col xl={7}>
                                    <label htmlFor="date" className="w100pc">
                                        Date:
                                        <div>
                                            <RangePicker
                                                dates={dates}
                                                range={7}
                                                minDate={decreaseDate(62)}
                                                maxDate={decreaseDate(1)}
                                                func={this.handleUpdateDate} />
                                        </div>
                                    </label>
                                </Col> */}
                            <Col>
                                <label className="w100pc op-0">.</label>
                                <Space size={'small'}>
                                    <Tag className="h-30 icon-search" onClick={handleSearchAllDetailBillCancel}>
                                        <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                                    </Tag>

                                    <Tag
                                        icon={<FileExcelOutlined />}
                                        className="h-30 icon-excel d-inline-block v-middle"
                                        onClick={() => handleExportAutoField(itemsCancel, "exportItemCancel")}
                                    >
                                        <span className="icon-excel-detail">Export</span>
                                    </Tag>
                                </Space>
                            </Col>

                            {
                                noteDetailCancel !== "" ?
                                    <Col xl={6}>
                                        <div className="bg-note cl-red">
                                            {noteDetailCancel}
                                        </div>
                                    </Col> : null
                            }
                        </Row>
                        <Row gutter={16} className="mrt-10">
                            <Col xl={6}>
                                <label htmlFor="invoiceBillDetailCancel" className="w100pc">
                                    Invoice code:
                                    <SelectboxAndCheckbox data={optFilInvoiceCancel} funcCallback={(val) => { setInvoiceBillDetailCancel(val) }} keyField={'invoiceBillDetailCancel'} defaultValue={invoiceBillDetailCancel} isMode={''} />
                                </label>
                            </Col>

                            <Col xl={6}>
                                <label htmlFor="employeecodeBillDetailCancel" className="w100pc">
                                    Employee:
                                    <SelectboxAndCheckbox data={optFilEmployeeCancel} funcCallback={(val) => { setEmployeecodeBillDetailCancel(val) }} keyField={'employeecodeBillDetailCancel'} defaultValue={employeecodeBillDetailCancel} isMode={''} />
                                </label>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row className="mrt-10">
                <Col xl={24}>
                    <TableListDetailBillCancel items={handleFilterBillCancel(detailBillCancel)} />
                </Col>
            </Row>

        </>
    }

    return (
        <>
            {renderTab()}
            {/* <CheckBillItems ref={refCheckbill} /> */}
        </>
    )
}
