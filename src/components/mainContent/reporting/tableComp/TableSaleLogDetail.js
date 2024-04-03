import { DateHelper, StringHelper } from "helpers";
import React from "react";

export default class TableSaleLogDetail extends React.Component {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
  }

  handleReturnActionType = (value) => {
    switch (value) {
      case 0:
        return (
          <span
            className="badge bg-warning fs-9"
            style={{ padding: "3px 7px" }}
          >
            Trừ 1
          </span>
        );
      case 1:
        return (
          <span
            className="badge bg-success fs-9"
            style={{ padding: "3px 7px" }}
          >
            Thêm 1
          </span>
        );
      case 2:
        return (
          <span className="badge bg-info fs-9" style={{ padding: "3px 7px" }}>
            Cập nhật số lượng
          </span>
        );
      case 3:
        return (
          <span className="badge bg-danger fs-9" style={{ padding: "3px 7px" }}>
            Xóa số lượng
          </span>
        );
      default:
        return value;
    }
  };

  render() {
    let itemsIndex = this.props.items.sort(
      (a, b) => new Date(a.scannedDate) - new Date(b.scannedDate),
    );

    return (
      <section id={this.idComponent}>
        <div
          style={{
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <table className="table">
            <thead style={{ position: "sticky", top: 0 }}>
              <tr className="tr-sticky">
                <th className="no-sticky fs-10">Item</th>
                <th className="no-sticky fs-10">Action</th>
                <th className="no-sticky fs-10">Qty</th>
                <th className="no-sticky fs-10 rule-date">Time</th>
              </tr>
            </thead>

            <tbody>
              {itemsIndex.length > 0 &&
                itemsIndex.map((item, index) => (
                  <tr key={index}>
                    <td className="fs-10 ">
                      {item.itemCode}
                      <span className="xxl-dnone">
                        <br />
                      </span>{" "}
                      {item.itemName}
                    </td>
                    <td className="fs-10 ">
                      {this.handleReturnActionType(item.action)}
                    </td>
                    <td className="fs-10 text-right">
                      {StringHelper.formatQty(item.itemQty)}
                    </td>
                    <td className="fs-10 rule-date">
                      {DateHelper.displayTimeSecond(item.scannedDate)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {Object.keys(itemsIndex).length === 0 ? (
          <div className="table-message">Search ...</div>
        ) : (
          ""
        )}
      </section>
    );
  }
}
