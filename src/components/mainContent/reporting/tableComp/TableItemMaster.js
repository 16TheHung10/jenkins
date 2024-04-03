import React, { Component } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import Paging from "external/control/pagination";
import { handleExportAutoField } from "helpers/ExportHelper";

export default class TableItemMaster extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
    this.items = [];
    // this.fieldSelected =  "";
    this.page = this.props.page || 1;
    this.type = this.props.type || "";
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }
    // if (newProps.fieldSelected !== this.fieldSelected) {
    //     this.fieldSelected = newProps.fieldSelected;
    // }

    this.page = 1;

    this.refresh();
  };

  handleHighlight = (qty) => {
    if (qty < 0) {
      return "cl-red";
    }
    return "";
  };

  styleTrueFalse = (value) => {
    if (value === true) {
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
        return "bg-secondary";
    }
  };

  styleOrderDay = (value) => {
    if (value) {
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
    }
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  // handleExport = () => {
  //     // let newArr = this.items.length > 1 ? this.items.filter((el,i)=> (i >= (this.page - 1) * 30) && (i < this.page * 30) ) : this.items;

  //     handleExportAutoField(this.items,"exportItemMaster");
  // }

  render() {
    let items = this.items;

    let itemsIndex =
      items.length > 1
        ? items.filter(
            (el, i) => i >= (this.page - 1) * 30 && i < this.page * 30,
          )
        : items;

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
            style={{ maxHeight: "calc(100vh - 257px)", overflow: "auto" }}
          >
            <thead style={{ position: "sticky", top: 0 }}>
              <tr>
                <th rowSpan={2}>Division </th>
                <th rowSpan={2}>Category </th>
                <th rowSpan={2} className="text-center">
                  Sub <br />
                  category{" "}
                </th>
                <th rowSpan={2}>Item</th>
                <th rowSpan={2}></th>
                <th rowSpan={2}>Unit</th>
                {this.type === "md" && (
                  <>
                    <th rowSpan={2} className="text-center">
                      Master <br />
                      cost
                    </th>
                    <th rowSpan={2} className="text-center">
                      Promotion <br />
                      cost price
                    </th>
                  </>
                )}
                <th rowSpan={2} className="text-center">
                  Sales <br />
                  price
                </th>
                <th rowSpan={2} className="text-center">
                  MOQ <br />
                  store
                </th>
                <th rowSpan={2} className="text-center">
                  MOQ <br />
                  WH{" "}
                </th>
                <th rowSpan={2} className="text-center">
                  Supplier
                </th>
                <th rowSpan={2} className="text-center"></th>
                <th rowSpan={2}>Delivery</th>
                <th rowSpan={2}></th>
                <th rowSpan={2} className="text-center">
                  MOV{" "}
                </th>
                <th colSpan={3} className="text-center brb-im">
                  Allowed{" "}
                </th>
                <th rowSpan={2}>
                  Order <br />
                  day{" "}
                </th>
                <th rowSpan={2} className="text-center">
                  Origin <br />
                  of goods
                </th>
                <th rowSpan={2} className="text-center">
                  Self <br />
                  declaration{" "}
                </th>
                <th rowSpan={2} className="text-center">
                  Preserved
                </th>
                <th rowSpan={2} className="text-center">
                  Expiry <br />
                  Date
                </th>
                <th rowSpan={2} className="text-center">
                  VAT in
                </th>
                <th rowSpan={2} className="text-center">
                  VAT out
                </th>
              </tr>
              <tr>
                <th>Sales</th>
                <th>Store order</th>
                <th>WH order</th>
              </tr>
            </thead>
            <tbody>
              {itemsIndex.map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td>{item.divitionName}</td>
                  <td>{item.categoryName}</td>
                  <td>{item.subCategoryName}</td>
                  <td style={{ background: "ivory" }}>{item.itemCode}</td>
                  <td style={{ background: "ivory" }}>{item.itemName}</td>
                  <td>{item.unit}</td>
                  {this.type === "md" && (
                    <>
                      <td
                        className={
                          "text-center " + this.handleHighlight(item.masterCost)
                        }
                        style={{ background: "ivory" }}
                      >
                        {StringHelper.formatValue(item.masterCost)}
                      </td>
                      <td
                        className={
                          "text-center " + this.handleHighlight(item.costPrice)
                        }
                        style={{ background: "ivory" }}
                      >
                        {StringHelper.formatValue(item.costPrice)}
                      </td>
                    </>
                  )}
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.salesPrice)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.salesPrice)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.moQ_Store)
                    }
                  >
                    {StringHelper.formatValue(item.moQ_Store)}
                  </td>
                  <td
                    className={
                      "text-center " + this.handleHighlight(item.moQ_WH)
                    }
                  >
                    {StringHelper.formatValue(item.moQ_WH)}
                  </td>
                  <td>{item.supplierCode}</td>
                  <td>{item.supplierName}</td>
                  <td style={{ background: "ivory" }}>{item.deliveryBy}</td>
                  <td style={{ background: "ivory" }}>{item.deliveryNameBy}</td>
                  <td
                    className={"text-center " + this.handleHighlight(item.mov)}
                  >
                    {StringHelper.formatValue(item.mov)}
                  </td>
                  <td className="text-center">
                    {this.styleTrueFalse(item.salesAllowed)}
                  </td>
                  <td className="text-center">
                    {this.styleTrueFalse(item.storeOrderAllowed)}
                  </td>
                  <td className="text-center">
                    {this.styleTrueFalse(item.whOrderAllowed)}
                  </td>
                  <td>{this.styleOrderDay(item.orderDay)}</td>
                  <td>{item.originOfGoods}</td>
                  <td>{item.selfDeclaration}</td>
                  <td>{item.preserved}</td>
                  <td>{item.expiryDate}</td>
                  <td className="text-center">{item.vatIn}</td>
                  <td className="text-center">{item.vatOut}</td>
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
