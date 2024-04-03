import BaseComponent from "components/BaseComponent";
import DatePicker from "react-datepicker";
import React from "react";
import Select from "react-select";
import Moment from "moment";

export default class SearchIMHistory extends BaseComponent {
  constructor(props) {
    super(props);

    this.historyPriceItemMaster = [];
    this.suppliers = props.suppliers || {};
    this.divisions = props.division || {};
    this.groups = props.groups || {};
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.minDate = this.tomorrow.setDate(this.today.getDate() - 90);
    this.fieldSelected = this.assignFieldSelected({
      fromDate: this.minDate,
      toDate: this.today,
      barCode: "",
      supplierCode: "",
      divisionCode: "",
      groupCode: "",
      historyType: "cost",
    });
    this.isRender = true;
  }
  findFilterItemOptions(name, keyOption) {
    switch (name) {
      case "group":
        if (keyOption !== undefined && keyOption !== "") {
          let groupKeys = Object.keys(this.groups);
          if (groupKeys.length && this.groups !== undefined) {
            var groupsDic = {};
            for (var key in groupKeys) {
              let itemKey = groupKeys[key];

              if (
                groupsDic[this.groups[itemKey]["divisionCode"]] === undefined
              ) {
                groupsDic[this.groups[itemKey]["divisionCode"]] = [];
              }
              groupsDic[this.groups[itemKey]["divisionCode"]].push(
                this.groups[itemKey],
              );
            }
          }
          return groupsDic[keyOption] || [];
        } else {
          this.fieldSelected.groupCode = "";
          return [];
        }
      default:
        break;
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.suppliers !== newProps.suppliers) {
      this.suppliers = newProps.suppliers;
    }
    if (this.divisions !== newProps.divisions) {
      this.divisions = newProps.divisions;
    }
    if (this.groups !== newProps.groups) {
      this.groups = newProps.groups;
    }

    this.refresh();
  }

  handleSearch = () => {
    let params = {
      fromDate: Moment(this.fieldSelected.fromDate).format("YYYY/MM/DD"),
      toDate: Moment(this.fieldSelected.toDate).format("YYYY/MM/DD"),
      barCode: this.fieldSelected.barCode,
      supplierCode: this.fieldSelected.supplierCode,
      divisionCode: this.fieldSelected.divisionCode,
      groupCode: this.fieldSelected.groupCode,
      historyType: this.fieldSelected.historyType,
    };
    return params;
  };
  changeFromDate = (value) => {
    this.minDate = value;
    this.tomorrow = new Date(this.minDate);
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.today = this.tomorrow.setDate(this.minDate.getDate() + 90);
    this.fieldSelected.fromDate = this.minDate;
    this.fieldSelected.toDate = this.today;
    this.refresh();
  };
  changeToDate = (value) => {
    this.today = value;
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.minDate = this.tomorrow.setDate(this.today.getDate() - 90);
    this.fieldSelected.fromDate = this.minDate;
    this.fieldSelected.toDate = this.today;
    this.refresh();
  };
  renderComp() {
    let historyTypeOptions = [
      { value: "cost", label: "Cost Price History" },
      { value: "cost-promotion", label: "Cost Promotion Price History" },
      { value: "selling", label: "Selling Price History" },
    ];
    let supplierOptions = [];
    let divisionOpt = [];
    let groupsOptions = [];
    if (this.suppliers && Object.keys(this.suppliers).length > 0) {
      let suppliers = Object.values(this.suppliers);
      supplierOptions =
        suppliers.map((item) => {
          return { value: item.supplierCode, label: item.supplierName };
        }) || [];
    }
    if (this.divisions && Object.keys(this.divisions).length > 0) {
      let divisions = Object.values(this.divisions);
      divisionOpt =
        divisions.map((item) => {
          return { value: item.divisionCode, label: item.divisionName };
        }) || [];
    }
    if (this.groups && Object.keys(this.groups).length > 0) {
      let groups = this.findFilterItemOptions(
        "group",
        this.fieldSelected.divisionCode,
      );
      groupsOptions = groups.map((item) => {
        return { value: item.groupCode, label: item.groupName };
      });
    }

    return (
      <section style={{ fontSize: 11 }}>
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="from" className="w100pc">
                {" "}
                From:{" "}
              </label>
              <DatePicker
                placeholderText="-- From --"
                onChange={(value) =>
                  this.handleChangeFieldCustom("fromDate", value, () =>
                    this.changeFromDate(value),
                  )
                }
                dateFormat="dd/MM/yyyy"
                selected={this.fieldSelected.fromDate}
                className="form-control"
                autoComplete="off"
                minDate={this.minDate}
                maxDate={this.today}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="to" className="w100pc">
                To:{" "}
              </label>
              <DatePicker
                placeholderText="-- To --"
                selected={this.fieldSelected.toDate}
                onChange={(value) =>
                  this.handleChangeFieldCustom("toDate", value, () =>
                    this.changeToDate(value),
                  )
                }
                dateFormat="dd/MM/yyyy"
                className="form-control"
                autoComplete="off"
                minDate={this.minDate}
                maxDate={this.today}
              />
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="supplier" className="w100pc">
                Supplier:
              </label>
              <Select
                // isDisabled={ supplierOptions.length === 1 }
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- All --"
                value={supplierOptions.filter(
                  (option) => option.value === this.fieldSelected.supplierCode,
                )}
                options={supplierOptions}
                onChange={(e) =>
                  this.handleChangeFieldCustom("supplierCode", e ? e.value : "")
                }
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="division" className="w100pc">
                Division:
              </label>
              <Select
                // isDisabled={ divisionOptions.length === 1 }
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- All --"
                value={divisionOpt.filter(
                  (option) => option.value === this.fieldSelected.divisionCode,
                )}
                options={divisionOpt}
                onChange={(e) =>
                  this.handleChangeFieldCustom("divisionCode", e ? e.value : "")
                }
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="group" className="w100pc">
                Category:
              </label>
              <Select
                // isDisabled={ groupOptions.length === 1 }
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- All --"
                value={groupsOptions.filter(
                  (option) => option.value === this.fieldSelected.groupCode,
                )}
                options={groupsOptions}
                onChange={(e) =>
                  this.handleChangeFieldCustom("groupCode", e ? e.value : "")
                }
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="barCode" className="w100pc">
                BarCode:
              </label>
              <input
                type="text"
                autoComplete="off"
                name="barCode"
                placeholder="-- BarCode --"
                value={this.props.itemName}
                onChange={(e) =>
                  this.handleChangeFieldCustom(
                    "barCode",
                    e ? e.target.value : "",
                  )
                }
                className="form-control"
                // disabled={this.isCreate ? false : true}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="historyType" className="w100pc">
                History Type:
              </label>
              <Select
                // isDisabled={ supplierOptions.length === 1 }
                classNamePrefix="select"
                maxMenuHeight={260}
                value={historyTypeOptions.filter(
                  (option) => option.value === this.fieldSelected.historyType,
                )}
                options={historyTypeOptions}
                onChange={(e) =>
                  this.handleChangeFieldCustom("historyType", e ? e.value : "")
                }
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
