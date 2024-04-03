import React from "react";
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
export default class ListImOrderDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];
    this.regions = this.props.regions || [];

    this.idComponent = "listImOrderDetail" + StringHelper.randomKey();

    this.isRender = true;
  }

  componentDidMount() {}

  componentWillReceiveProps = (newProps) => {
    if (newProps) {
      if (newProps.items) {
        this.items = newProps.items;
      }
      if (newProps.regions) {
        this.regions = newProps.regions;
      }

      this.refresh();
    }
  };

  handleGetRegionName = (code) => {
    let region = this.regions.filter((el) => el.regionCode === code);
    let name = region[0] ? region[0].regionName : "";
    return name;
  };

  handleReturnLabelTrueFalse = (value) => {
    switch (value) {
      case true:
        return <span className="label label-success"></span>;
      default:
        return <span className="label label-danger"></span>;
    }
  };

  renderComp() {
    let items = this.items;

    return (
      <section id={this.idComponent}>
        <div
          className="wrap-table popup-form-additem"
          style={{ overflow: "auto", maxHeight: "calc(100vh - 170px)" }}
        >
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Region</th>
                {/* <th className="text-center">Qty order min</th> */}
                <th className="text-center">Qty order max</th>
                <th className="text-center">MOQ</th>
                {/* <th>Delivery method</th> */}
                {/* <th>Is return supplier</th> */}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  data-group="itemGroup"
                  className={"eachItem"}
                  data-itemid={item.itemID}
                >
                  <td>{this.handleGetRegionName(item.regionCode)}</td>
                  {/* <td className="text-center">{StringHelper.formatQty(item.quantityOrderMin)}</td> */}
                  <td className="text-center">
                    {StringHelper.formatQty(item.quantityOrderMax)}
                  </td>
                  <td className="text-center">
                    {StringHelper.formatQty(item.arithmeticProgression)}
                  </td>
                  {/* <td>{item.deliveryMethod}</td> */}
                  {/* <td>{this.handleReturnLabelTrueFalse(item.isReturnSupplier)}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
          {items.length == 0 ? (
            <div className="table-message">No Data</div>
          ) : (
            ""
          )}
        </div>
        <div data-group="popupContainer" className="popup-container"></div>
      </section>
    );
  }
}
