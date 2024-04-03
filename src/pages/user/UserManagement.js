import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";
import ListStoreComp from "components/mainContent/user/listUser";
import UserModel from "models/UserModel";
import Capcha from "components/common/capcha/Capcha";
export default class UserManagement extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.listStoreRef = React.createRef();
    this.handleCreate = this.handleCreate.bind(this);
    //this.handleEditUserMenu = this.handleEditUserMenu.bind(this);
  }

  handleCreate() {
    super.targetLink("/user/create");
  }
  // handleEditUserMenu() {
  //     super.targetLink("/user/edit-menu");
  // }
  renderAction() {
    let actionLeftInfo = [
      {
        name: "New",
        actionType: "info",
        action: this.handleCreate,
      },
      // {
      //     name: "Edit Menu",
      //     actionType: "info",
      //     action: this.handleEditUserMenu,
      // },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }
  componentDidMount = () => {
    this.handleGetGroupUser();
  };

  handleGetGroupUser = async () => {
    let userModel = new UserModel();
    await userModel.getGroupUser().then((response) => {
      if (response.status) {
        if (response.data.groupusers && response.data.groupusers.length > 0) {
          this.groupUser = response.data.groupusers;
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
          <Capcha />

          <ListStoreComp groupUser={this.groupUser}></ListStoreComp>
        </div>
      </>
    );
  }
}
