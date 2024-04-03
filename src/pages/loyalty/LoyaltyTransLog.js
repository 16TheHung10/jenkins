import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import TransLogComp from "components/mainContent/loyalty/transLog";

export default class LoyaltyTransLog extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.transLogCompRef = React.createRef();
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
          <TransLogComp type={this.props.type} ref={this.transLogCompRef} />
        </div>
      </>
    );
  }
}
