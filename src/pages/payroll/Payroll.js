import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import PayrollComp from "components/mainContent/payroll";

class Payroll extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <div className="container-table">
          <PayrollComp type={this.props.type} />
        </div>
      </>
    );
  }
}

export default Payroll;
