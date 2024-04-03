import React from "react";
import CustomPage from "pages/CustomPage";
import LoginForm from "components/mainContent/account/loginForm";

class Login extends CustomPage {
  renderPage() {
    return (
      <div className="overlay">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-md-5">
              <div
                className="card-group"
                style={{ borderRadius: "20px", overflow: "hidden" }}
              >
                <div className="card-alert">{this.renderAlert()}</div>
                <div className="card">
                  <div className="card-body">
                    <LoginForm />
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

export default Login;
