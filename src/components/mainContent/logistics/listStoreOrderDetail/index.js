//Plugin
import $ from "jquery";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";

class ListStoreOrderDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];

    this.idComponent = "listDetail" + StringHelper.randomKey();

    this.fieldSelected.filterby = this.props.filterby || "";
    this.fieldSelected.tabShow = this.props.tabShow || "";
    // this.handleDeleteIOItems = this.handleDeleteIOItems.bind(this);

    this.handleShowItemsFilter = this.handleShowItemsFilter.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);

    this.isRender = true;
  }

  componentDidMount() {}

  componentWillReceiveProps = (newProps) => {
    if (newProps) {
      this.items = newProps.items;
      this.refresh();
    }
  };

  handleCheckAll(e) {
    if (this.items.length === 0) {
      this.showAlert("Item not found");
      $(e.target).prop("checked", false);
      return;
    }

    $("#" + this.idComponent)
      .find("[name='itemOption']:visible")
      .prop("checked", e.target.checked);
  }

  // handleDeleteIOItems() {
  //     var itemOptionChecked = $("#" + this.idComponent).find("[name='itemOption']:checked");
  //     if ($(itemOptionChecked).length > 0) {
  //         for (var k = 0; k < $(itemOptionChecked).length; k++) {
  //             for (var k2 = 0; k2 < this.items.length; k2++) {
  //                 if (this.items[k2].itemID === $(itemOptionChecked[k]).val()) {
  //                     this.items.splice(k2, 1);
  //                     $(itemOptionChecked[k]).prop("checked", false);
  //                     break;
  //                 }
  //             }
  //         }
  //         this.props.updateItems(this.items);
  //         this.refresh();
  //     } else {
  //         this.showAlert("Please select at least one item");
  //     }
  // }

  handleShowItemsFilter() {
    this.props.showFilterItems();
  }

  handleChangeItemDeliveryDate(index, value) {
    this.items[index].deliveryDate = value;
    this.refresh();
  }

  handleChangeItemQty(index, value) {
    this.items[index].qtyConfirm = parseInt(value);

    this.props.updateItems(this.items);

    this.refresh();
  }
  // handleChangeItemQty = (itemCode, value) => {

  //     let index = this.items.findIndex(x=>x.itemCode === itemCode);
  //     this.items[index].qty = value;

  //     this.props.updateItems(this.items);

  //     this.refresh();
  // }

  handleBlurChangeItemQty(i, e) {
    super.handleBlurItemQty(e);
    // let index = this.items.findIndex(x=>x.itemCode === itemCode);
    this.handleChangeItemQty(i, $(e.target).attr("oldVal"));
  }

  handleShowHideItemByFilter(item) {
    if (this.props.filter !== undefined) {
      var status = 1;

      if (
        this.props.filter.supplier &&
        item.supplierCode !== this.props.filter.supplier
      ) {
        status = 0;
      } else if (
        this.props.filter.subClass &&
        item.subCategory !== this.props.filter.subClass
      ) {
        status = 0;
      } else if (
        this.props.filter.itemType &&
        item.itemType !== this.props.filter.itemType
      ) {
        status = 0;
      } else if (
        this.props.filter.group &&
        item.groupCode !== this.props.filter.group
      ) {
        status = 0;
      } else if (
        this.props.filter.keyword &&
        StringHelper.searchLike(item.itemName, this.props.filter.keyword) === -1
      ) {
        status = 0;
      } else if (
        this.props.filter.barcode &&
        StringHelper.searchLike(item.itemCode, this.props.filter.barcode) === -1
      ) {
        status = 0;
      }
      if (status === 0) {
        return "hide";
      }
    }
    return "";
  }

  getSupplierPrice(items) {
    let supplierPrices = {};
    for (var i in items) {
      let supplierCode = items[i].supplierCode;
      items[i].totalPrice = items[i].qty * items[i].costPrice;
      if (supplierPrices[supplierCode] === undefined) {
        supplierPrices[supplierCode] = 0;
      }
      supplierPrices[supplierCode] += items[i].totalPrice;
    }
    return supplierPrices;
  }

  renderComp() {
    let items = this.items;

    return (
      <section id={this.idComponent}>
        <div
          className="wrap-table popup-form-additem"
          style={{ overflow: "auto" }}
        >
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  STT
                  {/* <input type="checkbox" onClick={this.handleCheckAll} /> */}
                </th>
                <th className="w10">Item code</th>
                {/* <th>Item ID</th> */}
                <th>Item name</th>
                <th className="rule-number">Qty PO</th>
                <th className="rule-number">WH confirm</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.itemCode} data-group="itemGroup">
                  <td className="w10">
                    {i + 1}
                    {/* <input type="checkbox" name="itemOption" value={item.itemCode} /> */}
                  </td>

                  <td>{item.itemCode}</td>
                  {/* <td>{item.itemID}</td> */}
                  <td>{item.itemName}</td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(item.qty)}
                  </td>
                  <td className="rule-number">
                    <input
                      style={{ width: 65 }}
                      type="number"
                      min="0"
                      max={item.qty}
                      tabIndex={i + 1}
                      value={StringHelper.escapeQty(item.qtyConfirm)}
                      name="qtyConfirm"
                      onFocus={(e) => this.handleFocus(e)}
                      onKeyPress={(e) => this.handleNextTabIndex(e, true)}
                      onChange={(e) =>
                        this.handleChangeItemQty(i, e.target.value)
                      }
                    />
                  </td>

                  <td>{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? (
            <div className="table-message">Item not found</div>
          ) : (
            ""
          )}
          <div className="filterItem table-message hide">
            Filter item not found
          </div>
        </div>
        <div data-group="popupContainer" className="popup-container"></div>
      </section>
    );
  }
}

export default ListStoreOrderDetail;
