import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import SupplierMasterReport from "components/mainContent/reporting/searchComp/SupplierMaster";
import Action from "components/mainContent/Action";

export default class SupplierMaster extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleShowItemMaster() {
    super.targetLink("/report-item-master");
  }
  handleShowSupplierMaster() {
    super.targetLink("/supplier-master");
  }
  handleShowABCclassification() {
    super.targetLink("/report-abc-classification");
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Item master",
        actionType: "info",
        action: this.handleShowItemMaster,
      },
      {
        name: "Supplier master",
        actionType: "info",
        classActive: "active",
        action: this.handleShowSupplierMaster,
      },
      {
        name: "ABC classification",
        actionType: "info",
        action: this.handleShowABCclassification,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}

        <SupplierMasterReport type={this.props.type} />
      </>
    );
  }
}
