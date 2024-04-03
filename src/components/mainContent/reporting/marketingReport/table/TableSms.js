import React from "react";
import BaseComponent from "components/BaseComponent";
import DateHelper from "helpers/DateHelper";
import StringHelper from "helpers/StringHelper";

class TableSms extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();

    this.isRender = true;
  }

  renderComp() {
    let { list, page, pageSize } = this.props || [];

    return (
      <>
        <section id={this.idComponent}>
          <div className="wrap-table htable">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>MessageID</th>
                  <th>Message</th>
                  <th>Description</th>
                  <th className="rule-date">Date</th>
                  <th>Date Str</th>
                  <th className="rule-number">Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((el, index) => (
                  <tr key={index}>
                    <td>{el.messageID}</td>
                    <td>{el.message}</td>
                    <td>{el.description}</td>
                    <td className="rule-date">
                      {DateHelper.displayDateTime(el.date)}
                    </td>
                    <td>{el.dateStr}</td>
                    <td className="rule-number">{el.phone}</td>
                    <td>{el.status ? "True" : "False"}</td>
                  </tr>
                )) ?? ""}
              </tbody>
            </table>
            {list.length <= 0 ? (
              <div className="table-message">Item not found</div>
            ) : (
              ""
            )}
          </div>
        </section>
      </>
    );
  }
}

export default TableSms;
