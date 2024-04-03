import React from "react";
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
export default class ListImRegionDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];
    this.regions = this.props.regions || [];
    this.data.suppliers = this.props.suppliers || {};

    this.idComponent = "listImRegionDetail" + StringHelper.randomKey();

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

      if (this.data.suppliers !== newProps.suppliers) {
        this.data.suppliers = newProps.suppliers;
      }

      this.refresh();
    }
  };

  handleGetRegionName = (code) => {
    let region = this.regions.filter((el) => el.regionCode === code);
    let name = region[0] ? region[0].regionName : "";
    return name;
  };

  handleGetNameSupplier = (code) => {
    let suppliers = Object.values(this.data.suppliers).filter(
      (item) => item.supplierCode === code,
    );
    let name = suppliers[0] ? suppliers[0].supplierName : "";
    return name;
  };

  handleReturnLabelTrueFalse = (value) => {
    switch (value) {
      case true:
        return <span className="label label-success">Yes</span>;
      default:
        return <span className="label label-danger">No</span>;
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
                <th className="rule-number">
                  <span style={{ whiteSpace: "break-spaces" }}>
                    Selling price
                  </span>
                </th>
                <th>
                  <span style={{ whiteSpace: "break-spaces" }}>
                    Supplier region
                  </span>
                </th>
                <th className="rule-number">
                  <span style={{ whiteSpace: "break-spaces" }}>
                    Cost price region
                  </span>
                </th>
                <th className="rule-number">
                  <span style={{ whiteSpace: "break-spaces" }}>
                    Return Goods{" "}
                  </span>
                </th>
                <th>
                  <span style={{ whiteSpace: "break-spaces" }}>
                    Allow order
                  </span>
                </th>
                <th>
                  <span style={{ whiteSpace: "break-spaces" }}>
                    Allow return
                  </span>
                </th>
                <th>
                  <span style={{ whiteSpace: "break-spaces" }}>
                    Calculate inventory
                  </span>
                </th>
                <th>
                  <span style={{ whiteSpace: "break-spaces" }}>Sold</span>
                </th>
                {/* <th className="rule-date"><span style={{whiteSpace: "break-spaces"}}>Updated date</span></th> */}
                {/* <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Capital gain yield</span></th>*/}
                {/* <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Entry price</span></th>
                                <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Entry price max</span></th>
                                <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Entry price min</span></th>
                                <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Exit price</span></th>  */}
                {/* <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Qty inventory max</span></th>
                                <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Qty inventory min</span></th>
                                <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Qty sale max</span></th>
                                <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Qty sale min</span></th> 
                                <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Margin</span></th> */}
                {/* <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Selling gain yield</span></th> */}
                {/* <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Whole sale margin</span></th> */}
                {/* <th className="rule-number"><span style={{whiteSpace: "break-spaces"}}>Whole sale price</span></th> */}
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
                  <td className="text-center">
                    {StringHelper.formatPrice(item.salePrice)}
                  </td>
                  <td>{this.handleGetNameSupplier(item.supplierCodeRegion)}</td>
                  <td className="text-center">
                    {StringHelper.formatPrice(item.costPriceRegion)}
                  </td>
                  <td className="text-center">{item.payingBackDay}</td>
                  <td className="text-center">
                    {this.handleReturnLabelTrueFalse(item.isAllowEntryOrder)}
                  </td>
                  <td className="text-center">
                    {this.handleReturnLabelTrueFalse(item.isAllowPayingBack)}
                  </td>
                  <td className="text-center">
                    {this.handleReturnLabelTrueFalse(item.isCalculateInventory)}
                  </td>
                  <td className="text-center">
                    {this.handleReturnLabelTrueFalse(item.isSold)}
                  </td>
                  {/* <td className="rule-date">{DateHelper.displayDateTime(item.updatedDate)}</td> */}
                  {/* <td className="rule-number">{item.capitalGainYield}</td> */}
                  {/* <td className="rule-number">{item.entryPrice}</td>
                                    <td className="rule-number">{item.entryPriceMax}</td>
                                    <td className="rule-number">{item.entryPriceMin}</td>
                                    <td className="rule-number">{item.exitPrice}</td> */}
                  {/* <td className="rule-number">{item.quantityInventoryMax}</td>
                                    <td className="rule-number">{item.quantityInventoryMin}</td>
                                    <td className="rule-number">{item.quantitySaleMax}</td>
                                    <td className="rule-number">{item.quantitySaleMin}</td> 
                                    <td className="rule-number">{item.retailMargin}</td> */}

                  {/* <td className="rule-number">{item.sellingGainYield}</td> */}

                  {/* <td className="rule-number">{item.wholesaleMargin}</td> */}
                  {/* <td className="rule-number">{item.wholesalePrice}</td> */}
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
