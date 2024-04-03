import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import SearchComp from "components/mainContent/promotion/searchCheckinPage";
import Action from "components/mainContent/Action";
import AccountState from "helpers/AccountState";

export default class Promotion extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();

    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate() {
    super.targetLink("/promotion-checkin/create");
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Create",
        actionType: "info",
        action: this.handleCreate,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderAlert() {
    return <div className="wrap-alert"></div>;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table hContainerTable">
          <SearchComp ref={this.searchRef} type={this.props.type} />
        </div>
      </>
    );
  }
}
