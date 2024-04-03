//Plugin
import $ from "jquery";
import QRCode from "qrcode.react";
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import imgLogoQr from "./images/logoaboutus.png";
//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, PageHelper, StringHelper } from "helpers";

import SearchItems from "components/mainContent/promotion/addItemCode";
import CommonModel from "models/CommonModel";
import PromotionModel from "models/PromotionModel";
import VoucherModel from "models/VoucherModel";

export default class SearchCheckin extends BaseComponent {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();

    this.listSearchCheckinRef = React.createRef();
    this.idListComponent = "listPromotion" + StringHelper.randomKey();
    this.idSearchItemsComponent = "searchItemPopup" + StringHelper.randomKey();

    //Default data
    this.data.stores = [];
    this.data.typeVoucherOpt = [
      { value: "cash", label: "Voucher cash" },
      { value: "product", label: "Voucher product" },
      { value: "point", label: "Point" },
    ];
    this.data.valueVoucherOpt = [
      { value: "10000", label: "10000" },
      { value: "15000", label: "15000" },
      { value: "20000", label: "20000" },
      { value: "30000", label: "30000" },
    ];
    this.data.types = [];
    this.itemCount = 0;
    this.items = [];

    this.data.statusOpt = [
      { value: "active", label: "Start" },
      { value: "unactive", label: "Stop" },
    ];

    this.qrList = [];

    this.isStatus = false;
    this.isAllowUpdate = true;
    this.isShowBtnHistorey = false;
    this.promotionActive = 0;

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.minDate = this.tomorrow;

    //Data Selected
    this.fieldSelected = this.assignFieldSelected(
      {
        searchStartDate: "",
        searchEndDate: "",

        startDate: "",
        endDate: "",

        typeVoucher: "",

        cashDate: this.minDate,
        cashExpired: "",
        amount: "",
        totalBillApprove: "",

        cashDate2: "",
        cashExpired2: "",
        amount2: "",
        totalBillApprove2: "",

        productDate: this.minDate,
        productExpired: "",
        productCode: "",

        pointReward: "",

        // url:"https://gs25.com.vn/register-app?promotionCode=2&storeCode=VN0002",
        url: "",
        promotionCode: "",

        status: "unactive",
      },
      ["storeCode"],
    );

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        // if (filters["startDate"]) { filters["startDate"] = new Date(filters["startDate"]); }
        // if (filters["endDate"]) { filters["endDate"] = new Date(filters["endDate"]); }

        return true;
      },
    );

    this.isRender = true;
  }

  handleSave = () => {
    let fields = this.fieldSelected;

    if (fields.storeCode === "") {
      this.showAlert("Please select a store to apply");
      return false;
    }

    if (
      fields.startDate === "" ||
      fields.endDate === "" ||
      fields.startDate === null ||
      fields.endDate === null
    ) {
      this.showAlert("Please enter promotion date to apply store");
      return false;
    }

    if (fields.typeVoucher.length === 0) {
      this.showAlert("Please select voucher type");
      return false;
    }

    let checkCash2 = 0;

    if (fields.typeVoucher.indexOf("cash") !== -1) {
      if (fields.cashDate === "") {
        this.showAlert("Please enter date to apply cash");
        return false;
      }

      if (fields.cashExpired === "") {
        this.showAlert("Please enter expired days to apply cash");
        return false;
      }

      if (fields.amount === "") {
        this.showAlert("Please enter value to apply cash");
        return false;
      }

      if (fields.totalBillApprove === "") {
        this.showAlert("Please enter total bill applicable");
        return false;
      }

      if (fields.cashDate2 !== "") {
        checkCash2++;
      }
      if (fields.cashExpired2 !== "") {
        checkCash2++;
      }
      if (fields.amount2 !== "") {
        checkCash2++;
      }
      if (fields.totalBillApprove2 !== "") {
        checkCash2++;
      }

      if (checkCash2 !== 0) {
        if (checkCash2 < 4) {
          this.showAlert("Please enter or remove information fields cash 2");
          return false;
        }
      }
    }

    let cashVoucher = {
      TypeVoucher: fields.typeVoucher.indexOf("cash") !== -1 ? "cash" : "",
      Amount: fields.amount,
      TotalBillApprove: fields.totalBillApprove,
      ApplyDate:
        fields.cashDate !== ""
          ? DateHelper.displayDateFormat(fields.cashDate)
          : "",
      Expired: fields.cashExpired,
      AppliedStore: fields.storeCode,
    };
    // --------------------------------

    let cashVoucher2 = {
      TypeVoucher: fields.typeVoucher.indexOf("cash") !== -1 ? "cash" : "",
      Amount: fields.amount2,
      TotalBillApprove: fields.totalBillApprove2,
      ApplyDate:
        fields.cashDate2 !== ""
          ? DateHelper.displayDateFormat(fields.cashDate2)
          : "",
      Expired: fields.cashExpired2,
      AppliedStore: fields.storeCode,
    };
    // --------------------------------
    let barCode = this.items.length !== 0 ? this.items[0].itemCode : "";
    let itemName = this.items.length !== 0 ? this.items[0].itemName : "";

    if (fields.typeVoucher.indexOf("product") !== -1) {
      if (fields.productDate === "") {
        this.showAlert("Please enter date to apply product");
        return false;
      }

      if (fields.productExpired === "") {
        this.showAlert("Please enter expired days to apply product");
        return false;
      }

      if (barCode === "") {
        this.showAlert("Please add item to apply product");
        return false;
      }
    }

    let itemProduct = {
      TypeVoucher:
        fields.typeVoucher.indexOf("product") !== -1 ? "product" : "",
      ItemCode: barCode,
      ItemName: itemName,
      ApplyDate:
        fields.productDate !== ""
          ? DateHelper.displayDateFormat(fields.productDate)
          : "",
      Expired: fields.productExpired,
      AppliedStore: fields.storeCode,
      TotalBillApprove: 0,
    };

    if (fields.typeVoucher.indexOf("point") !== -1) {
      if (fields.pointReward === "") {
        this.showAlert("Please enter reward point");
        return false;
      }
    }

    let pointReward = {
      TypeVoucher: fields.typeVoucher.indexOf("point") !== -1 ? "point" : "",
      Point: fields.pointReward,
    };

    let voucherList = [];

    if (fields.typeVoucher.indexOf("cash") !== -1) {
      voucherList.push(cashVoucher);
    }

    if (checkCash2 >= 4) {
      voucherList.push(cashVoucher2);
    }

    if (fields.typeVoucher.indexOf("product") !== -1) {
      voucherList.push(itemProduct);
    }

    if (fields.typeVoucher.indexOf("point") !== -1) {
      voucherList.push(pointReward);
    }

    let obj = {
      storeCode: fields.storeCode,
      startDate:
        fields.startDate !== ""
          ? DateHelper.displayDateFormat(fields.startDate)
          : "",
      endDate:
        fields.endDate !== ""
          ? DateHelper.displayDateFormat(fields.endDate)
          : "",
      voucherLst: voucherList,
      appliedStore: fields.storeCode,
    };

    let model = new VoucherModel();

    model.postVoucherCondition(obj).then((response) => {
      if (response.status) {
        this.showAlert("Save success", "success");
        fields.promotionCode = response.data.promotionCode;
        fields.status = "unactive";
        this.isStatus = true;
        this.isShowBtnHistorey = true;
        this.promotionActive = response.data.reporting || 0;
        this.handleChangeStore();
      } else {
        this.showAlert(response.message || "error");
      }

      this.refresh();
    });
  };

  componentDidMount = () => {
    this.handleUpdateState();
  };

  // handleSearch = () => { PageHelper.pushHistoryState(this.fieldSelected); this.handleLoadResult(); this.refresh(); };

  handleUpdateState = async (event) => {
    let commonModel = new CommonModel();
    await commonModel.getData("store").then((response) => {
      if (response.status && response.data.stores) {
        this.data.stores = response.data.stores || [];
      }
    });
    this.handleHotKey({});
    this.refresh();
  };

  handleMoveSearchPage = (store, startDate, endDate) => {
    this.targetLink(
      "/promotion-checkin" +
        "?storeCode=" +
        store +
        "&startDate=" +
        DateHelper.displayDateTimeFormat(startDate) +
        "&endDate=" +
        DateHelper.displayDateTimeFormat(endDate) +
        "&action=load",
    );
  };

  handleSearch = async () => {
    let fields = this.fieldSelected;

    if (fields.storeCode === "") {
      this.showAlert("Please select a store");
      return;
    }

    if (fields.searchStartDate === "" || fields.searchStartDate === null) {
      this.showAlert("Please select start date to search");
      return;
    }

    if (fields.searchEndDate === "" || fields.searchEndDate === null) {
      this.showAlert("Please select end date to search");
      return;
    }

    this.handleResetField();

    let params = {
      storeCode: fields.storeCode,
      startDate: DateHelper.displayDateFormat(fields.searchStartDate),
      endDate: DateHelper.displayDateFormat(fields.searchEndDate),
      history: 0,
    };

    let model = new PromotionModel();

    await model.getQrCode(params).then((res) => {
      if (res.status && res.data.qrList) {
        this.qrList = res.data.qrList;

        if (res.data.reporting && res.data.reporting.length !== 0) {
          this.promotionActive = res.data.reporting[0].active;
        }

        if (res.data.qrList.length !== 0) {
          this.isStatus = true;
          this.isShowBtnHistorey = true;

          fields.startDate = new Date(res.data.qrList[0].startDate);
          fields.endDate = new Date(res.data.qrList[0].endDate);
          this.isAllowUpdate = !this.dateInPastArrow(
            new Date(res.data.qrList[0].endDate.slice(0, 10)),
            new Date(),
          );

          fields.status =
            res.data.qrList[0].active === 0 ? "unactive" : "active";
          this.isShowQrCode = res.data.qrList[0].active === 0 ? false : true;
          fields.promotionCode = res.data.qrList[0].id;

          this.handleChangeStore();
          let voucher = JSON.parse(res.data.qrList[0].voucher);
          this.qrList = voucher;

          let typeVoucherArr = [];
          let countCash = 0;

          for (let i = 0; i < voucher.length; ++i) {
            if (voucher[i].hasOwnProperty("TypeVoucher")) {
              typeVoucherArr.push(voucher[i]["TypeVoucher"]);

              if (voucher[i]["TypeVoucher"] === "cash") {
                countCash++;
                if (countCash === 1) {
                  fields.amount = voucher[i]["Amount"];
                  fields.totalBillApprove = voucher[i]["TotalBillApprove"];
                  fields.cashDate = new Date(voucher[i]["ApplyDate"]);
                  fields.cashExpired = voucher[i]["Expired"];
                }
                if (countCash === 2) {
                  fields.amount2 = voucher[i]["Amount"];
                  fields.totalBillApprove2 = voucher[i]["TotalBillApprove"];
                  fields.cashDate2 = new Date(voucher[i]["ApplyDate"]);
                  fields.cashExpired2 = voucher[i]["Expired"];
                }
              }

              if (voucher[i]["TypeVoucher"] === "product") {
                let obj = {
                  itemCode: voucher[i]["ItemCode"],
                  itemName: voucher[i]["ItemName"],
                };
                this.items = [];
                this.items.push(obj);
                fields.productDate = new Date(voucher[i]["ApplyDate"]);
                fields.productExpired = voucher[i]["Expired"];
              }

              if (voucher[i]["TypeVoucher"] === "point") {
                fields.pointReward = voucher[i]["Point"];
              }
            }
          }

          fields.typeVoucher = typeVoucherArr.toString();
        } else {
          this.isStatus = false;
          this.showAlert("Promotion not found");
        }
      }
    });

    this.refresh();
  };

  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.page = page;
    this.refresh();
  };

  handleChangeStore = () => {
    let fields = this.fieldSelected;
    if (fields.promotionCode != "") {
      fields.url =
        "https://gs25.com.vn/register-app?promotionCode=" +
        fields.promotionCode +
        "&storeCode=" +
        fields.storeCode;
    }
    this.refresh();
  };

  handleResetField = () => {
    let fields = this.fieldSelected;
    fields.url = "";
    fields.typeVoucher = "";
    fields.startDate = "";
    fields.endDate = "";
    fields.cashDate = this.minDate;
    fields.cashExpired = "";
    fields.amount = "";
    fields.totalBillApprove = "";
    fields.cashDate2 = "";
    fields.cashExpired2 = "";
    fields.amount2 = "";
    fields.totalBillApprove2 = "";
    fields.productDate = this.minDate;
    fields.productExpired = "";
    fields.productCode = "";
    fields.pointReward = "";
    this.items = [];
    this.isStatus = false;
    this.isAllowUpdate = true;
    this.isShowBtnHistorey = false;
    this.isShowQrCode = false;
    this.refresh();
  };

  handleDownloadQRcode = () => {
    let fields = this.fieldSelected;
    if (fields.storeCode == "") {
      this.showAlert("Please choose store to download", "error");
      return;
    }
    var canvas = document.getElementById("qr-gen");
    var pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${fields.storeCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  renderQRcode = () => {
    const fields = this.fieldSelected;

    let statusOpt = this.data.statusOpt;
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

    return (
      <>
        <div className="row header-detail">
          <div className="col-md-6">
            <button
              onClick={() => super.back("/promotion-checkin")}
              type="button"
              className="btn btn-back"
              style={{ background: "beige", marginTop: 10 }}
            >
              Back
            </button>
          </div>
        </div>
        <div className="form-filter">
          <div className="row">
            <div className="col-md-7">
              <div className="row">
                {/* STORE */}
                <div className="col-md-5">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Store:
                    </label>
                    <Select
                      isDisabled={storeOptions.length === 1}
                      isClearable
                      // isMulti
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      // value={storeOptions.filter((option) => fields.storeCode.indexOf(option.value) !== -1)}
                      // options={storeOptions}
                      // onChange={(e) => this.handleChangeFieldsCustom("storeCode", e ? e : "",)}
                      value={storeOptions.filter(
                        (option) => option.value === fields.storeCode,
                      )}
                      options={storeOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "storeCode",
                          e ? e.value : "",
                          this.handleResetField,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="col-md-7">
                  <div className="form-group">
                    <label className="w100pc">Date: </label>
                    <div className="row date-row-ft">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="From"
                          selected={fields.searchStartDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "searchStartDate",
                              value,
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={fields.searchStartDate ? true : false}
                        />
                      </div>
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="To"
                          selected={fields.searchEndDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom("searchEndDate", value)
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={fields.searchEndDate ? true : false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={this.handleSearch}
                    >
                      Search
                    </button>
                    {this.isShowBtnHistorey && (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() =>
                          this.handleMoveSearchPage(
                            fields.storeCode,
                            fields.startDate,
                            fields.endDate,
                          )
                        }
                      >
                        View history (active: {this.promotionActive})
                      </button>
                    )}
                    {this.isShowQrCode && (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={this.handleDownloadQRcode}
                        style={{ height: 38 }}
                      >
                        Download QR code
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                {this.isStatus &&
                  (this.isAllowUpdate ? (
                    <>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="status" className="w100pc">
                            Status:
                          </label>
                          <Select
                            // isClearable
                            classNamePrefix="select"
                            maxMenuHeight={260}
                            placeholder="--"
                            value={statusOpt.filter(
                              (option) => option.value === fields.status,
                            )}
                            options={statusOpt}
                            onChange={(e) =>
                              this.handleChangeFieldCustom(
                                "status",
                                e ? e.value : "unactive",
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="statusAction" className="w100pc op0">
                            .
                          </label>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={this.handleApplyPromotion}
                            style={{ height: 38 }}
                          >
                            Apply status
                          </button>
                        </div>
                      </div>
                      {fields.status === "unactive" && (
                        <div className="col-md-12">
                          <div className="form-group">
                            <label style={{ color: "red" }}>
                              Please start status to get QR code
                            </label>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="status" className="w100pc">
                            Status:{" "}
                            {fields.status === "unactive"
                              ? "Unactive"
                              : "Finished "}
                          </label>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            </div>

            <div className="col-md-5 text-center">
              {this.isShowQrCode && (
                <>
                  {fields.url !== "" && (
                    <>
                      <QRCode
                        id="qr-gen"
                        value={fields.url}
                        size={400}
                        imageSettings={{
                          src: imgLogoQr,
                          excavate: true,
                          width: 50,
                          height: 16,
                        }}
                      />

                      {/* <div className="row">
                                                <div className="col-md-12 text-center">
                                                    <button type="button" className="btn btn-success" onClick={this.handleDownloadQRcode} style={{margin:0}}>
                                                        Download QR code
                                                    </button>
                                                </div>
                                            </div> */}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  handleAddItemCodeToList = (item) => {
    this.items = [];
    this.items.push(item);
    this.refresh();
  };

  handleChangeTypeVoucher = () => {
    // this.items = [];
    this.refresh();
  };

  handleApplyPromotion = async () => {
    let fields = this.fieldSelected;
    let params = {
      promotionCode: fields.promotionCode,
      status: fields.status === "unactive" ? 0 : 1,
    };

    let model = new PromotionModel();
    await model.applyPromotion(params).then((res) => {
      if (res.status) {
        this.showAlert("Save success", "success");
        this.isShowQrCode = fields.status === "active" ? true : false;
      } else {
        this.showAlert(res.message || "error");
      }
    });
    this.refresh();
  };

  renderConditionVoucher = () => {
    let fields = this.fieldSelected;
    let typeVoucherOpt = this.data.typeVoucherOpt;
    let valueVoucherOpt = this.data.valueVoucherOpt;
    let statusOpt = this.data.statusOpt;

    let items = this.items;

    return (
      <>
        <div className="form-filter">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="typeVoucher" className="w100pc">
                  Type gift:
                </label>
                <Select
                  isDisabled={typeVoucherOpt.length === 1}
                  isClearable
                  isMulti
                  classNamePrefix="select"
                  maxMenuHeight={260}
                  placeholder="-- Type --"
                  value={typeVoucherOpt.filter(
                    (option) => fields.typeVoucher.indexOf(option.value) !== -1,
                  )}
                  options={typeVoucherOpt}
                  onChange={(e) =>
                    this.handleChangeFieldsCustom(
                      "typeVoucher",
                      e ? e : "",
                      this.handleChangeTypeVoucher,
                    )
                  }
                />
              </div>
            </div>
            <div className="col-md-5">
              <div className="form-group">
                <label className="w100pc">Promotion date: </label>
                <div className="row date-row-ft">
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <DatePicker
                      minDate={this.minDate}
                      placeholderText="Start date"
                      selected={fields.startDate}
                      onChange={(value) =>
                        this.handleChangeFieldCustom("startDate", value)
                      }
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      isClearable={fields.startDate ? true : false}
                    />
                  </div>
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <DatePicker
                      minDate={this.minDate}
                      placeholderText="Expiration date"
                      selected={fields.endDate}
                      onChange={(value) =>
                        this.handleChangeFieldCustom("endDate", value)
                      }
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      isClearable={fields.endDate ? true : false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {fields.typeVoucher.indexOf("cash") !== -1 && (
            <div className="row">
              <div className="col-md-12">
                <h3 className="text-primary">Cash</h3>
              </div>
            </div>
          )}
          {fields.typeVoucher.indexOf("cash") !== -1 && (
            <>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="cashDate" className="w100pc">
                      Start date (voucher):
                    </label>

                    <DatePicker
                      minDate={this.minDate}
                      placeholderText="dd/MM/yyyy"
                      selected={fields.cashDate}
                      onChange={(value) =>
                        this.handleChangeFieldCustom("cashDate", value)
                      }
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      isClearable={fields.cashDate ? true : false}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="cashExpired" className="w100pc">
                      Expire days:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="cashExpired"
                      onChange={(e) => {
                        var pattern = new RegExp(/^[0-9\b]+$/);

                        if (e.target.value && !pattern.test(e.target.value)) {
                          return;
                        }

                        this.handleChangeFieldCustom(
                          "cashExpired",
                          e.target.value,
                        );
                      }}
                      maxLength="2"
                      value={fields.cashExpired}
                      className="form-control"
                      placeholder="Numbers"
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="amount" className="w100pc">
                      Amount:
                    </label>

                    <Select
                      isDisabled={valueVoucherOpt.length === 1}
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- Value --"
                      value={valueVoucherOpt.filter(
                        (option) => option.value === this.fieldSelected.amount,
                      )}
                      options={valueVoucherOpt}
                      onChange={(e) =>
                        this.handleChangeFieldCustom("amount", e ? e.value : "")
                      }
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="totalBillApprove" className="w100pc">
                      Total bill applicable (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        >=
                      </span>
                      ):
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="totalBillApprove"
                      onChange={(e) => {
                        var pattern = new RegExp(/^[0-9\b]+$/);

                        if (e.target.value && !pattern.test(e.target.value)) {
                          return;
                        }

                        this.handleChangeFieldCustom(
                          "totalBillApprove",
                          e.target.value,
                        );
                      }}
                      maxLength="7"
                      value={fields.totalBillApprove}
                      className="form-control"
                      placeholder="Numbers"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {fields.typeVoucher.indexOf("cash") !== -1 && (
            <>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="cashDate2" className="w100pc">
                      Start date (voucher):
                    </label>

                    <DatePicker
                      minDate={this.minDate}
                      placeholderText="dd/MM/yyyy"
                      selected={fields.cashDate2}
                      onChange={(value) =>
                        this.handleChangeFieldCustom("cashDate2", value)
                      }
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      isClearable={fields.cashDate2 ? true : false}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="cashExpired2" className="w100pc">
                      Expire days:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="cashExpired2"
                      onChange={(e) => {
                        var pattern = new RegExp(/^[0-9\b]+$/);

                        if (e.target.value && !pattern.test(e.target.value)) {
                          return;
                        }

                        this.handleChangeFieldCustom(
                          "cashExpired2",
                          e.target.value,
                        );
                      }}
                      maxLength="2"
                      value={fields.cashExpired2}
                      className="form-control"
                      placeholder="Numbers"
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="amount2" className="w100pc">
                      Amount:
                    </label>

                    <Select
                      isDisabled={valueVoucherOpt.length === 1}
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- Value --"
                      value={valueVoucherOpt.filter(
                        (option) => option.value === this.fieldSelected.amount2,
                      )}
                      options={valueVoucherOpt}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "amount2",
                          e ? e.value : "",
                        )
                      }
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="totalBillApprove2" className="w100pc">
                      Total bill applicable (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        >=
                      </span>
                      ):
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="totalBillApprove2"
                      onChange={(e) => {
                        var pattern = new RegExp(/^[0-9\b]+$/);

                        if (e.target.value && !pattern.test(e.target.value)) {
                          return;
                        }

                        this.handleChangeFieldCustom(
                          "totalBillApprove2",
                          e.target.value,
                        );
                      }}
                      maxLength="7"
                      value={fields.totalBillApprove2}
                      className="form-control"
                      placeholder="Numbers"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {fields.typeVoucher.indexOf("product") !== -1 && (
            <>
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-primary">Product:</h3>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="productDate" className="w100pc">
                      Start date (product):
                    </label>

                    <DatePicker
                      minDate={this.minDate}
                      placeholderText="dd/MM/yyyy"
                      selected={fields.productDate}
                      onChange={(value) =>
                        this.handleChangeFieldCustom("productDate", value)
                      }
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      isClearable={fields.productDate ? true : false}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="productExpired" className="w100pc">
                      Expire days:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="productExpired"
                      onChange={(e) => {
                        var pattern = new RegExp(/^[0-9\b]+$/);

                        if (e.target.value && !pattern.test(e.target.value)) {
                          return;
                        }

                        this.handleChangeFieldCustom(
                          "productExpired",
                          e.target.value,
                        );
                      }}
                      maxLength="2"
                      value={fields.productExpired}
                      className="form-control"
                      placeholder="Numbers"
                    />
                  </div>
                </div>

                {/* <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="itemCode" className="w100pc">
                                            Item code:
                                        </label>
                                        <input 
                                            type="text" 
                                            autoComplete="off" 
                                            name="itemCode" 
                                            onChange={this.handleChangeField} 
                                            value={fields.itemCode}
                                            className="form-control"
                                        />
                                    </div>
                                </div> */}
                <div className="col-md-12">
                  <div className="wrap-table htable">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Barcode</th>
                          <th>Name</th>
                          {/* <th>Unit</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, key) => (
                          <tr
                            key={key}
                            data-group="itemContainer"
                            data-item-code={item.itemCode}
                          >
                            <td>{item.itemCode}</td>
                            <td style={{ whiteSpace: "normal" }}>
                              <p style={{ margin: 0 }}>{item.itemName}</p>
                            </td>
                            {/* <td>{item.unit}</td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {items.length != 0 ? null : (
                      <div className="table-message">Item not found</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {fields.typeVoucher.indexOf("point") !== -1 && (
            <>
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-primary">Point:</h3>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="productExpired" className="w100pc">
                      Reward points:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="pointReward"
                      onChange={(e) => {
                        var pattern = new RegExp(/^[0-9\b]+$/);

                        if (e.target.value && !pattern.test(e.target.value)) {
                          return;
                        }

                        this.handleChangeFieldCustom(
                          "pointReward",
                          e.target.value,
                        );
                      }}
                      maxLength="5"
                      value={fields.pointReward}
                      className="form-control"
                      placeholder="Numbers"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  handleShowSearchItems = () => {
    if (this.fieldSelected.storeCode === "") {
      this.showAlert("Please choose store");
      return false;
    }

    $(".popup-form").hide();
    $("#" + this.idSearchItemsComponent).show();
    $("#" + this.idSearchItemsComponent)
      .find("[name=keywordbarcode]")
      .focus()
      .select();
  };

  renderAddItem = () => {
    let fields = this.fieldSelected;

    return (
      <>
        <div className="floating-btn" style={{ paddingTop: 0 }}>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              {fields.typeVoucher.indexOf("product") !== -1 && (
                <button
                  type="button"
                  onClick={this.handleShowSearchItems}
                  className="btn btn-success btn-showpp"
                >
                  1. ADD ITEMS
                </button>
              )}
            </div>
          </div>
        </div>

        <SearchItems
          idComponent={this.idSearchItemsComponent}
          storeCode={this.fieldSelected.storeCode}
          addItemCodeToList={this.handleAddItemCodeToList}
        />
      </>
    );
  };

  dateInPastArrow = (firstDate, secondDate) =>
    firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0);

  renderComp = () => {
    return (
      <div>
        <div className="wrap-section">{this.renderQRcode()}</div>
        {this.renderConditionVoucher()}
        {this.renderAddItem()}
      </div>
    );
  };
}
