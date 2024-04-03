import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

import EstimateStockComp from 'components/mainContent/dashBoard/EstimateStock';
import Action from 'components/mainContent/Action';
import CheckInventory from 'component/checkInventory/CheckInventory';

export default class EstimateStock extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleShowInvByStore() {
    super.targetLink('/report-current-inventory-by-store-md');
  }

  // handleShowInvByItem() {
  // 	super.targetLink("/report-current-inventory-by-item");
  // }
  handleShowSohEstimate() {
    super.targetLink('/estimate-stock-md');
  }
  handleShowStockmovement() {
    super.targetLink('/stock-movement-md');
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Inv by store',
        actionType: 'info',
        action: this.handleShowInvByStore,
      },
      // {
      // 	"name" : "Inv by item",
      // 	"actionType": "info",

      // 	"action" : this.handleShowInvByItem
      // },
      {
        name: 'SOH & Estimate',
        actionType: 'info',
        classActive: 'active',
        action: this.handleShowSohEstimate,
      },
      {
        name: 'Stock movement',
        actionType: 'info',
        action: this.handleShowStockmovement,
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
        <div className="container-table">
          <div className="col-md-12">
            <CheckInventory>
              <EstimateStockComp />
            </CheckInventory>
          </div>
        </div>
      </>
    );
  }
}
