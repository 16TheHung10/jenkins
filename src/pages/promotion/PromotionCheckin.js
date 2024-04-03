import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import SearchComp from "components/mainContent/promotion/searchCheckin";
import Action from "components/mainContent/Action";

export default class PromotionCheckin extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
    this.handleSave = this.handleSave.bind(this);
  }
  handleSave() {
    this.searchRef.current.handleSave();
  }
  renderAction() {
    let actionLeftInfo = [
      {
        name: "Submit",
        actionType: "info",
        action: this.handleSave,
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
