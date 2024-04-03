import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import ItemMasterReport from "components/mainContent/reporting/mdReport/search/ItemMaster";
import Action from "components/mainContent/Action";

export default class ReportItemMasterMD extends CustomAuthorizePage {
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
        classActive: "active",
        action: this.handleShowItemMaster,
      },
      {
        name: "Supplier master",
        actionType: "info",
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
        <ItemMasterReport type={this.props.type} />
      </>
    );
  }
}
