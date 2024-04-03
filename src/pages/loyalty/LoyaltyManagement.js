import { message } from "antd";
import Action from "components/mainContent/Action";
import SearchComp from "components/mainContent/loyalty/search";
import AccountState from "helpers/AccountState";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import React from "react";
import LoyaltyNav from "../../components/mainContent/loyalty/nav/LoyaltyNav";

export default class LoyaltyManagement extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();

    // this.handleCreate = this.handleCreate.bind(this);
    this.handleMerge = this.handleMerge.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.handleNotify = this.handleNotify.bind(this);
    this.handleRedeem = this.handleRedeem.bind(this);
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
        classActive: "active",
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
        name: "Bill search",
        actionType: "info",
        action: this.handleMoveBillManagement,
      },
      // {
      //   name: 'Refund order',
      //   actionType: 'info',
      //   action: this.handleMoveRefundOrder,
      // },
    ];

    let actionRightInfo = [];

    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderAlert() {
    return <div className="wrap-alert"></div>;
  }

  renderPage() {
    return (
      <>
        <div className="container-table">
          {this.renderAlert()}
          {/* {this.renderAction()} */}
          <LoyaltyNav>
            <SearchComp ref={this.searchRef} type={this.props.type} />
          </LoyaltyNav>
        </div>
      </>
    );
  }
}
