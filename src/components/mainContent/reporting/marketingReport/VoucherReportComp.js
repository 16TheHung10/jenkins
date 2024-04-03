//Plugin
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import StringHelper from 'helpers/StringHelper';
import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';

// import StringHelper from 'helpers/StringHelper';
import DateHelper from 'helpers/DateHelper';

import { FileExcelOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Col, Row, Tag, message } from 'antd';
import { cloneDeep, createDataTable, createListOption, decreaseDate } from 'helpers/FuncHelper';
import DownloadModel from 'models/DownloadModel';
import RangePicker from 'utils/rangePicker';
import SelectBox from 'utils/selectboxAndCheckbox';
import TableCustom from 'utils/tableCustom';
import { AuthApi } from '../../../../api/AuthApi';

class VoucherReportComp extends BaseComponent {
  constructor(props) {
    super(props);

    this.listVoucherType = {};
    this.list = [];
    this.itemCount = 0;
    this.billStatusOpt = [];

    let dateDefault = new Date();

    this.fieldSelected = this.assignFieldSelected({
      // startDate: dateDefault,
      // endDate: dateDefault,
      page: 1,
      pageSize: 100,
      voucherType: 'gs25',
      billStatus: '',
      start: null,
      date: null,
      voucherCode: '',
      name: '',
    });

    this.isAutoload = true;

    // PageHelper.updateFilters(this.fieldSelected, (filters) => {
    //     const arrList = ["startDate", "endDate"];

    //     const handleUpdateField = () => {
    //         for (let i = 0; i < arrList.length; i++) {
    //             if (filters[arrList[i]]) {
    //                 if (filters[arrList[i]] !== "") {
    //                     filters[arrList[i]] = new Date(filters[arrList[i]]);
    //                 } else {
    //                     filters[arrList[i]] = "";
    //                 }
    //             }
    //         }
    //     };

    //     handleUpdateField();

    //     return true;
    // });

    this.isRender = true;
    this.isPaging = false;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    let res = await commonModel.getData('vouchertype');

    if (res.status) {
      this.listVoucherType = res.data.vouchertype;
    }

    this.refresh();
  };

  handleIsLoading = () => {
    this.isLoading = true;
    this.list = [];
    this.refresh();
  };

  handleSearch = async () => {
    const fields = this.fieldSelected;
    this.billStatusOpt = [];

    if (fields.start === null || fields.start === '') {
      message.error('Please choose date');
      return false;
    }

    if (fields.voucherType == '' || fields.voucherType == null) {
      message.error('Please choose voucher type');
      return false;
    }

    const params = {
      voucherType: fields.voucherType,
      types: 'voucherapp',
      startdate: DateHelper.displayDateFormat(fields.start) ?? '',
      enddate: DateHelper.displayDateFormat(fields.date) ?? '',
      page: fields.page,
      pagesize: fields.pageSize,
    };

    this.handleIsLoading();

    try {
      const url = `/reporting/voucher`;
      const response = await AuthApi.get(url, params);

      if (response?.status) {
        let results = response?.data?.voucherapp?.voucherList || [];
        console.log(results);
        this.itemCount = response?.data?.voucherapp?.total || 0;

        this.billStatusOpt = createListOption(results, 'billStatus');
        this.voucherCodeOpt = createListOption(results, 'voucherCode');
        this.nameOpt = createListOption(results, 'name');

        this.list = results;

        if (results === 0) {
          message.warning('Data not found');
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      this.isLoading = false;
      this.refresh();
    }
  };

  handleExport = async () => {
    const fields = this.fieldSelected;

    if (fields.start === null || fields.start === '') {
      message.error('Please choose date');
      return false;
    }

    const params = {
      voucherType: fields.voucherType,
      type: 'vouchertype',
      startDate: DateHelper.displayDateFormat(fields.start) ?? '',
      endDate: DateHelper.displayDateFormat(fields.date) ?? '',
    };

    let model = new ReportingModel();
    let response = await model.exportReport(params);
    if (response.status) {
      let downloadModel = new DownloadModel();
      downloadModel.get(response.data.downloadUrl, null, null, '.xls');
    } else {
      message.error(response.message);
    }
  };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.refresh();
    }
  };

  handleUpdateDate = (arr) => {
    let fields = this.fieldSelected;

    fields.start = arr && arr[0] !== null ? arr[0] : null;
    fields.date = arr && arr[1] !== null ? arr[1] : null;

    this.refresh();
  };

  handleFilter = (arr) => {
    let fields = this.fieldSelected;
    let newArr = [];
    let list = cloneDeep(arr);

    newArr = fields.voucherCode !== '' ? list.filter((el) => el.voucherCode === fields.voucherCode) : list;
    newArr = fields.name !== '' ? newArr.filter((el) => el.name === fields.name) : newArr;

    return newArr;
  };

  renderComp() {
    let fields = this.fieldSelected;

    let billStatusOpt = this.billStatusOpt;

    let voucherType = this.listVoucherType;
    let voucherKeys = Object.keys(voucherType || {});
    let voucherTypeOption = voucherKeys.map((key) => {
      return { value: key, label: `${voucherType[key]}` };
    });

    let dates = [fields.start, fields.date];

    let voucherCodeOpt = this.voucherCodeOpt || [];
    let nameOpt = this.nameOpt || [];

    let list = this.handleFilter(this.list) || [];

    const renderIsApp = (val, key, item) => {
      return <>{val !== '' ? <>{val == true ? <Tag color="success">Is app</Tag> : <Tag color="warning">Not an app</Tag>}</> : null}</>;
    };

    const renderBillStatus = (val, key, item) => {
      return <>{val !== '' ? <>{val === 'Success' ? <Tag color="success">{val}</Tag> : <Tag color="warning">{val}</Tag>}</> : null}</>;
    };

    const columns = [
      {
        field: 'name',
        label: 'Name',
        classHead: 'fs-10',
        classBody: 'fs-10',
        isSort: true,
        keySort: 'name',
      },
      {
        field: 'memberCode',
        label: 'Member code',
        classHead: 'fs-10',
        classBody: 'fs-10',
        isSort: true,
        keySort: 'memberCode',
      },
      {
        field: 'billCode',
        label: 'Bill code',
        classHead: 'fs-10',
        classBody: 'fs-10',
        isSort: true,
        keySort: 'billCode',
      },
      // { field: 'billAmount', label: 'Bill value', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', formatBody: (val) => StringHelper.formatValue(val), isSort: true, keySort: 'billAmount' },
      {
        field: 'voucherCode',
        label: 'Voucher code',
        classHead: 'fs-10',
        classBody: 'fs-10',
        isSort: true,
        keySort: 'voucherCode',
      },
      {
        field: 'amount',
        label: 'Voucher value',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'amount',
      },
      {
        field: 'expiredDate',
        label: 'Expired date',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => DateHelper.displayDateTime(val),
        isSort: true,
        keySort: 'expiredDate',
      },
      // { field: 'groupVoucher', label: 'Group voucher', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', formatBody: (val) => StringHelper.formatValue(val), isSort: true, keySort: 'groupVoucher' },
      {
        field: 'isApp',
        label: 'Is app',
        classHead: 'fs-10',
        classBody: 'fs-10',
        formatBody: renderIsApp,
        isSort: true,
        keySort: 'isApp',
      },
      {
        field: 'itemCode',
        label: 'Item code',
        classHead: 'fs-10',
        classBody: 'fs-10',
        isSort: true,
        keySort: 'itemCode',
      },
      {
        field: 'itemName',
        label: 'Item name',
        classHead: 'fs-10',
        classBody: 'fs-10',
        isSort: true,
        keySort: 'itemName',
      },
      {
        field: 'usedDate',
        label: 'Used date',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => DateHelper.displayDateTime(val),
        isSort: true,
        keySort: 'usedDate',
      },
      {
        field: 'billStatus',
        label: 'Bill status',
        classHead: 'fs-10',
        classBody: 'fs-10',
        formatBody: renderBillStatus,
        isSort: true,
        keySort: 'billStatus',
      },
    ];

    const data = createDataTable(list, columns);

    let sumFooter = {
      billAmount: 0,
      amount: 0,
    };

    return (
      <>
        <div className="container-table pd-0">
          <div className="col-md-12">
            <Row gutter={16} className="mrt-10 mrb-10">
              <Col xl={24}>
                <div className="section-block">
                  <Row gutter={16}>
                    <Col xl={19}>
                      <Row gutter={16} className="mrb-10">
                        <Col xl={7}>
                          <label htmlFor="date" className="w100pc">
                            Date:
                            <div>
                              <RangePicker
                                dates={dates}
                                // range={60}
                                minDate={decreaseDate(62)}
                                maxDate={decreaseDate(0)}
                                func={this.handleUpdateDate}
                              />
                            </div>
                          </label>
                        </Col>

                        <Col xl={6}>
                          <label htmlFor="storeCode" className="w100pc">
                            Voucher type:
                            <SelectBox data={voucherTypeOption} func={this.updateFilter} funcCallback={() => (fields.page = 1)} keyField={'voucherType'} value={fields.voucherType} isMode={''} />
                          </label>
                        </Col>

                        <Col xl={6}>
                          <label htmlFor="storeCode" className="w100pc">
                            &nbsp;
                          </label>
                          <Tag className="h-30 icon-search" onClick={this.handleSearch}>
                            <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                          </Tag>

                          <Tag icon={<FileExcelOutlined />} className="h-30 icon-excel" onClick={this.handleExport}>
                            <span className="icon-excel-detail">Export</span>
                          </Tag>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        {this.billStatusOpt.length > 0 ? (
                          <Col xl={6}>
                            <label htmlFor="billStatus" className="w100pc">
                              Bill status:
                              <SelectBox
                                data={billStatusOpt}
                                func={this.updateFilter}
                                // funcCallback={() => fields.page = 1}
                                keyField={'billStatus'}
                                // defaultValue={fields.voucherType}
                                isMode={''}
                              />
                            </label>
                          </Col>
                        ) : null}
                        {this.list?.length > 0 && (
                          <>
                            <Col xl={6}>
                              <label htmlFor="voucherCode" className="w100pc">
                                Voucher code filter:
                                <SelectBox data={voucherCodeOpt} func={this.updateFilter} keyField={'voucherCode'} value={fields.voucherCode} isMode={''} />
                              </label>
                            </Col>
                            <Col xl={6}>
                              <label htmlFor="name" className="w100pc">
                                Name filter:
                                <SelectBox data={nameOpt} func={this.updateFilter} keyField={'name'} value={fields.name} isMode={''} />
                              </label>
                            </Col>
                          </>
                        )}
                      </Row>
                    </Col>
                    <Col xl={5}></Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <div className="section-block">
              <TableCustom data={data} columns={columns} sumFooter={sumFooter} isLoading={this.isLoading} />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default VoucherReportComp;
