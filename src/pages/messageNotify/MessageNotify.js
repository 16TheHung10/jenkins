import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import MessageNotifyComp from "components/mainContent/messageNotify/message";

class MessageNotify extends CustomAuthorizePage {
  constructor(props) {
    super(props);
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <div className="container-table pd-0">
          <MessageNotifyComp
            groupType={this.props.groupType}
            task={this.props.task}
          />
        </div>
      </>
    );
  }
}

export default MessageNotify;
