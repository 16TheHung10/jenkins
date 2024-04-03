//Plugin
import $ from "jquery";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper } from "helpers";
import PromotionModel from "models/PromotionModel";

import SearchItems from "components/mainContent/promotion/addItemsDiscountList";
import ControlDetail from "components/mainContent/promotion/controlDetailDiscountList";
import ListDetail from "components/mainContent/promotion/listDetailDiscountList";

import { message } from "antd";

export default class SearchDetailDiscountList extends BaseComponent {
  constructor(props) {
    super(props);
    this.orderCode = this.props.orderCode || "";
    this.isCreate = this.orderCode === "";
    this.group = [];
    this.numberGroup = 1;

    this.isUpdateForm = this.orderCode !== "";
    this.isAllowShowForm = true;
    this.isAllowSave = true;
    this.isAllowUpdateStatus = false;
    this.items = [];
    this.infoPromotion = {};
    this.idSearchItemsComponent = "searchItemPopup" + StringHelper.randomKey();
    this.idFilterItemsComponent = "filterItemPopup" + StringHelper.randomKey();

    this.startDate = this.infoPromotion.fromDate
      ? new Date(this.infoPromotion.fromDate)
      : new Date();
    this.endDate = this.infoPromotion.toDate
      ? new Date(this.infoPromotion.toDate)
      : new Date();
    this.store = [];
    this.promotionName = "";
    this.active = this.infoPromotion.active || "";
    this.partnerList = [{ codeName: "", codeValue: "" }];
    this.dayOfWeeks = [];
    this.discountBill = "";

    this.indexAddMore = -1;
    this.qtyBuy = "";
    this.discountAmount = "";

    this.idListComponentRef = React.createRef();
    this.addItemRef = React.createRef();

    if (!this.isUpdateForm) {
      this.isRender = true;
    }
  }

  updateStartDate = (date) => {
    this.startDate = date;
    this.refresh();
  };
  updateEndDate = (date) => {
    this.endDate = date;
    this.refresh();
  };
  updateStore = (date) => {
    this.store = date;
    this.refresh();
  };
  updatePromotionName = (value) => {
    this.promotionName = value;
    this.refresh();
  };
  updateActive = (value) => {
    this.active = value;
    this.refresh();
  };

  componentDidMount = () => {
    this.handleUpdateState();
  };

  handleUpdateState = async () => {
    if (this.orderCode !== "") {
      let model = new PromotionModel();
      await model.getPromotion("discountbylist", this.orderCode).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotion) {
            this.infoPromotion = res.data.promotion;
            this.promotionName = res.data.promotion.promotionName;
            this.fieldSelected.store = this.infoPromotion.storeCode || "";

            this.fieldSelected.startDate = this.infoPromotion.fromDate
              ? new Date(this.infoPromotion.fromDate)
              : new Date();
            this.fieldSelected.endDate = this.infoPromotion.toDate
              ? new Date(this.infoPromotion.toDate)
              : new Date();

            this.items = this.infoPromotion.promotionDetails;

            this.qtyBuy = this.infoPromotion.quantityBuy || "";
            this.discountAmount = this.infoPromotion.discountAmount || "";
          }

          this.refreshAction();
          this.refresh();
        } else {
          // this.targetLink("/promotion-discount-list");
          this.showAlert(res.message);
        }
      });
      // this.handleHotKey(this.funcHotKey);
    } else {
      this.refreshAction();
      // this.handleHotKey(this.funcHotKey);
    }
  };

  refreshAction = () => {
    super
      .getActionMenu()
      .showHideActionItem(["save", "loadDefault"], this.isAllowSave);
    super
      .getActionMenu()
      .showHideActionItem(["approve", "delete"], this.isAllowUpdateStatus);
  };

  handleSave = () => {
    if (this.promotionName === "") {
      message.error("Please enter promotion name");
      return;
    }

    if (
      this.startDate === "" ||
      this.startDate === null ||
      this.endDate === "" ||
      this.endDate === null
    ) {
      message.error("Please select date");
      return;
    }

    if (this.items.length === 0) {
      message.error("Item not found");
      return;
    }

    if (this.qtyBuy === "") {
      message.error("Please enter quantity buy");
      return;
    }
    if (this.discountAmount === "") {
      message.error("Please enter discount amount");
      return;
    }

    let arrList = [];

    this.items.map((elm, index) =>
      arrList.push({
        itemCode: elm.itemCode,
        // discountAmount: elm.discountAmount,
      }),
    );

    let storeList = [];
    this.store.map((elm, index) => storeList.push(elm.value));

    let model = new PromotionModel();

    let params = {
      promotionName: this.promotionName,
      startDate: DateHelper.displayDateFormatMinus(this.startDate),
      endDate: DateHelper.displayDateFormatMinus(this.endDate) + "T23:59:59",
      storeCode: storeList,
      quantityBuy: this.qtyBuy,
      discountAmount: this.discountAmount,
      promotionDetails: arrList,
    };

    if (this.orderCode !== "") {
      model
        .putPromotion("discountbylist", this.orderCode, params)
        .then((res) => {
          if (res.status && res.data) {
            if (res.data.promotionCode && res.data.promotionCode !== "") {
              this.targetLink(
                "/promotion-discount-list/" + res.data.promotionCode,
                "/promotion-discount-list",
              );
            }
            this.showAlert("Save successfully!", "success");
          } else {
            this.showAlert(res.message);
          }
        });
    } else {
      model.postPromotion("discountbylist", params).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== "") {
            this.targetLink(
              "/promotion-discount-list/" + res.data.promotionCode,
              "/promotion-discount-list",
            );
          }
          this.showAlert("Save successfully!", "success");
        } else {
          this.showAlert(res.message);
        }
      });
    }
  };

  handleAddItemsToList = (results, index) => {
    let arrGroup = [];

    for (let elm in results) {
      let objElm = results[elm].item;

      this.items.push(objElm);
    }

    this.refresh();
  };

  handleShowSearchItems = (indexAddMore) => {
    $(".popup-form").hide();
    $("#" + this.idSearchItemsComponent).show();
    $("#" + this.idSearchItemsComponent)
      .find("[name=keywordbarcode]")
      .focus()
      .select();

    if (indexAddMore !== -1) {
      this.indexAddMore = indexAddMore;
    } else {
      this.indexAddMore = -1;
    }

    this.refresh();
  };

  handleShowFilterItems = () => {
    $(".popup-form").hide();
    $("#" + this.idFilterItemsComponent).show();
  };

  handleUpdateItems = (items) => {
    this.items = items;
    this.refresh();
  };

  updateQtyBuy = (value) => {
    this.qtyBuy = value;
    this.refresh();
  };
  updateDiscountAmount = (value) => {
    this.discountAmount = value;
    this.refresh();
  };

  renderComp = () => {
    this.funcHotKey = {
      ppAddItem: () => this.handleShowSearchItems(),
      ppFilter: () => this.handleShowFilterItems(),
      addItem:
        this.isAllowShowForm &&
        (!this.isUpdateForm ||
          (!this.infoPromotion.approved && !this.infoPromotion.cancel))
          ? () => this.addItemRef.current.handleAddItems()
          : undefined,
    };

    return (
      <section className="wrap-section">
        <div className="row header-detail">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <button
              onClick={() => super.back("/promotion-discount-list")}
              type="button"
              className="btn btn-back"
              style={{ background: "beige" }}
            >
              Back
            </button>
            <h2 className="name-target">
              {!this.isUpdateForm ? "New promotion" : "#" + this.orderCode}
            </h2>
          </div>
        </div>

        {this.isAllowShowForm ? (
          <ControlDetail
            isCreate={this.isCreate}
            infoPromotion={this.infoPromotion}
            group={this.group}
            updateStartDate={this.updateStartDate}
            updateEndDate={this.updateEndDate}
            updateStore={this.updateStore}
            updatePromotionName={this.updatePromotionName}
            promotionName={this.promotionName}
            updateActive={this.updateActive}
            active={this.active}
            updateQtyBuy={this.updateQtyBuy}
            updateDiscountAmount={this.updateDiscountAmount}
            qtyBuy={this.qtyBuy}
            discountAmount={this.discountAmount}
          />
        ) : null}

        {this.isAllowShowForm ? (
          <ListDetail
            infoPromotion={this.infoPromotion}
            items={this.items}
            filter={this.filterListPoDetail}
            showFilterItems={this.handleShowFilterItems}
            showSearchItems={this.handleShowSearchItems}
            updateItems={this.handleUpdateItems}
            type={this.props.type}
            ref={this.idListComponentRef}
            isCreate={this.isCreate}
            group={this.group}
          />
        ) : null}

        <SearchItems
          type={"discountbylist"}
          idComponent={this.idSearchItemsComponent}
          storeCode={this.fieldSelected.store}
          orderDate={this.fieldSelected.orderDate}
          supplierCode={this.fieldSelected.supplier}
          orderCode={this.orderCode}
          infoPromotion={this.infoPromotion}
          ref={this.addItemRef}
          selectedItems={this.items}
          addItemsToList={this.handleAddItemsToList}
          numberGroup={this.numberGroup}
          indexAddMore={this.indexAddMore}
        />
      </section>
    );
  };
}
