//Plugin
import React from "react";
import DatePicker from "react-datepicker";
import CreatableSelect from "react-select/creatable";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import DownloadModel from "models/DownloadModel";
import LoyaltyModel from "models/LoyaltyModel";
import Moment from "moment";

// import SearchItems from "components/mainContent/loyalty/addItems";

export default class Reporting extends BaseComponent {
  constructor(props) {
    super(props);

    this.items = [];
    this.itemsHistory = [];
    this.itemsHighestPoint = [];

    this.optionTop = [
      { label: "30", value: "30" },
      { label: "50", value: "50" },
      { label: "100", value: "100" },
      { label: "200", value: "200" },
      { label: "300", value: "300" },
      { label: "500", value: "500" },
      { label: "1000", value: "1000" },
    ];

    this.fieldSelected = this.assignFieldSelected({
      top: "30",
      startDate: new Date(),
      endDate: new Date(),
      startDateHistory: new Date(),
      endDateHistory: new Date(),
      startDateHighestPoint: new Date(),
      endDateHighestPoint: new Date(),
    });

    this.isRender = true;
  }

  // handleSearch = async () => {
  //     let fields = this.fieldSelected;

  //     if (fields.startDate === "" || fields.startDate === null) {
  //         this.showAlert("Please choose start date");
  //         return false;
  //     }
  //     if (fields.endDate === "" || fields.endDate === null) {
  //         this.showAlert("Please choose end date");
  //         return false;
  //     }
  //     if (fields.top === "" || fields.top === null) {
  //         this.showAlert("Please choose the top");
  //         return false;
  //     }

  //     let model = new LoyaltyModel();
  //     let params = {
  //         startDate   : fields.startDate ? Moment(fields.startDate).format('YYYY-MM-DD') : "",
  //         endDate     : fields.endDate ? Moment(fields.endDate).format('YYYY-MM-DD') : "",
  //         top         : fields.top
  //     };

  //     await model.reportTransaction(params).then(res=>{
  //         if (res.status) {
  //             this.items = res.data.top;
  //             this.refresh();
  //         }
  //         else {
  //             this.showAlert(res.message);
  //         }
  //     });
  // };

  // handleExport = () => {
  //     let fields = this.fieldSelected;

  //     if (fields.startDate === "" || fields.startDate === null) {
  //         this.showAlert("Please choose start date");
  //         return false;
  //     }
  //     if (fields.endDate === "" || fields.endDate === null) {
  //         this.showAlert("Please choose end date");
  //         return false;
  //     }
  //     if (fields.top === "" || fields.top === null) {
  //         this.showAlert("Please choose the top");
  //         return false;
  //     }

  //     let model = new LoyaltyModel();
  //     let params = {
  //         startDate   : fields.startDate ? Moment(fields.startDate).format('YYYY-MM-DD') : "",
  //         endDate     : fields.endDate ? Moment(fields.endDate).format('YYYY-MM-DD') : "",
  //         top         : fields.top
  //     };

  //     model.exportReportTransaction(params).then(res=>{
  //         if (res.status) {
  //             let downloadModel = new DownloadModel();
  //             downloadModel.get(res.data.downloadUrl, null, null, ".xls");
  //         } else {
  //             this.showAlert(res.message);
  //         }
  //     });
  // }

  handleSearch = async () => {
    let fields = this.fieldSelected;

    if (fields.startDate === "" || fields.startDate === null) {
      this.showAlert("Please choose start date");
      return false;
    }
    if (fields.endDate === "" || fields.endDate === null) {
      this.showAlert("Please choose end date");
      return false;
    }

    let model = new LoyaltyModel();
    let params = {
      startDate: fields.startDate
        ? Moment(fields.startDate).format("YYYY-MM-DD")
        : "",
      endDate: fields.endDate
        ? Moment(fields.endDate).format("YYYY-MM-DD")
        : "",
    };

    await model.getListMember(params).then((res) => {
      if (res.status) {
        this.items = res.data.top;
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleExport = () => {
    let fields = this.fieldSelected;

    if (fields.startDate === "" || fields.startDate === null) {
      this.showAlert("Please choose start date");
      return false;
    }
    if (fields.endDate === "" || fields.endDate === null) {
      this.showAlert("Please choose end date");
      return false;
    }

    let model = new LoyaltyModel();
    let params = {
      startDate: fields.startDate
        ? Moment(fields.startDate).format("YYYY-MM-DD")
        : "",
      endDate: fields.endDate
        ? Moment(fields.endDate).format("YYYY-MM-DD")
        : "",
    };

    model.exportListMember(params).then((res) => {
      if (res.status) {
        let downloadModel = new DownloadModel();
        downloadModel.get(res.data.downloadUrl, null, null, ".xls");
      } else {
        this.showAlert(res.message);
      }
    });
  };

  // history -----------------
  handleSearchHistory = async () => {
    let fields = this.fieldSelected;

    if (fields.startDateHistory === "" || fields.startDateHistory === null) {
      this.showAlert("Please choose start date");
      return false;
    }
    if (fields.endDateHistory === "" || fields.endDateHistory === null) {
      this.showAlert("Please choose end date");
      return false;
    }

    let model = new LoyaltyModel();
    let params = {
      startDate: fields.startDateHistory
        ? Moment(fields.startDateHistory).format("YYYY-MM-DD")
        : "",
      endDate: fields.endDateHistory
        ? Moment(fields.endDateHistory).format("YYYY-MM-DD")
        : "",
    };

    await model.getTransLogReport(params).then((res) => {
      if (res.status) {
        this.itemsHistory = res.data.top;
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleExportHistory = () => {
    let fields = this.fieldSelected;

    if (fields.startDateHistory === "" || fields.startDateHistory === null) {
      this.showAlert("Please choose start date");
      return false;
    }
    if (fields.endDateHistory === "" || fields.endDateHistory === null) {
      this.showAlert("Please choose end date");
      return false;
    }

    let model = new LoyaltyModel();
    let params = {
      startDate: fields.startDateHistory
        ? Moment(fields.startDateHistory).format("YYYY-MM-DD")
        : "",
      endDate: fields.endDateHistory
        ? Moment(fields.endDateHistory).format("YYYY-MM-DD")
        : "",
    };

    model.exportTransLogReport(params).then((res) => {
      if (res.status) {
        let downloadModel = new DownloadModel();
        downloadModel.get(res.data.downloadUrl, null, null, ".xls");
      } else {
        this.showAlert(res.message);
      }
    });
  };

  // Highest Point ------------------
  handleSearchHighestPoint = async () => {
    let fields = this.fieldSelected;

    if (
      fields.startDateHighestPoint === "" ||
      fields.startDateHighestPoint === null
    ) {
      this.showAlert("Please choose start date");
      return false;
    }
    if (
      fields.endDateHighestPoint === "" ||
      fields.endDateHighestPoint === null
    ) {
      this.showAlert("Please choose end date");
      return false;
    }
    // if (fields.top === "" || fields.top === null) {
    //     this.showAlert("Please choose the top");
    //     return false;
    // }

    let model = new LoyaltyModel();
    let params = {
      top: fields.top,
      startDate: fields.startDateHighestPoint
        ? Moment(fields.startDateHighestPoint).format("YYYY-MM-DD")
        : "",
      endDate: fields.endDateHighestPoint
        ? Moment(fields.endDateHighestPoint).format("YYYY-MM-DD")
        : "",
    };

    await model.getHighestPoint(params).then((res) => {
      if (res.status) {
        this.itemsHighestPoint = res.data.top;
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleExportHighestPoint = () => {
    let fields = this.fieldSelected;

    if (
      fields.startDateHighestPoint === "" ||
      fields.startDateHighestPoint === null
    ) {
      this.showAlert("Please choose start date");
      return false;
    }
    if (
      fields.endDateHighestPoint === "" ||
      fields.endDateHighestPoint === null
    ) {
      this.showAlert("Please choose end date");
      return false;
    }
    // if (fields.top === "" || fields.top === null) {
    //     this.showAlert("Please choose the top");
    //     return false;
    // }

    let model = new LoyaltyModel();
    let params = {
      top: fields.top,
      startDate: fields.startDateHighestPoint
        ? Moment(fields.startDateHighestPoint).format("YYYY-MM-DD")
        : "",
      endDate: fields.endDateHighestPoint
        ? Moment(fields.endDateHighestPoint).format("YYYY-MM-DD")
        : "",
    };

    model.exportHighestPoint(params).then((res) => {
      if (res.status) {
        let downloadModel = new DownloadModel();
        downloadModel.get(res.data.downloadUrl, null, null, ".xls");
      } else {
        this.showAlert(res.message);
      }
    });
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

  eventName = (eventName) => {
    switch (eventName) {
      case "BILL_PRINTED":
        return <span className="label label-primary">Hóa đơn</span>;
      case "PAYMENT":
        return <span className="label label-success">Thanh toán</span>;
      case "RETURN_ITEM":
        return <span className="label label-info">Trả hàng</span>;
      case "BILL_CANCEL":
        return <span className="label label-warning">Hóa đơn hủy</span>;
      case "ADD_REWARD":
        return (
          <span className="label label-primary">
            Điểm thưởng không theo giao dịch
          </span>
        );
      case "ADD_REWARD_TRANSACTION":
        return (
          <span className="label label-success">
            Điểm thưởng theo giao dịch
          </span>
        );
      case "BILL_CANCEL":
        return <span className="label label-success">Huỷ hoá đơn</span>;
      default:
        return <span className="label label-default">{eventName}</span>;
    }
  };

  renderComp = () => {
    let fields = this.fieldSelected;
    let items = this.items;
    let itemsHistory = this.itemsHistory;
    let itemsHighestPoint = this.itemsHighestPoint;

    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <div className="tt-tbtab">
              <button
                className="btnTitle active"
                onClick={() => {
                  this.openTab("report-memberregister", "detail-tab");
                  this.hightLightTab(0, "btnTitle");
                }}
              >
                New member registered
              </button>
              <button
                className="btnTitle"
                onClick={() => {
                  this.openTab("report-history", "detail-tab");
                  this.hightLightTab(1, "btnTitle");
                }}
              >
                History transaction
              </button>
              <button
                className="btnTitle"
                onClick={() => {
                  this.openTab("report-highestscore", "detail-tab");
                  this.hightLightTab(2, "btnTitle");
                }}
              >
                Member with the highest score
              </button>
            </div>
          </div>
        </div>
        <section className="wrap-section">
          <div id="report-memberregister" className="detail-tab">
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

                <h2
                  style={{
                    margin: 10,
                    display: "inline-block",
                    verticalAlign: "top",
                  }}
                >
                  # New member registered
                </h2>
              </div>
            </div>

            <div className="form-filter">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="w100pc">Date: </label>
                    <div className="row date-row-ft">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
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
                          placeholderText="End date"
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

              <div className="row">
                <div className="col-md-9">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.handleExport}
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="wrap-table htable" style={{ marginBottom: 10 }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Member code</th>
                        <th>Full name</th>
                        <th className="rule-number">Passport</th>
                        <th>Gender</th>
                        <th className="rule-number">Phone</th>
                        <th>Email</th>
                        <th className="rule-date">Birthday</th>
                        <th className="rule-date">Register date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, key) => (
                        <tr
                          key={key}
                          data-group="itemContainer"
                          data-item-code={item.memberCode}
                        >
                          <td>{item.memberCode}</td>
                          <td>
                            {item.lastName} {item.firstName}
                          </td>
                          <td className="rule-number">{item.passport}</td>
                          <td>{item.gender}</td>
                          <td className="rule-number">{item.phone}</td>
                          <td>{item.email}</td>
                          <td className="rule-date">{item.birthDateStr}</td>
                          <td className="rule-date">{item.registerDateStr}</td>
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
          </div>

          <div
            id="report-history"
            className="detail-tab"
            style={{ display: "none" }}
          >
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

                <h2
                  style={{
                    margin: 10,
                    display: "inline-block",
                    verticalAlign: "top",
                  }}
                >
                  # History transaction
                </h2>
              </div>
            </div>

            <div className="form-filter">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="w100pc">Date: </label>
                    <div className="row date-row-ft">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="Start date"
                          selected={fields.startDateHistory}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "startDateHistory",
                              value,
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={fields.startDateHistory ? true : false}
                        />
                      </div>
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="End date"
                          selected={fields.endDateHistory}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "endDateHistory",
                              value,
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={fields.endDateHistory ? true : false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-9">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.handleSearchHistory}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.handleExportHistory}
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="wrap-table htable" style={{ marginBottom: 10 }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Full name</th>
                        <th className="rule-number">Phone</th>
                        <th>Invoice code</th>
                        <th className="rule-number">transactionPoint</th>
                        <th className="rule-date">Request date</th>
                        <th>Event name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsHistory.map((item, key) => (
                        <tr
                          key={key}
                          data-group="itemContainer"
                          data-item-code={item.memberCode}
                        >
                          <td>
                            {item.lastName} {item.firstName}
                          </td>
                          <td className="rule-number">{item.phone}</td>
                          <td>{item.invoiceCode}</td>
                          <td className="rule-number">
                            {item.transactionPoint}
                          </td>
                          <td className="rule-date">{item.requestDateStr}</td>
                          <td>{this.eventName(item.eventName)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {itemsHistory.length != 0 ? null : (
                    <div className="table-message">Item not found</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            id="report-highestscore"
            className="detail-tab"
            style={{ display: "none" }}
          >
            <div className="row header-detail">
              <div className="col-md-12">
                <button
                  onClick={() => super.back("/loyalty")}
                  type="button"
                  className="btn btn-back"
                  style={{ background: "beige", marginTop: 10 }}
                >
                  Back
                </button>

                <h2
                  style={{
                    margin: 10,
                    display: "inline-block",
                    verticalAlign: "top",
                  }}
                >
                  # Member with the highest score
                </h2>
              </div>
            </div>

            <div className="form-filter">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="w100pc">Date: </label>
                    <div className="row date-row-ft">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="Start date"
                          selected={fields.startDateHighestPoint}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "startDateHighestPoint",
                              value,
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={
                            fields.startDateHighestPoint ? true : false
                          }
                        />
                      </div>
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="End date"
                          selected={fields.endDateHighestPoint}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "endDateHighestPoint",
                              value,
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={
                            fields.endDateHighestPoint ? true : false
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Top:
                    </label>
                    <CreatableSelect
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="--"
                      value={this.optionTop.filter(
                        (option) => option.value === fields.top,
                      )}
                      options={this.optionTop}
                      onChange={(e) => {
                        this.handleChangeFieldCustom("top", e ? e.value : "");
                        e &&
                          e.value &&
                          this.optionTop.filter((a) => a.value == e.value)
                            .length <= 0 &&
                          this.optionTop.push({
                            label: e.value,
                            value: e.value,
                          });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-9">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.handleSearchHighestPoint}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.handleExportHighestPoint}
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="wrap-table htable" style={{ marginBottom: 10 }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Member code</th>
                        <th>Full name</th>
                        <th className="rule-number">Phone</th>
                        <th>Gender</th>
                        <th className="rule-number">Transaction point</th>
                        <th className="rule-number">Used point</th>
                        <th className="rule-number">Reward point</th>
                        <th className="rule-number">
                          Reward transaction point
                        </th>
                        <th className="rule-number">Merge transaction point</th>
                        <th className="rule-number">Id No</th>
                        <th className="rule-number">Passport</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsHighestPoint.map((item, key) => (
                        <tr
                          key={key}
                          data-group="itemContainer"
                          data-item-code={item.memberCode}
                        >
                          <td>{item.memberCode}</td>
                          <td>{item.lastName + " " + item.firstName}</td>
                          <td className="rule-number">{item.phone}</td>
                          <td>{item.gender}</td>
                          <td className="rule-number">
                            <span className="label label-warning">
                              {StringHelper.formatQty(
                                item.totalTransactionPoint,
                              )}
                            </span>
                          </td>
                          <td className="rule-number">
                            <span className="label label-warning">
                              {StringHelper.formatQty(item.totalUsedPoint)}
                            </span>
                          </td>
                          <td className="rule-number">
                            <span className="label label-warning">
                              {StringHelper.formatQty(item.totalRewardPoint)}
                            </span>
                          </td>
                          <td className="rule-number">
                            <span className="label label-warning">
                              {StringHelper.formatQty(
                                item.totalRewardTransactionPoint,
                              )}
                            </span>
                          </td>
                          <td className="rule-number">
                            <span className="label label-warning">
                              {StringHelper.formatQty(
                                item.totalMergeTransactionPoint,
                              )}
                            </span>
                          </td>
                          <td className="rule-number">{item.idNo}</td>
                          <td className="rule-number">{item.passport}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {itemsHighestPoint.length != 0 ? null : (
                    <div className="table-message">Item not found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };
}
