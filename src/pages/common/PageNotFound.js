import React from "react";
import CustomPage from "pages/CustomPage";
import LogoForm from "components/layouts/header/navBarBrand/images/logoaboutus.png";

class PageNotFound extends CustomPage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPage() {
    return (
      <div className="container-table">
        <h2>
          <img src={LogoForm} alt="gs25" className="logoform" /> Page not found
        </h2>
        <a href="javascript:void(0)" onClick={() => super.targetHome()}>
          Back to dashboard
        </a>
      </div>
    );
  }
}

export default PageNotFound;
