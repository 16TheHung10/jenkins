import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import BaseComponent from "components/BaseComponent";
import ListProductOrder from "components/mainContent/bill/listProductOrder";
import Sort from "components/mainContent/common/sort";
import { PageHelper, StringHelper } from "helpers";
import { decreaseDate } from "helpers/FuncHelper";
import CommonModel from "models/CommonModel";
class SearchProductOrder extends BaseComponent {
  constructor(props) {
    super(props);

    this.idListPROComponent = "listPRO" + StringHelper.randomKey();
    this.data.stores = [];
    this.data.orderStatuses = {};
    this.data.paymentStatuses = {};
    this.data.paymentTypes = {};
    this.data.partnerTypes = {};
    this.data.refundStatus = {};
    this.reporting = {};
    this.items = [];

    let dateDefault = new Date();

    this.fieldSelected = this.assignFieldSelected(
      {
        orderStartDate: dateDefault,
        orderEndDate: dateDefault,
        keyword: "",
        // orderStatus: "1",
        refundstatus: "1",
        page: 1,
      },
      ["storeCode"],
    );

    this.isAutoload = true;
    PageHelper.updateFilters(this.fieldSelected, function (filters) {
      if (filters["orderStartDate"]) {
        filters["orderStartDate"] = new Date(filters["orderStartDate"]);
      }
      if (filters["orderEndDate"]) {
        filters["orderEndDate"] = new Date(filters["orderEndDate"]);
      }
      return true;
    });
    this.listOrderRef = React.createRef();

    this.handleUpdateState = this.handleUpdateState.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  handleSearch(refresh = false) {
    if (this.fieldSelected.keyword && this.fieldSelected.keyword.length <= 2) {
      this.showAlert("Please enter keyword less than 2 characters");
      return;
    }

    this.listOrderRef.current.handleSearch(this.fieldSelected);
    PageHelper.pushHistoryState(this.fieldSelected);
  }

  handleExport() {
    this.listOrderRef.current.handleExport(this.fieldSelected);
  }

  async handleUpdateState(event) {
    let commonModel = new CommonModel();
    await commonModel
      .getData(
        "store,orderstatus,paymentstatus,paymenttype,orderpartners,refundstatus",
      )
      .then((response) => {
        if (response.status) {
          if (response.data.stores) {
            this.data.stores = response.data.stores;
          }
          if (response.data.orderStatuses) {
            this.data.orderStatuses = response.data.orderStatuses;
          }
          if (response.data.paymentStatuses) {
            this.data.paymentStatuses = response.data.paymentStatuses;
          }
          if (response.data.paymentTypes) {
            this.data.paymentTypes = response.data.paymentTypes;
          }
          if (response.data.partnerTypes) {
            this.data.partnerTypes = response.data.partnerTypes;
          }
          if (response.data.orderpartners) {
            this.data.partnerTypes = response.data.orderpartners;
          }
          if (response.data.refundStatus) {
            this.data.refundStatus = response.data.refundStatus;
          }
        }
      });
    this.handleHotKey({});
    this.refresh();
  }

  handleUpdateItems = (reporting) => {
    if (reporting !== null) {
      this.reporting = reporting[0];
      this.refresh();
    }
  };

  renderFilter() {
    let stores = this.data.stores;
    let storeKeys = Object.keys(stores);
    let storeOptions = [];
    if (storeKeys.length === 0) {
      storeOptions.push({
        value: this.data.storeCode,
        label: this.data.storeCode + " - " + this.data.storeName,
      });
    } else {
      storeOptions = storeKeys.map((key) => {
        return {
          value: stores[key].storeCode,
          label: stores[key].storeCode + " - " + stores[key].storeName,
        };
      });
    }

    // let orderStatuses = this.data.orderStatuses;
    // let orderStatusKeys = Object.keys(orderStatuses);
    // let orderStatuseOptions = orderStatusKeys.map((key) => {
    //     return { value: key, label: orderStatuses[key] };
    // });
    let refundStatus = this.data.refundStatus;
    let refundStatusKey = Object.keys(refundStatus);
    let refundStatusOptions = refundStatusKey.map((key) => {
      return { value: key, label: refundStatus[key] };
    });

    let paymentTypes = this.data.paymentTypes;
    let paymentTypeKeys = Object.keys(paymentTypes);
    let paymentTypeOptions = paymentTypeKeys.map((key) => {
      return { value: key, label: paymentTypes[key] };
    });

    return (
      <div className="form-filter">
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="store" className="w100pc">
                    Store
                  </label>
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
                      (option) => option.value === this.fieldSelected.storeCode,
                    )}
                    options={storeOptions}
                    onChange={(e) =>
                      this.handleChangeFieldCustom(
                        "storeCode",
                        e ? e.value : "",
                      )
                    }
                  />
                </div>
              </div>

              <div className="col-md-8">
                <div className="form-group">
                  <label className="w100pc">Order date</label>
                  <div className="row date-row-ft">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <DatePicker
                        placeholderText="From"
                        selected={this.fieldSelected.orderStartDate}
                        onChange={(value) =>
                          this.handleChangeFieldCustom("orderStartDate", value)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        // isClearable={this.fieldSelected.orderStartDate ? true : false}
                        minDate={decreaseDate(60)}
                        autoComplete="off"
                      />
                    </div>

                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <DatePicker
                        placeholderText="to"
                        selected={this.fieldSelected.orderEndDate}
                        onChange={(value) =>
                          this.handleChangeFieldCustom("orderEndDate", value)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        minDate={decreaseDate(60)}
                        // isClearable={this.fieldSelected.orderEndDate ? true : false}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="w100pc">Payment type</label>
                  <Select
                    isSearchable={false}
                    isClearable
                    classNamePrefix="select"
                    maxMenuHeight={260}
                    placeholder="--"
                    value={paymentTypeOptions.filter(
                      (option) =>
                        option.value === this.fieldSelected.paymentType,
                    )}
                    options={paymentTypeOptions}
                    onChange={(e) =>
                      this.handleChangeFieldCustom(
                        "paymentType",
                        e ? e.value : "",
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-md-4">
                <label className="w100pc">Status</label>
                <Select
                  isSearchable={false}
                  classNamePrefix="select"
                  maxMenuHeight={260}
                  placeholder="--"
                  value={refundStatusOptions.filter(
                    (option) =>
                      option.value === this.fieldSelected.refundstatus,
                  )}
                  options={refundStatusOptions}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "refundstatus",
                      e ? e.value : "",
                    )
                  }
                />
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="keyword" className="w100pc">
                    Keyword
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    name="keyword"
                    value={this.fieldSelected.keyword || ""}
                    onChange={this.handleChangeField}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          {this.reporting ? (
            <div className="col-md-5">
              <table
                className="table-hover d-block"
                style={{ width: "auto", float: "right", overflow: "auto" }}
              >
                <thead>
                  <tr>
                    <th></th>
                    <th className="fs-10 pd-5 bd-none rule-number">Order</th>
                    <th className="fs-10 pd-5 bd-none rule-number">
                      Processing
                    </th>
                    <th className="fs-10 pd-5 bd-none rule-number">Refund</th>
                    <th className="fs-10 pd-5 bd-none rule-number">None</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fs-10 pd-5 bd-none rule-number">Order</th>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "aliceblue" }}
                    >
                      {StringHelper.formatQty(
                        this.reporting.TotalSKUProcessingCurrent +
                          this.reporting.TotalSKUApproveCurrent +
                          this.reporting.TotalSKUDeleteCurrent,
                      )}
                    </td>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "ivory" }}
                    >
                      {StringHelper.formatQty(
                        this.reporting.TotalSKUProcessingCurrent,
                      )}
                    </td>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "aliceblue" }}
                    >
                      {StringHelper.formatQty(
                        this.reporting.TotalSKUApproveCurrent,
                      )}
                    </td>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "ivory" }}
                    >
                      {StringHelper.formatQty(
                        this.reporting.TotalSKUDeleteCurrent,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className="fs-10 pd-5 bd-none rule-number">Qty</th>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "aliceblue" }}
                    >
                      {StringHelper.formatQty(
                        this.reporting.TotalQtyProcessingCurrent +
                          this.reporting.TotalQtyApproveCurrent +
                          this.reporting.TotalQtyDeleteCurrent,
                      )}
                    </td>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "ivory" }}
                    >
                      {StringHelper.formatQty(
                        this.reporting.TotalQtyProcessingCurrent,
                      )}
                    </td>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "aliceblue" }}
                    >
                      {StringHelper.formatQty(
                        this.reporting.TotalQtyApproveCurrent,
                      )}
                    </td>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "ivory" }}
                    >
                      {StringHelper.formatQty(
                        this.reporting.TotalQtyDeleteCurrent,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className="fs-10 pd-5 bd-none rule-number">Value</th>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "aliceblue" }}
                    >
                      {StringHelper.formatPrice(
                        this.reporting.TotalValueProcessingCurrent +
                          this.reporting.TotalValueApproveCurrent +
                          this.reporting.TotalValueDeleteCurrent,
                      )}
                    </td>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "ivory" }}
                    >
                      {StringHelper.formatPrice(
                        this.reporting.TotalValueProcessingCurrent,
                      )}
                    </td>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "aliceblue" }}
                    >
                      {StringHelper.formatPrice(
                        this.reporting.TotalValueApproveCurrent,
                      )}
                    </td>
                    <td
                      className="fs-10 pd-5 bd-none rule-number"
                      style={{ background: "ivory" }}
                    >
                      {StringHelper.formatPrice(
                        this.reporting.TotalValueDeleteCurrent,
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <button
              type="button"
              onClick={() => this.handleSearch(true)}
              className="btn btn-success"
            >
              Search
            </button>
            <button
              type="button"
              onClick={this.handleExport}
              className="btn btn-success"
            >
              Export
            </button>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div className="col-md-offset-5 col-md-7">
              <Sort
                sortBy={this.fieldSelected.sortBy}
                sortOrder={this.fieldSelected.sortOrder}
                trigger={this.handleSearch}
                onChange={this.handleChangeFieldCustom}
                options={[
                  { value: "ordercode", label: "Order code" },
                  { value: "orderdate", label: "Order date" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderList() {
    return (
      <ListProductOrder
        idComponent={this.idListPROComponent}
        page={this.fieldSelected.page}
        storeCode={this.fieldSelected.storeCode}
        keyword={this.fieldSelected.keyword}
        orderStartDate={this.fieldSelected.orderStartDate}
        orderEndDate={this.fieldSelected.orderEndDate}
        // orderStatus={this.fieldSelected.orderStatus}
        refundstatus={this.fieldSelected.refundstatus}
        paymentStatus={this.fieldSelected.paymentStatus}
        paymentType={this.fieldSelected.paymentType}
        // partnerType={this.fieldSelected.partnerType}
        partnerType={3}
        sortBy={this.fieldSelected.sortBy}
        sortOrder={this.fieldSelected.sortOrder}
        onClickSearch={this.handleSearch}
        ref={this.listOrderRef}
        updateItems={this.handleUpdateItems}
        autoload={this.isAutoload}
        hasReporting={true}
      />
    );
  }

  renderComp() {
    return (
      <section>
        {this.renderFilter()}
        {this.renderList()}
      </section>
    );
  }
}

export default SearchProductOrder;
