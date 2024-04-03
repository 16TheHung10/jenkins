import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import ReportComp from "components/mainContent/loyalty/reporting";

export default class LoyaltyReport extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.reportCompRef = React.createRef();
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
          <ReportComp type={this.props.type} ref={this.reportCompRef} />
        </div>
      </>
    );
  }
}
