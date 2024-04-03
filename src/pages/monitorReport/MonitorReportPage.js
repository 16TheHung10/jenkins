import React from "react";
import Action from "components/mainContent/Action";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import MonitorReportComp from "components/mainContent/monitorReport/MonitorReport";

export default class MonitorReportPage extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();

    // this.handleCreate = this.handleCreate.bind(this);
    // this.handleApprove = this.handleApprove.bind(this);
    // this.handleDelete = this.handleDelete.bind(this);
  }

  // handleCreate() {
  //     super.targetLink("/promotion/create");
  // }

  // handleApprove() {
  //     this.searchRef.current.handleApprove();
  // }

  // handleDelete() {
  //     this.searchRef.current.handleDelete();
  // }

  renderAction() {
    let actionLeftInfo = [];

    let actionRightInfo = [
      // {
      //     name: "Approve",
      //     actionType: "approve",
      //     action: this.handleApprove,
      // },
      // {
      //     name: "Delete",
      //     actionType: "delete",
      //     action: this.handleDelete,
      // },
    ];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderAlert() {
    return (
      <div className="row">
        <div className="wrap-alert"></div>
      </div>
    );
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table pd-0">
          <MonitorReportComp />
        </div>
      </>
    );
  }
}
