//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import CancelBillPage from "components/mainContent/reporting/searchComp/CancelBill";
import { StringHelper } from "helpers";

export default class CancelBill extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];
    this.idComponent =
      this.props.id || "detailPopup" + StringHelper.randomKey();

    this.isRender = true;
  }

  componentWillReceiveProps(newProps) {
    if (this.items !== newProps.items) {
      this.items = newProps.items;
    }
  }

  renderComp() {
    return (
      <section
        id={this.idComponent}
        className="popup-form"
        style={{ minWidth: 670, maxWidth: "65%", width: "auto" }}
      >
        <CancelBillPage items={this.items} />
      </section>
    );
  }
}
