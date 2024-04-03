//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper } from "helpers";

export default class CheckLossDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.item = [];
    this.idComponent =
      this.props.id || "detailCheckPopup" + StringHelper.randomKey();

    this.isRender = true;
  }

  componentWillReceiveProps(newProps) {
    if (this.item !== newProps.item) {
      this.item = newProps.item;
    }
    this.refresh();
  }

  handleHighlight = (qty) => {
    if (qty < 0) {
      return "cl-red";
    }
    return "";
  };

  handleFilter = (arrItems) => {
    let lst =
      this.fieldSelected.cat !== ""
        ? arrItems.filter((el) => el.categoryName === this.fieldSelected.cat)
        : arrItems;
    lst =
      this.fieldSelected.barcode !== ""
        ? lst.filter((el) => el.itemCode === this.fieldSelected.barcode)
        : lst;

    return Object.values(lst);
  };

  handleSumLoss = (lst) => {
    if (lst) {
      this.sum = {
        qtyHave: 0,
        qtyLoss: 0,
      };

      for (let key in lst) {
        let item = lst[key];
        if (item.lossQty >= 0) {
          this.sum.qtyLoss += item.lossQty;
        } else {
          this.sum.qtyHave += item.lossQty;
        }
      }
    }
  };

  renderComp() {
    return (
      <section
        id={this.idComponent}
        className="popup-form"
        style={{ minWidth: 420, maxWidth: "65%", width: "auto" }}
      >
        <div className="wrap-table mrt-5" style={{ overflow: "auto" }}>
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
                <th className="fs-10">Category</th>
                <th className="fs-10">Item code</th>
                <th className="fs-10">Item name</th>
                <th className="fs-10 text-center">Date</th>
                <th className="fs-10 text-center">
                  Open <br />
                  stock
                </th>
                <th className="fs-10 text-center">Sales</th>
                <th className="fs-10 text-center">
                  RCV <br />
                  stock
                </th>
                <th className="fs-10 text-center">
                  Internal <br />
                  RCV
                </th>
                <th className="fs-10 text-center">Transfer</th>
                <th className="fs-10 text-center">Disposal</th>
                <th className="fs-10 text-center">StoreUsed</th>
                <th className="fs-10 text-center">Return</th>
                <th className="fs-10 text-center">Lost</th>
                <th className="fs-10 text-center">
                  Stock <br />
                  balance
                </th>
                <th className="fs-10 text-center">
                  Close <br />
                  stock
                </th>
              </tr>
            </thead>
            <tbody>
              {this.item.map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td className="fs-10" style={{ background: "antiquewhite" }}>
                    {item.categoryName}
                  </td>
                  <td className="fs-10" style={{ background: "antiquewhite" }}>
                    {item.itemCode}
                  </td>
                  <td className="fs-10" style={{ background: "antiquewhite" }}>
                    <span style={{ maxWidth: 280, display: "inline-block" }}>
                      {item.itemName}
                    </span>
                  </td>
                  <td className="fs-10">{DateHelper.displayDate(item.date)}</td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.openingStock)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.openingStock)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " + this.handleHighlight(item.salesQty)
                    }
                    style={{ background: "antiquewhite" }}
                  >
                    {StringHelper.formatValue(item.salesQty)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.receivingStock)
                    }
                    style={{ background: "antiquewhite" }}
                  >
                    {StringHelper.formatValue(item.receivingStock)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.receivingInternalStock)
                    }
                    style={{ background: "antiquewhite" }}
                  >
                    {StringHelper.formatValue(item.receivingInternalStock)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.intTransferQty)
                    }
                    style={{ background: "antiquewhite" }}
                  >
                    {StringHelper.formatValue(item.intTransferQty)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.disposalQty)
                    }
                  >
                    {StringHelper.formatValue(item.disposalQty)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.storeUsedQty)
                    }
                  >
                    {StringHelper.formatValue(item.storeUsedQty)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.returnSupplierQty)
                    }
                  >
                    {StringHelper.formatValue(item.returnSupplierQty)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " + this.handleHighlight(item.lossQty)
                    }
                  >
                    {StringHelper.formatValue(item.lossQty)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.stockBalanceQty)
                    }
                  >
                    {StringHelper.formatValue(item.stockBalanceQty)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.closingQty)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.closingQty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {this.item.length === 0 && this.isSearch ? (
            <div className="table-message">Please search ...</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}
