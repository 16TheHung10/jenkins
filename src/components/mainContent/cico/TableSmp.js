import React from "react";
import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper } from "helpers";
export default class TableSmp extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = "listBillDetail" + StringHelper.randomKey();
  }

  render() {
    let { data, dataTT } = this.props;
    return (
      <section id={this.idComponent}>
        {/* {this.renderContextMenu()} */}
        <div className="wrap-table table-chart mhTable of-auto">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Store code</th>
                <th>Trans ID</th>
                <th>Type</th>
                <th>Provider</th>
                <th>Contract No</th>
                <th>Customer Phone</th>
                <th className="rule-number">Amount</th>
                <th className="rule-date">Date</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data).map((item, index) => (
                <tr key={index} data-group="itemGroup">
                  <td>{data[item].storeCode}</td>
                  <td>{data[item].transID}</td>
                  <td>{data[item].type}</td>
                  <td>{data[item].providerCode}</td>
                  <td>{data[item].contractNo}</td>
                  <td>{data[item].customerPhone}</td>
                  <td className="rule-number">
                    {StringHelper.formatQty(data[item].amount)}
                  </td>
                  <td className="rule-number">
                    {DateHelper.displayDateTime(data[item].date)}
                  </td>
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
