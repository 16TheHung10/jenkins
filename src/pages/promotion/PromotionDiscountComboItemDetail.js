import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import SearchDetail from "components/mainContent/promotion/searchPromotionDiscountComboItemDetail";

export default class PromotionDiscountComboItemDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.orderCode = this.props.orderCode || "";
    this.searchDetailRef = React.createRef();
  }

  handleSave = () => {
    this.searchDetailRef.current.handleSave();
  };

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
