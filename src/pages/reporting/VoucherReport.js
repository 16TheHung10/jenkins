import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import VoucherReportComp from "components/mainContent/reporting/marketingReport/VoucherReportComp";

class VoucherReport extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <VoucherReportComp />
      </>
    );
  }
}

export default VoucherReport;
