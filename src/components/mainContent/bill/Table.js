import React from "react";
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
export default class Table extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();

    this.isRender = true;
  }

  renderComp() {
    let { list } = this.props || [];
    let { info } = this.props || {};

    return (
      <>
        <section id={this.idComponent}>
          <div className="wrap-table htable mrt-10">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Code</th>
                  <th className="rule-number">Value</th>
                </tr>
              </thead>
              <tbody>
                {list.map((el, index) => (
                  <tr
                    key={index}
                    className={info.code === el.code && "bg-warning"}
                  >
                    <td>{index + 1}</td>
                    <td>{el.code}</td>
                    <td className="rule-number">
                      {StringHelper.formatPrice(el.value)}
                    </td>
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
