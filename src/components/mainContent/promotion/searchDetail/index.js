//Plugin
import $ from "jquery";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import PromotionModel from "models/PromotionModel";

import SearchItems from "components/mainContent/promotion/addItems";
import ControlDetail from "components/mainContent/promotion/controlDetail";
import ListDetail from "components/mainContent/promotion/listDetail";

export default class SearchDetail extends BaseComponent {
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
  updatePartnerList = (value) => {
    this.partnerList = value;
    this.refresh();
  };
  updateDayOfWeeks = (value) => {
    this.dayOfWeeks = value;
    this.refresh();
  };
  updateDiscountBill = (value) => {
    this.discountBill = value;
    this.refresh();
  };

  componentDidMount = () => {
    this.handleUpdateState();
  };

  handleUpdateState = async () => {
    if (this.orderCode !== "") {
      let model = new PromotionModel();
      await model.getDetailPage(this.orderCode).then((res) => {
        if (res.status) {
          this.infoPromotion = res.data.promotion;
          this.promotionName = res.data.promotion.promotionName;
          this.fieldSelected.store = this.infoPromotion.storeCode || "";

          this.fieldSelected.startDate = this.infoPromotion.fromDate
            ? new Date(this.infoPromotion.fromDate)
            : new Date();
          this.fieldSelected.endDate = this.infoPromotion.toDate
            ? new Date(this.infoPromotion.toDate)
            : new Date();

          res.data.promotionDetail &&
            this.convertItemsResponse(res.data.promotionDetail);
          this.refreshAction();
          this.refresh();
        } else {
          this.targetLink("/promotion");
          this.showAlert(res.message);
        }
      });
      this.handleHotKey(this.funcHotKey);
    } else {
      this.refreshAction();
      this.handleHotKey(this.funcHotKey);
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

  convertItemsResponse = (result) => {
    let arr = [];

    let group = result.reduce((r, a) => {
      r[a.group] = [...(r[a.group] || []), a];
      return r;
    }, {});

    for (let el in group) {
      arr.push(group[el]);
    }

    this.items = arr;
    this.refresh();
  };

  handleApprove = () => {
    // let orderDetails = [];
    // var item = this.infoPromotion;
    // orderDetails.push({
    //     ElementID: item.poid,
    // });
    // var inforSaved = orderDetails;
    // new PromotionModel().approveMultiPo(inforSaved).then((response) => {
    //     if (response.status) {
    //         this.infoPromotion.approved = true;
    //         this.isAllowUpdateStatus = false;
    //         this.isAllowSave = false;
    //         this.targetLink("/purchase/" + this.orderCode, "/purchase");
    //     } else {
    //         this.showAlert(response.message);
    //     }
    // });
  };

  handleDelete = () => {
    // let orderDetails = [];
    // var item = this.infoPromotion;
    // orderDetails.push({
    //     ElementID: item.poid,
    // });
    // var inforSaved = orderDetails;
    // new PromotionModel().deleteMultiPo(inforSaved).then((response) => {
    //     if (response.status) {
    //         this.infoPromotion.cancel = true;
    //         this.isAllowUpdateStatus = false;
    //         this.isAllowSave = false;
    //         this.targetLink("/purchase/" + this.orderCode, "/purchase");
    //     } else {
    //         this.showAlert(response.message);
    //     }
    // });
  };

  handleSave = () => {
    if (this.promotionName === "") {
      this.showAlert("Please enter promotion name");
      return;
    }

    if (
      this.startDate === "" ||
      this.startDate === null ||
      this.endDate === "" ||
      this.endDate === null
    ) {
      this.showAlert("Please select date");
      return;
    }

    if (this.items.length === 0) {
      this.showAlert("Item not found");
      return;
    }

    let arrList = [];

    this.items.map((elm, index) =>
      elm.map((item, itemIndex) =>
        arrList.push({
          itemCode: item.itemCode,
          qty: item.qtyReceiving,
          discountAmount: item.discountAmount,
          group: index + 1,
        }),
      ),
    );

    let storeList = [];
    this.store.map((elm, index) => storeList.push(elm.value));

    let model = new PromotionModel();

    if (this.isCreate) {
      let params = {
        promotionName: this.promotionName,
        startDate: this.startDate,
        endDate: this.endDate,
        storeCode: storeList,
        promotionDetails: arrList,
      };

      // let params = {
      //     promotionName : this.promotionName,
      //     startDate : this.startDate,
      //     endDate : this.endDate,
      //     storeCode : storeList,
      //     promotionDetails: arrList,
      //     payment: this.partnerList,
      //     dayOfWeeks: this.dayOfWeeks,
      //     discountBill: this.discountBill,
      // }

      model.createPromotion(params).then((res) => {
        if (res.status && res.data.promotionCode) {
          this.targetLink("/promotion/" + res.data.promotionCode, "/promotion");
          this.showAlert("Save successfully!", "success");
        } else {
          this.showAlert(res.message);
        }
      });
    } else {
      let params = {
        promotionCode: this.orderCode,
        active: this.active,
      };
    }
  };

  handleAddItemsToList = (results) => {
    let arrGroup = [];

    for (let elm in results) {
      let objElm = results[elm].item;
      objElm["qtyReceiving"] = results[elm].qtyReceiving;
      objElm["discountAmount"] = results[elm].discountAmount;

      arrGroup.push(objElm);
    }

    this.items.push(arrGroup);

    this.refresh();
  };

  numberGroupUpdate = (num) => {
    this.numberGroup = this.numberGroup + 1;
    this.refresh();
  };

  handleShowSearchItems = () => {
    $(".popup-form").hide();
    $("#" + this.idSearchItemsComponent).show();
    $("#" + this.idSearchItemsComponent)
      .find("[name=keywordbarcode]")
      .focus()
      .select();
  };

  handleShowFilterItems = () => {
    $(".popup-form").hide();
    $("#" + this.idFilterItemsComponent).show();
  };

  handleUpdateOrderDateState = (orderDate, controlField = null) => {
    this.fieldSelected.orderDate = orderDate;
    if (controlField != null) {
      controlField.orderDate = orderDate;
    }
    this.refresh();
  };

  handleChangeOrderDate = (orderDate, fields = null) => {
    this.handleUpdateOrderDateState(fields.orderDate);
  };

  handleChangeStoreCode = (storeCode) => {
    this.fieldSelected.store = storeCode;
    this.refresh();
  };

  handleChangeSupplierCode = (supplier) => {
    this.fieldSelected.supplier = supplier;
    this.refresh();
  };

  handleChangeSupplierCode = (storeCode) => {
    this.fieldSelected.supplier = storeCode;
    this.refresh();
  };

  handleFilterListPoDetail = (filter) => {
    this.filterListPoDetail = filter;
    this.refresh();
  };

  handleUpdateItems = (items) => {
    this.items = items;
    this.refresh();
  };

  groupUpdate = (list) => {
    this.group = list;
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
              onClick={() => super.back("/promotion")}
              type="button"
              className="btn btn-back"
              style={{ background: "beige" }}
            >
              Back
            </button>
            <h2
              style={{
                margin: 10,
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {!this.isUpdateForm ? "New promotion" : "#" + this.orderCode}
            </h2>
          </div>
        </div>

        {this.isAllowShowForm ? (
          <ControlDetail
            isCreate={this.isCreate}
            infoPromotion={this.infoPromotion}
            group={this.group}
            groupUpdate={this.groupUpdate}
            updateStartDate={this.updateStartDate}
            updateEndDate={this.updateEndDate}
            updateStore={this.updateStore}
            updatePromotionName={this.updatePromotionName}
            promotionName={this.promotionName}
            updateActive={this.updateActive}
            active={this.active}
            updatePartnerList={this.updatePartnerList}
            updateDayOfWeeks={this.updateDayOfWeeks}
            updateDiscountBill={this.updateDiscountBill}
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

        {this.isCreate && (
          <SearchItems
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
            numberGroupUpdate={this.numberGroupUpdate}
          />
        )}
      </section>
    );
  };
}
