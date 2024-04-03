import React from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import CommonModel from "models/CommonModel";
import SettingModel from "models/SettingModel";
import Select from "react-select";

class UserPermission extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
    this.fieldSelected.type = "";
    this.fieldSelected.object = "";
    this.data.permissions = [];
    this.data.functions = [];
    this.data.userTypes = [];
    this.data.objectPermissions = {};
  }

  componentDidMount = () => {
    this.handleUpdateState();
  };

  handleUpdateState = async () => {
    var commonModel = new CommonModel();
    await commonModel
      .getData("usertype,permission,function")
      .then((response) => {
        if (response.status && response.data.userTypes) {
          const { role, ...rest } = response.data.userTypes;
          this.data.types = rest;
        }

        if (response.status && response.data.permissions) {
          this.data.permissions = response.data.permissions;
        }

        if (response.status && response.data.functions) {
          this.data.functions = response.data.functions;
        }
      });
    this.refresh();
  };

  handleChangeType = async () => {
    this.data.objectPermissions = {};
    $("[name='optionAll']").prop("checked", false);
    var settingModel = new SettingModel();
    await settingModel
      .getObjectByType(this.fieldSelected.type)
      .then((response) => {
        if (response.status && response.data.objects) {
          this.data.objects = response.data.objects;
        }
      });
    this.fieldSelected.object = "";
    this.refresh();
  };

  handleChangeObject = async () => {
    this.data.objectPermissions = {};
    $("[name='optionAll']").prop("checked", false);
    var settingModel = new SettingModel();
    await settingModel
      .getObjectPermissionByType(
        this.fieldSelected.type,
        this.fieldSelected.object,
      )
      .then((response) => {
        if (response.status && response.data.objectPermissions) {
          this.data.objectPermissions = response.data.objectPermissions;
        }
      });
    this.refresh();
  };

  handleCheckAll = (status, permissionParam = null, functionParam = null) => {
    if (permissionParam === null && functionParam === null) {
      this.data.objectPermissions = {};
    }

    if (this.data.functions && this.data.permissions) {
      for (var key in this.data.functions) {
        var functionItem = this.data.functions[key];

        if (
          this.data.objectPermissions[functionItem.functionID] === undefined
        ) {
          this.data.objectPermissions[functionItem.functionID] = [];
        }

        for (var key2 in this.data.permissions) {
          var permission = this.data.permissions[key2];

          if (permissionParam === null && functionParam === null && status) {
            this.data.objectPermissions[functionItem.functionID].push(
              permission.permissionID,
            );
          } else if (
            permissionParam !== null &&
            permissionParam === permission.permissionID
          ) {
            if (status) {
              var index = this.data.objectPermissions[
                functionItem.functionID
              ].indexOf(permission.permissionID);
              if (index === -1) {
                this.data.objectPermissions[functionItem.functionID].push(
                  permission.permissionID,
                );
              }
            } else {
              var index = this.data.objectPermissions[
                functionItem.functionID
              ].indexOf(permission.permissionID);
              this.data.objectPermissions[functionItem.functionID].splice(
                index,
                1,
              );
            }
          } else if (
            functionParam !== null &&
            functionParam === functionItem.functionID
          ) {
            if (status) {
              this.data.objectPermissions[functionItem.functionID].push(
                permission.permissionID,
              );
            } else {
              this.data.objectPermissions[functionItem.functionID] = [];
            }
          }
        }
      }
    }
    this.refresh();
  };

  handleConfirmCustomer = async (functionID, permissionID, status) => {
    var type = this.fieldSelected.type;
    var objectID = this.fieldSelected.object;
    if (type == "") {
      this.showAlert("Please choose type", "error", true, false);
      return;
    }

    if (objectID == "") {
      this.showAlert("Please choose object", "error", true, false);
      return;
    }
    if (
      this.data.objectPermissions &&
      this.data.objectPermissions[functionID] === undefined
    ) {
      this.data.objectPermissions[functionID] = [];
    }

    if (status) {
      this.data.objectPermissions[functionID].push(permissionID);
    } else {
      var index = this.data.objectPermissions[functionID].indexOf(permissionID);
      this.data.objectPermissions[functionID].splice(index, 1);
    }
    this.refresh();
  };

  handleSavePermission = async () => {
    var type = this.fieldSelected.type;
    var objectID = this.fieldSelected.object;
    if (type == "") {
      this.showAlert("Please choose type", "error", true, false);
      return;
    }

    if (objectID == "") {
      this.showAlert("Please choose object", "error", true, false);
      return;
    }

    var settingModel = new SettingModel();
    await settingModel
      .assignObjectPermission(type, objectID, this.data.objectPermissions)
      .then((response) => {
        this.refresh();
      });
  };

  renderComp() {
    let types = this.data.types || {};
    let typeKeys = Object.keys(types);
    let typeOptions = [];
    typeOptions = typeKeys.map((key) => {
      return { value: key, label: types[key] };
    });

    let objects = this.data.objects || [];
    let objectOptions = objects.map((item) => {
      return { value: item.id, label: item.name };
    });

    return (
      <section>
        <div className="section-block mt-15 mb-15">
          {" "}
          <div className="form-filter">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <Select
                    classNamePrefix="select"
                    maxMenuHeight={260}
                    placeholder="--Type--"
                    value={typeOptions.filter(
                      (option) => option.value === this.fieldSelected.type,
                    )}
                    options={typeOptions}
                    onChange={(e) =>
                      this.handleChangeFieldCustom(
                        "type",
                        e ? e.value : "",
                        this.handleChangeType,
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <Select
                    classNamePrefix="select"
                    maxMenuHeight={260}
                    placeholder="--Object--"
                    value={objectOptions.filter(
                      (option) => option.value === this.fieldSelected.object,
                    )}
                    options={objectOptions}
                    onChange={(e) =>
                      this.handleChangeFieldCustom(
                        "object",
                        e ? e.value : "",
                        this.handleChangeObject,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.data.functions ? (
          <div className="section-block mb-15 w-fit">
            <div
              className="wrap-table htable"
              style={{ maxHeight: "calc(100vh - 248px) " }}
            >
              <table className="table table-checklist w-fit">
                <thead>
                  <tr className="permission-tr">
                    <th>
                      <input
                        type="checkbox"
                        onChange={(e) => this.handleCheckAll(e.target.checked)}
                        className="ckb-style"
                        name="optionAll"
                      />{" "}
                      All
                    </th>
                    {this.data.permissions.map((item, i) => (
                      <th key={i}>
                        <label>{item.permissionName}</label>
                        <div>
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              this.handleCheckAll(
                                e.target.checked,
                                item.permissionID,
                              )
                            }
                            className="ckb-style"
                            name="optionAll"
                          />
                        </div>
                      </th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.data.functions.map((item1, i) => (
                    <tr key={i}>
                      <td>{item1.functionName}</td>
                      {this.data.permissions.map((item2, j) => (
                        <td key={j}>
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              this.handleConfirmCustomer(
                                item1.functionID,
                                item2.permissionID,
                                e.target.checked,
                              )
                            }
                            className="ckb-style"
                            name="permission"
                            checked={
                              this.data.objectPermissions &&
                              this.data.objectPermissions[item1.functionID] &&
                              this.data.objectPermissions[
                                item1.functionID
                              ].indexOf(item2.permissionID) != -1
                                ? true
                                : false
                            }
                          />
                        </td>
                      ))}
                      <td>
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            this.handleCheckAll(
                              e.target.checked,
                              null,
                              item1.functionID,
                            )
                          }
                          className="ckb-style"
                          name="optionAll"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>
    );
  }
}

export default UserPermission;
