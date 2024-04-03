import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import BillComp from "components/mainContent/bill/BillComp";
import AccountState from "helpers/AccountState";
import { message } from "antd";

export default class BillManagement extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMoveMember = () => {
    super.targetLink("/customer-service");
  };

  handleMoveBill = () => {
    if (AccountState.getInstance().isAdmin()) {
      super.targetLink("/bill-management-customer");
    } else {
      message.error("Permission denied");
    }
  };
  handleMoveCancelAccount = () => {
    super.targetLink("/request-cancel-accounts");
  };
  renderAction() {
    let actionLeftInfo = [
      {
        name: "Member search",
        actionType: "info",
        action: this.handleMoveMember,
      },
      {
        name: "Bill search",
        actionType: "info",
        action: this.handleMoveBill,
        classActive: "active",
      },
      {
        name: "Request cancel account",
        actionType: "info",
        action: this.handleMoveCancelAccount,
      },
    ];
    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        <div className="container-table">
          {this.renderAlert()}
          {this.renderAction()}
          <BillComp />
        </div>
      </>
    );
  }
}
