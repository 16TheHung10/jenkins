import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import SupplierMasterReport from "components/mainContent/reporting/mdReport/search/SupplierMaster";
import Action from "components/mainContent/Action";

export default class SupplierMasterMD extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleShowItemMaster() {
    super.targetLink("/md-report-item-master");
  }
  handleShowSupplierMaster() {
    super.targetLink("/md-supplier-master");
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
