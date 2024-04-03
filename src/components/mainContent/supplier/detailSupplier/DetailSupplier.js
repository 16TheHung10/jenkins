//Plugin
import React from "react";
import Select from "react-select";

//Custom
import BaseComponent from "components/BaseComponent";
import SupplierModel from "models/SupplierModel";
import CommonModel from "models/CommonModel";

export default class SupplierDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.type = props.type;
    this.supplierCode = props.supplierCode;
    this.distributorCode = props.distributorCode;
    this.isCheckAllOrderDay = false;
    this.data.banks = [];
    this.data.supplierCodeCurrent = 0;
    this.fieldSelected = this.assignFieldSelected({
      supplierCode: "",
      supplierInternalCode: "",
      supplierName: "",
      supplierStatus: 0,
      address: "",
      phone: "",
      email: "",
      taxCode: "",
      tradingName: "",
      mov: "0",
      orderType: 0,
      orderValue: [
        { value: "2", label: "Mon", isChecked: false },
        { value: "3", label: "Tue", isChecked: false },
        { value: "4", label: "Web", isChecked: false },
        { value: "5", label: "Thu", isChecked: false },
        { value: "6", label: "Fri", isChecked: false },
        { value: "7", label: "Sat", isChecked: false },
        { value: "8", label: "Sun", isChecked: false },
      ],
      apply: true,
      numberOfDayOrder: 0,
      note: "",
      bankAccountNumber: "",
      bank: "",
      payLongTerm: "30",
    });
  }

  componentDidMount = () => {
    this.handleGetSupplier();
    this.handleGetBank();
  };
  handleGetBank = async () => {
    let commonModel = new CommonModel();
    await commonModel.getBank().then((response) => {
      if (response.status && response.data.banks) {
        this.data.banks = response.data.banks;
        this.refresh();
      }
    });
  };

  handleGetSupplierCode = () => {
    let fields = this.fieldSelected;
    return fields.supplierCode;
  };

  handleSave = async () => {
    let fields = this.fieldSelected;

    if (fields.supplierCode !== "") {
      let reg = new RegExp(
        "^([0-9]|[V]|[W])([0-9]|[N]|[H])[0-9][0-9][0-9][0-9]$",
      );
      if (!reg.test(fields.supplierCode)) {
        this.showAlert("Supplier Code does not match format XXXXXX");
        return false;
      }
    }

    if (fields.supplierInternalCode === "") {
      this.showAlert("Please enter Supplier Internal Code");
      return false;
    }

    if (fields.supplierName === "") {
      this.showAlert("Please enter Supplier Name");
      return false;
    }

    if (fields.tradingName === "") {
      this.showAlert("Please enter Trading Name");
      return false;
    }

    if (fields.address === "") {
      this.showAlert("Please enter Address");
      return false;
    }

    if (fields.phone === "") {
      this.showAlert("Please enter Phone");
      return false;
    }

    if (fields.email === "") {
      this.showAlert("Please enter Email");
      return false;
    }

    if (fields.taxCode === "") {
      this.showAlert("Please enter TaxCode");
      return false;
    }

    if (isNaN(fields.mov.trim().replaceAll(",", ""))) {
      this.showAlert("MOV format incorrect");
      return false;
    }

    if (fields.bankAccountNumber === "") {
      this.showAlert("Please enter Bank Account Number");
      return false;
    }

    if (fields.bank === "") {
      this.showAlert("Please enter Bank");
      return false;
    }

    if (fields.numberOfDayOrder === "") {
      this.showAlert("Please enter  Delivery Day");
      return false;
    }

    if (
      fields.orderValue
        .filter((item) => item.isChecked === true)
        .map((i) => {
          return i.value;
        })
        .toString() === ""
    ) {
      this.showAlert("Please select Order Day");
      return false;
    }

    let params = {
      SupplierCode: fields.supplierCode,
      SupplierInternalCode: fields.supplierInternalCode,
      SupplierName: fields.supplierName,
      SupplierStatus: fields.supplierStatus,
      Address: fields.address,
      Phone: fields.phone,
      Email: fields.email,
      TaxCode: fields.taxCode,
      TradingName: fields.tradingName,
      MOV: fields.mov.replaceAll(",", "").trim(),
      OrderType: fields.orderType,
      OrderValue: fields.orderValue
        .filter((item) => item.isChecked === true)
        .map((i) => {
          return i.value;
        })
        .toString(),
      Apply: fields.apply,
      NumberOfDayOrder: fields.numberOfDayOrder,
      Note: fields.note,
      BankAccountNumber: fields.bankAccountNumber,
      Bank: fields.bank,
      PayLongTerm: fields.payLongTerm,
    };
    let supplierModel = new SupplierModel();
    if (this.type === "Create" || this.type === "CreateDistributor") {
      await supplierModel.postSupplier(params).then((res) => {
        if (res.status) {
          this.showAlert("Save successfully!", "success");
        } else {
          this.showAlert(res.message);
        }
      });
    }

    if (this.type === "Update") {
      await supplierModel.putSupplier(this.supplierCode, params).then((res) => {
        if (res.status) {
          this.showAlert("Save successfully!", "success");
        } else {
          this.showAlert(res.message);
        }
      });
    }
  };
  handleGetSupplier = async () => {
    let supplierModel = new SupplierModel();
    let params = {
      supplierCode: this.supplierCode || "",
      supplierName: "",
      supplierStatus: "",
      pageNumber: 1,
      pageSize: 1,
    };
    await supplierModel.getListSupplier(params).then((response) => {
      if (response.status) {
        if (response.data) {
          this.data.supplierCodeCurrent = parseInt(
            response.data.supplierCodeCurrent,
          );
          if (this.type === "Create") {
            this.fieldSelected.supplierCode = this.data.supplierCodeCurrent + 1;
            this.fieldSelected.supplierInternalCode =
              this.data.supplierCodeCurrent + 1;
          }
          if (this.type === "CreateDistributor") {
            this.fieldSelected.supplierCode = this.data.supplierCodeCurrent + 1;
            this.fieldSelected.supplierInternalCode = this.distributorCode;
          }
          if (
            this.type === "Update" &&
            response.data.suppliers &&
            response.data.suppliers.length > 0
          ) {
            this.fieldSelected.supplierCode =
              response.data.suppliers[0].supplierCode;
            this.fieldSelected.supplierInternalCode =
              response.data.suppliers[0].supplierInternalCode;
            this.fieldSelected.supplierName =
              response.data.suppliers[0].supplierName;
            this.fieldSelected.supplierStatus =
              response.data.suppliers[0].status;
            this.fieldSelected.address = response.data.suppliers[0].address;
            this.fieldSelected.phone = response.data.suppliers[0].phone;
            this.fieldSelected.email = response.data.suppliers[0].email;
            this.fieldSelected.taxCode = response.data.suppliers[0].taxCode;
            this.fieldSelected.tradingName =
              response.data.suppliers[0].tradingName;
            this.fieldSelected.mov = response.data.suppliers[0].mov;
            this.fieldSelected.orderType = response.data.suppliers[0].orderType;
            let orderValueTemp = [];
            if (response.data.suppliers[0].orderValue.endsWith(",")) {
              orderValueTemp = response.data.suppliers[0].orderValue
                .slice(
                  0,
                  response.data.suppliers[0].orderValue.lastIndexOf(","),
                )
                .split(",");
            } else {
              orderValueTemp = response.data.suppliers[0].orderValue.split(",");
            }
            this.fieldSelected.orderValue.forEach((element) => {
              if (orderValueTemp.includes(element.value)) {
                element.isChecked = true;
              }
            });
            this.fieldSelected.supplierInternalCode =
              response.data.suppliers[0].supplierInternalCode;
            this.fieldSelected.apply = response.data.suppliers[0].apply;
            this.fieldSelected.numberOfDayOrder =
              response.data.suppliers[0].numberOfDayOrder;
            this.fieldSelected.note = response.data.suppliers[0].note;
            this.fieldSelected.bankAccountNumber =
              response.data.suppliers[0].bankAccountNumber;
            this.fieldSelected.bank = response.data.suppliers[0].bank;
            this.fieldSelected.payLongTerm =
              response.data.suppliers[0].payLongTerm;
            this.isCheckAllOrderDay = this.fieldSelected.orderValue.every(
              (v) => v.isChecked === true,
            );
          }
          this.refresh();
        }
      }
    });
  };

  handleChangeOrderValue = (index) => {
    this.fieldSelected.orderValue[index].isChecked =
      !this.fieldSelected.orderValue[index].isChecked;
    this.isCheckAllOrderDay = this.fieldSelected.orderValue.every(
      (v) => v.isChecked === true,
    );
    this.refresh();
  };
  handleCheckAllOrderValue = (value) => {
    this.isCheckAllOrderDay = value;
    for (let i in this.fieldSelected.orderValue) {
      this.fieldSelected.orderValue[i].isChecked = value;
    }
    this.refresh();
  };
  renderComp = () => {
    let fields = this.fieldSelected;
    let statusOptions = [
      { value: 0, label: "Open" },
      { value: 1, label: "Close" },
    ];
    let orderTypeOptions = [{ value: 0, label: "By Week" }];
    let bankOptions =
      this.data.banks.map((el) => ({
        value: el.bankCode,
        label: el.bankName,
      })) || [];
    let payLongTermOptions = [
      { value: "30", label: "30 Ngày" },
      { value: "45", label: "45 Ngày" },
      { value: "60", label: "60 Ngày" },
      { value: "90", label: "90 Ngày" },
    ];
    return (
      <section className="wrap-section">
        {/* <GuideLineComp type="supplier" /> */}
        <div className="row header-detail">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <button
              onClick={() => super.targetLink("/supplier")}
              type="button"
              className="btn btn-back"
              style={{ background: "beige" }}
            >
              Back
            </button>
            <h2
              style={{
                marginTop: "10px",
                marginBottom: "0px",
                display: "inline-block",
                verticalAlign: "middle",
                width: "900px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {this.type === "Create"
                ? "New Supplier"
                : this.type === "CreateDistributor"
                ? "New Distributor"
                : "#" + this.fieldSelected.supplierName}
            </h2>
          </div>
        </div>
        <div className="form-filter">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="supplierCode" className="w100pc">
                      {" "}
                      Supplier Code<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="supplierCode"
                      placeholder="-- Supplier Code --"
                      value={fields.supplierCode}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="supplierInternalCode" className="w100pc">
                      Internal Code<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="supplierInternalCode"
                      placeholder="-- Supplier Internal Code --"
                      value={fields.supplierInternalCode}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="supplierName" className="w100pc">
                      {" "}
                      Supplier Name<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="supplierName"
                      placeholder="-- Supplier Name --"
                      value={fields.supplierName}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group">
                    <label htmlFor="tradingName" className="w100pc">
                      {" "}
                      Trading Name<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="tradingName"
                      placeholder="-- Trading Name --"
                      value={fields.tradingName}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <div className="form-group">
                    <label htmlFor="address" className="w100pc">
                      {" "}
                      Address<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="address"
                      placeholder="-- Address --"
                      value={fields.address}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="phone" className="w100pc">
                      Phone<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="phone"
                      placeholder="-- Phone --"
                      value={fields.phone}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="email" className="w100pc">
                      Email<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="email"
                      placeholder="-- Email --"
                      value={fields.email}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="taxCode" className="w100pc">
                      TaxCode<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="taxCode"
                      placeholder="-- TaxCode --"
                      value={fields.taxCode}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="mov" className="w100pc">
                      MOV<span style={{ color: "red" }}>*</span>:{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="mov"
                      placeholder="-- MOV --"
                      value={fields.mov}
                      onChange={(e) => {
                        // var pattern = new RegExp(/^\d{0,8}(\.\d{1,4})?$/);

                        // if (e.target.value && !pattern.test(e.target.value)) {
                        //     return;
                        // }
                        this.handleChangeFieldCustom("mov", e.target.value);
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="bankAccountNumber" className="w100pc">
                      Bank Account Number<span style={{ color: "red" }}>*</span>
                      :{" "}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="bankAccountNumber"
                      placeholder="-- Bank Account Number --"
                      value={fields.bankAccountNumber}
                      onChange={(e) => {
                        var pattern = new RegExp(/^[0-9\b]+$/);

                        if (e.target.value && !pattern.test(e.target.value)) {
                          return;
                        }
                        this.handleChangeFieldCustom(
                          "bankAccountNumber",
                          e.target.value,
                        );
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="bank" className="w100pc">
                      Bank<span style={{ color: "red" }}>*</span>:
                    </label>
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- Bank --"
                      value={bankOptions.filter(
                        (option) => option.value === fields.bank,
                      )}
                      options={bankOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom("bank", e ? e.value : "")
                      }
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="payLongTerm" className="w100pc">
                      Pay Term:
                    </label>
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={payLongTermOptions.filter(
                        (option) => option.value === fields.payLongTerm,
                      )}
                      options={payLongTermOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "payLongTerm",
                          e ? e.value : "",
                        )
                      }
                    />
                  </div>
                </div>
                {this.type === "Update" && (
                  <div className="col-md-2">
                    <div className="form-group">
                      <label htmlFor="supplierStatus" className="w100pc">
                        Status:
                      </label>
                      <Select
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- All --"
                        value={statusOptions.filter(
                          (option) => option.value === fields.supplierStatus,
                        )}
                        options={statusOptions}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "supplierStatus",
                            e ? e.value : "",
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-md-3">
                  <h5>Supplier Order</h5>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="col-md-2">
                    <div className="form-group">
                      <label htmlFor="orderType" className="w100pc">
                        Order Type:{" "}
                      </label>
                      <Select
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- Order Type --"
                        value={orderTypeOptions.filter(
                          (option) => option.value === fields.orderType,
                        )}
                        options={orderTypeOptions}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "orderType",
                            e ? e.value : "",
                          )
                        }
                        isDisabled={true}
                      />
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="form-group" style={{ margin: "0px" }}>
                      <label htmlFor="numberOfDayOrder" className="w100pc">
                        Order Day
                        <span style={{ color: "red" }}>*</span>:
                        <input
                          type="checkbox"
                          style={{ marginLeft: 10 }}
                          key={1}
                          name="All"
                          checked={this.isCheckAllOrderDay}
                          value="All"
                          onChange={(e) =>
                            this.handleCheckAllOrderValue(e.target.checked)
                          }
                        />
                        <span style={{ marginLeft: 5 }}>All</span>
                      </label>
                      {fields.orderValue.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            width: "14.2%",
                            float: "left",
                            paddingTop: "10px",
                            margin: "0px",
                          }}
                        >
                          <div className="form-group">
                            <input
                              type="checkbox"
                              key={i}
                              name={item.value}
                              checked={item.isChecked}
                              value={item.value}
                              onChange={this.handleChangeOrderValue.bind(
                                null,
                                i,
                              )}
                            />
                            <label
                              htmlFor={item.label}
                              style={{ paddingLeft: "5px" }}
                              className=""
                            >
                              {item.label}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label htmlFor="numberOfDayOrder" className="w100pc">
                        Delivery Day<span style={{ color: "red" }}>*</span>:{" "}
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        name="numberOfDayOrder"
                        placeholder="-- Delivery Day --"
                        value={fields.numberOfDayOrder}
                        onChange={(e) => {
                          var pattern = new RegExp(/^[1-7]$/);

                          if (e.target.value && !pattern.test(e.target.value)) {
                            this.showAlert(
                              "Number Of Delivery Day value from 1 to 7",
                            );
                            return;
                          }
                          this.handleChangeFieldCustom(
                            "numberOfDayOrder",
                            e.target.value,
                          );
                        }}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="note" className="w100pc">
                        {" "}
                        Note:{" "}
                      </label>
                      <textarea
                        style={{ height: "65px" }}
                        type="text"
                        autoComplete="off"
                        name="note"
                        placeholder="-- Note --"
                        value={fields.note}
                        onChange={(e) => this.handleChangeField(e)}
                        className="form-control"
                      />
                    </div>
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
