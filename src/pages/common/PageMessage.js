import React from "react";
import LogoForm from "components/layouts/header/navBarBrand/images/logoaboutus.png";
import CustomPage from "pages/CustomPage";

class PageMessage extends CustomPage {
  renderLoginSuccessMessage() {
    return (
      <section>
        <h4>Thank you for login</h4>
        <a href="javascript:void(0)" onClick={() => super.targetHome()}>
          Back to Dashboard
        </a>
      </section>
    );
  }

  renderLoginFailMessage() {
    return (
      <section>
        <h4>Can't login MS Azure Account</h4>
        <a href="javascript:void(0)" onClick={() => super.targetHome()}>
          Back to Login
        </a>
      </section>
    );
  }

  renderSwitch() {
    if (this.props.type == "loginsuccess") {
      return this.renderLoginSuccessMessage();
    } else if (this.props.type == "loginfail") {
      return this.renderLoginFailMessage();
    }
    return null;
  }

  renderPage() {
    return (
      <div className="overlay">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-md-5">
              <div className="card-group">
                <div className="card">
                  <div className="card-body">
                    <h1>
                      <img src={LogoForm} alt="gs25" className="logoform" />
                    </h1>
                    {this.renderSwitch()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageMessage;
