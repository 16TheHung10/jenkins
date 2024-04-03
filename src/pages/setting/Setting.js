import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import CacheSetting from "components/mainContent/setting/cacheSetting";

class Setting extends CustomAuthorizePage {
  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <div className="container-table pd-0">
          <CacheSetting />
        </div>
      </>
    );
  }
}

export default Setting;
