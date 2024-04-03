//Plugin
import React from "react";
import DatePicker from "react-datepicker";
import CreatableSelect from "react-select/creatable";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import DownloadModel from "models/DownloadModel";
import LoyaltyModel from "models/LoyaltyModel";

// import SearchItems from "components/mainContent/loyalty/addItems";

export default class HighestPoint extends BaseComponent {
  constructor(props) {
    super(props);

    this.items = [];

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
    });

    this.isRender = true;
  }

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
    // if (fields.top === "" || fields.top === null) {
    //     this.showAlert("Please choose the top");
    //     return false;
    // }

    let model = new LoyaltyModel();
    let params = {
      top: fields.top,
    };

    await model.getHighestPoint(params).then((res) => {
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
    // if (fields.top === "" || fields.top === null) {
    //     this.showAlert("Please choose the top");
    //     return false;
    // }

    let model = new LoyaltyModel();
    let params = {
      top: fields.top,
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

  renderComp = () => {
    let fields = this.fieldSelected;
    let items = this.items;

    return (
      <section className="wrap-section">
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
              # Highest Point
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
                      this.optionTop.filter((a) => a.value == e.value).length <=
                        0 &&
                      this.optionTop.push({ label: e.value, value: e.value });
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
                    <th>Gender</th>
                    <th className="rule-number">Phone</th>
                    <th className="rule-number">Transaction point</th>
                    <th className="rule-number">Used point</th>
                    <th className="rule-number">Reward point</th>
                    <th className="rule-number">Reward transaction point</th>
                    <th className="rule-number">Merge transaction point</th>
                    <th className="rule-number">Id No</th>
                    <th className="rule-number">Passport</th>
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
                      <td>{item.lastName + " " + item.firstName}</td>
                      <td className="rule-number">{item.phone}</td>
                      <td>{item.gender}</td>
                      <td className="rule-number">
                        <span className="label label-warning">
                          {StringHelper.formatQty(item.totalTransactionPoint)}
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
              {items.length != 0 ? null : (
                <div className="table-message">Item not found</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };
}
