import BaseComponent from "components/BaseComponent";
import DateHelper from "helpers/DateHelper";
import StringHelper from "helpers/StringHelper";
import $ from "jquery";
import React, { Fragment } from "react";

export default class TableListDetailBillCancel extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "list" + StringHelper.randomKey();

    this.items = [];
    this.fieldSelected = "";
    this.page = 1;

    this.isRender = true;
  }

  handleShow = () => {
    $("#" + this.idComponent).show();
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  componentDidMount() {
    this.handleRightClick(this.idComponent);
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }

    if (newProps.fieldSelected !== this.fieldSelected) {
      this.fieldSelected = newProps.fieldSelected;
    }

    this.page = 1;
    this.refresh();
  };

  handleHighlight = (qty) => {
    if (qty < 0) {
      return "cl-red";
    }
    return "";
  };

  handleExpandItems = (e) => {
    if ($(e.target).hasClass("active")) {
      $(".tb-child-items").addClass("d-none");
      $(".btn-expand-tr-items").text("+");
      $(".btn-expand-tr-items").removeClass("active");
      return false;
    }

    $(".tb-child-items").addClass("d-none");
    $(".btn-expand-tr-items").text("+");
    $(".btn-expand-tr-items").removeClass("active");

    $(e.target)
      .parents(".tb-parent")
      .next(".tb-child-items")
      .removeClass("d-none");
    $(e.target).text("-");
    $(e.target).addClass("active");
  };

  handleExpandPayment = (e) => {
    if ($(e.target).hasClass("active")) {
      $(".tb-child-payment").addClass("d-none");
      $(".btn-expand-tr-payment").text("+");
      $(".btn-expand-tr-payment").removeClass("active");
      return false;
    }

    $(".tb-child-payment").addClass("d-none");
    $(".btn-expand-tr-payment").text("+");
    $(".btn-expand-tr-payment").removeClass("active");

    $(e.target)
      .parents(".tb-parent")
      .next()
      .next(".tb-child-payment")
      .removeClass("d-none");
    $(e.target).text("-");
    $(e.target).addClass("active");
  };

  // renderContextMenuBill = () => {
  // 	return (
  //         <div className="context menu">
  //             <ul className="menu-options">
  // 				<li className="menu-option" onClick={ (e) => this.props.checkBill($(this.getCurrentTarget()).attr('data-itemid')) }>
  // 					<i><FontAwesomeIcon icon={faCheck}/></i>Bill detail</li>
  //             </ul>
  //         </div>
  //     )
  // }

  handleItemShowDetail = (objGroupDetail) => {
    if (Object.keys(objGroupDetail).length === 0) {
      return false;
    }

    let obj = {};

    let min = (this.page - 1) * 30;
    let max = this.page * 30;

    for (let i = min; i < max; i++) {
      let key = Object.keys(objGroupDetail)[i];
      if (key) {
        obj[key] = objGroupDetail[key];
      }
    }

    return obj;
  };

  renderComp = () => {
    // let items = Object.values(this.objItems).sort((a,b) => new Date(a.invoiceDate) - new Date(b.invoiceDate));
    // let objItems = this.handleItemShowDetail(items);

    let itemsLst = this.items || [];

    return (
      <section id={this.idComponent}>
        {/* {this.renderContextMenuBill()} */}
        <div
          className="wrap-table table-chart"
          style={{ maxHeight: "auto", overflow: "initial" }}
        >
          {/* {
                        Object.keys(items).length > 0 &&
                        <div className="row">
                            <div className="col-md-12 text-right">
                                <div style={{display:'inline-block'}}>
                                    <Paging page={this.page} onClickPaging={this.handleClickPaging} onClickSearch={()=>console.log()} itemCount={Object.keys(items).length} />
                                </div>
                            </div>
                        </div>
                    } */}
          <table
            className={"table table-hover " + (itemsLst.length > 0 && "mH-370")}
            style={{
              maxHeight: "calc(100vh - 271px)",
              overflow: "auto",
              display: "block",
            }}
          >
            <thead>
              <tr>
                <th>Invoice code</th>
                <th className="rule-date">Time</th>
                {/* <th className="text-center">Cash <br/>received</th>
                                <th className="text-center">Return <br/>amount</th>
                                <th className="text-center">Total <br/>amount</th>
                                <th className="text-center">Discount</th>
                                <th className="text-center">Gross <br/>sales</th> */}
                <th>Employee</th>
                <th></th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {itemsLst.length > 0 &&
                itemsLst.map((item, index) => (
                  <Fragment key={item.invoiceCode}>
                    <tr
                      className="tb-parent"
                      data-group="itemGroup"
                      data-itemid={item}
                    >
                      <td>{item.invoiceCode}</td>
                      <td className="rule-date">
                        {DateHelper.displayTime(item.invoiceDate)}
                      </td>
                      {/* <td className={"text-center " + this.handleHighlight(item.payCustomer)}>{StringHelper.formatValue(item.payCustomer)}</td>
											<td className={"text-center " + this.handleHighlight(item.returnPaid)}>{StringHelper.formatValue(item.returnPaid)}</td>
											<td className={"text-center " + this.handleHighlight(item.totalAmount)}>{StringHelper.formatValue(item.totalAmount)}</td>
											<td className={"text-center " + this.handleHighlight(item.discount)}>{StringHelper.formatValue(item.discount)}</td>
											<td className={"text-center " + this.handleHighlight(item.billGrossSales)}>{StringHelper.formatValue(item.billGrossSales)}</td> */}

                      <td>{item.employeeCode}</td>
                      <td>{item.employeeName}</td>
                      <td>
                        <span
                          className="btn-org text-center d-inline-block btn-expand-tr-items"
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 2,
                            lineHeight: "16px",
                          }}
                          onClick={(e) => this.handleExpandItems(e)}
                        >
                          +
                        </span>
                      </td>
                    </tr>

                    {item.items && item.items.length > 0 && (
                      <tr
                        className="d-none tb-child-items"
                        style={{ background: "beige" }}
                      >
                        <td
                          colSpan={12}
                          className="text-center"
                          style={{ padding: "5px 15px 15px" }}
                        >
                          <table
                            className="table table-hover cl-chocolate"
                            style={{ width: "100%" }}
                          >
                            <thead style={{ zIndex: 1 }}>
                              <tr>
                                <th style={{ zIndex: 0 }} className="fs-10">
                                  Item code
                                </th>
                                <th style={{ zIndex: 0 }} className="fs-10">
                                  Item name
                                </th>
                                <th
                                  style={{ zIndex: 0 }}
                                  className="fs-10 text-center"
                                >
                                  Qty
                                </th>
                                <th
                                  style={{ zIndex: 0 }}
                                  className="fs-10 text-center"
                                >
                                  Item discount
                                </th>
                                <th
                                  style={{ zIndex: 0 }}
                                  className="fs-10 text-center"
                                >
                                  VAT
                                </th>
                                <th
                                  style={{ zIndex: 0 }}
                                  className="fs-10 text-center"
                                >
                                  VAT amount
                                </th>
                                <th
                                  style={{ zIndex: 0 }}
                                  className="fs-10 text-center"
                                >
                                  Gross sales
                                </th>
                                {item.listpayment && item.listpayment.length > 0
                                  ? item.listpayment.map((a, ia) => (
                                      <Fragment key={ia + item}>
                                        <th
                                          style={{ zIndex: 0 }}
                                          className="fs-10 text-center"
                                        >
                                          {a.paymentMethodName}
                                        </th>
                                      </Fragment>
                                    ))
                                  : null}
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    height: 0,
                                    padding: 0,
                                    border: "none",
                                  }}
                                ></td>
                                <td
                                  style={{
                                    height: 0,
                                    padding: 0,
                                    border: "none",
                                  }}
                                ></td>
                                <td
                                  style={{
                                    height: 0,
                                    padding: 0,
                                    border: "none",
                                  }}
                                ></td>
                                <td
                                  style={{
                                    height: 0,
                                    padding: 0,
                                    border: "none",
                                  }}
                                ></td>
                                <td
                                  style={{
                                    height: 0,
                                    padding: 0,
                                    border: "none",
                                  }}
                                ></td>
                                <td
                                  style={{
                                    height: 0,
                                    padding: 0,
                                    border: "none",
                                  }}
                                ></td>
                                <td
                                  style={{
                                    height: 0,
                                    padding: 0,
                                    border: "none",
                                  }}
                                ></td>
                                {item &&
                                  item.listpayment &&
                                  item.listpayment.map((a, ia) => (
                                    <td
                                      key={index + ia + item}
                                      rowSpan={item.details.length + 1}
                                      className={
                                        "text-center " +
                                        this.handleHighlight(a.amount)
                                      }
                                    >
                                      {StringHelper.formatValue(a.amount)}
                                    </td>
                                  ))}
                              </tr>

                              {item.items.map((el, i) => (
                                <tr key={el.itemCode + "lstItem" + i}>
                                  <td className="fs-10">{el.barcode}</td>
                                  <td className="fs-10 text-left">
                                    {el.itemName}
                                  </td>
                                  <td
                                    className={
                                      "fs-10 text-center " +
                                      this.handleHighlight(el.qty)
                                    }
                                  >
                                    {StringHelper.formatValue(el.qty)}
                                  </td>
                                  <td
                                    className={
                                      "fs-10 text-center " +
                                      this.handleHighlight(el.itemDiscount)
                                    }
                                  >
                                    {StringHelper.formatValue(el.itemDiscount)}
                                  </td>
                                  <td
                                    className={
                                      "fs-10 text-center " +
                                      this.handleHighlight(el.vat)
                                    }
                                  >
                                    {StringHelper.formatValue(el.vat)}
                                  </td>
                                  <td
                                    className={
                                      "fs-10 text-center " +
                                      this.handleHighlight(el.vatAmount)
                                    }
                                  >
                                    {StringHelper.formatValue(el.vatAmount)}
                                  </td>
                                  <td
                                    className={
                                      "fs-10 text-center " +
                                      this.handleHighlight(el.grossSales)
                                    }
                                  >
                                    {StringHelper.formatValue(el.grossSales)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
            </tbody>
          </table>
          {itemsLst.length === 0 ? (
            <div className="table-message">Search ...</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  };
}
