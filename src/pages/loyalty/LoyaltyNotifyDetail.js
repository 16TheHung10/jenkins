import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import MessageNotifyDetailComp from "components/mainContent/messageNotify/message-detail";

class LoyaltyNotifyDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
  }

  renderPage() {
    return (
      <div className="container-table">
        {this.renderAlert()}
        <LoyaltyNotifyDetailComp
          id={this.props.id}
          groupType={this.props.groupType}
          task={this.props.task}
        />
      </div>
    );
  }
}

export default LoyaltyNotifyDetail;
