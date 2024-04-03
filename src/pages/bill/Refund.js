import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import SearchProductOrder from "components/mainContent/bill/searchProductOrder";
import Action from "components/mainContent/Action";
import AccountState from "helpers/AccountState";
import { message } from "antd";

class Refund extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchPRORef = React.createRef();
  }

  handleCreate = () => {
    this.targetLink("/loyalty");
  };

  handleMoveBillManagement = () => {
    if (AccountState.getInstance().isAdmin()) {
      super.targetLink("/bill-management");
    } else {
      message.error("Permission denied");
    }
  };

  handleMoveRefundOrder = () => {
    if (AccountState.getInstance().isAdmin()) {
      super.targetLink("/refund-order");
    } else {
      message.error("Permission denied");
    }
  };

  handleMerge = () => {
    super.targetLink("/loyalty/merge");
  };

  handleReport = () => {
    super.targetLink("/loyalty/reporting");
  };

  handleNotify = () => {
    super.targetLink("/loyalty-notify");
  };

  handleRedeem = () => {
    super.targetLink("/loyalty/redeem-voucher");
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Loyalty",
        actionType: "info",
        action: this.handleCreate,
      },
      {
        name: "Merge",
        actionType: "info",
        action: this.handleMerge,
      },

      {
        name: "Notify",
        actionType: "info",
        action: this.handleNotify,
      },
      {
        name: "Claim Voucher",
        actionType: "info",
        action: this.handleRedeem,
      },
      {
        name: "Bill management",
        actionType: "info",
        action: this.handleMoveBillManagement,
      },
      // {
      //   name: 'Refund order',
      //   actionType: 'info',
      //   classActive: 'active',
      //   action: this.handleMoveRefundOrder,
      // },
    ];
    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table">
          <div className="col-md-12">
            <SearchProductOrder ref={this.searchPRORef} />
          </div>
        </div>
      </>
    );
  }
}

export default Refund;
