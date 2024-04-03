//Plugin
import $ from "jquery";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import LoyaltyModel from "models/LoyaltyModel";

import SearchItems from "components/mainContent/loyalty/addItems";

export default class MergeMember extends BaseComponent {
  constructor(props) {
    super(props);
    this.addItemRef = React.createRef();
    this.idSearchItemsComponent = "searchItemPopup" + StringHelper.randomKey();

    this.memberCode = this.props.memberCode || "";

    this.isCreate = this.memberCode === "";
    this.isUpdateForm = this.memberCode !== "";

    this.fieldSelected = this.assignFieldSelected({
      reason: "",
      memberCode1: "",
      memberCode2: "",
    });
    // let abc = new Date("2021-08-11T10:26:04.556Z");

    this.member = 1;
    this.member1 = [];
    this.member2 = [];

    if (!this.isUpdateForm) {
      this.isRender = true;
    }
  }

  componentDidMount = () => {};

  handleActionMergePoint = () => {
    let fields = this.fieldSelected;
    let model = new LoyaltyModel();
    if (fields.memberCode1 === "") {
      this.showAlert("Please choose member id 1");
      return false;
    }

    if (fields.memberCode2 === "") {
      this.showAlert("Please choose member id 2");
      return false;
    }

    if (Object.keys(this.member1)[0].active === 0) {
      this.showAlert("Please active member id 1");
      return false;
    }
    if (Object.keys(this.member2)[0].active === 0) {
      this.showAlert("Please active member id 2");
      return false;
    }

    if (fields.reason === "") {
      this.showAlert("Please enter reason");
      return false;
    }

    let params = {
      memberCode: fields.memberCode2,
      body: {
        reason: fields.reason,
        memberCode: fields.memberCode1,
      },
    };

    model.mergePoint(params).then((res) => {
      if (res.status) {
        this.showAlert(res.message, "success");
      } else {
        this.showAlert(res.message);
      }
      this.refresh();
    });
  };

  handleAddMember = (obj) => {
    let newObj = JSON.parse(obj);

    if (
      newObj.memberCode === this.fieldSelected.memberCode2 ||
      newObj.memberCode === this.fieldSelected.memberCode1
    ) {
      this.showAlert("This member has been added");
      return false;
    }

    switch (this.member) {
      case 2:
        this.member2 = [];
        this.member2.push(newObj);
        this.fieldSelected.memberCode2 = newObj.memberCode;
        break;

      default:
        this.member1 = [];
        this.member1.push(newObj);
        this.fieldSelected.memberCode1 = newObj.memberCode;
        break;
    }
    this.refresh();
  };

  handleShowSearchItems = (type) => {
    $(".popup-form").hide();
    $("#" + this.idSearchItemsComponent).show();
    $("#" + this.idSearchItemsComponent)
      .find("[name=memberCode]")
      .focus()
      .select();

    this.items = [];
    this.member = type;

    this.refresh();
  };

  renderComp = () => {
    let fields = this.fieldSelected;

    return (
      <section className="wrap-section">
        <div className="row header-detail">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <button
              onClick={() => super.back("/loyalty")}
              type="button"
              className="btn btn-back"
              style={{ background: "beige", marginTop: 10 }}
            >
              Back
            </button>

            <button
              onClick={this.handleActionMergePoint}
              type="button"
              className="btn "
              style={{ backgroundColor: "#000", color: "white", marginTop: 10 }}
            >
              Merge ID 1 to ID 2:
            </button>
          </div>
        </div>

        <div className="form-filter">
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div className="section-block mt-15">
                <div style={{ marginBottom: 10 }}>
                  <h3 style={{ display: "inline-block" }}>Mem - ID 1: </h3>
                  <button
                    type="button"
                    onClick={() => this.handleShowSearchItems(1)}
                    style={{
                      display: "inline-block",
                      height: 38,
                      marginTop: 5,
                      marginLeft: 10,
                      verticalAlign: "baseline",
                    }}
                    className="btn btn-success btn-showpp"
                  >
                    Find member
                  </button>
                </div>
                <div className="wrap-table" style={{ marginBottom: 10 }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Member code</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Id No</th>
                        <th>Phone</th>
                        <th>Active/Lock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.member1.map((item, key) => (
                        <tr
                          key={key}
                          data-group="itemContainer"
                          data-item-code={item.memberCode}
                        >
                          <td>{item.memberCode}</td>
                          <td>{item.firstName}</td>
                          <td>{item.lastName}</td>
                          <td>{item.idNo}</td>
                          <td>{item.phone}</td>
                          <td>
                            {item.active === 0 ? (
                              <span class="label label-danger">Lock</span>
                            ) : (
                              <span class="label label-success ">Active</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {this.member1.length != 0 ? null : (
                    <div className="table-message">Member not found</div>
                  )}
                </div>
              </div>

              <div className="section-block mt-15">
                <div style={{ marginBottom: 10 }}>
                  <h3 style={{ display: "inline-block" }}>Mem - ID 2: </h3>
                  <button
                    type="button"
                    onClick={() => this.handleShowSearchItems(2)}
                    style={{
                      display: "inline-block",
                      height: 38,
                      marginTop: 5,
                      marginLeft: 10,
                      verticalAlign: "baseline",
                    }}
                    className="btn btn-success btn-showpp"
                  >
                    Find member
                  </button>
                </div>

                <div className="wrap-table" style={{ marginBottom: 10 }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Member code</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Id No</th>
                        <th>Phone</th>
                        <th>Active/Lock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.member2.map((item, key) => (
                        <tr
                          key={key}
                          data-group="itemContainer"
                          data-item-code={item.memberCode}
                        >
                          <td>{item.memberCode}</td>
                          <td>{item.firstName}</td>
                          <td>{item.lastName}</td>
                          <td>{item.idNo}</td>
                          <td>{item.phone}</td>
                          <td>
                            {item.active === 0 ? (
                              <span class="label label-danger">Lock</span>
                            ) : (
                              <span class="label label-success ">Active</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {this.member2 != 0 ? null : (
                    <div className="table-message">Member not found</div>
                  )}
                </div>
              </div>

              <div className="section-block mt-15">
                <div className="form-group">
                  <h3 className="required">Reason</h3>
                  <textarea
                    className="form-control mt-15"
                    name="reason"
                    placeholder="-- Reason --"
                    rows={7}
                    value={fields.reason}
                    onChange={this.handleChangeField}
                  />
                </div>
              </div>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              {this.idSearchItemsComponent ? (
                <SearchItems
                  member={this.member}
                  idComponent={this.idSearchItemsComponent}
                  ref={this.addItemRef}
                  selectedItems={this.items}
                  items={this.items}
                  memberSearch={this.memberSearch}
                  memberPhoneSearch={this.memberPhoneSearch}
                  addMemberMerge={this.handleAddMember}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  };
}
