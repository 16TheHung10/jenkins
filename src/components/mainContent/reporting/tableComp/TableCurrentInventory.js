import React, { Component } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import Paging from "external/control/pagination";
import IconDownTrend from "images/arrow-trend-down-solid.svg";
import IconUpTrend from "images/arrow-trend-up-solid.svg";

export default class TableCurrentInventory extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
    this.items = [];
    this.fieldSelected = "";
    this.itemReport = {
      totalItem: 0,
      totalOpenStock: 0,
      totalRcvQty: 0,
      totalSaleQty: 0,
      totalDeliveryQty: 0,
      totalSOH: 0,
    };
    this.page = 1;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }
    if (newProps.fieldSelected !== this.fieldSelected) {
      this.fieldSelected = newProps.fieldSelected;
    }
    if (newProps.itemReport !== this.itemReport) {
      this.itemReport = newProps.itemReport;
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

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  highLightText = (txt) => {
    if (txt === "A") {
      return "hl-red";
    } else if (txt === "B") {
      return "hl-yellow";
    } else {
      return "";
    }
  };

  render() {
    let items = this.items;

    // let data = items.sort(function(a, b){
    //     if(a.class < b.class) { return -1; }
    //     if(a.class > b.class) { return 1; }
    //     return 0;
    // });
    // let itemsIndex = data.length > 1 ? data.filter((el,i)=> (i >= (this.page - 1) * 30) && (i < this.page * 30) ) : data;
    let itemsIndex =
      items.length > 1
        ? items.filter(
            (el, i) => i >= (this.page - 1) * 30 && i < this.page * 30,
          )
        : items;

    return (
      <section
        id={this.idComponent}
        className="d-inline-block"
        style={{ width: "100%" }}
      >
        {items.length > 0 ? (
          <div className="text-right">
            <div className="d-inline-block">
              <Paging
                page={this.page}
                onClickPaging={this.handleClickPaging}
                onClickSearch={() => console.log()}
                itemCount={items.length}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          style={{
            maxHeight: "calc(100vh - 230px)",
            overflow: "auto",
            position: "relative",
          }}
        >
          <table className="table">
            <thead>
              <tr>
                <th className="fs-10">STT</th>
                <th className="fs-10">Store</th>
                <th className="fs-10">Supplier</th>
                <th className="fs-10">Category</th>
                <th className="fs-10">Item</th>

                <th className="fs-10 text-center">Open stock</th>
                <th className="fs-10 text-center">RCV qty</th>
                <th className="fs-10 text-center">Sale qty</th>
                <th className="fs-10 text-center">Delivery qty</th>
                <th className="fs-10 text-center">SOH</th>
              </tr>
            </thead>
            <tbody>
              {itemsIndex.map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td className="fs-10">{index + 1}</td>
                  <td className="fs-10">{item.storeCode}</td>
                  <td className="fs-10" style={{ background: "aliceblue" }}>
                    {item.supplierName}
                  </td>
                  <td className="fs-10" style={{ background: "aliceblue" }}>
                    {item.categoryName}
                  </td>
                  <td className="fs-10" style={{ background: "ivory" }}>
                    {item.itemCode} <br />
                    {item.itemName}
                  </td>
                  <td
                    style={{ background: "ivory" }}
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.openStock)
                    }
                  >
                    {StringHelper.formatValue(item.openStock)}
                  </td>
                  <td
                    style={{ background: "aliceblue" }}
                    className={
                      "fs-10 text-center " + this.handleHighlight(item.rcvQty)
                    }
                  >
                    {StringHelper.formatValue(item.rcvQty)}
                  </td>
                  <td
                    style={{ background: "ivory" }}
                    className={
                      "fs-10 text-center " + this.handleHighlight(item.saleQty)
                    }
                  >
                    {StringHelper.formatValue(item.saleQty)}
                  </td>
                  <td
                    style={{ background: "aliceblue" }}
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.deliveryQty)
                    }
                  >
                    {StringHelper.formatValue(item.deliveryQty)}
                  </td>
                  <td
                    style={{ background: "ivory" }}
                    className={
                      "fs-10 text-center " + this.handleHighlight(item.soh)
                    }
                  >
                    {StringHelper.formatValue(item.soh)}
                  </td>
                </tr>
              ))}
            </tbody>

            {itemsIndex.length > 0 ? (
              <tfoot>
                <tr>
                  <td colSpan={3} className="fs-10">
                    Total:
                  </td>

                  <td className="bd-none fs-10 text-center">
                    {StringHelper.formatQty(this.itemReport.totalItem)} items
                  </td>
                  <td className="bd-none fs-10 text-center">
                    {StringHelper.formatQty(this.itemReport.totalOpenStock)}
                  </td>
                  <td className="bd-none fs-10 text-center">
                    {StringHelper.formatQty(this.itemReport.totalRcvQty)}
                  </td>
                  <td className="bd-none fs-10 text-center">
                    {StringHelper.formatQty(this.itemReport.totalSaleQty)}
                  </td>
                  <td className="bd-none fs-10 text-center">
                    {StringHelper.formatQty(this.itemReport.totalDeliveryQty)}
                  </td>
                  <td className="bd-none fs-10 text-center">
                    {StringHelper.formatQty(this.itemReport.totalSOH)}
                  </td>
                </tr>
              </tfoot>
            ) : null}
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
