import { APIHelper, AlertHelper, PageHelper } from "helpers";
import AccountState from "helpers/AccountState";
import ProgressBar from "helpers/ProgressBar";
import React from "react";
import { Redirect } from "react-router";

class CustomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.redirectUrl = "";
    this.renderPage = this.renderPage.bind(this);
    this.targetLink = this.targetLink.bind(this);
    this.targetHome = this.targetHome.bind(this);
    this.refresh = this.refresh.bind(this);
    var objMe = this;
    APIHelper.callBack401 = function () {
      objMe.getAccountState().destroy();
      objMe.redirect("/login");
    };

    ProgressBar.init();
  }

  refresh() {
    if (this.state.countRender === undefined) {
      this.setState({ countRender: 0 });
    } else {
      this.setState({ countRender: this.state.countRender + 1 });
    }
  }

  targetLink(url) {
    PageHelper.logHistory(url);
    let page = PageHelper.getInstance().getValue("page");
    if (page) {
      page.redirect(url);
    } else {
      this.redirect(url);
    }
  }

  targetHome() {
    let page = PageHelper.getInstance().getValue("page");
    if (page) {
      page.redirect("/");
    } else {
      this.redirect("/");
    }
  }

  redirect(url) {
    this.redirectUrl = url;
    this.refresh();
  }

  setRedirectUrl(url) {
    this.redirectUrl = url;
  }

  back(url) {
    var backUrl = PageHelper.getInstance().getHistory(window.location.pathname);
    this.targetLink(backUrl || url);
  }

  render() {
    if (this.redirectUrl !== "") {
      let url = this.redirectUrl;
      this.redirectUrl = "";
      return <Redirect to={url} />;
    }
    return this.renderPage();
  }

  showAlert(msg, type = "error") {
    AlertHelper.showAlert(msg, type);
  }

  getAccountState() {
    return AccountState.getInstance();
  }

  renderPage() {
    return null;
  }

  renderAlert() {
    return (
      <div className="row">
        <div className="wrap-alert"></div>
      </div>
    );
  }
}

export default CustomPage;
