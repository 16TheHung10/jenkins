import { Col, Row } from 'antd';
import BaseComponent from 'components/BaseComponent';
import DateHelper from 'helpers/DateHelper';
import { createDataTable } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';
import React from 'react';
import TableCustom from 'utils/tableCustom';

export default class TableLoyaltyTransReport extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = 'listDetail' + StringHelper.randomKey();
    this.dataTrans = [];

    this.storeCode = '';
    this.transactionType = '';
    this.discount = '';
    this.memberCode = '';
    this.phone = '';

    this.page = 1;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.data !== this.dataTrans) {
      this.dataTrans = newProps.data;
    }

    if (newProps.storeCode !== this.storeCode) {
      this.storeCode = newProps.storeCode;
    }
    if (newProps.transactionType !== this.transactionType) {
      this.transactionType = newProps.transactionType;
    }
    if (newProps.discount !== this.discount) {
      this.discount = newProps.discount;
    }
    if (newProps.memberCode !== this.memberCode) {
      this.memberCode = newProps.memberCode;
    }
    if (newProps.phone !== this.phone) {
      this.phone = newProps.phone;
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

  handleClickPagingTop = (page) => {
    this.page = page;
    this.refresh();
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

  handleFilter = (lst) => {
    let list = [];

    list = this.storeCode !== '' ? lst.filter((el) => el.storeCode === this.storeCode) : lst;
    list = this.transactionType !== '' ? list.filter((el) => el.eventName === this.transactionType) : list;
    list = this.discount !== '' ? list.filter((el) => el.discount === this.discount) : list;
    list = this.memberCode !== '' ? list.filter((el) => el.memberCode === this.memberCode) : list;
    list = this.phone !== '' ? list.filter((el) => el.phoneClean === this.phone) : list;

    // if (this.props.updateItemExport) {
    //     this.props.updateItemExport(list);
    // }
    return list;
  };

  render() {
    let data = this.handleFilter(this.dataTrans) || [];

    let items = data.length > 1 ? data.filter((el, i) => i >= (this.page - 1) * 30 && i < this.page * 30) : data;

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

    let dataTable = createDataTable(data, columns).sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

    return (
      <>
        <div className="section-block w-fit mt-15">
          <Row className="mrt-20">
            <Col>
              <h5 className="mrt-0">Loyalty members transaction</h5>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xl={24}>
              <TableCustom data={dataTable} columns={columns} fullWidth={false} />
            </Col>
          </Row>
        </div>

        {/* <div className="row">

                    <div className="col-md-12">
                        <div className="bg-block">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <h5 className="mrt-0">Loyalty members transaction</h5>
                                        </div>

                                        <div className="col-md-7">
                                            {
                                                data.length > 0 ?
                                                    <div className="row">
                                                        <div className="col-md-12 text-right">
                                                            <div style={{ display: 'inline-block' }}>
                                                                <Paging page={this.page} onClickPaging={this.handleClickPagingTop} onClickSearch={() => console.log()} itemCount={data.length} />
                                                            </div>
                                                        </div>
                                                    </div> : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <TableCustom data={dataTable} columns={columns} fullWidth={false} />
                                    <div className="wrap-tb of-initial">
                                        <table className="table d-block of-auto " style={{ maxHeight: 'calc(100vh - 300px)' }}>
                                            <thead className="fs-10">
                                                <tr>
                                                    <td>Transaction code</td>
                                                    <td>Transaction type</td>
                                                    <td>Transaction time</td>
                                                    <td>First name</td>
                                                    <td>Last name</td>
                                                    <td>Member code</td>
                                                    <td>Gender</td>
                                                    <td>Address</td>
                                                    <td>Birth date</td>
                                                    <td>Phone</td>
                                                    <td>Item code</td>
                                                    <td>Item name</td>
                                                    <td className="text-center">Discount</td>
                                                    <td className="text-center">Transaction <br />point</td>
                                                    <td className="text-center">Bonus <br />point</td>
                                                    <td className="text-center">Campaign <br />point</td>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    items.length > 0 &&
                                                    items.map((el, i) => (
                                                        <tr key={i}>
                                                            <td className="fs-10">{el.invoiceCode}</td>
                                                            <td className="fs-10">{this.eventName(el.eventName)}</td>
                                                            <td className="fs-10 text-right">{DateHelper.displayDateTime24HM(el.requestDate)}</td>
                                                            <td className="fs-10" style={{ background: 'ivory' }}>{el.firstName}</td>
                                                            <td className="fs-10" style={{ background: 'ivory' }}>{el.lastName}</td>
                                                            <td className="fs-10" style={{ background: 'ivory' }}>{el.memberCode}</td>
                                                            <td className="fs-10" style={{ background: 'ivory' }}>{el.gender}</td>
                                                            <td className="fs-10" style={{ background: 'ivory' }}>{el.address}</td>
                                                            <td className="fs-10" style={{ background: 'ivory' }}>{DateHelper.displayDate(el.birthDate)}</td>
                                                            <td className="fs-10" style={{ background: 'ivory' }}>{el.phoneClean}</td>
                                                            <td className="fs-10">{el.itemCode}</td>
                                                            <td className="fs-10">{el.itemName}</td>
                                                            <td className="fs-10 text-center">{StringHelper.formatValue(el.discount)}</td>
                                                            <td className="fs-10 text-center">{StringHelper.formatValue(el.transactionPoint)}</td>
                                                            <td className="fs-10 text-center">{StringHelper.formatValue(el.rewardPoint)}</td>
                                                            <td className="fs-10 text-center">{StringHelper.formatValue(el.rewardTransactionPoint)}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
      </>
    );
  }
}
