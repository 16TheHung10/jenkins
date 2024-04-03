import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import BaseComponent from "components/BaseComponent";
import { PageHelper, DateHelper } from "helpers";
import CommonModel from "models/CommonModel";
import ReportintModel from "models/ReportingModel";
import TableSmp from "components/mainContent/cico/TableSmp";
import TableTotalSmp from "components/mainContent/cico/TableTotalSmp";
import DownloadModel from "models/DownloadModel";
class Cico extends BaseComponent {
  constructor(props) {
    super(props);

    this.listSalesByStoreDetailRef = React.createRef();
    this.listTableMomoRef = React.createRef();
    this.listTableSmpRef = React.createRef();

    //Default data
    this.data.stores = [];

    this.dataTotalMomo = {};
    this.dataTableMomo = [];

    this.dataDetail = [];

    this.dataTotalSmp = {};
    this.dataTableSmp = [];

    this.data.soh = [];
    this.isSearch = false;

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        startDateSmp: new Date(),
        endDateSmp: new Date(),
        storeCodeSmp: "",
      },
      ["storeCode"],
    );

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        const arrList = ["startDateSmp", "endDateSmp"];

        function handleUpdateField(filters, arrList) {
          for (let i = 0; i < arrList.length; i++) {
            if (filters[arrList[i]]) {
              if (filters[arrList[i]] !== "") {
                filters[arrList[i]] = new Date(filters[arrList[i]]);
              } else {
                filters[arrList[i]] = "";
              }
            }
          }
        }

        handleUpdateField(filters, arrList);
        return true;
      },
    );

    this.isRender = true;
  }

  // exportDisposal = () => {
  //     var params = {
  //         id: this.fieldSelected.storeCode,
  //         startdate:
  //             this.fieldSelected.startDateDisposal !== null || this.fieldSelected.startDateDisposal !== ""
  //                 ? DateHelper.displayDateFormat(this.fieldSelected.startDateDisposal)
  //                 : "",
  //         enddate:
  //             this.fieldSelected.endDateDisposal !== null || this.fieldSelected.endDateDisposal !== ""
  //                 ? DateHelper.displayDateFormat(this.fieldSelected.endDateDisposal)
  //                 : "",
  //     };

  //     let model = new ReportintModel();
  //     model.exportDisposalDetail(params).then((response) => {
  //         if (response.status) {
  //             let downloadModel = new DownloadModel();
  //             downloadModel.get(response.data.downloadUrl, null, null, ".xls");
  //         } else {
  //             this.showAlert(response.message);
  //         }
  //     });
  // };

  // getDataDisposalDetail = async () => {
  //     var params = {
  //         type: "disposal",
  //         id: this.fieldSelected.storeCodeDis,
  //         startdate:
  //             this.fieldSelected.startDateDisposal !== null || this.fieldSelected.startDateDisposal !== ""
  //                 ? DateHelper.displayDateFormat(this.fieldSelected.startDateDisposal)
  //                 : "",
  //         enddate:
  //             this.fieldSelected.endDateDisposal !== null || this.fieldSelected.endDateDisposal !== ""
  //                 ? DateHelper.displayDateFormat(this.fieldSelected.endDateDisposal)
  //                 : "",
  //     };

  //     var report = new ReportintModel();
  //     await report.getDataReportDisposal(params).then((res) => {
  //         if (res.status) {
  //             this.data.disposal = res.data.disposal.disList;
  //             this.data.disposalTotal = res.data.total;
  //             this.refresh();
  //         }
  //     });
  // };

  componentDidMount() {
    this.handleUpdateState();
  }

  // handleSearch = () => {
  //     PageHelper.pushHistoryState(this.fieldSelected);

  //     if (this.fieldSelected.startDate !== null && this.fieldSelected.endDate !== null) {
  //         this.handleLoadDetailResult();
  //     } else {
  //         this.dataDetail = [];
  //         this.refresh();
  //     }
  // };

  // handleLoadDetailResult = async () => {
  //     let params = {
  //         storecode: this.fieldSelected.storeCode,
  //         startDate: this.fieldSelected.startDate,
  //         endDate: this.fieldSelected.endDate,
  //     };

  //     this.dataDetail = [];

  //     let resultModel = new ReportintModel();
  //     await resultModel
  //         .getDataSalesByStore(params.storecode, DateHelper.displayDateFormat(params.startDate), DateHelper.displayDateFormat(params.endDate))
  //         .then((res) => {
  //             if (res.status) {
  //                 this.dataDetail = res.data.rpList;
  //                 this.refresh();
  //             }
  //         });
  // };

  handleUpdateState = async (isCommon = true, isTableDetail = false) => {
    if (isCommon) {
      let commonModel = new CommonModel();
      await commonModel.getData("store").then((response) => {
        if (response.status) {
          this.data.stores = response.data.stores;
        }
      });
    }

    this.refresh();
  };

  openTab = (name, classname) => {
    var i;
    var x = document.getElementsByClassName(classname);

    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(name).style.display = "block";
  };

  hightLightTab = (index, classname) => {
    var i;
    var btn = document.getElementsByClassName(classname);
    for (i = 0; i < btn.length; i++) {
      btn[i].classList.remove("active");
    }

    btn[index].classList.add("active");
  };

  handleSearchCicoSmp = async () => {
    let params = {
      type: "cico",
      typePayment: "smartpay",
      storeCode: this.fieldSelected.storeCodeSmp,
      startDate:
        this.fieldSelected.startDateSmp !== ""
          ? DateHelper.displayDateFormat(this.fieldSelected.startDateSmp)
          : "",
      endDate:
        this.fieldSelected.endDateSmp !== ""
          ? DateHelper.displayDateFormat(this.fieldSelected.endDateSmp)
          : "",
    };

    let model = new ReportintModel();
    await model.getCicoReport(params).then((res) => {
      if (res.status && !res.data.cico) {
        this.showAlert("Item not found");
      }

      if (res.status && res.data && res.data.cico) {
        this.dataTableSmp = res.data.cico.result;
        this.dataTotalSmp = res.data.report;

        this.isSearch = true;
      }
    });

    this.refresh();
  };

  handleExportCicoSmp = () => {
    if (!this.isSearch) {
      this.showAlert("Please search before exporting");
      return false;
    }

    let params = {
      type: "smartpay",
      typePayment: "smartpay",
      storeCode: this.fieldSelected.storeCodeSmp,
      startDate:
        this.fieldSelected.startDateSmp !== ""
          ? DateHelper.displayDateFormat(this.fieldSelected.startDateSmp)
          : "",
      endDate:
        this.fieldSelected.endDateSmp !== ""
          ? DateHelper.displayDateFormat(this.fieldSelected.endDateSmp)
          : "",
    };

    let model = new ReportintModel();
    model.exportCico(params).then((response) => {
      if (response.status) {
        let downloadModel = new DownloadModel();
        downloadModel.get(response.data.downloadUrl, null, null, ".xls");
      } else {
        this.showAlert(response.message);
      }
    });
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
          value: orderStore[key].storeCode,
          label: orderStore[key].storeCode + " - " + orderStore[key].storeName,
        };
      });
    }

    return (
      <div className="container-table">
        <div id="smp" className="detail-tab row mrt-10">
          <div className="col-md-12">
            <div className="tt-tbtab tt-tb">
              <button
                className="btnTabSmp active"
                onClick={() => {
                  this.openTab("smp-cashin", "detail-smp");
                  this.hightLightTab(0, "btnTabSmp");
                }}
                style={{ padding: 0 }}
              >
                SMARTPAY
              </button>
              {/* <button
                                className="btnTabSmp"
                                onClick={() => {
                                    this.openTab("smp-cashout", "detail-smp");
                                    this.hightLightTab(1, "btnTabSmp");
                                }}
                            >
                                Cashout
                            </button> */}
            </div>

            <div className="wrap-block-table">
              <div id="smp-cashin" className="detail-smp mrt-10">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="storeCodeSmp" className="w100pc">
                            Store:
                          </label>
                          <Select
                            isDisabled={storeOptions.length === 1}
                            isClearable
                            classNamePrefix="select"
                            maxMenuHeight={260}
                            placeholder="-- All --"
                            value={storeOptions.filter(
                              (option) =>
                                option.value ===
                                this.fieldSelected.storeCodeSmp,
                            )}
                            options={storeOptions}
                            onChange={(e) =>
                              this.handleChangeFieldCustom(
                                "storeCodeSmp",
                                e ? e.value : "",
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="w100pc">Date:</label>
                          <div className="row date-row-ft">
                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                              <DatePicker
                                placeholderText="Start date"
                                selected={this.fieldSelected.startDateSmp}
                                onChange={(value) =>
                                  this.handleChangeFieldCustom(
                                    "startDateSmp",
                                    value,
                                  )
                                }
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                autoComplete="off"
                                isClearable={
                                  this.fieldSelected.startDateSmp ? true : false
                                }
                              />
                            </div>
                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                              <DatePicker
                                placeholderText="End date"
                                selected={this.fieldSelected.endDateSmp}
                                onChange={(value) =>
                                  this.handleChangeFieldCustom(
                                    "endDateSmp",
                                    value,
                                  )
                                }
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                autoComplete="off"
                                isClearable={
                                  this.fieldSelected.endDateSmp ? true : false
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12">
                        <button
                          onClick={this.handleSearchCicoSmp}
                          type="button"
                          className="btn btn-danger"
                          style={{ height: "38px" }}
                        >
                          Search
                        </button>
                        <button
                          onClick={this.handleExportCicoSmp}
                          type="button"
                          className="btn btn-danger"
                          style={{ height: "38px", marginRight: 0 }}
                        >
                          Export
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <TableTotalSmp data={this.dataTotalSmp} />
                  </div>
                </div>

                <div className="row mrt-10">
                  <div className="col-md-12">
                    <TableSmp
                      data={this.dataTableSmp}
                      // dataTT={this.data.disposalTotal}
                      // checkBill={this.handleCheckBill}
                      // ref={this.listBillDetailRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cico;
