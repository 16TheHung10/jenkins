import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import ManageDevice from "components/mainContent/manageDevice";

export default class ManageDevicePage extends CustomAuthorizePage {
  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <div className="container-table pd-0">
          <ManageDevice />
        </div>
      </>
    );
  }
}
