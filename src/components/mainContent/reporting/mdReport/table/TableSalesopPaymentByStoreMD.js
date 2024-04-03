import React, { Component, Fragment } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faObjectUngroup } from "@fortawesome/free-solid-svg-icons";

export default class TableSalesopPaymentByStoreMD extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
    this.fieldSelected.storePaymentFilter = "";
    this.items = this.props.items || [];
    this.totalAll = {
      total: 0,
      payoo: 0,
      baemin: 0,
      cashAdvance: 0,
      creditCard: 0,
      eVoucher: 0,
      facePay: 0,
      gS25IntOrder: 0,
      goJek: 0,
      grab: 0,
      loShip: 0,
      memberShip: 0,
      moMo: 0,
      moca: 0,
      now: 0,
      ocb: 0,
      shopeePay: 0,
      smartPay: 0,
      sodexoGift: 0,
      sonKimCard: 0,
      vcb: 0,
      vnPay: 0,
      vnd: 0,
      zaloPay: 0,
      clingMe: 0,
    };

    this.totalStore = this.props.totalStore.total || {};
    this.total = this.props.total || {};
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.storePaymentFilter !== this.storePaymentFilter) {
      this.fieldSelected.storePaymentFilter = newProps.storePaymentFilter;
    }
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }
    if (newProps.total !== this.total) {
      this.total = newProps.total;
    }
    if (newProps.totalStore.total !== this.totalStore) {
      this.totalStore = newProps.totalStore.total;
    }
    this.refresh();
  };

  handleFilter = (arr) => {
    let lst = [];
    this.totalAll = {
      total: 0,
      payoo: 0,
      baemin: 0,
      cashAdvance: 0,
      creditCard: 0,
      eVoucher: 0,
      facePay: 0,
      gS25IntOrder: 0,
      goJek: 0,
      grab: 0,
      loShip: 0,
      memberShip: 0,
      moMo: 0,
      moca: 0,
      now: 0,
      ocb: 0,
      shopeePay: 0,
      smartPay: 0,
      sodexoGift: 0,
      sonKimCard: 0,
      vcb: 0,
      vnPay: 0,
      vnd: 0,
      zaloPay: 0,
      clingMe: 0,
    };

    if (arr) {
      if (this.fieldSelected.storePaymentFilter !== "") {
        lst = arr.filter(
          (el) => el.storeCode === this.fieldSelected.storePaymentFilter,
        );
      } else {
        lst = arr;
      }

      for (let k in lst) {
        let item = lst[k];

        this.totalAll.total += this.totalStore[item.storeCode];
        this.totalAll.payoo += item.payoo || 0;
        this.totalAll.baemin += item.baemin;
        this.totalAll.cashAdvance += item.cashAdvance;
        this.totalAll.creditCard += item.creditCard;
        this.totalAll.eVoucher += item.eVoucher;
        this.totalAll.facePay += item.facePay;
        this.totalAll.gS25IntOrder += item.gS25IntOrder;
        this.totalAll.goJek += item.goJek;
        this.totalAll.grab += item.grab;
        this.totalAll.loShip += item.loShip;
        this.totalAll.memberShip += item.memberShip;
        this.totalAll.moMo += item.moMo;
        this.totalAll.moca += item.moca;
        this.totalAll.now += item.now;
        this.totalAll.ocb += item.ocb;
        this.totalAll.shopeePay += item.shopeePay;
        this.totalAll.smartPay += item.smartPay;
        this.totalAll.sodexoGift += item.sodexoGift;
        this.totalAll.sonKimCard += item.sonKimCard;
        this.totalAll.vcb += item.vcb;
        this.totalAll.vnPay += item.vnPay;
        this.totalAll.vnd += item.vnd;
        this.totalAll.zaloPay += item.zaloPay;
        this.totalAll.clingMe += item.clingMe;
      }
    }

    return lst;
  };

  handleSum = (arr) => {
    let obj = {};

    for (let key in arr) {
      let item = arr[key];

      for (let key2 in item) {
        let item2 = item[key2];

        if (!obj[key2]) {
          obj[key2] = {};
          obj[key2].amount = 0;
        }

        obj[key2].amount += item2.amount;
      }
    }

    return obj;
  };

  handleSumTotal = (arr) => {
    let obj = {};

    for (let key in arr) {
      let item = arr[key];

      for (let key2 in item) {
        let item2 = item[key2];

        if (!obj[key2]) {
          obj[key2] = 0;
        }

        obj[key2] += item[key2];
      }
    }

    return obj;
  };

  render() {
    // let listStore = this.handleFilter(this.items);
    let listStore = this.items;
    let sum = this.handleSum(this.items);

    let total = this.total;

    let sumTotal = this.handleSumTotal(this.total);

    return (
      <section id={this.idComponent}>
        <div className="wrap-tb">
          <table
            className={
              "table table-hover d-block of-auto " +
              (listStore.length > 0 ? "mH-370" : "")
            }
            style={{ maxHeight: "calc(100vh - 238px)" }}
          >
            <thead>
              <tr>
                <th className="fs-10 pos-sticky" style={{ left: 0, zIndex: 2 }}>
                  Store
                </th>
                <th className="fs-10 rule-number">TT.Amount</th>
                <th className="fs-10 rule-number">TT.Trans</th>
                <th className="fs-10 rule-number">BAEMIN</th>
                <th className="fs-10 rule-number">CreditCard</th>
                <th className="fs-10 rule-number">FacePay</th>
                <th className="fs-10 rule-number">GO-JEK (Go-Viet)</th>
                <th className="fs-10 rule-number">Grab Order</th>
                <th className="fs-10 rule-number">Membership</th>
                <th className="fs-10 rule-number">NOW(ShopeeFood)</th>
                <th className="fs-10 rule-number">OCB-eBank</th>
                <th className="fs-10 rule-number">ShopeePay</th>
                <th className="fs-10 rule-number">SonKim Card </th>
                <th className="fs-10 rule-number">Tiền VND</th>
                <th className="fs-10 rule-number">VCB-eBank</th>
                <th className="fs-10 rule-number">Ví MOCA</th>
                <th className="fs-10 rule-number">Ví MOMO</th>
                <th className="fs-10 rule-number">Ví SmartPay</th>
                <th className="fs-10 rule-number">Ví VNPAY</th>
                <th className="fs-10 rule-number">Ví ZaloPay</th>
                <th className="fs-10 rule-number">e-Voucher</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(listStore).length > 0 &&
                Object.keys(listStore)
                  .sort()
                  .map((item, index) => (
                    <tr key={index}>
                      <td
                        className="fs-10 pos-sticky"
                        style={{ left: 0, background: "ivory" }}
                      >
                        {item}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(total[item]["TT.Amount"])}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(total[item]["TT.Trans"])}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["BAEMIN"] &&
                            listStore[item]["BAEMIN"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["CreditCard"] &&
                            listStore[item]["CreditCard"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["FacePay"] &&
                            listStore[item]["FacePay"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["GO-JEK (Go-Viet)"] &&
                            listStore[item]["GO-JEK (Go-Viet)"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["Grab Order"] &&
                            listStore[item]["Grab Order"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["Membership"] &&
                            listStore[item]["Membership"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["NOW(ShopeeFood)"] &&
                            listStore[item]["NOW(ShopeeFood)"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["OCB-eBank"] &&
                            listStore[item]["OCB-eBank"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["ShopeePay"] &&
                            listStore[item]["ShopeePay"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["SonKim Card"] &&
                            listStore[item]["SonKim Card"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["Tiền VND"] &&
                            listStore[item]["Tiền VND"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["VCB-eBank"] &&
                            listStore[item]["VCB-eBank"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["Ví MOCA"] &&
                            listStore[item]["Ví MOCA"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["Ví MOMO"] &&
                            listStore[item]["Ví MOMO"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["Ví SmartPay"] &&
                            listStore[item]["Ví SmartPay"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["Ví VNPAY"] &&
                            listStore[item]["Ví VNPAY"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["Ví ZaloPay"] &&
                            listStore[item]["Ví ZaloPay"].amount,
                        )}
                      </td>
                      <td className="fs-10 rule-number">
                        {StringHelper.formatPrice(
                          listStore[item]["e-Voucher"] &&
                            listStore[item]["e-Voucher"].amount,
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
            {Object.keys(listStore).length > 0 ? (
              <tfoot>
                <tr>
                  <td className="fs-10"></td>
                  <td className="fs-10 rule-number">
                    {sumTotal["TT.Amount"] &&
                      StringHelper.formatPrice(sumTotal["TT.Amount"])}
                  </td>
                  <td className="fs-10 rule-number">
                    {sumTotal["TT.Trans"] &&
                      StringHelper.formatPrice(sumTotal["TT.Trans"])}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["BAEMIN"] &&
                      StringHelper.formatPrice(sum["BAEMIN"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["CreditCard"] &&
                      StringHelper.formatPrice(sum["CreditCard"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["FacePay"] &&
                      StringHelper.formatPrice(sum["FacePay"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["GO-JEK (Go-Viet)"] &&
                      StringHelper.formatPrice(sum["GO-JEK (Go-Viet)"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["Grab Order"] &&
                      StringHelper.formatPrice(sum["Grab Order"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["Membership"] &&
                      StringHelper.formatPrice(sum["Membership"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["NOW(ShopeeFood)"] &&
                      StringHelper.formatPrice(sum["NOW(ShopeeFood)"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["OCB-eBank"] &&
                      StringHelper.formatPrice(sum["OCB-eBank"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["ShopeePay"] &&
                      StringHelper.formatPrice(sum["ShopeePay"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["SonKim Card"] &&
                      StringHelper.formatPrice(sum["SonKim Card"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["Tiền VND"] &&
                      StringHelper.formatPrice(sum["Tiền VND"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["VCB-eBank"] &&
                      StringHelper.formatPrice(sum["VCB-eBank"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["Ví MOCA"] &&
                      StringHelper.formatPrice(sum["Ví MOCA"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["Ví MOMO"] &&
                      StringHelper.formatPrice(sum["Ví MOMO"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["Ví SmartPay"] &&
                      StringHelper.formatPrice(sum["Ví SmartPay"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["Ví VNPAY"] &&
                      StringHelper.formatPrice(sum["Ví VNPAY"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["Ví ZaloPay"] &&
                      StringHelper.formatPrice(sum["Ví ZaloPay"].amount)}
                  </td>
                  <td className="fs-10 rule-number">
                    {sum["e-Voucher"] &&
                      StringHelper.formatPrice(sum["e-Voucher"].amount)}
                  </td>
                </tr>
              </tfoot>
            ) : null}
          </table>
          {listStore.length === 0 ? (
            <div className="table-message">Item not found</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}
