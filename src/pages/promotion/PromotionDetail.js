import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import SearchDetail from "components/mainContent/promotion/searchDetail";

export default class PromotionDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.orderCode = this.props.orderCode || "";
    this.searchDetailRef = React.createRef();

    this.handleSave = this.handleSave.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLoadDefault = this.handleLoadDefault.bind(this);
  }

  handleSave() {
    this.searchDetailRef.current.handleSave();
  }

  handleApprove() {
    this.searchDetailRef.current.handleApprove();
  }

  handleDelete() {
    this.searchDetailRef.current.handleDelete();
  }

  handleLoadDefault() {
    this.searchDetailRef.current.handleLoadDefault();
  }

  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    //isAllowSave
    actionLeftInfo.push({
      name: "Save",
      actionType: "save",
      action: this.handleSave,
      hide: true,
      actionName: "save",
    });

    //isAllowUpdateStatus
    actionRightInfo.push(
      {
        name: "Approve",
        actionType: "approve",
        action: this.handleApprove,
        hide: true,
        actionName: "approve",
      },
      {
        name: "Delete",
        actionType: "delete",
        action: this.handleDelete,
        hide: true,
        actionName: "delete",
      },
    );
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
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table">
          <SearchDetail
            type={this.props.type}
            orderCode={this.orderCode}
            ref={this.searchDetailRef}
          />
        </div>
      </>
    );
  }
}
