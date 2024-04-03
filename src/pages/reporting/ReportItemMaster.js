import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import ItemMasterReport from "components/mainContent/reporting/searchComp/ItemMaster";
import Action from "components/mainContent/Action";

export default class ReportItemMaster extends CustomAuthorizePage {
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
        classActive: "active",
        action: this.handleShowItemMaster,
      },
      {
        name: "Supplier master",
        actionType: "info",
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
        <ItemMasterReport type={this.props.type} />
      </>
    );
  }
}
