//Plugin
import React, { Fragment } from "react";
import $ from "jquery";
import Paging from "external/control/pagination";
import Select from "react-select";

//Custom
import BaseComponent from "components/BaseComponent";
import DateHelper from "helpers/DateHelper";
import StringHelper from "helpers/StringHelper";
import CommonModel from "models/CommonModel";
import ItemModel from "models/ItemModel";

export default class EstimateStockTabLock extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent =
      this.props.idComponent || "tabLock" + StringHelper.randomKey();

    //Default data
    this.objItems = {};
    this.items = [];
    this.lstType = [];
    this.optLstType = [];
    this.data.stores = {};
    this.itemReportLock = [];

    this.isRender = true;
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {
    if (this.objItems !== newProps.items) {
      this.items = newProps.items;
      this.handleListType(this.items);
    }

    if (this.data.stores !== newProps.stores) {
      this.data.stores = newProps.stores;
    }

    if (this.itemReportLock !== newProps.itemReportLock) {
      this.itemReportLock = newProps.itemReportLock;
    }

    // this.refresh();
  }

  funcReturnLabel = (key) => {
    if (key === "rcv") {
      return "Receiving";
    } else if (key === "po") {
      return "Purchase order";
    } else {
      return key;
    }
  };

  handleListType = (arr) => {
    if (this.items && this.items.length > 0) {
      this.items &&
        this.items.forEach((element) => {
          if (!this.lstType.includes(element.type)) {
            this.lstType.push(element.type);
          }
        });

      let result = this.items.reduce(function (r, a) {
        let key = a.type;
        r[key] = r[key] || [];
        r[key].push(a);
        return r;
      }, Object.create(null));

      this.objItems = result;
      this.optLstType = this.lstType.map((el) => {
        return { label: this.funcReturnLabel(el), value: el };
      });
    } else {
      this.optLstType = [];
    }
  };

  openTab = (tab) => {
    var i;
    var x = document.getElementsByClassName("detail-tab-lock");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(tab).style.display = "block";
  };

  renderComp() {
    let items = this.objItems;

    return (
      <section
        id={this.idComponent}
        className="popup-form popup-form-additem"
        style={{ maxWidth: "65%" }}
      >
        <div className="form-filter">
          <div className="row" style={{ position: "relative", zIndex: 1 }}>
            <div className="col-md-8">
              <div className="tt-tbtab">
                {this.lstType.map((el, i) => (
                  <button key={i} onClick={() => this.openTab(el + "Lock")}>
                    {this.funcReturnLabel(el)}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th></th>
                      <th className="rule-number">SKU</th>
                      <th className="rule-number">Qty</th>
                      <th className="rule-number">Qty Res</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.itemReportLock &&
                      this.itemReportLock.map((el, i) => (
                        <Fragment key={i}>
                          <tr>
                            <th>{el.type}</th>
                            <td className="rule-number">
                              {StringHelper.formatQty(el.sku)}
                            </td>
                            <td className="rule-number">
                              {StringHelper.formatQty(el.qty)}
                            </td>
                            <td className="rule-number">
                              {StringHelper.formatQty(el.qtyRes)}
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row">
            {this.lstType.map((el, i) => (
              <div
                id={el + "Lock"}
                className="col-md-12 detail-tab-lock"
                key={i}
                style={i === 0 ? { display: "block" } : { display: "none" }}
              >
                <div>
                  <h3 style={{ position: "absolute", top: -70 }}>
                    {this.funcReturnLabel(el)}
                  </h3>
                  <div
                    className="wrap-table pp-additem"
                    style={{ overflow: "auto" }}
                  >
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th style={{ padding: "10px 20px" }} className="w10">
                            STT
                          </th>
                          <th style={{ padding: "10px 20px" }}>Code</th>
                          {el === "rcv" && (
                            <th style={{ padding: "10px 20px" }}>tf code</th>
                          )}
                          <th style={{ padding: "10px 20px" }}>Supplier</th>
                          <th
                            style={{ padding: "10px 20px" }}
                            className="rule-date"
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.objItems[el].map((item, i) => (
                          <tr
                            key={i}
                            data-group="itemContainer"
                            data-item-code={item.code}
                          >
                            <td
                              style={{ padding: "10px 20px" }}
                              className="w10"
                            >
                              {i + 1}
                            </td>
                            <td style={{ padding: "10px 20px" }}>
                              {item.code}
                            </td>
                            {el === "rcv" && (
                              <td style={{ padding: "10px 20px" }}>
                                {item.tfCode}
                              </td>
                            )}
                            <td style={{ padding: "10px 20px" }}>
                              {item.supplierName}
                            </td>
                            <td
                              style={{ padding: "10px 20px" }}
                              className="rule-date"
                            >
                              {DateHelper.displayDate(item.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {items.length === 0 ? (
                      <div className="table-message">Item not found</div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}
