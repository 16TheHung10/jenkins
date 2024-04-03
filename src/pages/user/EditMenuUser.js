import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";
import EditMenuComp from "components/mainContent/user/editMenu";
import UserModel from "models/UserModel";
import EditMenuComponent from "../../components/mainContent/user/editMenu/editMenuComponent/EditMenuComponent";
import SettingModel from "models/SettingModel";
import { DateHelper } from "helpers";
import { Button } from "antd";

export default class EditMenuUser extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.listMenuRef = React.createRef();
    this.handleSave = this.handleSave.bind(this);
    this.isUpdateSuccess = false;
  }

  async handleSave() {
    const res = await this.listMenuRef.current.handleSave();
  }
  handleAddNewMenu() {
    this.listMenuRef.current.handleOpenAddNewMenuModal();
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Save 1",
        actionType: "info",
        action: this.handleSave,
      },
      {
        name: "Add new menu",
        actionType: "info",
        action: this.handleAddNewMenu,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}

        <div className="container-table hContainerTable">
          <EditMenuComponent />
        </div>
      </>
    );
  }
}
