import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import SupplierDetailComp from "components/mainContent/supplier/detailSupplier/DetailSupplier";

export default class SupplierDetailPage extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.supplierDetailRef = React.createRef();
    this.supplierCode = this.props.supplierCode;
    this.type = this.props.type;
    this.distributorCode = this.props.distributorCode;
    this.handleSave = this.handleSave.bind(this);
    this.handleCreateDistributor = this.handleCreateDistributor.bind(this);
  }

  handleSave() {
    this.supplierDetailRef.current.handleSave();
  }

  handleCreateDistributor() {
    super.targetLink("/supplier/" + this.supplierCode + "/create");
  }

  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    actionLeftInfo.push({
      name: "Save",
      actionType: "save",
      action: this.handleSave,
      hide: false,
      actionName: "save",
    });

    //isAllowUpdateStatus
    actionRightInfo.push({
      name: "New Sub",
      actionType: "info",
      hide: this.type === "Update" ? false : true,
      action: this.handleCreateDistributor,
    });
    return (
      <Action
        leftInfo={actionLeftInfo}
        rightInfo={actionRightInfo}
        ref={this.actionRef}
      />
    );
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table hContainerTable">
          <SupplierDetailComp
            ref={this.supplierDetailRef}
            type={this.props.type}
            supplierCode={this.supplierCode}
            distributorCode={this.distributorCode}
          />
        </div>
      </>
    );
  }
}
