import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import SatffDetailComp from "components/mainContent/staff/detailStaff";

export default class SatffDetailPage extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchDetailRef = React.createRef();
    this.staffCode = this.props.staffCode;
    this.statusStaff = this.props.status;
    this.storeCode = this.props.storeCode;
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    this.searchDetailRef.current.handleSave();
  }

  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    actionLeftInfo.push(
      {
        name: "Save",
        actionType: "save",
        action: this.handleSave,
        hide: false,
        actionName: "save",
      },
      // {
      //   "name" : "Create Voucher",
      //   "actionType": "save",
      //   "action" : this.handleCreateVoucher,
      //   "hide" : false,
      //   "actionName":"save"
      // }
    );

    //isAllowUpdateStatus
    actionRightInfo.push();
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
          <SatffDetailComp
            type={this.props.type}
            staffCode={this.staffCode}
            ref={this.searchDetailRef}
            status={this.statusStaff}
            storeCode={this.storeCode}
          />
        </div>
      </>
    );
  }
}
