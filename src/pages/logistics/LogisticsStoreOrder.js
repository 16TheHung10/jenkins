import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import SearchComp from "components/mainContent/logistics/searchStoreOrder";
import Action from "components/mainContent/Action";

export default class LogisticsStoreOrder extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
  }

  handleSendImport = () => {
    this.searchRef.current.handleSendImport();
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Save",
        actionType: "save",
        action: this.handleSendImport,
        hide: false,
        actionName: "save",
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
