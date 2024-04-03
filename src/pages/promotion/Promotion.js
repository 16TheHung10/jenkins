import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import SearchComp from "components/mainContent/promotion/search";
import Action from "components/mainContent/Action";
import AccountState from "helpers/AccountState";

export default class Promotion extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();

    this.handleCreate = this.handleCreate.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleCreate() {
    super.targetLink("/promotion/create");
  }

  handleApprove() {
    this.searchRef.current.handleApprove();
  }

  handleDelete() {
    this.searchRef.current.handleDelete();
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "New",
        actionType: "info",
        action: this.handleCreate,
      },
    ];

    let actionRightInfo = [
      {
        name: "Approve",
        actionType: "approve",
        action: this.handleApprove,
      },
      {
        name: "Delete",
        actionType: "delete",
        action: this.handleDelete,
      },
    ];
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
        <div className="container-table">
          <SearchComp ref={this.searchRef} type={this.props.type} />
        </div>
      </>
    );
  }
}
