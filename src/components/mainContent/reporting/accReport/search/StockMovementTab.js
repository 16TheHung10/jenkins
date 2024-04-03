//Plugin
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import $ from "jquery";
import Moment from "moment";

//Custom
import BaseComponent from "components/BaseComponent";
import PageHelper from "helpers/PageHelper";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import CommonModel from "models/CommonModel";
import ReportingModel from "models/ReportingModel";

import TableStockMovement from "components/mainContent/reporting/TableStockMovement";
import TableStockItemMovement from "components/mainContent/reporting/TableStockItemMovement";
import TableStockViewDiff from "components/mainContent/reporting/TableStockViewDiff";
import AutocompleteBarcode from "components/mainContent/reporting/autocompleteBarcode";

import DownloadModel from "models/DownloadModel";
import ItemModel from "models/ItemModel";
import { decreaseDate } from "helpers/FuncHelper";
import { handleExportAutoField } from "helpers/ExportHelper";

import { Button, Modal, Row, Col, Tag } from "antd";
import { FileExcelOutlined, FileSearchOutlined } from "@ant-design/icons";
import ".././css/style.scss";

class StockMovementTab extends BaseComponent {
  constructor(props) {
    super(props);

    this.autocompleteBarcodeRef = React.createRef();
    this.idBCAutoCompleteComponent =
      "autoCompleteBarcode" + StringHelper.randomKey();

    //Default data
    this.data.stores = [];
    this.itemsStockMovement = [];
    this.itemsItemMovement = [];

    this.data.disposal = [];
    this.data.disposalTotal = {};

    this.data.soh = [];
    this.lstCat = [];
    this.itemsOrder = {};

    this.isSearchListBarcode = true;
    this.isSearch = false;
    this.isOpen = false;
    this.titleViewReason = "Item code";
    this.dataViewReason = [];

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        startDate: decreaseDate(1),
        endDate: decreaseDate(1),
        startDateItem: decreaseDate(1),
        endDateItem: decreaseDate(1),
        storeItemMovement: "",
        textNotifyMovement: "Stock are running and update to every day",
        textNotifyItemMovement: "Stock are running and update to every day",
        isErrorMovement: 0,
        isErrorItemMovement: 0,
        lastInvMovement: "",
        curInvMovement: "",
        lastInvItemMovement: "",
        curInvItemMovement: "",
        isSearchMovement: false,
        isSearchItemMovement: false,
        cat: "",
      },
      ["storeCode"],
    );

    this.isRender = true;
  }

  // handleExportBill = () => {
  //     let model = new ReportingModel();
  //     model
  //         .exportBill(
  //             this.fieldSelected.storeCode,
  //             DateHelper.displayDateFormat(this.fieldSelected.startDate),
  //             DateHelper.displayDateFormat(this.fieldSelected.endDate)
  //         )
  //         .then((response) => {
  //             if (response.status) {
  //                 let downloadModel = new DownloadModel();
  //                 downloadModel.get(response.data.downloadUrl, null, null, ".xls");
  //             } else {
  //                 this.showAlert(response.message);
  //             }
  //         });
  // };

  componentDidMount() {
    this.handleCheckStatusInventory(decreaseDate(1), this.handleUpdateState);
  }

  handleCheckStatusInventory = async (valueDate, fn) => {
    let model = new ReportingModel();
    let date = DateHelper.displayDateFormatMinus(decreaseDate(1));

    await model.checkStatusAPIEst(date).then((response) => {
      if (response.status && response.data.storeStatus) {
        if (fn) {
          fn();
        }

        if (response.message) {
          if (response.message !== "") {
            this.showAlert(response.message, "error", false);
          }
        }
      } else {
        var elUpdating = document.getElementById("content-updating");
        elUpdating.classList.remove("d-none");
      }
    });

    this.refresh();
  };

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData("store,supplier").then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
      }
    });

    this.refresh();
  };

  openCity = (cityName) => {
    var i;
    var x = document.getElementsByClassName("detail-tab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(cityName).style.display = "block";
  };

  handleSearchStockMovement = async () => {
    if (this.fieldSelected.storeCode === "") {
      this.showAlert("Please choose store");
      return;
    }

    this.handleCheckStatusInventory(
      decreaseDate(1),
      this.handleGetStockMovement,
    );
  };

  handleGetStockMovement = async () => {
    this.fieldSelected.isErrorMovement = 0;
    this.fieldSelected.isSearchMovement = false;

    let params = {
      storeCode: this.fieldSelected.storeCode,
      startDate: this.fieldSelected.startDate,
      endDate: this.fieldSelected.endDate,
    };

    let model = new ReportingModel();
    await model.getStockMovement(params).then((res) => {
      if (res.status && res.data) {
        this.itemsStockMovement = res.data.stock;
        res.data.invFail &&
          (this.fieldSelected.isErrorMovement = res.data.invFail);
        res.data.lastInv &&
          (this.fieldSelected.lastInvMovement = res.data.lastInv);
        res.data.curInv &&
          (this.fieldSelected.curInvMovement = res.data.curInv);

        this.fieldSelected.isSearchMovement = true;
      } else {
        // this.showAlert("System busy!");
      }
    });

    this.refresh();
  };

  removeDuplicates = (originalArray, prop) => {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  };

  handleGetListItem = () => {
    if (
      this.fieldSelected.storeCode === "" ||
      this.fieldSelected.storeCode === null
    ) {
      this.showAlert("Please choose store");
      return false;
    }
    let page = "allitemmovement";
    let params = {
      storeCode: this.fieldSelected.storeCode,
      startDate: this.fieldSelected.startDateItem,
      endDate: this.fieldSelected.endDateItem,
    };
    this.itemsOrder = {};
    this.isSearchListBarcode = true;
    this.isSearch = false;

    let itemModel = new ReportingModel();
    itemModel.getListByPage(page, params).then((response) => {
      if (response.status && response.data.items) {
        let arr = response.data.items || [];
        let objGr = {};
        arr.map((el, i) => {
          objGr[el.itemCode] = el;
        });
        this.itemsOrder = objGr;

        this.isSearchListBarcode = false;
        this.isSearch = true;
      } else {
        // this.showAlert("System busy!");
      }

      this.refresh();
    });
  };

  handleSearchItemMovement = async () => {
    if (this.fieldSelected.storeCode === "") {
      this.showAlert("Please choose store");
      return;
    }

    if (this.autocompleteBarcodeRef.current.getBarcodeSelected() === "") {
      this.showAlert("Please choose barcode");
      return;
    }

    this.handleCheckStatusInventory(
      decreaseDate(1),
      this.handleGetItemMovement,
    );
  };

  handleGetItemMovement = async () => {
    this.fieldSelected.isErrorItemMovement = 0;
    this.fieldSelected.isSearchItemMovement = false;
    this.lstCat = [];

    let params = {
      storeCode: this.fieldSelected.storeCode,
      startDate: this.fieldSelected.startDateItem,
      endDate: this.fieldSelected.endDateItem,
      itemCode: this.autocompleteBarcodeRef.current.getBarcodeSelected(),
    };

    this.dataViewReason = [];

    let model = new ReportingModel();
    await model.getItemMovement(params).then((res) => {
      if (res.status && res.data) {
        this.itemsItemMovement = res.data.items;

        this.itemsItemMovement.map((el) => {
          this.lstCat.push({
            value: el.categoryCode,
            label: el.categoryCode + " - " + el.categoryName,
          });
        });

        var arrCat = this.removeDuplicates(this.lstCat, "value");

        this.lstCat = arrCat;

        res.data.invFail &&
          (this.fieldSelected.isErrorItemMovement = res.data.invFail);
        res.data.lastInv &&
          (this.fieldSelected.lastInvItemMovement = res.data.lastInv);
        res.data.curInv &&
          (this.fieldSelected.curInvItemMovement = res.data.curInv);
        this.fieldSelected.isSearchItemMovement = true;

        this.isSearchListBarcode = false;
        this.isSearch = false;
      } else {
        this.showAlert("API connect fail");
      }
    });

    this.refresh();
  };

  handleUpdateFilter = (code) => {
    this.fieldSelected.itemCode = code;
    this.refresh();
  };

  handleChangeStore = () => {
    this.itemsOrder = {};
    this.fieldSelected.itemCode = "";
    this.refresh();
  };

  handleViewReason = (itemCode, itemName, date) => {
    const fields = this.fieldSelected;

    let page = "loginvmovement";
    let params = {
      storeCode: fields.storeCode,
      itemCode: itemCode,
      date: date,
    };

    let model = new ReportingModel();
    model.getListByPage(page, params).then((res) => {
      if (res.status && res.data) {
        this.dataViewReason = res.data;

        this.isOpen = true;
        this.titleViewReason = itemName + " - " + itemCode;

        this.refresh();
      }
    });
  };

  handleCancel = () => {
    this.isOpen = false;
    this.refresh();
  };

  renderComp() {
    let stores = this.data.stores;
    let storeKeys = Object.keys(stores);
    const orderStore = {};
    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });
    let storeOptions = [];
    if (storeKeys.length === 0) {
      storeOptions.push({
        value: this.data.storeCode,
        label: this.data.storeCode + " - " + this.data.storeName,
      });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return {
          value: stores[key].storeCode,
          label: stores[key].storeCode + " - " + stores[key].storeName,
        };
      });
    }

    let cat = this.lstCat;

    return (
      <>
        {/* <div className="row mrt-10">
                    <div className="col-md-3 col-lg-2">

                        <Select
                            isDisabled={storeOptions.length === 1 && !this.getAccountState().isAdmin()}
                            isClearable
                            classNamePrefix="select"
                            maxMenuHeight={260}
                            placeholder="-- All --"
                            value={storeOptions.filter((option) => option.value === this.fieldSelected.storeCode)}
                            options={storeOptions}
                            onChange={(e) => this.handleChangeFieldCustom("storeCode", e ? e.value : "")}
                        />
                    </div>
                    <div className="col-md-9">
                        <div className="tt-tbtab" style={{ padding: 0, backgroundColor: 'transparent' }}>
                            <button style={{ padding: "10px 20px", background: 'rgb(0,154,255)' }} onClick={() => this.openCity("sbs")}>Stock movement</button>
                            <button style={{ padding: "10px 20px", background: 'rgb(0,212,233)' }} onClick={() => this.openCity("sbs-dis")}>Item movement</button>
                        </div>
                    </div>
                </div> */}
        {/* <div className="pos-relative"> */}

        <Row gutter={16}>
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={18}>
                  <Row gutter={[16, 8]}>
                    <Col xl={8}>
                      <label className="w100pc">Store:</label>
                      <Select
                        isDisabled={
                          storeOptions.length === 1 &&
                          !this.getAccountState().isAdmin()
                        }
                        isClearable
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- All --"
                        value={storeOptions.filter(
                          (option) =>
                            option.value === this.fieldSelected.storeCode,
                        )}
                        options={storeOptions}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "storeCode",
                            e ? e.value : "",
                          )
                        }
                      />
                    </Col>
                    <Col xl={16}>
                      <label className="w100pc">Date:</label>
                      <Row gutter={16}>
                        <Col xl={12}>
                          <DatePicker
                            placeholderText="Start date"
                            selected={this.fieldSelected.startDate}
                            onChange={(value) =>
                              this.handleChangeFieldCustom("startDate", value)
                            }
                            maxDate={decreaseDate(1)}
                            minDate={decreaseDate(60)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            autoComplete="off"
                            // isClearable={this.fieldSelected.startDate ? true : false}
                          />
                        </Col>
                        <Col xl={12}>
                          <DatePicker
                            placeholderText="End date"
                            selected={this.fieldSelected.endDate}
                            onChange={(value) =>
                              this.handleChangeFieldCustom("endDate", value)
                            }
                            maxDate={decreaseDate(1)}
                            minDate={new Date(this.fieldSelected.startDate)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            autoComplete="off"
                            // isClearable={this.fieldSelected.endDate ? true : false}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mrt-10">
                    <Col>
                      <Tag
                        className="h-30 icon-search"
                        onClick={this.handleSearchStockMovement}
                      >
                        <FileSearchOutlined />{" "}
                        <span className="icon-search-detail">Search</span>
                      </Tag>
                      <Tag
                        icon={<FileExcelOutlined />}
                        className="h-30 icon-excel"
                        onClick={() =>
                          handleExportAutoField(
                            this.itemsStockMovement,
                            "stockmovementexport",
                          )
                        }
                      >
                        <span className="icon-excel-detail">Export</span>
                      </Tag>
                    </Col>
                  </Row>
                </Col>
                <Col xl={6}>
                  <div className="cl-red bg-note">
                    {this.fieldSelected.isSearchMovement &&
                      (this.fieldSelected.isErrorMovement === 1 ? (
                        <>
                          <span>
                            Last inventory:{" "}
                            {DateHelper.displayDate(
                              new Date(this.fieldSelected.lastInvMovement),
                            )}{" "}
                            inventory not update, please wait process running{" "}
                          </span>
                          <br />{" "}
                        </>
                      ) : (
                        <>
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            Current inventory:{" "}
                            {DateHelper.displayDate(
                              new Date(this.fieldSelected.curInvMovement),
                            )}{" "}
                            inventory updated{" "}
                          </span>
                          <br />
                        </>
                      ))}

                    {this.fieldSelected.textNotifyMovement}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <TableStockMovement items={this.itemsStockMovement} />
          </Col>
        </Row>

        <div
          id="content-updating"
          className="detail-tab row d-none pos-absolute"
          style={{
            width: "100%",
            height: "100%",
            top: 0,
            bottom: 0,
            background: "white",
          }}
        >
          <h6 className="cl-red pos-relative" style={{ padding: "0 15px" }}>
            Dữ liệu đang được cập nhật, vui lòng quay lại sau.{" "}
            <button
              onClick={() => super.back("/")}
              type="button"
              className="btn btn-back"
            >
              Back
            </button>
          </h6>
        </div>
      </>
    );
  }
}

export default StockMovementTab;
