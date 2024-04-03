import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import Comp from "components/mainContent/reporting/searchComp/SalesLog";
import Action from "components/mainContent/Action";

export default class ReportSaleLogPage extends CustomAuthorizePage {
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
        action: this.handleShowSalesStoreAsync,
      },
      {
        name: "Sales Log",
        actionType: "info",
        classActive: "active",
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
        <Comp />
      </>
    );
  }
}
