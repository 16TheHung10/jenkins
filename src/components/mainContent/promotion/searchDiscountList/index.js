//Plugin
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, PageHelper, StringHelper } from "helpers";

import CommonModel from "models/CommonModel";
// import ListSearch from "components/mainContent/promotion/listSearchDiscountBill";
import PromotionModel from "models/PromotionModel";

export default class SearchDiscountList extends BaseComponent {
  constructor(props) {
    super(props);

    this.listSearchRef = React.createRef();
    this.idListComponent = "listPromotion" + StringHelper.randomKey();

    //Default data
    this.data.stores = [];
    this.data.orderstatus = [
      { value: "1", label: "Active" },
      { value: "0", label: "Inactive" },
    ];
    this.data.types = [];
    this.itemCount = 0;
    this.items = [];
    this.data.partners = {};

    //Data Selected
    this.fieldSelected = this.assignFieldSelected(
      {
        promotionCode: "",
        startDate: new Date(),
        endDate: new Date(),
        orderStatus: "",
        page: 1,
        type: "",
        partners: "",
        // discountAmount: 0,
      },
      ["storeCode"],
    );

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        if (filters["startDate"]) {
          filters["startDate"] = new Date(filters["startDate"]);
        }
        if (filters["endDate"]) {
          filters["endDate"] = new Date(filters["endDate"]);
        }

        return true;
      },
    );

    this.exportStore = [];
    this.exportSupplier = [];
    this.isExported = 0;
    this.isRender = true;
  }

  componentDidMount = () => {
    this.handleUpdateState();
  };

  handleSearch = () => {
    PageHelper.pushHistoryState(this.fieldSelected);

    this.handleLoadResult();

    this.refresh();
  };

  handleLoadResult = () => {
    let fields = this.fieldSelected;

    if (fields.startDate === "") {
      this.showAlert("Please select start date");
      return;
    }

    if (fields.endDate === "") {
      this.showAlert("Please select end date");
      return;
    }

    let page = "/promotion/discountbill/search";

    let params = {
      name: fields.promotionCode,
      startDate:
        fields.startDate !== ""
          ? DateHelper.displayDateFormat(fields.startDate)
          : "",
      endDate:
        fields.endDate !== ""
          ? DateHelper.displayDateFormat(fields.endDate)
          : "",
      pageNumber: fields.page,
      status: fields.status,
      pageSize: 30,
      store: fields.storeCode,
    };

    let model = new PromotionModel();
    model.getList(page, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.promotions) {
          this.itemCount = res.data.total;
          this.items = res.data.promotions;
        }
      }

      this.refresh();
    });
  };

  handleUpdateState = async (event) => {
    let commonModel = new CommonModel();
    await commonModel.getData("store,partners").then((response) => {
      if (response.status && response.data.stores) {
        this.data.stores = response.data.stores || [];
        this.data.partners = response.data.partners || [];
      }
    });
    this.handleHotKey({});
    this.refresh();
  };

  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.page = page;
    this.refresh();
  };

  renderFilter = () => {
    const fields = this.fieldSelected;

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

    // PARTNER:
    let partners = this.data.partners;
    let partnersOption = Object.keys(partners).map((elm) => {
      let obj = { value: partners[elm].key, label: partners[elm].value };
      return obj;
    });

    return (
      <div className="form-filter">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="row">
              <div className="col-md-8">
                <div className="row">
                  {/* STORE */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="storeCode" className="w100pc">
                        Store
                      </label>
                      <Select
                        isDisabled={storeOptions.length === 1}
                        isClearable
                        isMulti
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- All --"
                        value={storeOptions.filter(
                          (option) =>
                            fields.storeCode.indexOf(option.value) !== -1,
                        )}
                        options={storeOptions}
                        onChange={(e) =>
                          this.handleChangeFieldsCustom("storeCode", e ? e : "")
                        }
                      />
                    </div>
                  </div>

                  {/* DATE */}
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
                  {/* PROMOTION CODE */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="promotionCode">Promotion code: </label>
                      <input
                        type="text"
                        autoComplete="off"
                        name="promotionCode"
                        value={fields.promotionCode || ""}
                        onChange={this.handleChangeField}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="storeCode" className="w100pc">
                        Status:
                      </label>
                      <Select
                        isClearable
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="--"
                        value={this.data.orderstatus.filter(
                          (option) => option.value === fields.orderStatus,
                        )}
                        options={this.data.orderstatus}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "orderStatus",
                            e ? e.value : "",
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                {/* PARTNER */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="storeCode" className="w100pc">
                        Partner:
                      </label>
                      <Select
                        isDisabled={partnersOption.length === 1}
                        isClearable
                        isMulti
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- All --"
                        value={partnersOption.filter(
                          (option) =>
                            fields.partners.indexOf(option.value) !== -1,
                        )}
                        options={partnersOption}
                        onChange={(e) =>
                          this.handleChangeFieldsCustom("partners", e ? e : "")
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="discountAmount">Discount amount (%): </label>
                                            <input
                                                type="number"
                                                autoComplete="off"
                                                name="discountAmount"
                                                max="100"
                                                min="0"
                                                value={fields.discountAmount || 0}
                                                onChange={this.handleChangeField}
                                                onBlur={this.handleBlurIpNumber}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div> */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderList = () => {
    return (
      <>
        {/* <ListSearch
                idComponent={this.idListComponent}
                ref={this.listSearchRef}

                refresh={this.countSearch}
                page={this.fieldSelected.page}

                items={this.items}
                handleLoadResult={this.handleLoadResult}

                promotionCode={this.fieldSelected.promotionCode}
                startDate={this.fieldSelected.startDate}
                endDate={this.fieldSelected.endDate}
                storeCode={this.fieldSelected.storeCode}
                suppliers={this.fieldSelected.type}
                
                orderStatus={this.fieldSelected.orderStatus}
                autoload={this.isAutoload}
                type={this.props.type}
                onClickShowItemSearchRCVtoRCV={this.props.onClickShowItemSearchRCVtoRCV}
                onClickSearch={this.handleSearch}
                exportStore={this.exportStore}
                exportSupplier={this.exportSupplier}
                isExported={this.isExported}

                handleClickPaging={this.handleClickPaging}
                itemCount={this.itemCount}
            /> */}
      </>
    );
  };

  renderComp = () => {
    return (
      <div>
        {this.renderFilter()}
        {this.renderList()}
      </div>
    );
  };
}
