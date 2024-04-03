import React, { Component } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import { Tag } from "antd";

export default class TableStockItemMovement extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
    this.items = [];
    this.fieldSelected = "";
    this.isSearchListBarcode = true;
    this.isSearch = false;
  }

  handleHighlight = (qty) => {
    if (qty < 0) {
      return "cl-red";
    }
    return "";
  };

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }
    if (newProps.fieldSelected !== this.fieldSelected) {
      this.fieldSelected = newProps.fieldSelected;
    }
    if (newProps.isSearchListBarcode !== this.isSearchListBarcode) {
      this.isSearchListBarcode = newProps.isSearchListBarcode;
    }
    if (newProps.isSearch !== this.isSearch) {
      this.isSearch = newProps.isSearch;
    }
    this.refresh();
  };

  handleFilter = (listItem) => {
    let list = listItem;

    if (this.fieldSelected) {
      if (this.fieldSelected.cat !== "") {
        list = list.filter(
          (e) => e.categoryCode.toString() === this.fieldSelected.cat,
        );
      }
    }
    return list;
  };

  render() {
    let items = this.handleFilter(this.items);

    return (
      <section id={this.idComponent}>
        <div
          className="wrap-table table-chart"
          style={{
            overflow: "initial",
            height: "100vh",
            maxHeight: "calc(100vh - 284px)",
          }}
        >
          <table
            className="table table-hover"
            style={{
              maxHeight: "calc(100vh - 228px)",
              overflow: "auto",
              display: "block",
            }}
          >
            <thead>
              <tr>
                <th>Category</th>
                <th>Item code</th>
                <th>Item name</th>
                <th className="text-center">Date</th>
                <th className="text-center">
                  Open <br />
                  stock
                </th>
                <th className="text-center">Sales</th>
                <th className="text-center">
                  RCV <br />
                  stock
                </th>
                <th className="text-center">
                  Internal <br />
                  RCV
                </th>
                <th className="text-center">Transfer</th>
                <th className="text-center">Disposal</th>
                <th className="text-center">StoreUsed</th>
                <th className="text-center">Return</th>
                <th className="text-center">Lost</th>
                <th className="text-center">
                  Stock <br />
                  balance
                </th>
                <th className="text-center">
                  Close <br />
                  stock
                </th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td style={{ background: "antiquewhite" }}>
                    {item.categoryName}
                  </td>
                  <td style={{ background: "antiquewhite" }}>
                    {item.itemCode}
                  </td>
                  <td style={{ background: "antiquewhite" }}>
                    <span style={{ maxWidth: 280, display: "inline-block" }}>
                      {item.itemName}
                    </span>
                  </td>
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
                  <td>
                    {index > 0 ? (
                      <>
                        {item.openingStock !== items[index - 1].closingQty ? (
                          <Tag
                            color="orange"
                            style={{ fontSize: 10, cursor: "pointer" }}
                            onClick={() =>
                              this.props.handleViewReason(
                                item.itemCode,
                                item.itemName,
                                item.date,
                              )
                            }
                          >
                            View
                          </Tag>
                        ) : null}
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && this.isSearchListBarcode ? (
            <div className="table-message">Please search list barcode ...</div>
          ) : (
            ""
          )}
          {items.length === 0 && this.isSearch ? (
            <div className="table-message">Please search ...</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}
