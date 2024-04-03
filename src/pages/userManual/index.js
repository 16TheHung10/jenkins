import CustomAuthorizePage from "pages/CustomAuthorizePage";
import React from "react";

import IframeGs25Comp from "components/mainContent/userManual";

class UserManual extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPage() {
    return <IframeGs25Comp />;
  }
}

export default UserManual;
