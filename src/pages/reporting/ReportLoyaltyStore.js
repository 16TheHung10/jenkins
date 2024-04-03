import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

import LoyaltyReport from 'components/mainContent/reporting/searchComp/LoyaltyTransReport';
import Action from 'components/mainContent/Action';

export default class ReportLoyaltyStore extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleReportLoyalty = () => {
    super.targetLink('/report-loyalty');
  };

  handleReportLoyaltyStore = () => {
    super.targetLink('/report-loyalty-store');
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Summary',
        actionType: 'info',
        action: this.handleReportLoyalty,
      },
      {
        name: 'Store',
        actionType: 'info',
        classActive: 'active',
        action: this.handleReportLoyaltyStore,
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
        <LoyaltyReport />
      </>
    );
  }
}
