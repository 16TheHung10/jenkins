//Plugin
import React from "react";
import DatePicker from "react-datepicker";
import Select, { components } from "react-select";
//Custom
import BaseComponent from "components/BaseComponent";
import CommonModel from "models/CommonModel";

export default class ControlDetailDiscountList extends BaseComponent {
  constructor(props) {
    super(props);
    this.isCreate = this.props.isCreate;
    this.infoPromotion = this.props.infoPromotion || {};

    this.isUpdateForm = (this.infoPromotion.poCode || "") !== "";
    this.isAllowUpdate =
      !this.isUpdateForm ||
      (!this.infoPromotion.approved && !this.infoPromotion.cancel);

    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/

    this.data.stores = [];
    this.data.orderstatus = [
      { value: "1", label: "Active" },
      { value: "0", label: "Inactive" },
    ];

    if (this.infoPromotion.storeCode) {
      this.fieldSelected.storeCode = this.infoPromotion.storeCode;
      this.data.storeName = this.infoPromotion.storeName;
    }

    this.fieldSelected.promotionName = this.props.promotionName || "";
    // this.fieldSelected.discountBill = "";

    this.fieldSelected.createdDate = this.infoPromotion.createdDate
      ? new Date(this.infoPromotion.createdDate)
      : new Date();
    this.fieldSelected.startDate = this.infoPromotion.fromDate
      ? new Date(this.infoPromotion.fromDate)
      : new Date();
    this.fieldSelected.endDate = this.infoPromotion.toDate
      ? new Date(this.infoPromotion.toDate)
      : new Date();

    this.fieldSelected.group = "";

    this.fieldSelected.qtyBuy = this.props.qtyBuy || "";
    this.fieldSelected.discountAmount = this.props.discountAmount || "";
    this.fieldSelected.orderStatus = this.infoPromotion.active
      ? this.infoPromotion.active.toString()
      : "";

    this.listGroup = this.props.group || [];

    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/

    this.isRender = true;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    let isPoChange = this.props.infoPromotion !== newProps.infoPromotion;
    if (isPoChange) {
      this.infoPromotion = newProps.infoPromotion;
    }

    if (this.isCreate !== newProps.isCreate) {
      this.isCreate = newProps.isCreate;
    }

    if (newProps.group) {
      this.listGroup = newProps.group;
    }
    if (newProps.promotionName !== this.fieldSelected.promotionName) {
      this.fieldSelected.promotionName = newProps.promotionName;
    }

    if (newProps.qtyBuy !== this.fieldSelected.qtyBuy) {
      this.fieldSelected.qtyBuy = newProps.qtyBuy;
    }
    if (newProps.discountAmount !== this.fieldSelected.discountAmount) {
      this.fieldSelected.discountAmount = newProps.discountAmount;
    }

    this.refresh();
  }

  async handleUpdateState() {
    if (
      !this.isUpdateForm ||
      (!this.infoPromotion.approved && !this.infoPromotion.cancel)
    ) {
      let commonModel = new CommonModel();
      await commonModel.getData("store").then((response) => {
        if (response.status && response.data.stores) {
          this.data.stores = response.data.stores;
        }
      });

      this.refresh();
    }
  }

  renderStatus() {
    if (this.isUpdateForm) {
      if (this.infoPromotion.poCode === undefined) {
        return <span className="label label-danger">Invalid</span>;
      } else if (this.infoPromotion.approved && this.infoPromotion.cancel) {
        return <span className="label label-default">Approved/Deleted</span>;
      } else if (this.infoPromotion.approved) {
        return <span className="label label-success">Approved</span>;
      } else if (this.infoPromotion.cancel) {
        return <span className="label label-danger">Deleted</span>;
      } else if (!this.infoPromotion.cancel && !this.infoPromotion.approved) {
        return <span className="label label-warning">Processing</span>;
      }
    }
    return "";
  }

  renderComp() {
    let fields = this.fieldSelected;

    let stores = this.data.stores;
    let orderStore = {};
    let storeOptions = [];

    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });

    if (Object.keys(stores).length === 0) {
      let obj = {
        value: this.data.storeCode,
        label: this.data.storeCode + " - " + this.data.storeName,
      };
      storeOptions.push(obj);
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        let obj = {
          value: stores[key].storeCode,
          label: stores[key].storeCode + " - " + stores[key].storeName,
        };
        return obj;
      });
    }

    const styles = {
      control: (styles) => ({ ...styles }),
      option: (styles, { data }) => {
        return { ...styles };
      },
      multiValue: (styles, { data }) => {
        return {
          ...styles,
          diplay: "flex",
          flexWrap: "nowrap",
          flex: "1 1 0px",
        };
      },
      multiValueLabel: (styles, { data }) => ({ ...styles, flex: "1 1 0px" }),
    };

    return (
      <section>
        <div className="form-filter">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row">
                {/* GROUP */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Promotion name:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="promotionName"
                      placeholder="-- Promotion --"
                      value={this.fieldSelected.promotionName}
                      onChange={(e) =>
                        this.handleChangeField(
                          e,
                          this.props.updatePromotionName(e.target.value),
                        )
                      }
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                {/* DATE */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="w100pc">Date: </label>
                    <div className="row date-row-ft">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="Start date"
                          selected={fields.startDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "startDate",
                              value,
                              this.props.updateStartDate(value),
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                          className="form-control"
                          autoComplete="off"
                          // disabled={this.isCreate ? false : true}
                          isClearable={
                            !this.isCreate
                              ? false
                              : fields.startDate
                              ? true
                              : false
                          }
                        />
                      </div>
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="End date"
                          selected={fields.endDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "endDate",
                              value,
                              this.props.updateEndDate(value),
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                          className="form-control"
                          autoComplete="off"
                          // disabled={this.isCreate ? false : true}
                          isClearable={
                            !this.isCreate
                              ? false
                              : fields.endDate
                              ? true
                              : false
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CREATED DATE */}
                {!this.isCreate && (
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="w100pc">Created date: </label>
                      <DatePicker
                        placeholderText="End date"
                        selected={fields.createdDate}
                        onChange={(value) =>
                          this.handleChangeFieldCustom("createdDate", value)
                        }
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        className="form-control"
                        autoComplete="off"
                        disabled={true}
                        isClearable={
                          !this.isCreate
                            ? false
                            : fields.createdDate
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                )}

                {/* STATUS */}
                {!this.isCreate && (
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="storeCode" className="w100pc">
                        Status:
                      </label>
                      <Select
                        // isClearable
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="--"
                        value={this.data.orderstatus.filter(
                          (option) => option.value === fields.orderStatus,
                        )}
                        options={this.data.orderstatus}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "orderStatus",
                            e ? e.value : "",
                            this.props.updateActive(e.value),
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {/* STORE */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Apply store:
                    </label>
                    <Select
                      // isDisabled={this.isCreate ? false : true}
                      isClearable
                      isMulti
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={storeOptions.filter(
                        (option) =>
                          fields.storeCode.indexOf(option.value) !== -1,
                      )}
                      options={storeOptions}
                      onChange={(e) =>
                        this.handleChangeFieldsCustom(
                          "storeCode",
                          e ? e : "",
                          this.props.updateStore(e),
                        )
                      }
                      hideSelectedOptions={false}
                      styles={styles}
                      components={{ ValueContainer }}
                      autosize={false}
                    />
                  </div>
                </div>

                {this.isUpdateForm ? (
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="w100pc">
                        Status : {this.renderStatus()}
                      </label>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="qtyBuy" className="w100pc">
                      Quantity Buy:
                    </label>
                    <input
                      type="number"
                      autoComplete="off"
                      name="qtyBuy"
                      placeholder="-- Quantity --"
                      value={this.fieldSelected.qtyBuy}
                      onChange={(e) =>
                        this.handleChangeField(
                          e,
                          this.props.updateQtyBuy(e.target.value),
                        )
                      }
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="discountAmount" className="w100pc">
                      Discount amount:
                    </label>
                    <input
                      type="number"
                      autoComplete="off"
                      name="discountAmount"
                      placeholder="-- Amount --"
                      value={this.fieldSelected.discountAmount}
                      onChange={(e) =>
                        this.handleChangeField(
                          e,
                          this.props.updateDiscountAmount(e.target.value),
                        )
                      }
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const ValueContainer = ({ children, getValue, ...props }) => {
  let maxToShow = 2;
  var length = getValue().length;
  let displayChips = React.Children.toArray(children).slice(0, maxToShow);
  let shouldBadgeShow = length > maxToShow;
  let displayLength = length - maxToShow;

  return (
    <components.ValueContainer {...props}>
      {!props.selectProps.inputValue && displayChips}
      <div className="style-store">
        {shouldBadgeShow && `+ ${displayLength} `}
      </div>
    </components.ValueContainer>
  );
};
