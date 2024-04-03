import React, { Fragment } from "react";
import $ from "jquery";
import { message } from "antd";
import BaseComponent from "components/BaseComponent";
import cityJson from "data/json/city.json";
import {
  APIHelper,
  DateHelper,
  PageHelper,
  StringHelper,
  UrlHelper,
} from "helpers";
import CommonModel from "models/CommonModel";
import CustomerServiceModel from "models/CustomerServiceModel";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import CustomerServiceDetails from "./CustomerServiceDetails";
import DrawerEdit from "./DrawerEdit";
export default class CustomerService extends BaseComponent {
  constructor(props) {
    super(props);

    this.city = [];
    this.district = [];
    this.hasInfo = null;

    this.openDrawer = false;
    this.openDrawerTest = false;

    this.fieldSelected = this.assignFieldSelected({
      startdate: "",
      enddate: "",
      allowResetAccount: false,
      isUserNotFound: false,
    });
    this.searchData = {};

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        if (filters["startdate"]) {
          filters["startdate"] = new Date(filters["startdate"]);
        }
        if (filters["enddate"]) {
          filters["enddate"] = new Date(filters["enddate"]);
        }

        return true;
      },
    );

    this.isRender = true;
  }

  handleInitSearch() {
    const searchObject = UrlHelper.getSearchParamsObject();
    if (searchObject.phone) {
      this.fieldSelected.phoneSearch = searchObject.phone;
      this.hanldeSearchInfo();
      this.refresh();
    } else return;
  }
  componentDidMount() {
    this.hanldeUpdateState();
    this.handleInitSearch();
  }

  hanldeUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getAreaStore().then((response) => {
      if (response.status) {
        let resData = response.data.address;
        this.city = resData.city;
        this.district = resData.district;
      }
    });

    this.refresh();
  };

  hanldeSearchInfo = async () => {
    let fields = this.fieldSelected;
    var params = {
      phone: this.fieldSelected.phoneSearch,
    };

    if (this.validate(params.phone)) {
      var model = new CustomerServiceModel();
      APIHelper.withParams(params, async () => {
        const response = await model.getInfo(params);
        if (response.status) {
          document.querySelector(".bgresetpass").style.backgroundImage = "none";
          let resData = response.data.member;
          fields.hasInfo = true;
          fields.firstName = resData.firstName;
          fields.lastName = resData.lastName;
          fields.memberNo = resData.memberNo;
          fields.birthday = resData.birthday
            ? new Date(resData.birthday)
            : null;
          fields.password = resData.password;
          fields.totalPoint = resData.totalPoint;
          fields.email = resData.email;
          fields.sex = resData.sex;
          fields.cityID = resData.cityID || "";
          fields.wardID = resData.wardID || "";
          fields.districtID = resData.districtID || "";
          fields.address = resData.address || "";
          fields.redeem = response.data.redeem || {};
          fields.status = resData.status;
          fields.active = resData.active;
          fields.blocked = resData.blocked;
          fields.phone = resData.phone;
          fields.transactionDate = resData.transactionDate;

          fields.idNo = resData.idNo;
          fields.registerDate = resData.registerDate;

          let paramsBill = {
            memberNo: fields.memberNo,
            startdate:
              fields.startdate !== ""
                ? DateHelper.displayDateFormat(fields.startdate)
                : "",
            enddate:
              fields.enddate !== ""
                ? DateHelper.displayDateFormat(fields.enddate)
                : "",
          };

          model.getBill(paramsBill).then((res) => {
            fields.bill = res.data || {};
            this.refresh();
          });
          fields.allowResetAccount = false;
          this.fieldSelected = JSON.parse(JSON.stringify({ ...fields })) || {};
          this.searchData = fields;
          this.refresh();
        } else {
          fields.allowResetAccount = true;
          fields.hasInfo = false;
          message.error(response.message);
          if (response.message === "Customers has not registered an account!") {
            this.fieldSelected.isUserNotFound = true;
            this.refresh();
          }
          this.refresh();
        }
        return response;
      });
    }
  };

  validate = (value) => {
    var isValid = true;
    if (!value) {
      isValid = false;
      message.error("Please enter your phone number.");
      return;
    }

    if (typeof value !== undefined) {
      var pattern = new RegExp(/^[0-9\b]+$/);

      if (!pattern.test(value)) {
        isValid = false;
        message.error("Please enter only number.");
      } else if (value.length !== 10) {
        isValid = false;
        message.error("Please enter valid phone number.");
      }
    }

    return isValid;
  };

  hanldeUpdateInfo = () => {
    let fields = this.fieldSelected;
    var params = {
      memberNo: fields.memberNo,
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      sex: fields.sex,
      address: fields.address,
      cityID: fields.cityID,
      district: fields.district,
      birthday:
        fields.birthday && DateHelper.displayDateFormat(fields.birthday),
    };

    var answer = window.confirm('Please help me confirm the action "UPDATE"');

    if (answer === true) {
      var model = new CustomerServiceModel();
      model.updateInfo(params).then((response) => {
        if (response.status) {
          this.showAlert(response.message, "success");
          this.openDrawer = false;
          this.refresh();
        } else {
          this.showAlert(response.message);
        }
      });
    }
  };

  handleUpdateCSInfo = (data) => {
    var answer = window.confirm('Please help me confirm the action "UPDATE"');
    if (answer === true) {
      var model = new CustomerServiceModel();
      model
        .updateInfo({ ...data, email: this.fieldSelected.email })
        .then((response) => {
          if (response.status) {
            this.showAlert(response.message, "success");
            this.openDrawer = false;
            this.fieldSelected = {
              ...data,
              email: this.fieldSelected.email,
              birthday: data.birthday ? new Date(data.birthday) : null,
            };
            this.refresh();
          } else {
            this.showAlert(response.message);
          }
        });
    }
  };

  hanldeResetPass = (message) => {
    if (!this.validate(this.fieldSelected.phoneSearch)) {
      return;
    }
    var params = {
      phone: this.fieldSelected.phoneSearch,
    };

    var answer = window.confirm(
      "Please help me confirm the action " + (message || "RESET PASSWORD"),
    );
    if (answer === true) {
      var model = new CustomerServiceModel();
      model.getNewPass(params).then((response) => {
        if (response.status) {
          let resData = response.data.member;
          this.fieldSelected.password = resData.password;

          this.showAlert(response.message, "success");
          this.fieldSelected.isUserNotFound = false;
          this.openDrawer = false;
          this.refresh();
        } else {
          this.showAlert(response.message);
        }
      });
    }
  };

  hanldeResetAccount = () => {
    if (!this.validate(this.fieldSelected.phone)) {
      return;
    }
    var params = {
      phone: this.fieldSelected.phone,
    };

    var answer = window.confirm(
      'Please help me confirm the action "RESET ACCOUNT"',
    );

    if (answer === true) {
      var model = new CustomerServiceModel();
      model.getNewPass(params).then((response) => {
        if (response.status) {
          let resData = response.data.member;
          this.fieldSelected.password = resData.password;

          this.showAlert(response.message, "success");
          this.refresh();
        } else {
          this.showAlert(response.message);
        }
      });
    }
  };

  hanldeShowChildItem = (e, index) => {
    if ($(e.target).closest(".row-item").hasClass("clicked")) {
      $(e.target).closest(".row-item").removeClass("clicked");
      $(".elmChild" + index).addClass("hide");
    } else {
      $(e.target).closest(".row-item").addClass("clicked");
      $(".elmChild" + index).removeClass("hide");
    }
  };
  showDrawer = () => {
    this.openDrawer = true;
    this.refresh();
  };
  onCloseDrawer = () => {
    this.openDrawer = false;
    this.refresh();
  };
  openTest = () => {
    this.openDrawerTest = true;
    this.refresh();
  };
  renderFilter() {
    let fields = this.fieldSelected;

    let sexOption = [
      { value: "Nam", label: "Nam" },
      { value: "Nữ", label: "Nữ" },
    ];

    let cityList = this.city;
    let cityOption =
      cityJson.map((el) => ({
        value: el.code,
        // value: el.name.replace('Thành phố ', '').replace('Tỉnh ', ''),
        label: el.name.replace("Thành phố ", "").replace("Tỉnh ", ""),
      })) || [];

    let districtList = this.district;
    let districtOption = districtList[fields.city]
      ? Object.keys(districtList[fields.city]).map((key) => {
          return { value: key, label: districtList[fields.city][key].name };
        })
      : [];
    const cloneFieldSelected = this.fieldSelected;
    return (
      <div id="customer_detail" className="form-filter bgresetpass child-mrb-5">
        <DrawerEdit
          onUpdateUserInfo={this.handleUpdateCSInfo}
          size="large"
          initialData={this.fieldSelected}
          //   title={`Edit customer #${this.fieldSelected?.memberNo}`}
          placement="right"
          onClose={this.onCloseDrawer}
          open={this.openDrawer}
          onResetPass={() => this.hanldeResetPass.call(this, "RESET PASSWORD")}
        />
        {/* <Drawer onClose={this.onCloseDrawer} open={this.openDrawer}>
          olala
        </Drawer> */}
        <div className="section-block">
          <div className="row">
            <div
              className={`form-group ${
                this.fieldSelected.isUserNotFound
                  ? "col-md-5 col-xl-3"
                  : "col-md-4 col-xl-2"
              }`}
            >
              <label className="w100pc">Find information:</label>
              <div className="flex gap-10">
                <input
                  style={{ maxWidth: "200px" }}
                  type="text"
                  autoComplete="off"
                  className="form-control"
                  name="phoneSearch"
                  placeholder="Phone number"
                  value={this.fieldSelected.phoneSearch || ""}
                  onChange={(e) => {
                    var pattern = new RegExp(/^[0-9\b]+$/);
                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }
                    this.handleChangeFieldCustom("phoneSearch", e.target.value);
                    this.fieldSelected.isUserNotFound = false;
                    this.refresh();
                  }}
                />

                <BaseButton iconName="search" onClick={this.hanldeSearchInfo}>
                  Search
                </BaseButton>
                {this.fieldSelected.isUserNotFound ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => this.hanldeResetPass('"CREATE NEW ACCOUNT"')}
                    style={{ height: 38 }}
                  >
                    Create new account
                  </button>
                ) : null}
              </div>
              {this.fieldSelected.isUserNotFound ? (
                <p className="cl-red mt-10">
                  <span className="cl-red required">Chú ý: </span>{" "}
                  <span>
                    {" "}
                    Tài khoản không tồn tại trên hệ thống, click "Create new
                    account" để cấp mật khẩu (Mật khẩu mới sẽ được gửi vào số
                    điện thoại {this.fieldSelected.phone})
                  </span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="details mt-10">
            <CustomerServiceDetails
              isUserNotFound={this.fieldSelected.isUserNotFound}
              data={this.fieldSelected}
              onOpenEdit={this.showDrawer}
            />
          </div>

          {this.fieldSelected.redeem &&
            Object.keys(this.fieldSelected.redeem).length !== 0 && (
              <div className="row">
                <div className="col-md-12">
                  <div className="wrap-table">
                    <table className="table table-hover detail-search-rcv">
                      <thead>
                        <tr>
                          <th>Item code</th>
                          <th>Item name</th>
                          <th className="rule-date">Created date</th>
                          <th className="rule-number">Redeem point</th>
                          <th>Voucher code</th>
                          <th>Used</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{this.fieldSelected.redeem.itemCode}</td>
                          <td>{this.fieldSelected.redeem.itemName}</td>
                          <td className="rule-date">
                            {DateHelper.displayDate(
                              this.fieldSelected.redeem.createdDate,
                            )}
                          </td>
                          <td className="rule-number">
                            {this.fieldSelected.redeem.redeemPoint}
                          </td>
                          <td>{this.fieldSelected.redeem.voucherCode}</td>
                          <td>
                            {this.fieldSelected.redeem.used === 0 ? (
                              <span className={"label label-success"}>
                                open
                              </span>
                            ) : (
                              <span className={"label label-warning"}>
                                close
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          {this.fieldSelected.bill &&
            Object.keys(this.fieldSelected.bill).length !== 0 && (
              <div className="row mrt-10">
                <div className="col-md-12">
                  <div className="wrap-table">
                    <table className="table table-hover detail-search-rcv bg-cadetblue">
                      <thead>
                        <tr>
                          <th colSpan="4">Bill code</th>
                          <th className="rule-date">Date</th>
                          <th className="rule-number">Total bill</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(this.fieldSelected.bill).map(
                          (elm, indexElm) => (
                            <Fragment key={indexElm}>
                              <tr className="row-item">
                                <td colSpan="4">
                                  <span
                                    onClick={(e) =>
                                      this.hanldeShowChildItem(e, indexElm)
                                    }
                                    className={"btn-arr"}
                                  ></span>{" "}
                                  # {elm}
                                </td>
                                <td className="rule-date">
                                  {DateHelper.displayDate(
                                    this.fieldSelected.bill[elm].date,
                                  )}
                                </td>
                                <td className="rule-number">
                                  {StringHelper.formatPrice(
                                    this.fieldSelected.bill[elm].totalBill,
                                  )}
                                </td>
                              </tr>

                              <tr
                                className={
                                  "pdt-10 hide row-item-detail " +
                                  "elmChild" +
                                  indexElm
                                }
                              >
                                <th className={"bg-chocolate"}>Item code</th>
                                <th className={"bg-chocolate"}>Item name</th>
                                <th className={"bg-chocolate rule-number"}>
                                  Sales price
                                </th>
                                <th className={"bg-chocolate rule-number"}>
                                  Qty
                                </th>
                                <th className={"bg-chocolate rule-number"}>
                                  Discount amount
                                </th>
                                <th className={"bg-chocolate rule-number"}>
                                  Amount
                                </th>
                              </tr>
                              {this.fieldSelected.bill[elm].details.map(
                                (elm2, indexElm2) => (
                                  <tr
                                    className={
                                      "pdt-10 hide row-item-detail " +
                                      "elmChild" +
                                      indexElm
                                    }
                                    key={indexElm2}
                                  >
                                    <td>{elm2.itemCode}</td>
                                    <td>{elm2.itemName}</td>
                                    <td className="rule-number">
                                      {StringHelper.formatPrice(
                                        elm2.salesPrice,
                                      )}
                                    </td>
                                    <td className="rule-number">
                                      {StringHelper.formatQty(elm2.qty)}
                                    </td>
                                    <td className="rule-number">
                                      {StringHelper.formatPrice(
                                        elm2.discountAmount,
                                      )}
                                    </td>
                                    <td className="rule-number">
                                      {StringHelper.formatPrice(elm2.amount)}
                                    </td>
                                  </tr>
                                ),
                              )}
                              <tr
                                className={
                                  "disableHover pdt-10 hide row-item-detail " +
                                  "elmChild" +
                                  indexElm
                                }
                              >
                                <td
                                  colSpan="6"
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                  }}
                                ></td>
                              </tr>
                            </Fragment>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }

  renderComp() {
    return <section>{this.renderFilter()}</section>;
  }
}
