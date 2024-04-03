import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import Comp from "components/mainContent/logistics/searchOrderSupplierDetail";

export default class LogisticsOrderSupplierDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.compRef = React.createRef();

    this.poCode = this.props.poCode || "";
  }

  handleSave = () => {
    this.compRef.current.handleSave();
  };

  renderAction = () => {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    actionLeftInfo.push({
      name: "Save",
      actionType: "save",
      action: this.handleSave,
      actionName: "save",
    });

    // actionRightInfo.push();
    return (
      <Action
        leftInfo={actionLeftInfo}
        rightInfo={actionRightInfo}
        ref={this.actionRef}
      />
    );
  };

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table">
          <Comp
            type={this.props.type}
            ref={this.compRef}
            poCode={this.poCode}
          />
        </div>
      </>
    );
  }
}
