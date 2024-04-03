import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";
import SearchComp from "components/mainContent/staff/search";

export default class StaffManagement extends CustomAuthorizePage {
  constructor(props) {
    super(props);
  }

  handleCreate() {
    super.targetLink("/staff/create");
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "New",
        actionType: "info",
        action: this.handleCreate,
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
        <div className="container-table hContainerTable app_container">
          <SearchComp></SearchComp>
        </div>
      </>
    );
  }
}
