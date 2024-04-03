import { Button, Col, DatePicker, Row, Select, Tag, message } from 'antd';
import BaseComponent from 'components/BaseComponent';
import DateHelper from 'helpers/DateHelper';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { createDataTable } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';
import ReportingModel from 'models/ReportingModel';
import React from 'react';
import DrawerComp from 'utils/drawer';
import SelectBox from 'utils/selectBox';
import TableCustom from 'utils/tableCustom';
import DatePickerComp from 'utils/datePicker';
import moment from 'moment';
import RangePicker from 'utils/rangePicker';

export default class TableLoyaltyReport extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = 'listDetail' + StringHelper.randomKey();

    this.dataTopMonth = [];
    this.dataTopMonthBirthDateAndRegisterDate = [];
    this.birthDateSearch = null;
    this.registerDateSearch = null;
    this.fieldSelected = this.assignFieldSelected(
      {
        transactionDate: '',
        startLog: moment(new Date()),
        dateLog: moment(new Date()),
        isOpen: false,
      },
      ['storeCode']
    );

    this.page = 1;
    this.type = '';
    this.dataLogMem = [];
    this.isLoading = false;
  }

  handleGetTransactionByType = async (start, date, actionType) => {
    if (!start || !date) return;
    const model = new ReportingModel();
    const res = await model.getTransactionByType({ start, date, actionType });
    if (res.status) {
      this.dataTopMonthBirthDateAndRegisterDate = res.data.loyalty;
      this.refresh();
    } else {
      message.error(res.message);
    }
  };
  componentDidMount() {}

  componentWillReceiveProps = (newProps) => {
    if (newProps.dataTopMonth !== this.dataTopMonth) {
      this.dataTopMonth = newProps.dataTopMonth;
    }
    if (newProps.type !== this.type) {
      this.type = newProps.type;
    }

    this.page = 1;

    this.refresh();
  };

  handleHighlight = (qty) => {
    if (qty < 0) {
      return 'cl-red';
    }
    return '';
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.page = 1;
      this.refresh();
    }
  };

  showLabel = (date) => {
    let count = date && date !== '' ? DateHelper.diffDate(new Date(date), new Date()) : ' - ';

    if (count == 0) {
      return <span>{`Đã giao dịch lúc ${DateHelper.displayTimeSecond(date)} hôm nay`}</span>;
    } else if (count > 0 && count < 3) {
      return <span>{`Đã giao dịch ${count} ngày trước`}</span>;
    } else if (count > 30 || isNaN(count)) {
      return <span className="cl-red">{`Không có giao dịch trong vòng 30 ngày`}</span>;
    } else {
      return <span>{`Đã giao dịch vào ngày ${DateHelper.displayDate(date)}`}</span>;
    }
  };

  handleFilter = (arr) => {
    const fields = this.fieldSelected;
    let oldArr = [...arr];
    let newArr = [];

    if (fields.transactionDate !== '') {
      newArr =
        fields.transactionDate == '0'
          ? oldArr.filter((el) => el.lastPurchaseDate && DateHelper.diffDate(new Date(el.lastPurchaseDate), new Date()) == 0)
          : fields.transactionDate == '1'
          ? oldArr.filter((el) => el.lastPurchaseDate && DateHelper.diffDate(new Date(el.lastPurchaseDate), new Date()) <= 30)
          : fields.transactionDate == '2'
          ? oldArr.filter((el) => isNaN(DateHelper.diffDate(new Date(el.lastPurchaseDate), new Date())) || DateHelper.diffDate(new Date(el.lastPurchaseDate), new Date()) > 30)
          : oldArr;
    } else {
      newArr = oldArr;
    }

    return newArr;
  };

  returnDataExport = (list) => {
    let result = [];
    for (let index in list) {
      let item = list[index];

      if (!item.hasOwnProperty('lastPurchaseDate')) {
        item['lastPurchaseDate'] = '';
      }

      result.push(item);
    }

    return result;
  };

  eventName = (eventName) => {
    switch (eventName) {
      case 'BILL_PRINTED':
        return <span className="label label-primary">Hóa đơn</span>;
      case 'PAYMENT':
        return <span className="label label-success">Thanh toán</span>;
      case 'RETURN_ITEM':
        return <span className="label label-info">Trả hàng</span>;
      case 'BILL_CANCEL':
        return <span className="label label-warning">Hóa đơn hủy</span>;
      case 'ADD_REWARD':
        return <span className="label label-primary">Điểm thưởng không theo giao dịch</span>;
      case 'ADD_REWARD_TRANSACTION':
        return <span className="label label-success">Điểm thưởng theo giao dịch</span>;
      case 'APP_REDEEM_DEPOSIT':
        return <span className="label label-info">Đổi điểm</span>;
      case 'LOCK_GIFT':
        return <span className="label label-warning">Tặng quà</span>;
      default:
        return <span className="label label-default">{eventName}</span>;
    }
  };

  handleUpdateDate = (arr) => {
    let fields = this.fieldSelected;

    fields.startLog = arr && arr[0] !== null ? arr[0] : null;
    fields.dateLog = arr && arr[1] !== null ? arr[1] : null;

    this.refresh();
  };

  renderDrawer = () => {
    const fields = this.fieldSelected;

    const results = [...this.dataLogMem];
    let columns = [
      {
        field: 'invoiceCode',
        label: 'Transaction code',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'eventName',
        label: 'Transaction type',
        classHead: 'fs-10',
        classBody: 'fs-10',
        formatBody: (val) => this.eventName(val),
      },
      {
        field: 'requestDate',
        label: 'Transaction time',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => DateHelper.displayDateTime24HM(val),
      },
      {
        field: 'firstName',
        label: 'First name',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'lastName',
        label: 'Last name',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'memberCode',
        label: 'Member code',
        classHead: 'fs-10 ',
        classBody: 'fs-10 ',
      },
      {
        field: 'gender',
        label: 'Gender',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'address',
        label: 'Address',
        classHead: 'fs-10 ',
        classBody: 'fs-10 ',
      },
      {
        field: 'birthDate',
        label: 'Birth date',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => DateHelper.displayDate(val),
      },
      {
        field: 'phoneClean',
        label: 'Phone',
        classHead: 'fs-10 ',
        classBody: 'fs-10 ',
      },
      {
        field: 'itemCode',
        label: 'Item',
        classHead: 'fs-10 ',
        classBody: 'fs-10 ',
        colSpanHead: 2,
      },
      {
        field: 'itemName',
        label: '',
        classHead: 'fs-10 ',
        classBody: 'fs-10 ',
        colSpanHead: 0,
      },
      {
        field: 'discount',
        label: 'Discount',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'transactionPoint',
        label: 'Transaction point',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'rewardPoint',
        label: 'Bonus point',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'rewardTransactionPoint',
        label: 'Campaign point',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
      },
    ];
    const data = createDataTable(results, columns).sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

    let colType = {
      discount: 'number',
      transactionPoint: 'number',
      rewardPoint: 'number',
      rewardTransactionPoint: 'number',
    };

    let dates = [fields.startLog, fields.dateLog];

    return (
      <DrawerComp
        width={800}
        title={'Transaction log member'}
        btnName={'View log'}
        isOpen={this.fieldSelected.isOpen}
        keyFilter={'isOpen'}
        updateFilter={this.updateFilter}
        onSearch={() => {
          this.handleUpdateLoading();
          this.handleGetDataLogMem(fields.memberCode);
        }}
      >
        <Row gutter={16}>
          <Col xl={8}>
            <label htmlFor="date" className="w100pc">
              Month:
              <div>
                <RangePicker
                  dates={dates}
                  // range={30}
                  picker="month"
                  dateFormat="MM/YYYY"
                  minDate={new Date('2018-10-01')}
                  maxDate={new Date()}
                  func={this.handleUpdateDate}
                />
              </div>
            </label>
          </Col>
          <Col xl={8}>
            <label className="w100pc op-0">.</label>
            <button
              type="button"
              onClick={() => {
                this.handleUpdateLoading();
                this.handleGetDataLogMem(fields.memberCode, fields.dateLog, fields.startLog);
              }}
              className="btn btn-danger h-30"
              style={{ marginRight: 5 }}
            >
              Search
            </button>
            <button type="button" onClick={() => handleExportAutoField(data, 'exportLogMemberByMonth', null, null, colType)} className="btn btn-danger h-30">
              Export
            </button>
          </Col>
        </Row>
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <TableCustom data={data} columns={columns} isLoading={this.isLoading} />
          </Col>
        </Row>
      </DrawerComp>
    );
  };

  renderButton = (memberCode) => {
    const fields = this.fieldSelected;

    return (
      <Tag
        color={'warning'}
        className="cursor"
        onClick={() => {
          this.handleUpdateLoading();
          this.handleGetDataLogMem(memberCode);
          fields.isOpen = true;
          fields.memberCode = memberCode;
          fields.startLog = moment(new Date());
          fields.dateLog = moment(new Date());
          this.refresh();
        }}
      >
        View log
      </Tag>
    );
  };

  handleUpdateLoading = () => {
    this.isLoading = true;
    this.dataLogMem = [];
    this.refresh();
  };

  handleGetDataLogMem = (memberCode, monthVal, monthStartVal) => {
    const month = monthVal ? moment(new Date(monthVal)).format('YYYY/MM') : moment(new Date()).format('YYYY/MM');
    const monthStart = monthStartVal ? moment(new Date(monthStartVal)).format('YYYY/MM') : moment(new Date()).format('YYYY/MM');

    const diffInMonths = (new Date(month).getFullYear() - new Date(monthStart).getFullYear()) * 12 + (new Date(month).getMonth() - new Date(monthStart).getMonth());

    let params = { memberCode: memberCode };

    let model = new ReportingModel();
    if (diffInMonths === 0) {
      let page = 'transactionlog/member/' + month;
      model.getInfoLoyalty(page, params).then((res) => {
        if (res.status && res.data) {
          if (res.data.loyalty) {
            this.isLoading = false;
            this.dataLogMem = res.data.loyalty;
            this.refresh();
          }
        } else {
          this.isLoading = false;
          message.error(res.message);
        }
      });
    } else {
      for (var i = 0; i <= diffInMonths; i++) {
        let currentDate = new Date(month);
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth() + 1;
        const previousMonth = new Date(currentYear, currentMonth - (1 + i));
        const previousMonthFormatted = `${previousMonth.getFullYear()}/${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;
        let page = 'transactionlog/member/' + previousMonthFormatted;

        model.getInfoLoyalty(page, params).then((res) => {
          if (res.status && res.data) {
            if (res.data.loyalty) {
              this.isLoading = false;
              this.dataLogMem = [...this.dataLogMem, ...res.data.loyalty];
              this.refresh();
            }
          } else {
            this.isLoading = false;
            message.error(res.message);
          }
        });
      }
    }
  };
  handleExportMulti = async (start, date) => {
    if (!start || !date) {
      message.error('Please input apply month');
      return;
    }
    const params = {
      date,
      method: 'email',
      start,
      type: 'loyaltyprofilebirthdate',
    };
    const model = new ReportingModel();
    const res = await model.exportAnalyticreport(params);
    if (res.status) {
      message.success(`File sent successfully, please check your mail ${res.data.receiver} in 15 minutes`);
    } else {
      message.error(res.message);
    }
  };
  getLastDayOfMonth = (year, month) => {
    const lastDay = moment(`${year}-${month + 1}`, 'YYYY-MM').endOf('month');
    const currentDate = moment();
    if (lastDay.isAfter(currentDate)) {
      return currentDate.format('YYYY-MM-DD');
    } else {
      return lastDay.format('YYYY-MM-DD');
    }
  };
  render() {
    const fields = this.fieldSelected;
    // let data = this.dataTrans || [];
    let dataTopMonth = this.handleFilter([3, 4].includes(+fields.transactionDate) ? this.dataTopMonthBirthDateAndRegisterDate : this.dataTopMonth) || [];

    let transDateOpt = [
      { value: '0', label: 'Giao dịch trong ngày' },
      { value: '1', label: 'Giao dịch trong vòng 30 ngày' },
      { value: '2', label: 'Không có giao dịch trong vòng 30 ngày' },
      { value: '3', label: 'Sinh nhật trong tháng' },
      { value: '4', label: 'Tháng đăng ký' },
    ];

    let highlightColumnTrans = this.type === 'trans' ? 'fs-10 text-right bg-ivory' : 'fs-10 text-right';
    let highlightColumnBonus = this.type === 'bonus' ? 'fs-10 text-right bg-ivory' : 'fs-10 text-right';

    let columns = [
      {
        field: 'firstName',
        label: 'First name',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'lastName',
        label: 'Last name',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'memberCode',
        label: 'Member code',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'gender',
        label: 'Gender',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'address',
        label: 'Address',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'birthDate',
        label: 'Birth date',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => DateHelper.displayDate(val),
      },
      {
        field: 'registerDate',
        label: 'Register date',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => DateHelper.displayDate(val),
      },

      {
        field: 'phoneClean',
        label: 'Phone',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'transactionPoint',
        label: 'Transaction point',
        classHead: 'fs-10 text-right',
        classBody: highlightColumnTrans,
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'usedPoint',
        label: 'Used point',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'rewardPoint',
        label: 'Bonus point',
        classHead: 'fs-10 text-right',
        classBody: highlightColumnBonus,
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'rewardTransactionPoint',
        label: 'Campaign point',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'point',
        label: 'Current point',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: 'lastPurchaseDate',
        label: 'Note',
        classHead: 'fs-10',
        classBody: 'fs-10',
        formatBody: (val) => this.showLabel(val),
      },
      {
        field: 'privateKey',
        label: '',
        mainKey: 'memberCode',
        classHead: 'fs-10',
        classBody: 'fs-10',
        formatBody: (val) => this.renderButton(val),
      },
    ];

    let dataTable = createDataTable(dataTopMonth, columns);

    const type = +fields.transactionDate === 3 ? 'birthDate' : +fields.transactionDate === 4 ? 'registerDate' : '';
    let start = null;
    let date = null;
    if (type === 'birthDate' && this.birthDateSearch) {
      start = `${moment().year()}-${this.birthDateSearch}-1`;
      date = `${this.getLastDayOfMonth(moment().year(), this.birthDateSearch - 1)}`;
    } else if (type === 'registerDate' && this.registerDateSearch) {
      const diffFromNow = moment(this.registerDateSearch).endOf('month').diff(moment(), 'days');
      start = moment(this.registerDateSearch).startOf('month').format('YYYY-MM-DD');
      date = diffFromNow >= 0 ? moment().format('YYYY-MM-DD') : moment(this.registerDateSearch).endOf('month').format('YYYY-MM-DD');
    }

    return (
      <section id={this.idComponent} style={{ overflow: 'auto' }}>
        <Row gutter={16}>
          <Col xl={24}>
            <div className="bg-block w-full" style={{ height: 'auto', width: '100%' }}>
              <Row className="w-full">
                <Col xl={24}>
                  <Row gutter={16}>
                    <Col xl={4}>
                      <label htmlFor="transactionDate" className="w100pc">
                        Interactive status:
                        <SelectBox data={transDateOpt} func={this.updateFilter} keyField={'transactionDate'} defaultValue={fields.transactionDate} isMode={''} />
                      </label>
                    </Col>
                    {+fields.transactionDate === 4 ? (
                      <Col xl={4}>
                        <div className="w-full">
                          <label htmlFor="transactionDate" className="w100pc">
                            Apply month:
                          </label>
                          <DatePicker
                            className="w-full"
                            picker="month"
                            format="MM/YYYY"
                            disabledDate={(current) => {
                              return current && current > moment().endOf('day');
                            }}
                            onChange={(e) => {
                              this.registerDateSearch = e;
                              this.refresh();
                            }}
                          />
                        </div>
                      </Col>
                    ) : +fields.transactionDate === 3 ? (
                      <Col xl={4}>
                        <div className="w-full">
                          <label htmlFor="transactionDate" className="w100pc">
                            Apply month:
                          </label>
                          <Select
                            className="w-full"
                            options={Array.from({ length: 12 }, (_, index) => {
                              return index;
                            })
                              .sort((a, b) => Number(a) - Number(b))
                              .map((item) => {
                                return { value: item + 1, label: item + 1 };
                              })}
                            onChange={(value) => {
                              this.birthDateSearch = value;
                              this.refresh();
                            }}
                          />
                        </div>
                      </Col>
                    ) : null}
                    {[4].includes(+fields.transactionDate) && (
                      <Col xl={4} style={{ display: 'flex', alignItems: 'end' }}>
                        <div className="w-full">
                          <label htmlFor="transactionDate" className="w100pc"></label>
                          <Button
                            onClick={() => {
                              this.handleGetTransactionByType(start, date, type);
                            }}
                          >
                            Search
                          </Button>
                        </div>
                      </Col>
                    )}
                    {![3].includes(+fields.transactionDate) && (
                      <Col xl={4}>
                        <label className="w100pc">&nbsp;</label>
                        <button type="button" onClick={() => handleExportAutoField(this.returnDataExport(dataTopMonth), 'topLoyaltyMemberExport')} className="btn btn-danger h-30">
                          Export
                        </button>
                      </Col>
                    )}
                  </Row>

                  <Row className="mrt-10">
                    {[3].includes(+fields.transactionDate) ? (
                      <Col xl={4}>
                        <label className="w100pc">&nbsp;</label>
                        <button type="button" onClick={() => this.handleExportMulti(start, date)} className="btn btn-danger h-30">
                          Export multi
                        </button>
                      </Col>
                    ) : (
                      <TableCustom data={dataTable} columns={columns} fullWidth={false} />
                    )}
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        {this.renderDrawer()}
      </section>
    );
  }
}
