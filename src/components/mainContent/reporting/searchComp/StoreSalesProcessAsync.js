//Plugin
import React from "react";
import DatePicker from "react-datepicker";

//Custom
import BaseComponent from "components/BaseComponent";
import { ArrayHelper, DateHelper, StringHelper } from "helpers";
import CommonModel from "models/CommonModel";

import ReportingModel from "models/ReportingModel";

import { decreaseDate, mapData } from "helpers/FuncHelper";

import { message } from "antd";
import StoreApi from "api/StoreApi";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import TableStoreSalesProcessAsync from "components/mainContent/reporting/tableComp/TableStoreSalesProcessAsync";
import DrawerStoreSaleAsync2 from "./DrawerStoreSaleAsync2";

export default class StoreSalesProcessAsync extends BaseComponent {
  constructor(props) {
    super(props);

    this.autocompleteBarcodeRef = React.createRef();
    this.idBCAutoCompleteComponent =
      "autoCompleteBarcode" + StringHelper.randomKey();

    this.items = [];
    this.allStoreItems = [];
    this.isDrawerOpen = false;
    //Default data
    this.data.stores = [];
    this.counters = null;
    this.countersOnline = null;

    this.dataCompareSaleRegion = [];
    this.isDataRegion = false;

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        date: decreaseDate(1),
      },
      ["storeCode"],
    );

    this.isRender = true;
  }

  async handleGetCounter() {
    const res = await StoreApi.getCountersOfAllStore();
    if (res.status) {
      this.counters = res.data.counters;
    } else {
      message.error(res.message);
    }
    return res;
  }

  handleGetCounterOnline = async () => {
    const res = await StoreApi.getCountersOnline();

    if (res.status) {
      this.countersOnline = ArrayHelper.convertArrayToObject(
        res.data.online_usrs,
        "userId",
      );
      this.refresh();
    } else {
      message.error(res.message);
    }
    return res;
  };
  async handleInitData() {
    await Promise.all([this.handleGetCounter(), this.handleGetCounterOnline()]);
    this.handleSearch();
  }
  componentDidMount() {
    this.handleUpdateState();
    this.handleInitData();
    // this.handleCheckInventory();
  }

  // handleCheckInventory = async () => {

  //     let model = new ReportingModel();
  //     let date = DateHelper.displayDateFormatMinus(new Date());

  //     await model.checkStatusAPIinventory(date).then(response => {
  //         if (response.status && response.data.storeStatus) {
  //             this.handleUpdateState();

  //             if (response.message) {
  //                 if (response.message !== "") {
  //                     this.showAlert(response.message,'error', false);
  //                 }
  //             }
  //         }
  //         else {
  //             var elUpdating = document.getElementById("content-updating");
  //             elUpdating.classList.remove('d-none');
  //         }
  //     });

  //     this.refresh();
  // }

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData("store").then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
      }
    });

    this.refresh();
  };

  handleListStore = () => {
    let arr = [];
    for (let key in this.data.stores) {
      let item = this.data.stores[key];

      if (item.storeCode.substring(0, 2).toLowerCase() === "vn") {
        let obj = {
          statusStore: item.status,
          storeCode: key,
        };
        arr.push(obj);
      }
    }

    return arr;
  };

  handleSearch = async () => {
    this.items = [];
    this.allStoreItems = this.handleListStore();
    this.dataCompareSaleRegion = [];
    this.isDataRegion = false;

    this.handleGetCompareRegion();

    let model = new ReportingModel();
    let params = {
      date: DateHelper.displayDateFormatMinus(this.fieldSelected.date),
    };

    let page = "/storestatus/comparesale";
    await model.getAllSummary(page, params).then((response) => {
      if (response.status && response.data && response.data.compareSale) {
        this.items = response.data.compareSale;

        this.items.sort((a, b) => (a["storeCode"] <= b["storeCode"] ? -1 : 1));

        let newList = mapData(this.allStoreItems, this.items, "storeCode", [
          "status",
          "dateKey",
          "updatedDate",
          "note",
        ]);
        this.items = newList?.map((item) => {
          return { ...item, counters: this.counters?.[item.storeCode] || null };
        });
      } else {
        this.showAlert(response.message, "error", false);
      }
    });

    this.refresh();
  };

  handleGetCompareRegion = () => {
    let model = new ReportingModel();
    let params = {
      date: DateHelper.displayDateFormatMinus(this.fieldSelected.date),
    };

    let page = "/storestatus/comparesaleregion";
    model.getAllSummary(page, params).then((response) => {
      if (response.status && response.data) {
        if (response.data.compareSale) {
          this.dataCompareSaleRegion = response.data.compareSale;
          this.isDataRegion = true;
        }
        this.refresh();
      } else {
        this.showAlert(response.message, "error", false);
      }
    });
  };

  handleFilter = (listItem) => {
    let list = listItem;

    return list;
  };
  handleToggleDrawer = () => {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.refresh();
  };
  handleSetDate = (value) => {
    this.handleChangeFieldCustom("date", value, this.handleSearch);
    this.refresh();
  };
  renderComp() {
    const allStoreItems = this.handleListStore();
    let items = this.handleFilter(this.items);
    return (
      <div className="container-table">
        <div className="col-md-12">
          <div
            className="detail-tab row"
            style={{ width: "900px", maxWidth: "100%" }}
          >
            <div className="row mt-15">
              <div className="col-md-12 mb-15">
                <div className="section-block w-full ">
                  <div className="row mrt-5">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="Date" className="w100pc">
                          Date
                        </label>
                        <DatePicker
                          placeholderText="Start date"
                          selected={this.fieldSelected.date}
                          onChange={(value) =>
                            this.handleChangeFieldCustom("date", value)
                          }
                          dateFormat="dd/MM/yyyy"
                          maxDate={decreaseDate(1)}
                          minDate={decreaseDate(60)}
                          className="form-control"
                          autoComplete="off"
                          // isClearable={this.fieldSelected.date ? true : false}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label
                          htmlFor=""
                          className="w100pc"
                          style={{ opacity: 0 }}
                        >
                          .
                        </label>
                        <div className="flex items-center gap-10">
                          <BaseButton
                            onClick={this.handleSearch}
                            iconName="search"
                          >
                            Search
                          </BaseButton>
                          <BaseButton
                            onClick={this.handleToggleDrawer}
                            color="green"
                          >
                            History
                          </BaseButton>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-right">
                      <div className="cl-red bg-note d-inline-block text-left">
                        Lưu ý:
                        <br />- Chọn ngày và tìm kiếm để xem thông tin cửa hàng.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-block mb-15 ">
              <div className="row">
                <div className="col-md-12">
                  <TableStoreSalesProcessAsync
                    items={items}
                    dataCompareSaleRegion={this.dataCompareSaleRegion}
                    isDataRegion={this.isDataRegion}
                    countersOnline={this.countersOnline}
                    onRefreshCountersStatus={this.handleGetCounterOnline}
                  />
                </div>
              </div>
            </div>
          </div>

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
        {this.fieldSelected.date &&
          this.counters &&
          allStoreItems?.length > 0 && (
            <DrawerStoreSaleAsync2
              open={this.isDrawerOpen}
              onClose={this.handleToggleDrawer}
              date={this.fieldSelected.date}
              onSetDate={this.handleSetDate.bind(this)}
            />
          )}
      </div>
    );
  }
}
