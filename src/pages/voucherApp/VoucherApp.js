import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import VoucherAppComp from "components/mainContent/voucherApp";
class VoucherApp extends CustomAuthorizePage {
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
        name: "Save",
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
          <VoucherAppComp type={this.props.type} ref={this.refComp} />
        </div>
      </>
    );
  }
}

export default VoucherApp;
