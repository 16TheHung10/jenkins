import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import StoreConfigComp from "components/mainContent/storeConfig";
import Action from "components/mainContent/Action";

export default class StoreConfigPage extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.storeConfigRef = React.createRef();
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        <div className="container-table pd-0 flex flex-col h-full">
          <StoreConfigComp ref={this.storeConfigRef} />
        </div>
      </>
    );
  }
}
