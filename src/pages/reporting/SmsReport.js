import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import SmsReportComp from "components/mainContent/reporting/marketingReport/SmsReportComp";

class SmsReport extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <SmsReportComp />
      </>
    );
  }
}

export default SmsReport;
