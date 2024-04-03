//Plugin
import React, { Fragment } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import Moment from "moment";
import UserModel from "models/UserModel";
import { Cascader, Tree } from "antd";

export default class EditUserMenu extends BaseComponent {
  constructor(props) {
    super(props);
    this.type = props.type;
    this.groupUser = [];
    this.menu = [];
    this.menuPermission = [];
    this.fieldSelected = this.assignFieldSelected({
      appPermission: "1000",
      groupUser: "01",
    });

    this.expandedKeys = [];
    this.autoExpandParent = true;
    this.checkedKeys = [];
    this.selectedKeys = [];
    this.treeData = [];
    this.checkedKeysSave = [];
    this.appPermission = "";
    this.isRender = true;
  }
  componentDidMount = () => {
    this.handleGetGroupUser();
    this.handleGetAllMenu();
    this.handleGetPermissionMenu();
  };
  handleSave = async () => {
    let userModel = new UserModel();
    let params = {
      menuPermissions: this.checkedKeys,
    };
    // await userModel.putPermissionMenu(params).then((response) => {
    //     if (response.status) {
    //         this.showAlert("Success", "Success");
    //     }
    //     else {
    //         this.showAlert(response.message);
    //     }
    // });
  };

  handleGetGroupUser = async () => {
    let userModel = new UserModel();
    await userModel.getGroupUser().then((response) => {
      if (response.status) {
        if (response.data.groupusers.length > 0) {
          this.groupUser = response.data.groupusers;
          this.refresh();
        } else {
          this.showAlert("System Error");
        }
      } else {
        this.showAlert(response.message);
      }
    });
  };
  handleGetAllMenu = async () => {
    let userModel = new UserModel();
    await userModel.getAllMenu().then((response) => {
      if (response.status) {
        if (response.data.listMenu.length > 0) {
          this.menu = response.data.listMenu;
          this.treeData = this.menu.filter(
            (i) => i.appPermission == this.fieldSelected.appPermission,
          );
          this.refresh();
        } else {
          this.showAlert("System Error");
        }
      } else {
        this.showAlert(response.message);
      }
    });
  };
  handleGetPermissionMenu = async () => {
    let userModel = new UserModel();
    await userModel.getPermissionMenu().then((response) => {
      if (response.status) {
        if (response.data.listPermissionMenu.length > 0) {
          this.menuPermission = response.data.listPermissionMenu;
          const menuDataByGroupUser = this.menuPermission?.filter(
            (el) => +el.groupID === +this.fieldSelected.groupUser,
          );
          this.refresh();
        } else {
          this.showAlert("System Error");
        }
      } else {
        this.showAlert(response.message);
      }
    });
  };

  getCheckedKeys = (menuPermission) => {
    let result = [];

    for (let i = 0; i < menuPermission.length; i++) {
      if (
        menuPermission[i].groupID == this.fieldSelected.groupUser &&
        menuPermission[i].appPermission == this.fieldSelected.appPermission
      ) {
        let id = menuPermission[i].id;
        if (menuPermission.filter((i) => i.parentID == id).length == 0) {
          result.push(menuPermission[i]);
        }
      }
    }
    return result;
  };

  onChangeApp = (value, e) => {
    this.fieldSelected.appPermission = value.join().toString();
    this.treeData = this.menu.filter(
      (i) => i.appPermission == this.fieldSelected.appPermission,
    );
    //this.checkedKeys = this.menuPermission.filter(i => i.groupID == this.fieldSelected.groupUser && i.url != '' && i.appPermission == this.fieldSelected.appPermission).map(el => el.id.toString());
    this.refresh();
  };
  onChangeGroupUser = (value) => {
    this.fieldSelected.groupUser = value.join().toString();
    this.refresh();
  };
  onExpand = (expandedKeysValue) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    //setExpandedKeys(expandedKeysValue);
    //setAutoExpandParent(false);
    this.expandedKeys = expandedKeysValue;
    this.autoExpandParent = true;
    this.refresh();
  };
  onCheck = (checkedKeysValue, e) => {
    this.checkedKeys = checkedKeysValue;
    this.updateDataMenu(e.node.key, e.checked, e.node.children);
    this.refresh();
  };
  onSelect = (selectedKeysValue, info) => {
    this.selectedKeys = selectedKeysValue;
    this.refresh();
  };
  updateDataMenu = (key, isChecked, children) => {
    if (children.length > 0) {
      if (isChecked) {
        if (!this.checkedKeysSave.some((i) => i.menuID == key)) {
          this.checkedKeysSave.push({
            groupCode: Number(this.fieldSelected.groupUser),
            menuID: Number(key),
          });
        }
        children.forEach((element) => {
          if (!this.checkedKeysSave.some((i) => i.menuID == element.key)) {
            this.checkedKeysSave.push({
              groupCode: Number(this.fieldSelected.groupUser),
              menuID: Number(element.key),
            });
          }
        });
      } else {
        if (this.checkedKeysSave.some((i) => i.menuID == key)) {
          this.checkedKeysSave = this.checkedKeysSave.filter(
            (item) => item.menuID != key,
          );
        }
        children.forEach((element) => {
          if (this.checkedKeysSave.some((i) => i.menuID == element.key)) {
            this.checkedKeysSave = this.checkedKeysSave.filter(
              (item) => item.menuID != element.key,
            );
          }
        });
      }
    } else {
      if (!this.checkedKeysSave.some((i) => i.menuID == key)) {
        this.checkedKeysSave.push({
          groupCode: Number(this.fieldSelected.groupUser),
          menuID: Number(key),
        });
      } else {
        this.checkedKeysSave = this.checkedKeysSave.filter(
          (item) => item.menuID != key,
        );
      }
    }
  };
  renderComp = () => {
    let appOptionsRaw = [
      {
        value: "1000",
        label: "Store Management",
      },
      {
        value: "1001",
        label: "Portal",
      },
      {
        value: "1002",
        label: "FC",
      },
      {
        value: "1003",
        label: "Internal App",
      },
    ];
    let appOptions = [];
    if (this.appPermission != "" && this.appPermission != "") {
      let temp = this.appPermission.split(",");
      for (let i = 0; i < temp.length; i++) {
        appOptionsRaw.forEach((el) => {
          if (el.value == temp[i]) {
            appOptions.push(el);
          }
        });
      }
    }

    let groupUserOptions = this.groupUser.map((el) => ({
      value: el.groupUserCode,
      label: el.groupUserName,
    }));
    let expandedKeys = this.expandedKeys.map((el) => el);
    let autoExpandParent = this.autoExpandParent;
    let checkedKeys = this.checkedKeys.map((el) => el);
    let selectedKeys = this.selectedKeys.map((el) => el);
    let treeData = this.treeData;
    return (
      <section className="wrap-section">
        <div className="row header-detail">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <button
              onClick={() => super.back("/user")}
              type="button"
              className="btn btn-back"
              style={{ background: "beige" }}
            >
              Back
            </button>
          </div>
        </div>
        <div className="form-filter">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="group" className="w100pc">
                      {" "}
                      Group<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <Cascader
                      allowClear={false}
                      options={groupUserOptions}
                      defaultValue={this.fieldSelected.groupUser}
                      onChange={this.onChangeGroupUser}
                      placeholder="Please select"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="group" className="w100pc">
                      {" "}
                      Menu<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <Tree
                      checkable
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={this.onCheck}
                      onSelect={this.onSelect}
                      selectedKeys={selectedKeys}
                      // checked value of tree node
                      checkedKeys={checkedKeys}
                      // Reder Tree
                      treeData={treeData}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
}
