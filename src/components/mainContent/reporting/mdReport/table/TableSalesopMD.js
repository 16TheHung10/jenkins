import React, { Component } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";

export default class TableSalesopMD extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetailPo" + StringHelper.randomKey();
    this.itemReport = {};
    this.items = [];
    this.type = this.props.type || "";
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.dataResult !== this.items) {
      this.items = newProps.dataResult;
    }

    if (newProps.type !== this.type) {
      this.type = newProps.type;
    }

    if (newProps.itemReport !== this.itemReport) {
      this.itemReport = newProps.itemReport;
    }
  };

  formatKeyDate = (dateKey) => {
    let newDate = "";
    if (dateKey) {
      newDate =
        dateKey.toString().slice(0, 4) +
        "-" +
        dateKey.toString().slice(4, 6) +
        "-" +
        dateKey.toString().slice(6, 8);
    }

    return newDate;
  };

  render() {
    let dataResult = this.items || [];

    return (
      <section id={this.idComponent}>
        <div
          className="wrap-tb table-chart"
          style={{ maxHeight: "calc(100vh - 182px)", overflow: "auto" }}
        >
          <table className="table table-hover">
            <thead>
              <tr>
                <th rowSpan={2}>Store</th>
                <th className="text-center" rowSpan={2}>
                  Open <br />
                  date
                </th>
                <th className="text-center" rowSpan={2}>
                  Business <br />
                  days
                </th>
                <th className="text-center" colSpan={3}>
                  Qty<span className="line-cyan"></span>
                </th>
                <th className="rule-number" rowSpan={2}>
                  VAT amount
                </th>
                <th className="rule-number" rowSpan={2}>
                  Discount
                </th>
                <th className="rule-number" rowSpan={2}>
                  Item discount
                </th>
                <th className="rule-number" rowSpan={2}>
                  Gross sales
                </th>
                <th className="rule-number" rowSpan={2}>
                  Net sales
                </th>
                {this.type === "md" && (
                  <th className="rule-number" rowSpan={2}>
                    Cost Amt
                  </th>
                )}
                {/* <th className="rule-number" rowSpan={2}>Date</th> */}
              </tr>

              <tr>
                <th className="rule-number">Invoice</th>
                <th className="rule-number">Item</th>
                <th className="rule-number">Customer</th>
              </tr>
            </thead>
            <tbody>
              {dataResult.length === 0 ? (
                <tr>
                  <td colSpan={13} className="table-message">
                    Item not found
                  </td>
                </tr>
              ) : null}
              {Object.keys(dataResult).map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td style={{ background: "ivory" }}>
                    {dataResult[item].storeCode} - {dataResult[item].storeName}
                  </td>
                  <td className="text-center">
                    {dataResult[item].openDate
                      ? DateHelper.displayDate(dataResult[item].openDate)
                      : " - "}
                  </td>
                  <td className="text-center">
                    {dataResult[item].openDate
                      ? DateHelper.diffDate(
                          dataResult[item].openDate,
                          new Date(),
                        )
                      : " - "}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(dataResult[item].billCount)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(dataResult[item].qty)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(dataResult[item].customerCount)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(dataResult[item].vatAmount)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(dataResult[item].billDiscount)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(dataResult[item].itemDiscount)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(dataResult[item].grossSales)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(dataResult[item].netSales)}
                  </td>
                  {this.type === "md" && (
                    <td className="rule-number" style={{ background: "ivory" }}>
                      {StringHelper.formatPrice(
                        dataResult[item].totalCostPrice,
                      )}
                    </td>
                  )}
                  {/* <td className="rule-number">{DateHelper.displayDate(this.formatKeyDate(dataResult[item].dateKey))}</td> */}
                </tr>
              ))}
            </tbody>
            {dataResult.length !== 0 &&
            Object.keys(this.itemReport).length > 0 ? (
              <tfoot>
                <tr style={{ left: 0, bottom: 0 }}>
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.totalBill)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.totalItem)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.totalCustomer)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.vatAmount)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.billDiscount)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.itemDiscount)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.totalGrossSales)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.netSales)}
                  </td>
                  {/* <td className="rule-number"></td> */}
                  {this.type === "md" && (
                    <td className="rule-number">
                      {StringHelper.formatQty(this.itemReport.totalCostPrice)}
                    </td>
                  )}
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </section>
    );
  }
}
