import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper } from "helpers";
import React from "react";

export default class TableMomo extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
  }

  render() {
    let { data } = this.props;
    return (
      <section id={this.idComponent}>
        <div
          className="wrap-table table-chart"
          style={{ maxHeight: "350px", overflow: "auto" }}
        >
          <table className="table table-hover cl-chocolate">
            <thead>
              <tr>
                <th>Store code</th>
                <th>Type</th>
                <th className="rule-number">Amount</th>
                <th className="rule-date">Date</th>
                {/* <th>Request ID</th>
                                <th>Wallet ID</th> */}
              </tr>
            </thead>
            <tbody>
              {Object.keys(data).map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td>{data[item].storeCode}</td>
                  <td>{data[item].type}</td>
                  <td className="rule-number">
                    {StringHelper.formatQty(data[item].amount)}
                  </td>
                  <td className="rule-number">
                    {DateHelper.displayDateTime(data[item].date)}
                  </td>
                  {/* <td>{data[item].requestId}</td>
                                    <td>{data[item].walletId}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 ? (
            <div className="table-message">Item not found</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}
