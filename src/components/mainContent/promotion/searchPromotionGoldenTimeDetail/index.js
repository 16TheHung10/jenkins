//Plugin
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Col, Row, Tag, message } from "antd";
import $ from "jquery";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper } from "helpers";
import ItemModel from "models/ItemModel";
import PromotionModel from "models/PromotionModel";

import ControlDetail from "components/mainContent/promotion/controlPromotionBuyOneGetOneDetail/index_bk2";

import TableComp from "utils/table";
import moment from "moment";

export default class SearchPromotionGoldenTimeDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.idControlItemRef = React.createRef();

    this.orderCode = this.props.orderCode || "";
    this.isCreate = this.orderCode === "";
    this.isCopyType = this.props.type === "copy";

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
      : moment().add(1, "day");
    this.endDate = this.infoPromotion.toDate
      ? new Date(this.infoPromotion.toDate)
      : moment().add(1, "day");
    this.store = [];
    this.promotionName = "";
    this.active = "";
    this.partnerList = [{ codeName: "", codeValue: "" }];
    this.dayOfWeeks = [];
    this.discountBill = "";

    this.indexAddMore = -1;

    this.idListComponentRef = React.createRef();
    this.addItemRef = React.createRef();

    this.allItems = {};
    this.editListItem = [];
    this.isEdit = false;

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
  updateDate = (start, end) => {
    this.startDate = start;
    this.endDate = end;
    this.refresh();
  };
  updateStore = (store) => {
    this.store = store;
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
    this.handleGetAllItem();
  };

  handleGetAllItem = async () => {
    let model = new ItemModel();
    await model.getAllItems().then((res) => {
      if (res.status && res.data) {
        if (res.data.items) {
          this.allItems = res.data.items;
          this.refresh();
        }
      } else {
        message.error(res.message);
      }
    });
  };

  handleUpdateState = async () => {
    if (this.orderCode !== "") {
      let model = new PromotionModel();
      await model.getPromotion("buygift", this.orderCode).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotion) {
            this.infoPromotion = res.data.promotion;

            this.promotionName = !this.isCopyType
              ? res.data.promotion.promotionName
              : "";

            this.fieldSelected.store = !this.isCopyType
              ? this.infoPromotion.storeCode
              : "";
            this.store = !this.isCopyType ? this.infoPromotion.storeCode : "";

            this.startDate = !this.isCopyType
              ? this.infoPromotion.fromDate
                ? new Date(this.infoPromotion.fromDate)
                : new Date()
              : new Date();
            this.endDate = !this.isCopyType
              ? this.infoPromotion.toDate
                ? new Date(this.infoPromotion.toDate)
                : new Date()
              : new Date();

            this.active = !this.isCopyType
              ? this.infoPromotion.active === 0
                ? 2
                : this.infoPromotion.active
              : "";

            res.data.promotion.promotionDetails &&
              this.convertItemsResponse(res.data.promotion.promotionDetails);

            this.refreshAction();
            this.refresh();
          }
        } else {
          this.targetLink("/promotion-buy-one-get-one");
          message.error(res.message);
        }
      });
      this.handleHotKey(this.funcHotKey);
    } else {
      // this.refreshAction();
      super.getActionMenu().showHideActionItem(["save"], this.isAllowSave);
      this.handleHotKey(this.funcHotKey);
    }
  };

  refreshAction = () => {
    if (this.isCopyType) {
      super.getActionMenu().showHideActionItem(["save"], this.isAllowSave);
    } else {
      super
        .getActionMenu()
        .showHideActionItem(["save", "updatestatus"], this.isAllowSave);
    }
    // super.getActionMenu().showHideActionItem(["approve", "delete"], this.isAllowUpdateStatus);
  };

  convertItemsResponse = (result) => {
    let arr = [];

    let group = result.reduce((r, a) => {
      r[a.group] = [...(r[a.group] || []), a];
      return r;
    }, {});

    for (let el in group) {
      let item = group[el];

      for (let k in item) {
        item[k].key = k;
      }

      arr.push(group[el]);
    }

    this.items = arr;

    this.refresh();
  };

  handleSave = () => {
    if (this.isCopyType) {
      this.orderCode = "";
    }

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
      message.errort("Please select date");
      return;
    }

    if (
      !this.isCreate &&
      DateHelper.diffDate(new Date(), new Date(this.startDate)) < 0
    ) {
      message.error("Apply date must be greater than or equal to current date");
      return;
    }

    if (this.items.length === 0) {
      message.error("Item not found");
      return;
    }

    let arrList = [];

    this.items.map((elm, index) =>
      elm.map((item, itemIndex) =>
        arrList.push({
          // key: index+"_"+itemIndex,
          itemCode: item.itemCode,
          qty: item.qty,
          // discountAmount: item.discountAmount,
          group: index + 1,
          type: item.type,
        }),
      ),
    );

    let model = new PromotionModel();

    let params = {
      promotionName: this.promotionName,
      startDate: DateHelper.displayDateFormatMinus(this.startDate),
      endDate: DateHelper.displayDateFormatMinus(this.endDate) + "T23:59:59",
      storeCode: this.store.length > 0 ? this.store : [],
      promotionDetails: arrList,
    };

    if (this.orderCode !== "") {
      params.status = parseInt(this.active === 2 ? 0 : this.active);

      if (this.store.length === 0) {
        message.error("Please choose store");
        return;
      }
      model.putPromotion("buygift", this.orderCode, params).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== "") {
            this.targetLink(
              "/promotion-buy-one-get-one/" + res.data.promotionCode,
              "/promotion-buy-one-get-one",
            );
          }
          message.success("Save successfully!", 3);
        } else {
          message.error(res.message);
        }
      });
    } else {
      params.status = 1;
      model.postPromotion("buygift", params).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== "") {
            this.targetLink(
              "/promotion-buy-one-get-one/" + res.data.promotionCode,
              "/promotion-buy-one-get-one",
            );
          }
          message.success("Save successfully!", 3);
        } else {
          message.error(res.message);
        }
      });
    }
  };

  handleUpdateStatus = () => {
    let model = new PromotionModel();
    let type = this.active === 1 ? "/active" : "/inactive";
    let page = "buygift" + type;
    model.putPromotion(page, this.infoPromotion.promotionCode).then((res) => {
      if (res.status && res.data) {
        message.success("Save successfully!", 3);
      } else {
        message.error(res.message);
      }
    });
  };

  numberGroupUpdate = (num) => {
    this.numberGroup = this.numberGroup + 1;
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

  handleUpdateDataGroupPromo = (arr, index) => {
    let newArr = [];

    if (index !== "") {
      newArr = this.items.map((obj, i) => {
        if (i === index) {
          return arr;
        }
        return obj;
      });

      this.items = newArr;
    } else {
      let group = this.items.length + 1;

      for (let index in arr) {
        let item = arr[index];
        let obj = {
          key: index,
          group: group,
          qty: item.qty,
          // discountAmount: item.discountAmount,
          itemCode: item.itemCode,
          itemName: item.itemName,
          type: item.type,
        };

        newArr.push(obj);
      }

      this.items.push(newArr);
    }
    this.isEdit = false;
    this.refresh();
  };

  handleDeleteGroupPromo = (index) => {
    let newList = this.items.filter((el, i) => i !== index);
    this.items = newList;
    this.refresh();
  };

  handleEditTable = (index) => {
    if (this.isEdit) return;
    this.isEdit = true;
    this.editListItem = [];
    this.editListItem = [...this.items].filter((el, i) => i === index);

    this.editListItem.forEach((object, index) => {
      object.forEach((el, i) => {
        el.key = i;
        el.isDelete = false;
      });
    });

    this.idControlItemRef.current.handleEditItemsParent(
      this.editListItem[0],
      true,
      index,
    );
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

    const columnsTableAdd = [
      {
        title: "Item",
        dataIndex: "itemCode",
        key: "itemCode",
        colSpan: 2,
        align: "left",
      },
      {
        title: "",
        dataIndex: "itemName",
        key: "itemName",
        colSpan: 0,
        align: "left",
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        align: "center",
        render: (val) => (
          <>
            <Tag color={val === 0 ? "green" : "geekblue"} key={val}>
              {val === 0 ? "Buy" : "Get"}
            </Tag>
          </>
        ),
      },
      {
        title: "Qty",
        dataIndex: "qty",
        key: "qty",
        align: "right",
        render: (val) => StringHelper.formatValue(val),
      },
      // {
      //     title: 'Discount amount',
      //     dataIndex: 'discountAmount',
      //     key: 'discountAmount',
      //     align: 'right'
      // }
    ];

    return (
      <section className="wrap-section">
        <div className="row header-detail">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <button
              onClick={() => super.back("/promotion-buy-one-get-one")}
              type="button"
              className="btn btn-back"
              style={{ background: "beige" }}
            >
              Back
            </button>
            <h2 className="name-target">
              {this.isCopyType ? (
                "New promotion"
              ) : (
                <>
                  {!this.isUpdateForm ? "New promotion" : "#" + this.orderCode}
                </>
              )}
            </h2>
            {!this.isCopyType && (
              <>
                {!this.isCreate && (
                  <h6
                    className="d-inline-block"
                    style={{
                      verticalAlign: "middle",
                      marginTop: 8,
                      marginLeft: 10,
                    }}
                  >
                    Created date:{" "}
                    {DateHelper.displayDate(this.infoPromotion.createdDate)}
                  </h6>
                )}
              </>
            )}
          </div>
        </div>

        {this.isAllowShowForm ? (
          <ControlDetail
            ref={this.idControlItemRef}
            // startDate={this.startDate}
            // endDate={this.endDate}
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
            updateDate={this.updateDate}
            allItems={this.allItems}
            columnsTableAdd={columnsTableAdd}
            listItem={this.items}
            handleUpdateDataGroupPromo={this.handleUpdateDataGroupPromo}
            type={this.isCopyType}
          />
        ) : null}

        {/* {this.isAllowShowForm ? (
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
                ) : null} */}

        {/* {
                    this.isCreate &&
                    <SearchItems
                        type={'gift'}
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
                        indexAddMore={this.indexAddMore}
                    />
                } */}

        {this.items.length > 0 &&
          this.items.map((item, index) => (
            <Row key={item[0].itemCode + index} className="mrt-5 mrb-5">
              <Col xl={12}>
                <div className="section-block">
                  <h3 className="name-target">
                    Group: {item[0].group}
                    <EditOutlined
                      onClick={() => this.handleEditTable(index)}
                      style={{ color: "#007cff", marginLeft: 20 }}
                    />
                    <DeleteOutlined
                      onClick={() => this.handleDeleteGroupPromo(index)}
                      style={{ color: "red", marginLeft: 15 }}
                    />
                  </h3>
                  <TableComp
                    columns={columnsTableAdd}
                    dataSource={item}
                    page={false}
                  />
                </div>
              </Col>
            </Row>
          ))}
      </section>
    );
  };
}
