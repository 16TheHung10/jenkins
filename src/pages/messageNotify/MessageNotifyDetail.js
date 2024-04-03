import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import MessageNotifyDetailComp from "components/mainContent/messageNotify/message-detail";

class MessageNotifyDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <div className="container-table pd-0">
          <MessageNotifyDetailComp
            id={this.props.id}
            groupType={this.props.groupType}
            task={this.props.task}
          />
        </div>
      </>
    );
  }
}

export default MessageNotifyDetail;
