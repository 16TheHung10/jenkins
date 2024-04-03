//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";

import TableDiscountByCombo from "components/mainContent/promotion/report/TableDiscountByCombo";
import TableDiscountByGroupItem from "components/mainContent/promotion/report/TableDiscountByGroupItem";
import TableBuyItemGetItem from "components/mainContent/promotion/report/TableBuyItemGetItem";
import TableDiscountByItem from "components/mainContent/promotion/report/TableDiscountByItem";

export default class TableGeneral extends BaseComponent {
  constructor(props) {
    super(props);

    this.type = this.props.type || "";
    this.dataTable = this.props.dataTable || {};

    this.isRender = true;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps && newProps.type) {
      this.type = this.props.type;
      this.refresh();
    }

    if (newProps && newProps.dataTable) {
      this.dataTable = newProps.dataTable;
      this.refresh();
    }
  };

  renderTable = (type) => {
    switch (type) {
      case "Discount by combo":
        return <TableDiscountByCombo dataTable={this.dataTable} />;

      case "Discount by group item":
        return <TableDiscountByGroupItem dataTable={this.dataTable} />;

      case "Buy item get item":
        return <TableBuyItemGetItem dataTable={this.dataTable} />;

      case "Discount by item":
        return <TableDiscountByItem dataTable={this.dataTable} />;

      default:
        return <TableDiscountByCombo dataTable={this.dataTable} />;
    }
  };

  renderComp = () => {
    let { type } = this.props;

    return <>{this.renderTable(type)}</>;
  };
}
