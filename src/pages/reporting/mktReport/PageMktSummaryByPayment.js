import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

import OpReportComp from 'components/mainContent/reporting/mktReport/search/SummaryByPayment';
import Action from 'components/mainContent/Action';

export default class PageMktSummaryByPayment extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
    this.type = this.props.type || '';
  }

  handleMoveMktSaleByCate = () => {
    super.targetLink('/page-mkt-salebycategory');
  };

  handleMoveMktSummaryPayment = () => {
    super.targetLink('/page-mkt-summarybypayment');
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Sales by cate',
        actionType: 'info',
        action: this.handleMoveMktSaleByCate,
      },
      {
        name: 'Summary payment',
        actionType: 'info',
        classActive: 'active',
        action: this.handleMoveMktSummaryPayment,
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
        <OpReportComp />
      </>
    );
  }
}
