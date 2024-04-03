import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import MemberComp from "components/mainContent/loyalty/member";

export default class LoyaltyMember extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.memberCompRef = React.createRef();
  }

  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    //isAllowSave
    actionLeftInfo.push();

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
          <MemberComp type={this.props.type} ref={this.memberCompRef} />
        </div>
      </>
    );
  }
}
