//Plugin
import React, { Fragment } from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import DateHelper from "helpers/DateHelper";
import StringHelper from "helpers/StringHelper";
import Paging from "external/control/pagination";

export default class EstimateStockTabPending extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent =
      this.props.idComponent || "tabPending" + StringHelper.randomKey();

    //Default data

    this.items = this.props.items || [];
    this.type = this.props.type || "";
    this.lock = this.props.lock || "";
    this.report = this.props.report || [];
    this.itemReport = [];

    this.fieldSelected.storeCode = this.props.storeCode || "";
    this.page = 1;
    this.isRender = true;
  }

  componentDidMount() {}

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  componentWillReceiveProps(newProps) {
    if (this.items !== newProps.items) {
      this.items = newProps.items;
    }
    if (this.type !== newProps.type) {
      this.type = newProps.type;
    }
    if (this.lock !== newProps.lock) {
      this.lock = newProps.lock;
    }
    if (this.report !== newProps.report) {
      this.report = newProps.report;
      this.itemReport = this.report.filter((el) => el.type == this.type);
    }
    this.page = 1;
    this.refresh();
  }

  handleMoveToItem = (code, type, lock) => {
    if (lock === "lock") {
      window.open("/purchase/" + code, "_blank");
    } else {
      if (type === "rcv") {
        window.open("/rcv/" + code, "_blank");
      }

      if (type === "po") {
        window.open("/rcv/" + code + "?type=po", "_blank");
      }
    }
  };

  handleCountEndDay = (dateDelivery) => {
    let curDate = new Date().toISOString().substr(0, 10);

    let date1 = new Date(curDate);

    let setDate3 = new Date(dateDelivery).setDate(
      new Date(dateDelivery).getDate() + 2,
    );
    let date3 = new Date(setDate3);

    // One day in milliseconds
    let oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    let diffInTime = date3.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    let diffInDays = Math.round(diffInTime / oneDay);

    if (diffInDays < 0) {
      diffInDays = 0;
      return (
        <span className="label label-danger" style={{ color: "white" }}>
          {diffInDays}
        </span>
      );
    } else if (diffInDays >= 0 && diffInDays <= 2) {
      return (
        <span className="label label-warning" style={{ color: "white" }}>
          {diffInDays}
        </span>
      );
    } else {
      return (
        <span className="label label-success" style={{ color: "white" }}>
          {diffInDays}
        </span>
      );
    }
  };

  renderComp() {
    let items = this.items || [];
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
    let itemsIndex =
      items.length > 1
        ? items.filter(
            (el, i) => i >= (this.page - 1) * 30 && i < this.page * 30,
          )
        : items;

    return (
      <section
        id={this.idComponent}
        className="popup-form popup-form-additem"
        style={{
          maxWidth: "65%",
          width: "auto",
          fontSize: 12,
          overflow: "initial",
        }}
      >
        <div className="form-filter">
          {/* <div className='row'>
						<div className="col-md-12">
							<div className="row">
								<table className="table table-hover">
									<thead>
										<tr>
											<th></th>
											<th  className="rule-number">PO qty</th>
											<th  className="rule-number">SKU</th>
											<th  className="rule-number">Qty</th>
										</tr>
									</thead>
									<tbody>
										{
											this.itemReport.map((el,i)=>
												<Fragment key={i}>
													<tr>
														<th>{el.type}</th>
														<td  className="rule-number">{StringHelper.formatQty(el.qtyRes)}</td>
														<td  className="rule-number">{StringHelper.formatQty(el.sku)}</td>
														<td  className="rule-number">{StringHelper.formatQty(el.qty)}</td>
													</tr>
												</Fragment>
											)
										}
									</tbody>
								</table>
							</div>
						</div>
					</div> */}

          <div className="row">
            <div
              className="wrap-table pp-additem"
              style={{ overflow: "initial" }}
            >
              {items.length > 0 ? (
                <div className="row">
                  <div className="col-md-12 text-right">
                    <div style={{ display: "inline-block" }}>
                      <Paging
                        page={this.page}
                        onClickPaging={this.handleClickPaging}
                        onClickSearch={() => console.log()}
                        itemCount={items.length}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              <table
                className="table table-hover d-block"
                style={{ overflow: "auto", maxHeight: "calc(100vh - 203px)" }}
              >
                <thead>
                  <tr>
                    <th className="w10">STT</th>
                    <th>Status</th>
                    <th>Code</th>
                    {this.type === "rcv" && <th>Transfer code</th>}
                    <th>Supplier</th>
                    <th className="rule-date">
                      End date <br />
                      delivery
                    </th>
                    <th className="rule-date">
                      Delivery <br />
                      date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itemsIndex.map((item, i) => (
                    <tr
                      key={i}
                      data-group="itemContainer"
                      data-item-code={item.code}
                    >
                      <td className="w10">{i + 1}</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className="label label-warning"
                          style={{ color: "white", cursor: "pointer" }}
                          onClick={() =>
                            this.handleMoveToItem(
                              item.code,
                              this.type,
                              this.lock,
                            )
                          }
                        >
                          View
                        </span>
                      </td>
                      <td>{item.code}</td>
                      {this.type === "rcv" && <td>{item.tfCode}</td>}
                      <td>{item.supplierName}</td>
                      <td className="rule-number">
                        {this.handleCountEndDay(item.date)}
                      </td>
                      <td className="rule-date">
                        {DateHelper.displayDate(item.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {itemsIndex.length === 0 ? (
                <div className="table-message">Search ...</div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
