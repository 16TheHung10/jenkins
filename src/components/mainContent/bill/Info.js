import React from "react";
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import { message } from "antd";
import CONSTANT from "constant";
import BillModel from "models/BillModel";
import moment from "moment";

export default class Info extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = "info" + StringHelper.randomKey();
    this.isRender = true;
  }

  handleCancel = async () => {
    if (this.props.info.invoiceCode === "") {
      message.error("Please enter invoice code");
      return;
    }

    const confirm = window.confirm("Please confirm to cancel.");

    if (confirm) {
      let params = {
        billCode: this.props.info.invoiceCode,
      };

      let model = new BillModel();
      let response = await model.cancelBill(params);

      if (response.status) {
        message.success("succeeded!");
        this.props.reset();
      } else {
        message.error(response.message, "error");
      }

      this.refresh();
    }
  };

  renderType = (type) => {
    switch (type) {
      case "0":
        return <span className="label label-warning">Processing</span>;

      case "1":
        return <span className="label label-success">Done</span>;

      case "3":
        return <span className="label label-info">Return</span>;

      case "4":
        return <span className="label label-danger">Cancel</span>;

      default:
        return <span className="label label-default">Unknown</span>;
    }
  };

  renderComp() {
    let { info, list, payment } = this.props;

    return (
      <>
        <div className="">
          <div className="row">
            <div className="col-md-12">
              <div className="info-bill">
                <div className="head-bill">
                  <div className=" flex items-center justify-center">
                    <p className="text-center mr-10 color-gray">
                      Invoice code:{" "}
                      <strong data-group="counter" className="color-primary">
                        {info && info.invoiceCode}
                      </strong>
                    </p>
                    {info && info.customerCode ? (
                      <p className="text-center m-0 color-gray">
                        Customer code:{" "}
                        <strong data-group="counter" className="color-primary">
                          {info && info.customerCode}
                        </strong>
                      </p>
                    ) : null}
                  </div>

                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="rule-text"></td>
                        <td className="rule-text">
                          NV :{" "}
                          <span data-group="employee">
                            {info && info.employeeName}
                          </span>{" "}
                          -{" "}
                          <span data-group="counter">
                            {info && info.employeeCode}
                          </span>
                        </td>
                        <td className="rule-number">
                          <span data-group="billDate">
                            {info &&
                              moment(new Date(info.invoiceDate))
                                .utc()
                                .format(CONSTANT.FORMAT_DATE_IN_USE + " HH:mm")}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-infobill">
                  <table data-group="inforBillItem" className="table">
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
                      {list.map((item) => (
                        <tr>
                          <td className="rule-text">{item.itemName}</td>
                          <td>{item.qty}</td>
                          <td>{item.unitPrice}</td>
                          <td>{item.itemDiscount}</td>
                          <td className="rule-number">{item.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <hr />
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="rule-text">Tổng</td>
                        <td className="rule-number" data-group="billTotal">
                          {info && info.totalAmountBeforeDiscount}
                        </td>
                      </tr>
                      <tr>
                        <td className="rule-text">Chiết khấu hóa đơn</td>
                        <td className="rule-number" data-group="discount">
                          {info && info.discountAmount}
                        </td>
                      </tr>
                      <tr>
                        <td className="rule-text">Thành tiền</td>
                        <td className="rule-number" data-group="billTotalPrice">
                          {info && info.totalAmount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <hr />
                  {info &&
                  info.customerCode !== null &&
                  info.customerCode !== "" ? (
                    <>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>
                              <b>Hóa đơn có tích điểm</b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <hr />
                    </>
                  ) : null}

                  <table data-group="inforPayment" className="table">
                    <thead>
                      <tr>
                        <td className="rule-text">Loại TT:</td>
                        <td className="rule-number"></td>
                      </tr>
                    </thead>
                    <tbody>
                      {payment.map((item) => (
                        <tr>
                          <td className="rule-text">{item.paymentName}</td>
                          <td className="rule-number">
                            {StringHelper.formatPrice(item.paymentValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="row mrt-10 color-primary font-bold">
            <div className="col-md-12">
              {info.customerCode ? "Có tích điểm" : "Không tích điểm"}
            </div>{" "}
          </div>
          <div className="fw-bold cl-red">
            {info && info.invoiceType == 4 ? (
              info.cancelProcessing === 0 ? (
                <div className="row mrt-10">
                  {" "}
                  <div className="col-md-12">
                    Loại hóa đơn <span className="font-bold">hủy</span>
                  </div>{" "}
                </div>
              ) : null
            ) : null}
          </div>
        </div>

        {(info === undefined || Object.keys(info).length === 0) &&
        list.length === 0 &&
        payment.length === 0 ? (
          <div className="table-message">Item not found</div>
        ) : (
          ""
        )}
      </>
    );
  }
}
