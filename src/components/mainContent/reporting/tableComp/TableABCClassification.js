import React, { Component } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import Paging from "external/control/pagination";
import IconDownTrend from "images/arrow-trend-down-solid.svg";
import IconUpTrend from "images/arrow-trend-up-solid.svg";

export default class TableABCClassification extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
    this.items = [];
    this.fieldSelected = "";
    this.page = 1;
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

  handleFilter = (listItem) => {
    let list = listItem;

    if (this.fieldSelected) {
      if (this.fieldSelected.cat !== "") {
        list = list.filter(
          (e) => e.categoryName.toString() === this.fieldSelected.cat,
        );
      }

      if (this.fieldSelected.barcode !== "") {
        list = list.filter((a) => a.itemCode === this.fieldSelected.barcode);
      }

      if (this.fieldSelected.class !== "0") {
        list = list.filter((a) => a.class === this.fieldSelected.class);
      }
    }
    return list;
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

  showIconTrend = (classType) => {
    if (classType === "A" || classType === "B") {
      return <img src={IconUpTrend} alt="up trend" width={20} />;
    } else {
      return <img src={IconDownTrend} alt="down trend" width={20} />;
    }
  };

  render() {
    let items = this.handleFilter(this.items);

    let data = items.sort(function (a, b) {
      if (a.class < b.class) {
        return -1;
      }
      if (a.class > b.class) {
        return 1;
      }
      return 0;
    });
    let itemsIndex =
      data.length > 1
        ? data.filter(
            (el, i) => i >= (this.page - 1) * 30 && i < this.page * 30,
          )
        : data;

    return (
      <section id={this.idComponent}>
        <div className="wrap-table table-chart" style={{ overflow: "initial" }}>
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
            className={
              "table table-hover d-block " + (items.length > 0 && "mH-370")
            }
            style={{ maxHeight: "calc(100vh - 252px)", overflow: "auto" }}
          >
            <thead>
              <tr>
                <th>Category</th>
                <th>Item</th>
                <th></th>
                <th>Class</th>
                <th></th>
                <th className="text-center">
                  Suggestion <br />
                  order
                </th>
                <th className="text-center">
                  Last day <br />
                  sales
                </th>
                <th className="text-center">
                  Total <br />
                  qty
                </th>
                <th className="text-center">
                  Total <br />
                  sales
                </th>
              </tr>
            </thead>
            <tbody>
              {itemsIndex.map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td>{item.categoryName}</td>
                  <td style={{ background: "ivory" }}>{item.itemCode}</td>
                  <td style={{ background: "ivory" }}>{item.itemName}</td>
                  <td
                    className={"text-center " + this.highLightText(item.class)}
                  >
                    {item.class}
                  </td>
                  <td className={"text-center "}>
                    {this.showIconTrend(item.class)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.otpOrder)
                    }
                  >
                    {StringHelper.formatValue(item.otpOrder)}
                  </td>
                  <td
                    className={
                      "text-center " +
                      this.handleHighlight(item.lastDaySalesQty)
                    }
                  >
                    {StringHelper.formatValue(item.lastDaySalesQty)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.totalQty)
                    }
                  >
                    {StringHelper.formatValue(item.totalQty)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.totalAmount)
                    }
                  >
                    {StringHelper.formatValue(item.totalAmount)}
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
