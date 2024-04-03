import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";
import ListStoreComp from "components/mainContent/store/listStore/ListStore";

export default class StoreManagement extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.listStoreRef = React.createRef();
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate() {
    super.targetLink("/store/create");
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
        <div className="container-table hContainerTable">
          <ListStoreComp />
        </div>
      </>
    );
  }
}
