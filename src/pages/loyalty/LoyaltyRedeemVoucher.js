import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import RedeemVoucherComp from "components/mainContent/loyalty/redeemVoucher";
import LoyaltyNav from "../../components/mainContent/loyalty/nav/LoyaltyNav";

export default class LoyaltyRedeemVoucher extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.highestPointRef = React.createRef();
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
          <LoyaltyNav>
            <RedeemVoucherComp
              type={this.props.type}
              ref={this.highestPointRef}
            />
          </LoyaltyNav>
        </div>
      </>
    );
  }
}
