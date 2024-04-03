import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import SMSComp from "components/mainContent/sms";
import SMSReport from "../../components/mainContent/sms/smsReport/SMSReport";

class SMS extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.refComp = React.createRef();
  }

  handleSendImport = () => {
    this.refComp.current.handleSendImport();
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Send",
        actionType: "save",
        action: this.handleSendImport,
        hide: false,
        actionName: "save",
      },
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
          <SMSComp type={this.props.type} ref={this.refComp} />
          <SMSReport />
        </div>
      </>
    );
  }
}

export default SMS;
