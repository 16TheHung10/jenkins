import React from "react";
import Paging from "external/control/pagination";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper, PageHelper } from "helpers";
import ProductOrderModel from "models/ProductOrderModel";
import DownloadModel from "models/DownloadModel";
class ListProductOrder extends BaseComponent {
  constructor(props) {
    super(props);
    this.itemsOrder = [];
    this.page = this.props.page;
    this.itemCount = 0;
    this.idComponent =
      this.props.idComponent || "ListProductOrder" + StringHelper.randomKey();
    this.isRender = true;
    this.hasReporting = this.props.hasReporting || false;

    this.handleLoadOrderResult = this.handleLoadOrderResult.bind(this);
    this.handleShowOrderDetail = this.handleShowOrderDetail.bind(this);
    this.handleClickPaging = this.handleClickPaging.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  componentDidMount() {
    if (this.props.autoload) {
      this.handleLoadOrderResult();
    }
  }

  handleExport(filter) {
    let model = new ProductOrderModel();
    model
      .exportRefundOrder({
        // storeCode: filter.storeCode,
        // keyword: filter.keyword,
        // orderStartDate: DateHelper.displayDateFormat(filter.orderStartDate),
        // orderEndDate: DateHelper.displayDateFormat(filter.orderEndDate),
        // // orderStatus: filter.orderStatus === 0 ? null : filter.orderStatus,
        // orderStatus: "",
        // refundstatus : filter.refundstatus,
        // paymentStatus: filter.paymentStatus === 0 || filter.paymentStatus === undefined ? "" : filter.paymentStatus,
        // paymentType: filter.paymentType === 0 || filter.paymentStatus === undefined ? "" : filter.paymentType,
        // validPartner: 3,
        // refund: 1,
        storeCode: filter.storeCode,
        keyword: filter.keyword,
        orderStartDate: DateHelper.displayDateFormat(filter.orderStartDate),
        orderEndDate: DateHelper.displayDateFormat(filter.orderEndDate),
        refundstatus: filter.refundstatus,
        paymentStatus:
          filter.paymentStatus === 0 || filter.paymentStatus === undefined
            ? ""
            : filter.paymentStatus,
        paymentType:
          filter.paymentType === 0 || filter.paymentStatus === undefined
            ? ""
            : filter.paymentType,
        sortBy: filter.sortBy || "",
        sortOrder: filter.sortOrder || "",
        page: this.page,
        hasReporting: this.hasReporting,
        partner: 3,
        refund: 1,
      })
      .then((response) => {
        if (response.status) {
          let downloadModel = new DownloadModel();
          downloadModel.get(response.data.downloadUrl, null, null, ".xls");
        } else {
          this.showAlert(response.message);
        }
      });
  }

  handleSearch(filter = null) {
    this.page = 1;
    this.handleLoadOrderResult(filter);
  }

  handleLoadOrderResult(filter = null) {
    if (filter === null) {
      filter = this.props;
    }

    let model = new ProductOrderModel();
    model
      .getListOrder({
        storeCode: filter.storeCode,
        keyword: filter.keyword,
        orderStartDate: filter.orderStartDate,
        orderEndDate: filter.orderEndDate,
        // orderStatus: filter.orderStatus === 0 ? null : filter.orderStatus,
        refundstatus: filter.refundstatus,
        paymentStatus: filter.paymentStatus === 0 ? null : filter.paymentStatus,
        paymentType: filter.paymentType === 0 ? null : filter.paymentType,
        sortBy: filter.sortBy || "",
        sortOrder: filter.sortOrder || "",
        page: this.page,
        hasReporting: this.hasReporting,
        partner: 3,
        refund: 1,
      })
      .then((response) => {
        if (
          response.status &&
          response.data.orderList &&
          response.data.orderList.length > 0
        ) {
          this.itemsOrder = response.data.orderList;
          this.itemCount = response.data.total;
        } else {
          this.itemsOrder = [];
        }
        if (response.status && response.data.reporting) {
          this.props.updateItems(response.data.reporting);
        }
        this.refresh();
      });
  }

  handleUpdateState() {
    this.handleLoadOrderResult();
  }

  handleShowOrderDetail(code) {
    super.targetLink("/refund-order/" + code);
  }

  handleClickPaging(page) {
    this.page = page;
    PageHelper.pushHistoryState("page", page);
  }

  handleCheckAll(e) {
    if (this.itemsOrder.length === 0) {
      this.showAlert("Item not found");
      $(e.target).prop("checked", false);
      return;
    }

    $("#" + this.idComponent)
      .find("[name='itemOption']")
      .not(":disabled")
      .prop("checked", e.target.checked);
  }

  handleConfirmCustomer(obj) {
    let model = new ProductOrderModel();
    model.confirmCustomerOrder(obj.orderCode).then((response) => {
      if (response.status) {
        obj.isCustomerConfirmed = obj.isCustomerConfirmed === 1 ? 0 : 1;
      }
      this.refresh();
    });
  }

  handleLinkPage = (obj) => {
    if (obj.refundStatus === 1) {
      return false;
    }
    let answer = window.confirm('Please help me confirm the action "REFUND"');
    if (answer === true) {
      var url = obj.url;
      var model = new ProductOrderModel();

      model.refundOrder(obj.orderCode).then((res) => {
        if (res.status) {
          window.open(url);
        } else {
          this.showAlert(res.message);
        }

        this.refresh();
      });
    }
  };

  renderComp() {
    let items = this.itemsOrder;
    return (
      <section id={this.idComponent}>
        <div className="wrap-table htable">
          <table className="table table-hover" style={{ fontSize: 11 }}>
            <thead>
              <tr>
                <th className="w10">
                  <input type="checkbox" onClick={this.handleCheckAll} />
                </th>
                <th>Order code</th>
                <th>Bill code</th>
                <th>Title</th>
                <th>Store</th>
                <th className="rule-date">Order date</th>
                <th className="rule-number">SKU</th>
                <th className="rule-number">Qty</th>
                <th className="rule-number">Value</th>
                <th className="rule-number">discount </th>
                <th className="rule-number">FeeShip</th>
                <th>Payment</th>
                <th>Partner</th>
                <th>
                  Order
                  <br />
                  status
                </th>
                <th>
                  Payment
                  <br />
                  status
                </th>
                {/* <th>Confirmed</th> */}
                <th>Trans ID</th>
                <th width="130">
                  customer noted/ <br />
                  Mã KM
                </th>
                <th>
                  Note/
                  <br />
                  ngày giao
                </th>
                <th>Refund</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                // <tr key={i} onDoubleClick={() => this.handleShowOrderDetail(item.orderCode)}>
                <tr key={i}>
                  <td className="w10">
                    <input
                      type="checkbox"
                      key={item.id}
                      name="itemOption"
                      disabled={item.status === 2 || item.status === 3}
                      value={item.id}
                    />
                  </td>
                  <td>{item.orderCode}</td>
                  <td>{item.billCode}</td>
                  <td>{item.title}</td>
                  <td>{item.storeName}</td>
                  <td className="rule-date">
                    {DateHelper.displayDateTime(item.orderDate)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(item.totalItem)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(item.totalQty)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(item.totalValue)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(item.discount)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(item.totalFeeShip)}
                  </td>
                  <td>{item.paymentTypeName}</td>
                  <td>{item.partner}</td>
                  <td>
                    {item.status === 3 ? (
                      <span className="label label-danger">Deleted</span>
                    ) : (
                      ""
                    )}
                    {item.status === 2 ? (
                      <span className="label label-success ">Approved</span>
                    ) : (
                      ""
                    )}
                    {item.status === 1 ? (
                      <span className="label label-warning">Processing</span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {item.paymentStatus === 3 ? (
                      <span className="label label-danger">Fail</span>
                    ) : (
                      ""
                    )}
                    {item.paymentStatus === 2 ? (
                      <span className="label label-success ">Success</span>
                    ) : (
                      ""
                    )}
                    {item.paymentStatus === 1 ? (
                      <span className="label label-warning">Waiting</span>
                    ) : (
                      ""
                    )}
                  </td>
                  {/* <td>
                                        <input
                                            type="checkbox"
                                            onChange={() => this.handleConfirmCustomer(item)}
                                            className="ckb-style"
                                            key={item.id}
                                            disabled={item.status === 2}
                                            name="isCustomerConfirmed"
                                            checked={item.isCustomerConfirmed === 1}
                                        />
                                    </td> */}
                  <td>{item.transID}</td>
                  <td>{item.customerNote}</td>
                  <td>{item.note}</td>
                  <td>
                    <span
                      style={{ cursor: "pointer" }}
                      className={
                        item.refundStatus === 1
                          ? "label label-success op3"
                          : "label label-success"
                      }
                      onClick={() => this.handleLinkPage(item)}
                    >
                      Refund
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? (
            <div className="table-message">Item not found</div>
          ) : (
            ""
          )}
        </div>
        {items.length !== 0 ? (
          <Paging
            page={this.page}
            onClickPaging={this.handleClickPaging}
            onClickSearch={this.handleLoadOrderResult}
            itemCount={this.itemCount}
          />
        ) : (
          ""
        )}
      </section>
    );
  }
}

export default ListProductOrder;
