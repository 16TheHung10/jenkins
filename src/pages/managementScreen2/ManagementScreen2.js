import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";

import ManagementScreen2Comp from "components/mainContent/managementScreen2";

class ManagementScreen2 extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.refComp = React.createRef();
  }

  handleSave = () => {
    this.refComp.current.handleSave();
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Save",
        actionType: "save",
        action: this.handleSave,
        hide: false,
        actionName: "save",
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
          <ManagementScreen2Comp type={this.props.type} ref={this.refComp} />
        </div>
      </>
    );
  }
}

export default ManagementScreen2;
