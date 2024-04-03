import Action from "components/mainContent/Action";
import SearchDetail from "components/mainContent/loyalty/searchDetail";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import React from "react";

export default class LoyaltyDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.memberCode = this.props.memberCode || "";
    this.searchDetailRef = React.createRef();
    this.handleSave = this.handleSave.bind(this);
    this.handleCreateVoucher = this.handleCreateVoucher.bind(this);
  }

  handleSave() {
    this.searchDetailRef.current.handleSave();
  }

  handleCreateVoucher() {
    this.targetLink("/loyalty-voucher/" + this.memberCode);
  }

  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    //isAllowSave
    actionLeftInfo.push({
      name: "Save",
      actionType: "save",
      action: this.handleSave,
      hide: false,
      actionName: "save",
    });

    return (
      <Action
        leftInfo={actionLeftInfo}
        rightInfo={actionRightInfo}
        ref={this.actionRef}
      />
    );
  }

  renderPage() {
    return (
      <>
        <div className="container-table">
          {this.renderAlert()}
          {this.renderAction()}

          <SearchDetail
            type={this.props.type}
            memberCode={this.memberCode}
            ref={this.searchDetailRef}
          />
        </div>
      </>
    );
  }
}
