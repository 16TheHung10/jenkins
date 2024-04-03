import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import StoreDetailComp from "components/mainContent/store/detailStore/DetailStore";

export default class StoreDetailPage extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.storeDetailRef = React.createRef();
    this.storeCode = this.props.storeCode;
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    this.storeDetailRef.current.handleSave();
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
        {/* { this.renderAction() } */}
        <div className="container-table hContainerTable">
          <StoreDetailComp
            ref={this.storeDetailRef}
            type={this.props.type}
            storeCode={this.storeCode}
          />
        </div>
      </>
    );
  }
}
