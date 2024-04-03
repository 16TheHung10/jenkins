import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import React from 'react';

import Action from 'components/mainContent/Action';
import CurrentInventoryReport from 'components/mainContent/reporting/searchComp/CurrentInventory';

export default class ReportCurrentInventoryMKT extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleShowInvByStore() {
    super.targetLink('/report-mkt-current-inventory-by-store');
  }

  handleShowInvByItem() {
    super.targetLink('/report-mkt-current-inventory-by-item');
  }
  // handleShowSohEstimate(){
  // 	super.targetLink("/estimate-stock");
  // }
  // handleShowStockmovement(){
  // 	super.targetLink("/stock-movement");
  // }

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Stock by store',
        actionType: 'info',
        classActive: 'active',
        action: this.handleShowInvByStore,
      },
      // {
      // 	"name": "Stock by item",
      // 	"actionType": "info",
      // 	"action": this.handleShowInvByItem
      // },
      // {
      // 	"name" : "SOH & Estimate",
      // 	"actionType": "info",
      // 	"action" : this.handleShowSohEstimate
      // },
      // {
      // 	"name" : "Stock movement",
      // 	"actionType": "info",
      // 	"action" : this.handleShowStockmovement
      // }
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table">
          <div className="col-md-12">
            <CurrentInventoryReport />
          </div>
        </div>
      </>
    );
  }
}
