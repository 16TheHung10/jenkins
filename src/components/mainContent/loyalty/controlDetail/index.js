//Plugin
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
//Custom
import BaseComponent from "components/BaseComponent";
import CommonModel from "models/CommonModel";

export default class ControlDetail extends BaseComponent {
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
    this.fieldSelected.dayOfWeeks = [];
    this.dayOfWeeks = {
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat",
      8: "Sun",
    };
    this.data.partners = {};
    this.fieldSelected.partnerList = [{ codeName: "", codeValue: "" }];
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
    this.fieldSelected.discountBill = "";

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
      this.refresh();
    }

    if (this.isCreate !== newProps.isCreate) {
      this.isCreate = newProps.isCreate;
      this.refresh();
    }

    if (newProps.group) {
      this.listGroup = newProps.group;
      this.refresh();
    }
    if (newProps.promotionName !== this.fieldSelected.promotionName) {
      this.fieldSelected.promotionName = newProps.promotionName;
      this.refresh();
    }
  }

  async handleUpdateState() {
    if (
      !this.isUpdateForm ||
      (!this.infoPromotion.approved && !this.infoPromotion.cancel)
    ) {
      let commonModel = new CommonModel();
      await commonModel.getData("store,partners").then((response) => {
        if (response.status && response.data.stores) {
          this.data.stores = response.data.stores;
          this.data.partners = response.data.partners || [];
        }
      });

      this.refresh();
    }
  }

  renderIOStatus() {
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

  hanldeChangeInputSelect = (e, index, name) => {
    const fields = this.fieldSelected;
    const elm = e || { value: "", label: "" };

    const list = [...fields.partnerList];

    list[index][name] = elm.value;
    fields.partnerList = list;

    this.refresh();
  };

  hanldeChangeInput = (e, index) => {
    let fields = this.fieldSelected;
    const { name, value } = e.target;
    const list = [...fields.partnerList];

    list[index][name] = value;

    fields.partnerList = list;
    this.props.updatePartnerList(list);
    this.refresh();
  };

  hanldeAddInput = () => {
    let fields = this.fieldSelected;

    fields.partnerList.push({ codeName: "", codeValue: "" });

    this.refresh();
  };

  hanldeRemoveInput = (index) => {
    let fields = this.fieldSelected;
    const list = [...fields.partnerList];

    list.splice(index, 1);

    fields.partnerList = list;
    this.refresh();
  };

  hanldeChangeCheckbox = (e) => {
    this.handleMultiChecked(e);
    this.hanldeUpdateDaily();
  };

  hanldeUpdateDaily = () => {
    let fields = this.fieldSelected;

    this.props.updateDayOfWeeks(fields.dayOfWeeks);
  };

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

    // PARTNER:
    let partners = this.data.partners;
    let partnersOption = Object.keys(partners).map((elm) => {
      let obj = { value: partners[elm].key, label: partners[elm].value };
      return obj;
    });

    return (
      <section>
        <div className="form-filter">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      First name:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="firstName"
                      placeholder="-- First name --"
                      value={this.fieldSelected.promotionName}
                      onChange={(e) =>
                        this.handleChangeField(
                          e,
                          this.props.updatePromotionName(e.target.value),
                        )
                      }
                      className="form-control"
                      disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Last name:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="lastName"
                      placeholder="-- Last name --"
                      value={this.fieldSelected.promotionName}
                      onChange={(e) =>
                        this.handleChangeField(
                          e,
                          this.props.updatePromotionName(e.target.value),
                        )
                      }
                      className="form-control"
                      disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Phone:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="phone"
                      placeholder="-- Phone --"
                      value={this.fieldSelected.promotionName}
                      onChange={(e) =>
                        this.handleChangeField(
                          e,
                          this.props.updatePromotionName(e.target.value),
                        )
                      }
                      className="form-control"
                      disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="storeCode" className="w100pc">
                    Date of birth:
                  </label>
                  <DatePicker
                    placeholderText="-- Date of birth --"
                    selected={fields.startDate}
                    onChange={(value) =>
                      this.handleChangeFieldCustom(
                        "birthDate",
                        value,
                        this.props.updateStartDate(value),
                      )
                    }
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    className="form-control"
                    autoComplete="off"
                    disabled={this.isCreate ? false : true}
                    isClearable={
                      !this.isCreate ? false : fields.startDate ? true : false
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Email:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="email"
                      placeholder="-- Email --"
                      value={this.fieldSelected.promotionName}
                      onChange={(e) =>
                        this.handleChangeField(
                          e,
                          this.props.updatePromotionName(e.target.value),
                        )
                      }
                      className="form-control"
                      disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Passport:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="passport"
                      placeholder="-- Passport --"
                      value={this.fieldSelected.promotionName}
                      onChange={(e) =>
                        this.handleChangeField(
                          e,
                          this.props.updatePromotionName(e.target.value),
                        )
                      }
                      className="form-control"
                      disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Address:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="address"
                      placeholder="-- Address --"
                      value={this.fieldSelected.promotionName}
                      onChange={(e) =>
                        this.handleChangeField(
                          e,
                          this.props.updatePromotionName(e.target.value),
                        )
                      }
                      className="form-control"
                      disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Gender:
                    </label>
                    <Select
                      // isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- Gender --"
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
              </div>

              {/* <div className="row">
                                
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
                                            onChange={(e)=>this.handleChangeField(e,this.props.updatePromotionName(e.target.value))}
                                            className="form-control"
                                            disabled={this.isCreate ? false : true}
                                        />
                                    </div>
                                </div>
                             
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="w100pc">Date: </label>
                                        <div className="row date-row-ft">
                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                                <DatePicker
                                                    placeholderText="Start date"
                                                    selected={fields.startDate}
                                                    onChange={(value) => this.handleChangeFieldCustom("startDate", value,this.props.updateStartDate(value))}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                    className="form-control"
                                                    autoComplete="off"
                                                    disabled={this.isCreate ? false : true}
                                                    isClearable={!this.isCreate ? false : (fields.startDate ? true : false)}
                                                />
                                            </div>
                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                                <DatePicker
                                                    placeholderText="End date"
                                                    selected={fields.endDate}
                                                    onChange={(value) => this.handleChangeFieldCustom("endDate", value,this.props.updateEndDate(value))}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                    className="form-control"
                                                    autoComplete="off"
                                                    disabled={this.isCreate ? false : true}
                                                    isClearable={!this.isCreate ? false : (fields.endDate ? true : false)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                     
                                {
                                    !this.isCreate && 
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="w100pc">Created date: </label>
                                            <DatePicker
                                                placeholderText="End date"
                                                selected={fields.createdDate}
                                                onChange={(value) => this.handleChangeFieldCustom("createdDate", value)}
                                                dateFormat="dd/MM/yyyy"
                                                minDate={new Date()}
                                                className="form-control"
                                                autoComplete="off"
                                                disabled={true}
                                                isClearable={!this.isCreate ? false : (fields.createdDate ? true : false)}
                                            />
                                        </div>
                                    </div>
                                }

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <div className="w100pc">Valid day of week:</div>
                                        {Object.keys(this.dayOfWeeks).map((item, i) => (
                                            <label key={i} style={{paddingRight: 10}}>
                                                <input
                                                    type="checkbox"
                                                    name="dayOfWeeks"
                                                    checked={this.fieldSelected.dayOfWeeks.includes(item)}
                                                    onChange={(e) => this.hanldeChangeCheckbox(e)}
                                                    value={item}
                                                />{" "}
                                                {this.dayOfWeeks[item]}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                   
                                {
                                    !this.isCreate && 
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
                                                value={this.data.orderstatus.filter((option) => option.value === fields.orderStatus)}
                                                options={this.data.orderstatus}
                                                onChange={(e) => this.handleChangeFieldCustom("orderStatus", e ? e.value : "", this.props.updateActive(e.value))}
                                            />
                                        </div>
                                    </div>
                                }

                                
                            </div>
                            <div className="row">
                              
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="storeCode" className="w100pc">
                                            Apply store:
                                        </label>
                                        <Select
                                            isDisabled={this.isCreate ? false : true}
                                            isClearable
                                            isMulti
                                            classNamePrefix="select"
                                            maxMenuHeight={260}
                                            placeholder="-- All --"
                                            value={storeOptions.filter((option) => fields.storeCode.indexOf(option.value) !== -1)}
                                            options={storeOptions}
                                            onChange={(e) => this.handleChangeFieldsCustom("storeCode", e ? e : "", this.props.updateStore(e))}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="storeCode" className="w100pc">
                                            Discount bill:
                                        </label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            name="discountBill"
                                            value={this.fieldSelected.discountBill}
                                            onChange={(e)=>this.handleChangeField(e,this.props.updateDiscountBill(e.target.value))}
                                            className="form-control"
                                            disabled={this.isCreate ? false : true}
                                        />
                                    </div>
                                </div>

                                {this.isUpdateForm ? (
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="w100pc">Status : {this.renderIOStatus()}</label>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <label>Payment:</label>
                                    {
                                        fields.partnerList.map((x,i)=>{
                                            return (
                                                <div key={i} className="row">
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                        <Select
                                                            name="codeName"
                                                            placeholder="Choose ..."
                                                            isClearable
                                                            classNamePrefix="select"
                                                            value={partnersOption.filter((el) => el.value === fields.partnerList[i]["codeName"])}
                                                            onChange={(e) => this.hanldeChangeInputSelect(e, i,"codeName")}
                                                            options={partnersOption}
                                                        />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <input
                                                                name="codeValue"
                                                                placeholder="Discount"
                                                                value={x.codeValue}
                                                                onChange={(e) => this.hanldeChangeInput(e, i)}
                                                                className="form-control key-codeValue"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            {fields.partnerList.length !== 1 && (
                                                                <button type="button" onClick={() => this.hanldeRemoveInput(i)} className="btn btn-success" style={{ height: 38 }}>
                                                                    &nbsp;-&nbsp;
                                                                </button>
                                                            )}
                                                            {fields.partnerList.length - 1 === i && (
                                                                <button type="button" onClick={this.hanldeAddInput} className="btn btn-success" style={{ height: 38 }}>
                                                                    &nbsp;+&nbsp;
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                             */}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
