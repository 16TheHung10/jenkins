import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import SearchIMDetail from "components/mainContent/itemMaster/searchIMDetail";

export default class ItemMasterDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.code = this.props.code || "";
    this.searchIMDetailRef = React.createRef();
  }

  handleSave = () => {
    this.searchIMDetailRef.current.handleSave();
  };

  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    actionLeftInfo.push({
      name: "Save",
      actionType: "save",
      action: this.handleSave,
      // "hide" : true,
      actionName: "save",
    });

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
          {/* { this.renderAction() }\ */}
          <SearchIMDetail
            type={this.props.type}
            code={this.code}
            ref={this.searchIMDetailRef}
          />
        </div>
      </>
    );
  }
}
