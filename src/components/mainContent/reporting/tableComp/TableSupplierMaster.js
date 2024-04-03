import React, { Component } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import Paging from "external/control/pagination";
import SupplierItemDetail from "components/mainContent/reporting/popupComp/SupplierItemDetail";

export default class TableSupplierMaster extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
    this.idComponentDetail = "listDetail" + StringHelper.randomKey();
    this.items = [];
    this.itemsMaster = [];
    this.itemsDetail = [];
    this.fieldSelected = "";
    this.page = 1;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }
    if (newProps.itemsMaster !== this.itemsMaster) {
      this.itemsMaster = newProps.itemsMaster;
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

  styleResults = (value) => {
    if (value === "Scheduled") {
      return (
        <span
          className="btn-success"
          style={{ padding: 2, borderRadius: 2, margin: 2 }}
        >
          Yes
        </span>
      );
    } else {
      return (
        <span
          className="btn-org"
          style={{ padding: 2, borderRadius: 2, margin: 2 }}
        >
          No
        </span>
      );
    }
  };

  returnStyleOrderDay = (value) => {
    switch (value) {
      case "All":
        return "bg-secondary";
      case "Mo":
        return "bg-primary";
      case "Tu":
        return "bg-success";
      case "We":
        return "bg-danger";
      case "Th":
        return "bg-warning";
      case "Fr":
        return "bg-info";
      case "Sa":
        return "bg-dark";
      default:
        return "";
    }
  };

  styleOrderDay = (value) => {
    let arr = value.split("-");

    return (
      <div>
        {arr.map((el, i) => (
          <span
            key={i}
            className={this.returnStyleOrderDay(el)}
            style={{ padding: 2, borderRadius: 2, margin: 2 }}
          >
            {el}
          </span>
        ))}
      </div>
    );
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  handleFilter = (listItem) => {
    let list = listItem;

    if (this.fieldSelected) {
      if (this.fieldSelected.supplier !== "") {
        list = list.filter(
          (a) => a.supplierCode === this.fieldSelected.supplier,
        );
      }
      if (this.fieldSelected.orderSchedule !== "") {
        list = list.filter(
          (a) => a.orderScheduled === this.fieldSelected.orderSchedule,
        );
      }
      if (
        this.fieldSelected.orderDay.length > 0 &&
        this.fieldSelected.orderDay !== ""
      ) {
        list = list.filter((a) =>
          this.fieldSelected.orderDay.some((b) => a.orderDay.includes(b)),
        );
      }
    }
    return list;
  };

  handleViewItems = (supplierCode) => {
    let lstItem = this.itemsMaster.filter(
      (el) => el.supplierCode === supplierCode,
    );
    this.itemsDetail = lstItem;
    this.handleShowPp(this.idComponentDetail);
    this.refresh();
  };

  handleCheckHasItem = (supplierCode) => {
    let lstItem = this.itemsMaster.filter(
      (el) => el.supplierCode === supplierCode,
    );
    let result = "";
    if (lstItem.length > 0) {
      result = "";
    } else {
      result = "d-none";
    }

    return result;
  };

  render() {
    let items = this.handleFilter(this.items);
    let itemsIndex =
      items.length > 1
        ? items.filter(
            (el, i) => i >= (this.page - 1) * 30 && i < this.page * 30,
          )
        : items;

    return (
      <section id={this.idComponent}>
        <SupplierItemDetail
          id={this.idComponentDetail}
          items={this.itemsDetail}
        />
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
            style={{ maxHeight: "calc(100vh - 202px)", overflow: "auto" }}
          >
            <thead>
              <tr>
                <th>Supplier</th>
                <th></th>
                <th>Trading name </th>
                <th>TaxCode</th>
                <th className="text-center">MOV</th>
                <th className="text-center">
                  Order <br />
                  Lead time{" "}
                </th>
                <th>
                  Allow <br />
                  Order
                </th>
                <th>
                  Order <br />
                  Day{" "}
                </th>
                <th>Delivery to</th>
                <th></th>
                <th className="text-center">View list</th>
              </tr>
            </thead>
            <tbody>
              {itemsIndex.map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td style={{ background: "ivory" }}>{item.supplierCode}</td>
                  <td style={{ background: "ivory" }}>{item.supplierName}</td>
                  <td>{item.tradingName}</td>
                  <td>{item.taxCode}</td>
                  <td
                    className={"text-center " + this.handleHighlight(item.mov)}
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.mov)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.leadTime)
                    }
                  >
                    {StringHelper.formatValue(item.leadTime)}
                  </td>
                  <td>{this.styleResults(item.orderScheduled)}</td>
                  <td>{this.styleOrderDay(item.orderDay)}</td>
                  <td style={{ background: "ivory" }}>{item.deliveryBy}</td>
                  <td style={{ background: "ivory" }}>{item.deliveryName}</td>
                  <td>
                    <span
                      className={
                        "btn-success d-inline-block cursor btn-showpp " +
                        this.handleCheckHasItem(item.supplierCode)
                      }
                      style={{
                        padding: 2,
                        borderRadius: 2,
                        margin: 2,
                        background: "orangered",
                        whiteSpace: "nowrap",
                      }}
                      onClick={() => this.handleViewItems(item.supplierCode)}
                    >
                      View items
                    </span>
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
