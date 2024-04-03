//Plugin
import React from "react";
import $ from "jquery";

//Custom
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import ReportingModel from "models/ReportingModel";
import DateHelper from "helpers/DateHelper";

class CheckBill extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = "";
    this.bill = "";
    this.payment = "";
    this.billDetail = [];
    this.idComponent =
      this.props.idComponent || "checkBilltemPopup" + StringHelper.randomKey();
    this.isRender = true;
  }

  handleShow = () => {
    $("#" + this.idComponent).show();
  };

  handleLoadItemsResult = (invoiceId) => {
    let model = new ReportingModel();
    model.getBillItem(invoiceId).then((res) => {
      this.items = res.data || "";
      this.bill = this.items.bill || "";
      this.billDetail = this.items.billDetail || [];
      this.payment = this.items.payment || "";
      this.handleShow();
      this.refresh();
    });
  };

  renderComp = () => {
    let paymentName = "";
    let paymentNum = "";
    let paymentAmount = "";
    for (let i = 0; i < this.payment.length; i++) {
      paymentName = this.payment[i].paymentName;
      paymentNum = this.payment[i].number;
      paymentAmount = this.payment[i].paymentAmount;
    }

    let arrVat = [];
    this.billDetail.forEach((element) => {
      if (arrVat[element["vat"]] === undefined) {
        arrVat[element["vat"]] = element["vatAmount"];
      } else {
        arrVat[element["vat"]] += element["vatAmount"];
      }
    });

    return (
      <section id={this.idComponent} className="popup-form w-auto">
        <div className="wrap-table" style={{ padding: "10px 0" }}>
          <div className="info-bill">
            <div className="head-bill">
              <table className="table">
                <tbody>
                  <tr>
                    <td className="rule-text">Quầy : {this.bill.counter}</td>
                    <td className="rule-text">NV : {this.bill.employee}</td>
                    <td className="rule-number">
                      {DateHelper.displayDateTime(this.bill.date)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-infobill">
              <table
                data-group="inforBillItem"
                className="table"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th className="rule-text">Tên</th>
                    <th>S.Lượng</th>
                    <th>Đơn giá</th>
                    <th>CK</th>
                    <th className="rule-number">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {this.billDetail.length !== 0
                    ? this.billDetail.map((item, index) => (
                        <tr key={index}>
                          <td className="rule-text">{item.itemName}</td>
                          <td>{item.qty}</td>
                          <td>{item.salesPrice}</td>
                          <td>{item.discountAmountItem}</td>
                          <td className="rule-number">
                            {item.totalAmountItem}
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
              <hr />
              <table className="table" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td className="rule-text">Tổng</td>
                    <td className="rule-number" data-group="billTotal">
                      {this.bill.totalAmount}
                    </td>
                  </tr>
                  <tr>
                    <td className="rule-text">Chiết khấu hóa đơn</td>
                    <td className="rule-number" data-group="discount">
                      {this.bill.discountAmount}
                    </td>
                  </tr>
                  <tr>
                    <td className="rule-text">Thành tiền</td>
                    <td className="rule-number" data-group="billTotalPrice">
                      {this.bill.afterDiscount}
                    </td>
                  </tr>
                  <tr>
                    <td className="rule-text">Tiền khách trả</td>
                    <td className="rule-number" data-group="billPaid">
                      {this.bill.payCustomer}
                    </td>
                  </tr>
                  <tr>
                    <td className="rule-text">Tiền trả lại cho khách</td>
                    <td className="rule-number" data-group="billReturn">
                      {this.bill.customerReturnAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr />
              <table
                data-group="inforBillVAT"
                className="table"
                style={{ width: "100%" }}
              >
                <tbody>
                  {arrVat.length !== 0
                    ? Object.keys(arrVat).map((item, index) => (
                        <tr key={index}>
                          <td className="rule-text">VAT {item}%</td>
                          <td className="rule-number">{arrVat[item]}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
              <table
                data-group="inforPayment"
                className="table"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <td className="rule-text">Loại TT:</td>
                    <td className="rule-number"></td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="rule-text">
                      {paymentName} {paymentNum}
                    </td>
                    <td className="rule-number">{paymentAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  };
}

export default CheckBill;
