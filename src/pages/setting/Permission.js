import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import UserPermission from "components/mainContent/setting/userPermission";
import Action from "components/mainContent/Action";

class Permission extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.permissionRef = React.createRef();
  }

  handleSavePermission = () => {
    this.permissionRef.current.handleSavePermission();
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Save",
        actionType: "info",
        action: this.handleSavePermission,
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
          <UserPermission ref={this.permissionRef} />
        </div>
      </>
    );
  }
}

export default Permission;
