import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import StoreSalesProcessAsyncReport from "components/mainContent/reporting/searchComp/StoreSalesProcessAsync";
import Action from "components/mainContent/Action";

export default class ReportStoreSalesProcessAsync extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleShowSalesStoreAsync() {
    super.targetLink("/report-sales-store-async");
  }

  handleShowSaleLog() {
    super.targetLink("/report-sale-log");
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Sales store async",
        actionType: "info",
        classActive: "active",
        action: this.handleShowSalesStoreAsync,
      },
      {
        name: "Sales Log",
        actionType: "info",
        action: this.handleShowSaleLog,
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
        <StoreSalesProcessAsyncReport />
      </>
    );
  }
}
