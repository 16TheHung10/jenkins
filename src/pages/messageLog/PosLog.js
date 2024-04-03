import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import PosLogComp from "components/mainContent/messageLog/posLog";

class PosLog extends CustomAuthorizePage {
  constructor(props) {
    super(props);
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <div className="container-table pd-0">
          <PosLogComp />
        </div>
      </>
    );
  }
}

export default PosLog;
