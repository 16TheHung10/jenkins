import React, { Component, Fragment } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";

import { fnObjGroup } from "helpers/FuncHelper";

export default class TableSumByPayment extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();

    this.items = [];
    this.totalAll = {
      amount: 0,
    };
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }

    this.refresh();
  };

  handleFilter = (arr) => {
    let lst = [];
    this.totalAll = {
      trans: 0,
      amount: 0,
    };

    if (arr) {
      lst = arr;

      for (let k in lst) {
        let item = lst[k];
        this.totalAll.amount += item.amount;
        this.totalAll.trans += item.billCount;
      }
    }

    return lst;
  };

  render() {
    let items = this.handleFilter(this.items);
    items.sort(function (a, b) {
      if (a.storeCode < b.storeCode) {
        return -1;
      }
      if (a.storeCode > b.storeCode) {
        return 1;
      }
      return 0;
    });

    let objItems = {};

    for (let key in items) {
      let item = items[key];

      if (!objItems[item.storeCode]) {
        objItems[item.storeCode] = {};
        objItems[item.storeCode].details = {};
        objItems[item.storeCode].trans = {};
      }

      if (!objItems[item.storeCode].details[item.paymentMethodName]) {
        objItems[item.storeCode].details[item.paymentMethodName] = 0;
      }

      if (!objItems[item.storeCode].trans[item.paymentMethodName]) {
        objItems[item.storeCode].trans[item.paymentMethodName] = 0;
      }

      objItems[item.storeCode].details[item.paymentMethodName] += item.amount;
      objItems[item.storeCode].trans[item.paymentMethodName] +=
        item.billCount || 0;

      objItems[item.storeCode].details = Object.fromEntries(
        Object.entries(objItems[item.storeCode].details).sort(function (a, b) {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        }),
      );
    }
    return (
      <section id={this.idComponent}>
        <div className="wrap-tb table-chart">
          <table
            className={
              "table table-hover d-block of-auto " +
              (items.length > 0 ? "mH-370" : "")
            }
            style={{ maxHeight: "calc(100vh - 238px)" }}
          >
            <thead>
              <tr>
                <th>Store</th>
                <th>Payment</th>
                <th className="rule-number">Transaction</th>
                <th className="rule-number">TT.Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(objItems).map((el, i) => (
                <Fragment key={i}>
                  <tr>
                    <td
                      className="fs-10"
                      rowSpan={Object.keys(objItems[el].details).length + 1}
                      style={{ background: "ivory" }}
                    >
                      {el}
                    </td>
                  </tr>
                  {objItems[el].details &&
                  Object.keys(objItems[el].details).length > 0
                    ? Object.keys(objItems[el].details).map((item, index) => (
                        <tr key={i + item.storeCode + item + index}>
                          <td className="fs-10">{item}</td>
                          <td className="fs-10 rule-number">
                            {StringHelper.formatQty(objItems[el].trans[item])}
                          </td>
                          <td className="fs-10 rule-number">
                            {StringHelper.formatQty(objItems[el].details[item])}
                          </td>
                        </tr>
                      ))
                    : null}
                </Fragment>
              ))}
            </tbody>

            {items.length > 0 ? (
              <tfoot>
                <tr>
                  <td className="fs-10" style={{ background: "#007cff" }}>
                    Total
                  </td>
                  <td></td>
                  <td className="fs-10 rule-number">
                    {StringHelper.formatPrice(this.totalAll.trans)}
                  </td>
                  <td className="fs-10 rule-number">
                    {StringHelper.formatPrice(this.totalAll.amount)}
                  </td>
                </tr>
              </tfoot>
            ) : null}
          </table>
          {items.length === 0 ? (
            <div className="table-message">Item not found</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}
