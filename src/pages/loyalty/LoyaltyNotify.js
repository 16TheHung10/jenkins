import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import LoyaltyNotifyComp from "components/mainContent/loyalty/message";
import LoyaltyNav from "../../components/mainContent/loyalty/nav/LoyaltyNav";

class LoyaltyNotify extends CustomAuthorizePage {
  constructor(props) {
    super(props);
  }

  renderPage() {
    return (
      <div className="container-table">
        {this.renderAlert()}
        <LoyaltyNav>
          <LoyaltyNotifyComp
            groupType={this.props.groupType}
            task={this.props.task}
          />
        </LoyaltyNav>
      </div>
    );
  }
}

export default LoyaltyNotify;
