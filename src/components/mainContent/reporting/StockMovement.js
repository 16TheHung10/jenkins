import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import BaseComponent from "components/BaseComponent";
import DateHelper from "helpers/DateHelper";
import StringHelper from "helpers/StringHelper";
import CommonModel from "models/CommonModel";
import ReportingModel from "models/ReportingModel";
import TableStockMovement from "components/mainContent/reporting/TableStockMovement";
import { handleExportAutoField } from "helpers/ExportHelper";
import { decreaseDate } from "helpers/FuncHelper";
import { Col, Row, Tabs } from "antd";

import ReportStockItemMovementPage from "components/mainContent/reporting/accReport/search/StockItemMovement";
import ReportStockMovementPage from "components/mainContent/reporting/accReport/search/StockMovement";

const StockMovement = () => {
  const renderTab = () => {
    const tabList = [
      {
        label: (
          <span>
            {/* <LaptopOutlined /> */}
            Stock movement
          </span>
        ),
        key: "1",
        children: <ReportStockMovementPage />,
      },
      {
        label: (
          <span>
            {/* <GiftOutlined /> */}
            Item movement
          </span>
        ),
        key: "2",
        children: <ReportStockItemMovementPage />,
      },
    ];

    return (
      <>
        <Row gutter={16}>
          <Col xl={24}>
            <Tabs defaultActiveKey="1" items={tabList} />
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      <div className="container-table section-block mt-15">
        <div style={{ padding: "0 15px" }}>{renderTab()}</div>
      </div>
    </>
  );
};

class StockMovementCC extends BaseComponent {
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
      <div className="container-table">
        <div className="col-md-12">
          <div className="row mrt-10">
            <div className="col-md-3 col-lg-2">
              <Select
                isDisabled={
                  storeOptions.length === 1 && !this.getAccountState().isAdmin()
                }
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- All --"
                value={storeOptions.filter(
                  (option) => option.value === this.fieldSelected.storeCode,
                )}
                options={storeOptions}
                onChange={(e) =>
                  this.handleChangeFieldCustom("storeCode", e ? e.value : "")
                }
              />
            </div>
            <div className="col-md-9">
              <div
                className="tt-tbtab"
                style={{ padding: 0, backgroundColor: "transparent" }}
              >
                <button
                  style={{ padding: "10px 20px", background: "rgb(0,154,255)" }}
                  onClick={() => this.openCity("sbs")}
                >
                  Stock movement
                </button>
                <button
                  style={{ padding: "10px 20px", background: "rgb(0,212,233)" }}
                  onClick={() => this.openCity("sbs-dis")}
                >
                  Item movement
                </button>
              </div>
            </div>
          </div>
          <div className="pos-relative">
            <div id="sbs" className="detail-tab row">
              <div className="col-md-12">
                {/* <div className="tt-tb" style={{background: 'green'}}>Stock movement by qty</div> */}
                <div
                  className="wrap-block-table"
                  style={{ border: "4px solid rgb(0,154,255)" }}
                >
                  <div className="row">
                    <div className="col-md-9">
                      <div className="row mrt-10">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="w100pc">Date:</label>
                            <div className="row date-row-ft">
                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <DatePicker
                                  placeholderText="Start date"
                                  selected={this.fieldSelected.startDate}
                                  onChange={(value) =>
                                    this.handleChangeFieldCustom(
                                      "startDate",
                                      value,
                                    )
                                  }
                                  maxDate={decreaseDate(1)}
                                  minDate={decreaseDate(60)}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  autoComplete="off"
                                  // isClearable={this.fieldSelected.startDate ? true : false}
                                />
                              </div>
                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <DatePicker
                                  placeholderText="End date"
                                  selected={this.fieldSelected.endDate}
                                  onChange={(value) =>
                                    this.handleChangeFieldCustom(
                                      "endDate",
                                      value,
                                    )
                                  }
                                  maxDate={decreaseDate(1)}
                                  minDate={
                                    new Date(this.fieldSelected.startDate)
                                  }
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  autoComplete="off"
                                  // isClearable={this.fieldSelected.endDate ? true : false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <label
                            htmlFor=""
                            className="w100pc"
                            style={{ opacity: 0 }}
                          >
                            .
                          </label>
                          <button
                            onClick={this.handleSearchStockMovement}
                            type="button"
                            className="btn btn-danger"
                            style={{ height: "38px", marginRight: 0 }}
                          >
                            Search
                          </button>
                          <button
                            onClick={() =>
                              handleExportAutoField(
                                this.itemsStockMovement,
                                "stockmovementexport",
                              )
                            }
                            type="button"
                            className="btn btn-danger"
                            style={{ height: "38px", marginLeft: 5 }}
                          >
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="row mrt-10">
                        <div className="col-md-12">
                          <div className="cl-red bg-note">
                            {this.fieldSelected.isSearchMovement &&
                              (this.fieldSelected.isErrorMovement === 1 ? (
                                <>
                                  <span>
                                    Last inventory:{" "}
                                    {DateHelper.displayDate(
                                      new Date(
                                        this.fieldSelected.lastInvMovement,
                                      ),
                                    )}{" "}
                                    inventory not update, please wait process
                                    running{" "}
                                  </span>
                                  <br />{" "}
                                </>
                              ) : (
                                <>
                                  <span
                                    style={{
                                      color: "green",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Current inventory:{" "}
                                    {DateHelper.displayDate(
                                      new Date(
                                        this.fieldSelected.curInvMovement,
                                      ),
                                    )}{" "}
                                    inventory updated{" "}
                                  </span>
                                  <br />
                                </>
                              ))}

                            {this.fieldSelected.textNotifyMovement}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <TableStockMovement items={this.itemsStockMovement} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div id="sbs-dis" className="detail-tab row" style={{ display: "none" }}>
                            <div className="col-md-12">
                            
                                <div className="wrap-block-table" style={{ border: '4px solid rgb(0,212,233)' }}>
                                    <div className="row">
                                        <div className="col-md-9">
                                            <div className="row mrt-10">

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="w100pc">Date</label>
                                                        <div className="row date-row-ft">
                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                                                <DatePicker
                                                                    placeholderText="Start date"
                                                                    selected={this.fieldSelected.startDateItem}
                                                                    onChange={(value) => this.handleChangeFieldCustom("startDateItem", value)}
                                                                    maxDate={decreaseDate(1)}
                                                                    minDate={decreaseDate(60)}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    className="form-control"
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                                                <DatePicker
                                                                    placeholderText="End date"
                                                                    selected={this.fieldSelected.endDateItem}
                                                                    onChange={(value) => this.handleChangeFieldCustom("endDateItem", value)}
                                                                    maxDate={decreaseDate(1)}
                                                                    minDate={new Date(this.fieldSelected.startDateItem)}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    className="form-control"
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="methodcode" className="w100pc" style={{ opacity: 0 }}>
                                                        .
                                                    </label>
                                                    <button onClick={this.handleGetListItem} type="button" className="btn btn-danger" style={{ height: "38px" }}>
                                                        1. Search list barcode
                                                    </button>

                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="w100pc">Barcode - Item name:</label>
                                                        <AutocompleteBarcode
                                                            idComponent={this.idBCAutoCompleteComponent}
                                                            ref={this.autocompleteBarcodeRef}
                                                            barCodes={this.itemsOrder}
                                                            AddBarcode={this.handleAddBarcode}
                                                            updateFilter={this.handleUpdateFilter}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="methodcode" className="w100pc" style={{ opacity: 0 }}>
                                                        .
                                                    </label>
                                                    <button onClick={this.handleSearchItemMovement} type="button" className="btn btn-danger" style={{ height: "38px", marginRight: 0 }}>
                                                        2. Search
                                                    </button>
                                                    <button onClick={() => handleExportAutoField(this.itemsItemMovement, "itemmovementexport")} type="button" className="btn btn-danger" style={{ height: "38px", marginLeft: 5 }}>
                                                        Export
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="row mrt-10">
                                                <div className="col-md-12">
                                                    <div className="cl-red bg-note">
                                                        <strong>Noted:</strong><br />
                                                        Step 1: Choose date and search list barcode <br />
                                                        Step 2: Input barcode and search<br />
                                                        {
                                                            this.fieldSelected.isSearchItemMovement && (
                                                                this.fieldSelected.isErrorItemMovement === 1 ?
                                                                    <><span>Last inventory: {DateHelper.displayDate(new Date(this.fieldSelected.lastInvItemMovement))} inventory not update, please wait process running </span><br /></>
                                                                    :
                                                                    <><span style={{ color: 'green', fontWeight: 'bold' }}>Current inventory: {DateHelper.displayDate(new Date(this.fieldSelected.curInvItemMovement))} inventory updated </span><br /></>
                                                            )
                                                        }
                                                        {this.fieldSelected.textNotifyItemMovement}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <TableStockItemMovement
                                                items={this.itemsItemMovement}
                                                fieldSelected={this.fieldSelected}
                                                isSearch={this.isSearch}
                                                isSearchListBarcode={this.isSearchListBarcode}
                                                handleViewReason={this.handleViewReason}
                                            />
                                        </div>
                                    </div>

                                    <Modal
                                        open={this.isOpen}
                                        title={this.titleViewReason}
                                        onOk={this.handleCancel}
                                        onCancel={this.handleCancel}
                                        footer={[
                                            <Button key="back" onClick={this.handleCancel}>
                                                Close
                                            </Button>,
                                        ]}
                                        style={{
                                            top: 20,
                                        }}
                                    >
                                        <TableStockViewDiff items={this.dataViewReason} />
                                    </Modal>
                                </div>
                            </div>
                        </div> */}

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
          </div>
        </div>
      </div>
    );
  }
}

export default StockMovement;
