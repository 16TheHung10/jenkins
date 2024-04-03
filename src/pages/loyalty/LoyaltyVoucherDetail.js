import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import SearchDetail from "components/mainContent/loyalty/searchDetail";

export default class LoyaltyVoucherDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.memberCode = this.props.memberCode || "";
    this.searchDetailRef = React.createRef();

    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    this.searchDetailRef.current.handleSave();
  }

  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    //isAllowSave
    actionLeftInfo.push({
      name: "Save",
      actionType: "save",
      action: this.handleSave,
      hide: false,
      actionName: "save",
    });

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
        <div className="container-table">
          {this.renderAlert()}
          {this.renderAction()}
          <SearchDetail
            type={this.props.type}
            memberCode={this.memberCode}
            ref={this.searchDetailRef}
          />
        </div>
      </>
    );
  }
}
