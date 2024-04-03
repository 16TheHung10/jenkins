import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";
import ListSupplierComp from "components/mainContent/supplier/listSupplier/ListSupplier";
import GuideLineComp from "components/mainContent/guideLine/GuideLine";

export default class SupplierManagement extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate() {
    super.targetLink("/supplier/create");
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "New",
        actionType: "info",
        action: this.handleCreate,
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
        <GuideLineComp type="supplier" />
        <div className="container-table hContainerTable">
          <ListSupplierComp />
        </div>
      </>
    );
  }
}
