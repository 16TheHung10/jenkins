import React, { Component } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";

export default class TableStockMovement extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
  }

  handleHighlight = (qty) => {
    if (qty < 0) {
      return "cl-red";
    }
    return "";
  };

  render() {
    let { items } = this.props;

    return (
      <section id={this.idComponent}>
        <div
          className="wrap-table table-chart"
          style={{
            maxHeight: "calc(100vh - 228px)",
            overflow: "auto",
            height: "100vh",
          }}
        >
          <table className="table table-hover" style={{ width: "auto" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th className="text-center">
                  Open <br />
                  stock
                </th>
                <th className="text-center">Sales </th>
                <th className="text-center">
                  RCV <br />
                  stock
                </th>
                <th className="text-center">
                  Internal <br />
                  RCV
                </th>
                <th className="text-center">Transfer </th>
                <th className="text-center">Disposal </th>
                <th className="text-center">StoreUsed </th>
                <th className="text-center">Return </th>
                <th className="text-center">Lost</th>
                <th className="text-center">
                  Stock <br />
                  balance{" "}
                </th>
                <th className="text-center">
                  Close <br />
                  stock
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td>{DateHelper.displayDate(item.date)}</td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.openingStock)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.openingStock)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.salesQty)
                    }
                    style={{ background: "antiquewhite" }}
                  >
                    {StringHelper.formatValue(item.salesQty)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.receivingStock)
                    }
                    style={{ background: "antiquewhite" }}
                  >
                    {StringHelper.formatValue(item.receivingStock)}
                  </td>
                  <td
                    className={
                      "text-center " +
                      this.handleHighlight(item.receivingInternalStock)
                    }
                    style={{ background: "antiquewhite" }}
                  >
                    {StringHelper.formatValue(item.receivingInternalStock)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.intTransferQty)
                    }
                    style={{ background: "antiquewhite" }}
                  >
                    {StringHelper.formatValue(item.intTransferQty)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.disposalQty)
                    }
                  >
                    {StringHelper.formatValue(item.disposalQty)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.storeUsedQty)
                    }
                  >
                    {StringHelper.formatValue(item.storeUsedQty)}
                  </td>
                  <td
                    className={
                      "text-center " +
                      this.handleHighlight(item.returnSupplierQty)
                    }
                  >
                    {StringHelper.formatValue(item.returnSupplierQty)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.lossQty)
                    }
                  >
                    {StringHelper.formatValue(item.lossQty)}
                  </td>
                  <td
                    className={
                      "text-center " +
                      this.handleHighlight(item.stockBalanceQty)
                    }
                  >
                    {StringHelper.formatValue(item.stockBalanceQty)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.closingQty)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.closingQty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? (
            <div className="table-message">Search ...</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}
