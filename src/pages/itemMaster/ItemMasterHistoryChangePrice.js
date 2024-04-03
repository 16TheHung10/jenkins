import Action from "components/mainContent/Action";
import HistoryPrice from "components/mainContent/itemMaster/historyPrice";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import React from "react";

import SearchIMHistory from "components/mainContent/itemMaster/searchIMHistory";
import CommonModel from "models/CommonModel";
import ItemMasterModel from "models/ItemMasterModel";
import BaseButton from "../../components/common/buttons/baseButton/BaseButton";

export default class ItemMasterHistoryChangePrice extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchIMHistory = React.createRef();
    this.historyPrice = React.createRef();
    this.historyPriceItemMaster = [];
    this.historyPriceItemMasterDistinct = [];
    this.suppliers = {};
    this.divisions = {};
    this.groups = {};
    this.subclasses = {};
    this.items = [];
    this.CostChangePrice = [];
    this.PromotionChangePrice = [];
    this.SalesChangePrice = [];
    this.barCodeSelected = "";
  }
  handleSearch = () => {
    this.handleGetHistoryPrice();
  };
  componentDidMount() {
    //this.handleGetHistoryPrice();
    this.handleSearch();
    this.handleGetDataCommon();
  }

  handleGetHistoryPrice = async () => {
    let model = new ItemMasterModel();
    let params = this.searchIMHistory.current.handleSearch();
    if (
      params.fromDate === "Invalid date" ||
      params.toDate === "Invalid date"
    ) {
      this.showAlert("Please choose From Date");
      return;
    }

    if (params.toDate === "Invalid date") {
      this.showAlert("Please choose To Date");
      return;
    }
    this.type = params.historyType;
    await model.getHistoryPrice(params.historyType, params).then((response) => {
      if (response.status && response.data.historyPriceItemMaster) {
        this.historyPriceItemMaster = response.data.historyPriceItemMaster;
        this.refresh();
      }
    });
  };
  handleGetDataCommon = async () => {
    let commonModel = new CommonModel();
    await commonModel
      .getData("supplier,division,group,subclass")
      .then((response) => {
        if (response.status) {
          this.suppliers = response.data.suppliers;
          this.divisions = response.data.divisions;
          this.groups = response.data.groups;
          this.subclasses = response.data.subclasses;
        }
      });
    this.refresh();
  };

  removeDuplicatesArr(originalArray, prop) {
    let newArray = [];
    let lookupObject = {};

    for (let i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (let i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
  getSupplier(barcode) {
    if (
      this.historyPriceItemMasterDistinct.length > 0 &&
      Object.keys(this.suppliers).length > 0 &&
      this.historyPriceItemMasterDistinct.filter((i) => i.barcode === barcode)
        .length > 0
    ) {
      let supplierCode = this.historyPriceItemMasterDistinct
        .filter((i) => i.barcode === barcode)
        .map((i) => i.supplierCode)
        .join();
      if (this.suppliers["S" + supplierCode]) {
        return (
          this.suppliers["S" + supplierCode].supplierCode +
          "-" +
          this.suppliers["S" + supplierCode].supplierName
        );
      }
    }
    return "Unknow";
  }

  getDivision(barcode) {
    if (
      this.historyPriceItemMasterDistinct.length > 0 &&
      Object.keys(this.divisions).length > 0 &&
      this.historyPriceItemMasterDistinct.filter((i) => i.barcode === barcode)
        .length > 0
    ) {
      let divisionCode = this.historyPriceItemMasterDistinct
        .filter((i) => i.barcode === barcode)
        .map((i) => i.divisionCode)
        .join();
      if (this.divisions[divisionCode]) {
        return (
          this.divisions[divisionCode].divisionCode +
          "-" +
          this.divisions[divisionCode].divisionName
        );
      }
    }
    return "Unknow";
  }

  getCategory(barcode) {
    if (
      this.historyPriceItemMasterDistinct.length > 0 &&
      Object.keys(this.groups).length > 0 &&
      this.historyPriceItemMasterDistinct.filter((i) => i.barcode === barcode)
        .length > 0
    ) {
      let groupCode = this.historyPriceItemMasterDistinct
        .filter((i) => i.barcode === barcode)
        .map((i) => i.groupCode)
        .join();
      if (this.groups[groupCode]) {
        return (
          this.groups[groupCode].groupCode +
          "-" +
          this.groups[groupCode].groupName
        );
      }
    }
    return "Unknow";
  }

  getSubCategory(barcode) {
    if (
      this.historyPriceItemMasterDistinct.length > 0 &&
      Object.keys(this.subclasses).length > 0 &&
      this.historyPriceItemMasterDistinct.filter((i) => i.barcode === barcode)
        .length > 0
    ) {
      let subCategoryCode = this.historyPriceItemMasterDistinct
        .filter((i) => i.barcode === barcode)
        .map((i) => i.subCategoryCode)
        .join();
      if (this.subclasses[subCategoryCode]) {
        return (
          this.subclasses[subCategoryCode].subClassCode +
          "-" +
          this.subclasses[subCategoryCode].subClassName
        );
      }
    }
    return "Unknow";
  }
  handleClickItems = (barcode) => {
    this.barCodeSelected = barcode;
    this.refresh();
  };
  handleExport = () => {
    this.historyPrice.current.handleExport();
  };
  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];

    actionLeftInfo.push({
      name: "",
      actionType: "",
      action: "",
      hide: true,
      actionName: "",
    });

    return (
      <Action
        leftInfo={actionLeftInfo}
        rightInfo={actionRightInfo}
        ref={this.actionRef}
      />
    );
  }
  renderPage() {
    return (
      <>
        <div className="container-table">
          {this.renderAlert()}
          {this.renderAction()}
          <div className="form-filter">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="section-block">
                  <SearchIMHistory
                    ref={this.searchIMHistory}
                    suppliers={this.suppliers}
                    divisions={this.divisions}
                    groups={this.groups}
                  />
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <div className="center_vertical gap-10">
                          <BaseButton
                            iconName="search"
                            onClick={this.handleSearch}
                          >
                            Search
                          </BaseButton>
                          <BaseButton
                            iconName="export"
                            color="green"
                            disabled={
                              this.historyPriceItemMaster.length === 0
                                ? true
                                : false
                            }
                            onClick={this.handleExport}
                          >
                            Export
                          </BaseButton>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 p-0">
                      <HistoryPrice
                        ref={this.historyPrice}
                        type={this.type}
                        suppliers={this.suppliers}
                        divisions={this.divisions}
                        groups={this.groups}
                        categorySubClasses={this.subclasses}
                        historyContent={this.historyPriceItemMaster}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
