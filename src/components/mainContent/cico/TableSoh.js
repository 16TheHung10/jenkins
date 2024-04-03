import BaseComponent from "components/BaseComponent";
import React from "react";

export default class TableSoh extends BaseComponent {
  render() {
    let { data } = this.props;
    return (
      <section>
        <div className="wrap-table table-chart mhTable of-auto">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Store name</th>

                <th>Division name</th>
                <th>Group name</th>
                <th>Subcategory name</th>
                <th className="rule-number">Qty item</th>
                <th className="rule-number">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((elm, index) => (
                <tr key={index}>
                  <td>{elm.storeName || ""}</td>
                  <td>{elm.divisionName || ""}</td>
                  <td>{elm.groupName || ""}</td>
                  <td>{elm.subCategoryName || ""}</td>
                  <td className="rule-number">{elm.qtyItem || ""}</td>
                  <td className="rule-number">{elm.dateStr}</td>
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
