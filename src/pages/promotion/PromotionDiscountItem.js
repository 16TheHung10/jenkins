import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import SearchComp from "components/mainContent/promotion/searchDiscountItem";
import Action from "components/mainContent/Action";
import AccountState from "helpers/AccountState";

export default class PromotionDiscountItem extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
  }

  handleCreate = () => {
    super.targetLink("/promotion-discount-item/create");
  };

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
