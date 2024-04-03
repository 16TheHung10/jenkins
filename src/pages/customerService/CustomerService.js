import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import CustomerServiceComp from "components/mainContent/customerService";
import Action from "components/mainContent/Action";
export default class CustomerService extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMoveMember = () => {
    super.targetLink("/customer-service");
  };

  handleMoveBill = () => {
    super.targetLink("/bill-management-customer");
  };
  handleMoveCancelAccount = () => {
    super.targetLink("/request-cancel-accounts");
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Member search",
        actionType: "info",
        classActive: "active",
        action: this.handleMoveMember,
      },
      {
        name: "Bill search",
        actionType: "info",
        action: this.handleMoveBill,
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
          <CustomerServiceComp />
        </div>
      </>
    );
  }
}
