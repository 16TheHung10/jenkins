import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import ReportMainComp from "components/mainContent/promotion/report";
import Action from "components/mainContent/Action";

export default class ReportPromotion extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.compReportRef = React.createRef();

    this.handleLoadReport = this.handleLoadReport.bind(this);
  }

  handleLoadReport() {
    this.compReportRef.current.handleLoadReport();
  }

  renderAlert() {
    return <div className="wrap-alert"></div>;
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Reload",
        actionType: "info",
        action: this.handleLoadReport,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table">
          <ReportMainComp ref={this.compReportRef} type={this.props.type} />
        </div>
      </>
    );
  }
}
