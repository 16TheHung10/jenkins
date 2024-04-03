import Action from "components/mainContent/Action";
import CteateIMNormal from "components/mainContent/itemMaster/createIMNormal";
import CommonModel from "models/CommonModel";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import React from "react";

export default class ItemMasterChangeCostPrice extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.createIMNormal = React.createRef();
    this.suppliers = {};
    this.divisions = {};
    this.groups = {};
    this.subclasses = {};
    this.units = [];
  }
  handleSave = () => {
    this.createIMNormal.current.handleSave();
  };
  renderAction() {
    let actionLeftInfo = [
      {
        name: "Save",
        actionType: "info",
        action: this.handleSave,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }
  componentDidMount() {
    this.handleGetDataCommon();
  }

  handleGetDataCommon = async () => {
    let commonModel = new CommonModel();
    await commonModel
      .getData("supplier,division,group,subclass,itemUnit")
      .then((response) => {
        if (response.status) {
          this.units = response.data.itemUnits;
          this.suppliers = response.data.suppliers;
          this.divisions = response.data.divisions;
          this.groups = response.data.groups;
          this.subclasses = response.data.subclasses;
        }
      });
    this.refresh();
  };

  renderPage() {
    return (
      <>
        <div className="container-table">
          {this.renderAlert()}
          {/* {this.renderAction()} */}
          <CteateIMNormal
            ref={this.createIMNormal}
            units={this.units}
            suppliers={this.suppliers}
            divisions={this.divisions}
            groups={this.groups}
            categorySubClasses={this.subclasses}
          />
        </div>
      </>
    );
  }
}
