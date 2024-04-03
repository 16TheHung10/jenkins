import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";
import UserDetailComp from "components/mainContent/user/detailUser";
import UserModel from "models/UserModel";
import { Switch, message } from "antd";
export default class UserDetailPage extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.userDetailRef = React.createRef();
    this.userID = props.userID || "";
    this.handleSave = this.handleSave.bind(this);
    this.groupUser = [];
    this.stores = [];
    this.active = false;
    this.email = "";
    this.getMSAccountStatus = "idle";
  }
  handleUpdateEmail = (email) => {
    this.email = email;
    this.refresh();
  };
  handleUpdateStatusOfGetMSAccountStatus = (status) => {
    this.getMSAccountStatus = status;
    this.refresh();
  };
  handleUpdateMSAccountStatusLocal = (status) => {
    this.active = status;
    this.refresh();
  };
  handleUpdateMSAccountStatus = async () => {
    const model = new UserModel();
    const res = await model.updateMSAccountStatus(this.email, !this.active);
    if (res.status) {
      message.success("Updated MSAccount Status successfully");
      this.active = !this.active;
      this.refresh();
    } else {
      message.error(res.message);
    }
  };
  async handleSave() {
    this.userDetailRef.current.handleSave();
  }
  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    actionLeftInfo.push(
      {
        name: "Save",
        actionType: "save",
        action: this.handleSave,
        hide: false,
        actionName: "save",
      },

      // {
      //   "name" : "Create Voucher",
      //   "actionType": "save",
      //   "action" : this.handleCreateVoucher,
      //   "hide" : false,
      //   "actionName":"save"
      // }
    );
    if (this.getMSAccountStatus !== "error") {
      actionLeftInfo.push({
        name: (
          <div className="flex items-center gap-10">
            <p className="m-0">MS account status:</p>
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Active"
              checked={this.active}
              disabled={this.getMSAccountStatus !== "success"}
            />
          </div>
        ),
        actionType: "info",
        action: this.handleUpdateMSAccountStatus,
        actionName: "updatestatus",
      });
    }

    //isAllowUpdateStatus
    actionRightInfo.push();
    return (
      <Action
        leftInfo={actionLeftInfo}
        rightInfo={actionRightInfo}
        ref={this.actionRef}
      />
    );
  }
  componentDidMount = () => {
    this.handleGetGroupUser();
  };

  handleGetGroupUser = async () => {
    let userModel = new UserModel();
    await userModel.getGroupUser().then((response) => {
      if (response.status) {
        if (response.data.groupusers.length > 0) {
          this.groupUser = response.data.groupusers;
        }
        if (response.data.stores) {
          this.stores = Object.values(response.data.stores);
        }
        this.refresh();
      } else {
        this.showAlert(response.message);
      }
    });
  };

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table hContainerTable">
          <UserDetailComp
            ref={this.userDetailRef}
            userID={this.userID}
            groupUser={this.groupUser}
            stores={this.stores}
            userDetail={this.userDetail}
            onUpdateMSAccountStatusLocal={this.handleUpdateMSAccountStatusLocal}
            onUpdateEmail={this.handleUpdateEmail}
            onSetGetMSAccountStatus={
              this.handleUpdateStatusOfGetMSAccountStatus
            }
          ></UserDetailComp>
        </div>
      </>
    );
  }
}
