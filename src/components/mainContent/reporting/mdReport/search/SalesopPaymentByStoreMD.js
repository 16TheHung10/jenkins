//Plugin
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import $ from "jquery";

//Custom
import BaseComponent from "components/BaseComponent";

import CommonModel from "models/CommonModel";
import ReportingModel from "models/ReportingModel";

import PageHelper from "helpers/PageHelper";
import DateHelper from "helpers/DateHelper";
import StringHelper from "helpers/StringHelper";

import TableSalesAcc from "components/mainContent/reporting/mdReport/table/TableSalesopPaymentByStoreMD";

import { decreaseDate, changeTab, fnObjGroup, createListOption, fnSum } from "helpers/FuncHelper";
import { handleExportAutoField } from "helpers/ExportHelper";
import moment from 'moment';

import { Col, Row, Space, Tag } from 'antd';
import SelectBox from "utils/selectBox";
import RangePicker from "utils/rangePicker";
import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';
import ModelGroupDate from 'modelComponent/ModelGroupDate';

export default class SalesopPaymentByStoreMD extends BaseComponent {
    constructor(props) {
        super(props);

        this.idStoreShowExport = "ppStoreExport" + StringHelper.randomKey();
        this.idStoreShowExportDetail = "ppStoreExportDetail" + StringHelper.randomKey();


        //Default data
        this.data.stores = {};
        this.allStore = [];

        this.items = {};
        this.total = {};

        // Sales by store
        this.dataDetailSbs = [];

        // disposal data

        this.data.disposal = [];
        this.data.exportDis = [];

        this.data.disposalTotal = {};

        this.defaultDate = decreaseDate(1);

        //Data Selected

        this.resultSbc = [];

        this.fieldSelected = this.assignFieldSelected(
            {
                start: moment().clone().subtract(1, 'days'),
                date: moment().clone().subtract(1, 'days'),

                starDisposal: "",
                startDateDisposal: this.defaultDate,
                dateSbc: this.defaultDate,
                startDateSbc: decreaseDate(8),
                dateDetailEx: this.defaultDate,
                startDateDetailExport: "",
                storeCodeDetailExport: "",

                dateSbcEx: this.defaultDate,
                startDateSbcEx: "",
                starSbs: "",
                startDateSbs: this.defaultDate,
                storePaymentFilter: "",

                startSumByPayment: "",
                endSumByPayment: this.defaultDate,
                storeCodeCateExport: "",

                startSalesAcc: "",
                endSalesAcc: decreaseDate(1),
                datePaymentSalesByStore: moment().clone().subtract(1, 'days'),
                modelDatePaymentSalesByStore: 'date',
            },
            ["storeCode"]
        );

        this.page = 1;

        this.storeCodeCateExport = [];
        this.storeCodeDetailExport = [];

        this.detailBillCancel = [];
        this.detailBillCancelDisposal = [];
        this.detailBillCancelSBC = [];
        this.detailBillCancelPSBS = [];
        this.detailBillCancelSBP = [];

        // if (this.fieldSelected.storeCode === undefined || this.fieldSelected.storeCode === "" || this.data.storeCode === undefined) {
        //     this.fieldSelected.storeCode = "VN0001";
        // }

        this.dataExport = [];



        this.itemReport = {
            totalBill: 0,
            totalItem: 0,
            totalCustomer: 0,
            totalGrossSales: 0,
            vatAmount: 0,
            billDiscount: 0,
            itemDiscount: 0,
            netSales: 0
        };

        this.allTotalSales = {};
        this.listSales = [];
        this.itemsSumByPayment = [];

        this.isRender = true;

        this.methodPaymentSalesByStore = {};
        this.dataPaymentSalesByStore = [];
        this.isLoadingPaymentSalesByStore = false;
    }

    componentDidMount() {
        this.handleUpdateState();
    }

    onChangeStoreCode = (value) => {
        if (value) {
            this.handleReset();
        }
    }

    handleReset = () => {
        let fileds = this.fieldSelected;
        fileds.start = moment().clone().subtract(1, 'days');
        fileds.date = moment().clone().subtract(1, 'days');
        fileds.starDisposal = "";
        fileds.startDateDisposal = this.defaultDate;
        fileds.dateSbc = this.defaultDate;
        fileds.startDateSbc = "";
        fileds.dateDetailEx = this.defaultDate;
        fileds.startDateDetailExport = "";
        fileds.dateSbcEx = this.defaultDate;
        fileds.startDateSbcEx = "";
        fileds.starSbs = "";
        fileds.startDateSbs = this.defaultDate;

        this.resultSbc = [];
        this.dataDetailSbs = [];

        this.data.disposal = [];

        this.data.disposalTotal = {};

        this.itemReport = {
            totalBill: 0,
            totalItem: 0,
            totalCustomer: 0,
            totalGrossSales: 0,
            vatAmount: 0,
            billDiscount: 0,
            itemDiscount: 0,
            netSales: 0
        };
        this.refresh();
    }

    handleUpdateState = async () => {
        let commonModel = new CommonModel();
        commonModel.getData("store").then((res) => {
            if (res.status) {
                this.data.stores = res.data.stores || [];
            }
            this.refresh();
        });
    }

    handleSearchSalesAccounting = () => {
        this.handleGetPaymentMethod();
    };

    // handleGetPaymentMethod = () => {
    //     if (this.fieldSelected.date === null || this.fieldSelected.date === "") {
    //         this.showAlert("Please choose date ");
    //         return false;
    //     };

    //     let storeCode = this.fieldSelected.storeCode;
    //     let params = {
    //         start: DateHelper.displayDateFormatMinus(this.fieldSelected.date) === DateHelper.displayDateFormatMinus(this.fieldSelected.start) ? "" : DateHelper.displayDateFormatMinus(this.fieldSelected.start),
    //         date: DateHelper.displayDateFormatMinus(this.fieldSelected.date) ?? "",
    //     };

    //     this.items = [];

    //     this.fieldSelected.storeCodeDetailExport = "";
    //     this.storeCodeDetailExport = [];
    //     let page = storeCode !== "" ? "paymentMethod/summary" : "/paymentMethod/summary"

    //     let model = new ReportingModel();
    //     model.getInfoReport(page, storeCode, params).then(res => {
    //         if (res.status && res.data) {
    //             let arr = res.data.sale || [];

    //             let result = {}
    //             let title = {};
    //             let total = {};

    //             for (let i in arr) {
    //                 let item = arr[i];
    //                 if (!title[item.paymentMethodName]) {
    //                     title[item.paymentMethodName] = item.paymentMethodName;
    //                 };
    //             }

    //             for (let i in arr) {
    //                 let item = arr[i];

    //                 if (!result[item.storeCode]) {
    //                     result[item.storeCode] = {};
    //                 }

    //                 if (!total[item.storeCode]) {
    //                     total[item.storeCode] = {};
    //                     total[item.storeCode]["TT.Amount"] = 0;
    //                     total[item.storeCode]["TT.Trans"] = 0;
    //                 }
    //                 total[item.storeCode]["TT.Amount"] += item.amount;
    //                 total[item.storeCode]["TT.Trans"] += item.billCount;

    //                 if (!result[item.storeCode][item.paymentMethodName]) {
    //                     result[item.storeCode][item.paymentMethodName] = {};
    //                     result[item.storeCode][item.paymentMethodName].amount = 0;
    //                     result[item.storeCode][item.paymentMethodName].billCount = 0;
    //                 }

    //                 result[item.storeCode][item.paymentMethodName].amount += item.amount;
    //                 result[item.storeCode][item.paymentMethodName].billCount += item.billCount;
    //             }

    //             let obj = { amount: 0, billCount: 0 };


    //             for (let i in result) {
    //                 let item = result[i];

    //                 for (let i3 in title) {
    //                     if (!item[i3]) {
    //                         item[i3] = obj
    //                     }
    //                 }
    //             }

    //             this.items = result;

    //             this.total = total;
    //             this.dataExport = arr;
    //         }
    //         else {
    //             this.showAlert(res.message);
    //         }
    //         this.refresh();
    //     })
    // }

    handleGetPaymentMethod = () => {
        let storeCode = this.fieldSelected.storeCode;

        let groupDate = this.fieldSelected.datePaymentSalesByStore;
        let dateModel = this.fieldSelected.modelDatePaymentSalesByStore
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
            // date: this.fieldSelected.endSalesAcc ? DateHelper.displayDateFormatMinus(this.fieldSelected.endSalesAcc) : "",
            // start: this.fieldSelected.startSalesAcc ? DateHelper.displayDateFormatMinus(this.fieldSelected.startSalesAcc) : ""
            start: start.format(formatDate) === date.format(formatDate) ? '' : start.format(formatDate),
            date: date.format(formatDate),
        }

        this.items = [];
        this.methodPaymentSalesByStore = {};
        this.dataPaymentSalesByStore = [];
        this.isLoadingPaymentSalesByStore = true;
        this.fieldSelected.storeCodeDetailExport = "";
        this.storeCodeDetailExport = [];
        let page = storeCode !== "" ? "paymentMethod/summary" : "/paymentMethod/summary";

        let model = new ReportingModel();
        model.getInfoReport(page, storeCode, params).then(res => {
            if (res.status && res.data) {
                let arr = res.data.sale || [];

                const methodGroup = res?.data?.sale?.reduce((acc, item) => {
                    const { paymentMethodCode, paymentMethodName } = item;
                    if (!acc[paymentMethodCode]) {
                        acc[paymentMethodCode] = {};
                        acc[paymentMethodCode].value = paymentMethodCode;
                        acc[paymentMethodCode].label = paymentMethodName;
                    };

                    return acc;
                }, {});

                const entries = Object.entries(methodGroup);
                const sortedEntries = entries.sort((a, b) => a[0].localeCompare(b[0]));
                const sortedObjectMethod = Object.fromEntries(sortedEntries);
                this.methodPaymentSalesByStore = sortedObjectMethod;
                this.dataPaymentSalesByStore = arr;

                let result = {}
                let title = {};
                let total = {};

                for (let i in arr) {
                    let item = arr[i];
                    if (!title[item.paymentMethodName]) {
                        title[item.paymentMethodName] = item.paymentMethodName;
                    };
                }

                for (let i in arr) {
                    let item = arr[i];

                    if (!result[item.storeCode]) {
                        result[item.storeCode] = {};
                    }

                    if (!total[item.storeCode]) {
                        total[item.storeCode] = {};
                        total[item.storeCode]["TT.Amount"] = 0;
                        total[item.storeCode]["TT.Trans"] = 0;
                    }
                    total[item.storeCode]["TT.Amount"] += item.amount;
                    total[item.storeCode]["TT.Trans"] += item.billCount;

                    if (!result[item.storeCode][item.paymentMethodName]) {
                        result[item.storeCode][item.paymentMethodName] = {};
                        result[item.storeCode][item.paymentMethodName].amount = 0;
                        result[item.storeCode][item.paymentMethodName].billCount = 0;
                    }

                    result[item.storeCode][item.paymentMethodName].amount += item.amount;
                    result[item.storeCode][item.paymentMethodName].billCount += item.billCount;
                }

                let obj = { amount: 0, billCount: 0 };


                for (let i in result) {
                    let item = result[i];

                    for (let i3 in title) {
                        if (!item[i3]) {
                            item[i3] = obj
                        }
                    }
                }

                this.items = result;

                this.total = total;

            }
            else {
                this.showAlert(res.message);
            }
            this.isLoadingPaymentSalesByStore = false;
            this.refresh();
        })
    }

    updateFilter = (val, key) => {
        if (key) {
            this.fieldSelected[key] = val;
            this.refresh();
        }
    }

    handleUpdateDate = (arr) => {
        let fields = this.fieldSelected;

        fields.start = (arr && arr[0] !== null) ? arr[0] : null;
        fields.date = (arr && arr[1] !== null) ? arr[1] : null;

        this.refresh();
    }

    handleExportSalesAccounting = () => {
        let results = { ...this.items };
        let newObj = {};
        for (let key in results) {
            let item = results[key];
            if (!newObj[key]) {
                newObj[key] = {};
                newObj[key].storeCode = key;

                for (let key2 in item) {
                    let item2 = item[key2];
                    if (!newObj[key][key2]) {
                        newObj[key][key2 + "-amount"] = item2.amount;
                        newObj[key][key2 + "-bill"] = item2.billCount;
                    }
                }
            }
        }

        let dataExport = Object.values(newObj);
        handleExportAutoField(dataExport, 'paymentSalesByStoreExport');
    };

    renderComp() {
        let fields = this.fieldSelected;
        let stores = this.data.stores;

        let storeKeys = Object.keys(stores);
        const orderStore = {};
        Object.keys(stores)
            .sort()
            .forEach(function (key) {
                if (DateHelper.diffDate(stores[key].openedDate, new Date()) > 0) {
                    orderStore[key] = stores[key];
                }
            });
        let storeOptions = [];
        let storeOptionsCate = [];
        this.allStore = [];
        if (storeKeys.length === 0) {
            storeOptions.push({ value: this.data.storeCode, label: this.data.storeCode + " - " + this.data.storeName });
            this.allStore.push(this.data.storeCode);
            storeOptionsCate = storeOptions;
        } else {
            storeOptions = Object.keys(orderStore).map((key) => {
                this.allStore.push(stores[key].storeCode);
                return { value: stores[key].storeCode, label: stores[key].storeCode + " - " + stores[key].storeName, openedDate: stores[key].openedDate };
            });

            for (let key in orderStore) {
                let el = orderStore[key];
                if (el.storeCode.substring(0, 2) === "VN") {
                    storeOptionsCate.push({ value: el.storeCode, label: el.storeCode + " - " + el.storeName, openedDate: el.openedDate });
                }
            }
        }

        this.storeShowExport = {};
        let groupStore = [];
        let count = 1;
        const chunkSize = 100;
        for (let i = 0; i < storeOptionsCate.length; i += chunkSize) {
            const chunk = storeOptionsCate.slice(i, i + chunkSize);

            var obj = {};
            for (let a = 0; a < chunk.length; a++) {
                if (a === 0) {
                    obj.value = count;
                    obj.label = chunk[a].value;
                    obj.openedDate = chunk[a].openedDate;
                }
                if (a === chunk.length - 1) {
                    obj.label += (" - " + chunk[a].value);
                }
            }

            this.storeShowExport[count] = chunk;

            groupStore.push(obj);

            count++;
        }

        let dates = [fields.start, fields.date];

        return (
            <div >
                <div>
                    <Row gutter={16}>
                        <Col span={24}>
                            <div className="section-block">
                                <Row gutter={[16, 8]}>
                                    <Col xl={5}>
                                        <ModelGroupDate
                                            groupDate={this.fieldSelected.datePaymentSalesByStore}
                                            setGroupDate={(val) => { this.fieldSelected.datePaymentSalesByStore = val; this.refresh() }}
                                            dateModel={this.fieldSelected.modelDatePaymentSalesByStore}
                                            setDateModel={(val) => { this.fieldSelected.modelDatePaymentSalesByStore = val; this.refresh() }}
                                            isCurrentDate={false}
                                        />
                                    </Col>

                                </Row>
                                <Row gutter={[16, 8]} className="mrt-10">

                                    <Col>

                                        <Space size={'small'}>
                                            <Tag className="h-30 icon-search" onClick={this.handleSearchSalesAccounting}>
                                                <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                                            </Tag>
                                            <Tag
                                                icon={<FileExcelOutlined />}
                                                className="h-30 icon-excel" onClick={this.handleExportSalesAccounting}>
                                                <span className="icon-excel-detail">Export</span>
                                            </Tag>
                                        </Space>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={16} className="mrt-10">
                        <Col span={24}>
                            <TableSalesAcc isLoading={this.isLoadingPaymentSalesByStore} methodGroup={this.methodPaymentSalesByStore} data={this.dataPaymentSalesByStore} items={this.items} total={this.total} totalStore={this.allTotalSales} listStore={this.listSales} storePaymentFilter={this.fieldSelected.storePaymentFilter} />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
};
