import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import CicoComp from "components/mainContent/cico";

class CicoPage extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <CicoComp />
      </>
    );
  }
}

export default CicoPage;
