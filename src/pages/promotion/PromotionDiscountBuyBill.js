import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import SearchComp from "components/mainContent/promotion/searchPromotionDiscountBuyBill";
import Action from "components/mainContent/Action";
import AccountState from "helpers/AccountState";

export default class PromotionDiscountBuyBill extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
  }

  handleCreate = () => {
    super.targetLink("/promotion-discount-buy-bill/create");
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
