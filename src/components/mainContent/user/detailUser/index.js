//Plugin
import React from "react";

//Custom
import { Col, Row, message } from "antd";
import BaseComponent from "components/BaseComponent";
import SettingModel from "models/SettingModel";
import UserModel from "models/UserModel";
import Select from "react-select";
export default class UserDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.userID = props.userID;
    this.type = this.userID ? "Update" : "Create";
    this.groupUser = props.groupUser;
    this.stores = props.stores;
    this.userDetail = {};
    this.isUpdateSuccess = false;
    this.fieldSelected = this.assignFieldSelected({
      displayName: "",
      email: "",
      storeCode: "VN0001",
      groupCode: "01",
      status: "01",
      msAccount: "",
    });

    this.isRender = true;
  }
  componentWillReceiveProps(newProps) {
    if (this.groupUser !== newProps.groupUser) {
      this.groupUser = newProps.groupUser;
    }
    if (this.stores !== newProps.stores) {
      this.stores = newProps.stores;
    }

    this.refresh();
  }
  handleChangeGroupUser = (value) => {
    this.fieldSelected.groupCode = value;
  };
  handleChangeStore = (value) => {
    this.fieldSelected.store = value;
  };
  handleOnChangeEmail = (e) => {
    this.fieldSelected.email = e.target.value;
  };
  handleOnChangeDisplayName = (e) => {
    this.fieldSelected.displayName = e.target.value;
  };
  handleSave = async () => {
    let params = {
      DisplayName: this.fieldSelected.displayName,
      Email: this.fieldSelected.email,
      StoreCode:
        this.fieldSelected.groupCode === "10" ||
        this.fieldSelected.groupCode === "11"
          ? this.fieldSelected.storeCode
          : "WH0001",
      GroupCode: this.fieldSelected.groupCode,
      Active: this.fieldSelected.status === "01" ? true : false,
      RefreshToken: "",
      Partner: 0,
    };
    if (this.type === "Create") {
      let userModel = new UserModel();

      const response = await userModel.postUser(params);
      if (response.status) {
        this.showAlert(response.message, "success");
      } else {
        this.showAlert(response.message);
      }
    }
    if (this.type === "Update") {
      let userModel = new UserModel();
      userModel.putUser(this.userID, params).then((response) => {
        if (response.status) {
          this.isUpdateSuccess = true;
          this.showAlert(response.message, "success");
        } else {
          this.isUpdateSuccess = false;
          this.showAlert(response.message);
        }
        this.refresh();
      });
    }
  };

  handleGetMSAccountStatus = async (email) => {
    const model = new UserModel();
    this.props.onSetGetMSAccountStatus("idle");
    const res = await model.getMSAccountStatus(email);
    if (res.status) {
      this.props.onSetGetMSAccountStatus("success");
      this.props.onUpdateMSAccountStatusLocal(res.data.accountEnabled);
    } else {
      this.props.onSetGetMSAccountStatus("error");
      this.props.onUpdateMSAccountStatusLocal(false);
      message.error(res.message);
    }
  };
  componentDidMount = () => {
    if (this.type === "Update") {
      this.handleGetDetaiilUser();
    }
  };
  handleGetDetaiilUser = async () => {
    let userModel = new UserModel();
    await userModel.getDetailUser(this.userID).then((response) => {
      if (response.status) {
        if (response.data.user) {
          this.userDetail = response.data.user;
          this.handleGetMSAccountStatus(response.data.user.email);
          this.props.onUpdateEmail(response.data.user.email);
          this.fieldSelected.email = response.data.user.email;
          this.fieldSelected.displayName = response.data.user.displayName;
          this.fieldSelected.storeCode = response.data.user.storeCode;
          this.fieldSelected.groupCode = response.data.user.groupCode;
          this.fieldSelected.status = response.data.user.status;
        }
        this.refresh();
      } else {
        this.showAlert(response.message);
      }
    });
  };
  clearCache = async () => {
    let settModel = new SettingModel();
    await settModel.clearCache();
    message.success("Clear cache successfully");
    this.isUpdateSuccess = false;
    this.refresh();
  };

  renderComp = () => {
    let groupUserOptions = this.groupUser.map((el) => ({
      value: el.groupUserCode,
      label: el.groupUserName,
    }));
    let storesOptions = this.stores.map((el) => ({
      value: el.storeCode,
      label: el.storeCode + " - " + el.storeName,
    }));
    let userStatusOptions = [
      { value: "01", label: "Active" },
      { value: "02", label: "Inactive" },
    ];
    return (
      <section className="wrap-section">
        {/* {this.isUpdateSuccess ? (
          <div className="section-block mt-15 flex items-center gap-10 w-fit tag_warning">
            <p className="m-0">Do you want to clear cache ? </p>
            <Button onClick={this.clearCache} className="btn-danger">
              Clear
            </Button>
          </div>
        ) : null} */}
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
            <h2
              style={{
                margin: 10,
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {this.type === "Create" ? "New User" : "#" + this.userID}
            </h2>
          </div>
        </div>
        <div className="form-filter">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <div className="form-group">
                    <label htmlFor="appName" className="w100pc">
                      Email<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="email"
                      value={this.fieldSelected.email}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control h-38"
                      disabled={this.type === "Update" ? true : false}
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="form-group">
                    <label htmlFor="appName" className="w100pc">
                      {" "}
                      Display Name<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="displayName"
                      value={this.fieldSelected.displayName}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control h-38"
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="form-group">
                    <label htmlFor="groupCode" className="w100pc">
                      {" "}
                      Group<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <Select
                      style={{ height: "32" }}
                      classNamePrefix="select "
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={groupUserOptions.filter(
                        (option) =>
                          option.value == this.fieldSelected.groupCode,
                      )}
                      options={groupUserOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "groupCode",
                          e ? e.value : "",
                        )
                      }
                    />
                  </div>
                </Col>
                {this.fieldSelected.groupCode === "10" ||
                this.fieldSelected.groupCode === "11" ? (
                  <Col span={6}>
                    <div className="form-group">
                      <label htmlFor="group" className="w100pc">
                        {" "}
                        Store Code<span style={{ color: "red" }}>*</span>:{" "}
                      </label>
                      <Select
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- All --"
                        value={storesOptions.filter(
                          (option) =>
                            option.value == this.fieldSelected.storeCode,
                        )}
                        options={storesOptions}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "storeCode",
                            e ? e.value : "",
                          )
                        }
                      />
                    </div>
                  </Col>
                ) : (
                  <Col span={6}></Col>
                )}

                <Col span={6}>
                  <div className="form-group">
                    <label htmlFor="userStatus" className="w100pc">
                      Status<span style={{ color: "red" }}>*</span>:
                    </label>
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={userStatusOptions.filter(
                        (option) => option.value === this.fieldSelected.status,
                      )}
                      options={userStatusOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom("status", e ? e.value : "")
                      }
                    />
                  </div>
                </Col>
                {/* <Col span={6}>
                  <div className="form-group">
                    <label htmlFor="msAccount" className="w100pc">
                      {' '}
                      Microsoft account<span style={{ color: 'red' }}>*</span>:{' '}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="msAccount"
                      value={this.fieldSelected.msAccount}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control h-38"
                    />
                  </div>
                </Col> */}
              </Row>
            </Col>
          </Row>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row"></div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row">
                <div
                  className={this.type == "Create" ? "col-md-2" : "col-md-3"}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Show User permission */}
      </section>
    );
  };
}
