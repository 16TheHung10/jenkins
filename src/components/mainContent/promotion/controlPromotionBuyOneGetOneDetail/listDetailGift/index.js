//Plugin
import React, { Fragment } from "react";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import DownloadModel from "models/DownloadModel";
import Sort from "components/mainContent/common/sort";
import Select from "react-select";

export default class ListDetailGift extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];
    this.isCreate = this.props.isCreate;

    this.infoPromotion = this.props.infoPromotion || {};

    this.group = this.props.group || [];

    this.isCopyType = this.props.type === "copy";
    this.isUpdateForm =
      !this.isCopyType && (this.infoPromotion.poCode || "") !== "";
    this.isAllowUpdate =
      !this.isUpdateForm ||
      (!this.infoPromotion.approved && !this.infoPromotion.canCel);

    this.idComponent = "listPoDetail" + StringHelper.randomKey();
    this.handleShowItemsFilter = this.handleShowItemsFilter.bind(this);

    this.isRender = true;
  }

  // check soh function
  componentDidMount = () => {
    this.handleRightClick(this.idComponent);
  };

  handleCheckSOH = (itemCode) => {
    this.props.checkSOH(itemCode);
  };

  renderContextMenu = () => {
    return (
      <div className="context menu">
        <ul className="menu-options">
          <li
            className="menu-option"
            onClick={(e) =>
              this.handleCheckSOH(
                $(this.getCurrentTarget()).attr("data-itemid"),
              )
            }
          >
            <i>
              <FontAwesomeIcon icon={faCheck} />
            </i>
            Current Stock
          </li>
        </ul>
      </div>
    );
  };
  // check soh function end

  componentWillReceiveProps = (newProps) => {
    if (newProps.items) {
      this.items = newProps.items;
      this.refresh();
    }
    if (newProps.isCreate) {
      this.isCreate = newProps.isCreate;
      this.refresh();
    }
    if (newProps.group) {
      this.group = newProps.group;
      this.refresh();
    }
  };

  handleDeleteItems = () => {
    var itemOptionChecked = $("#" + this.idComponent).find(
      "[name='itemOption']:checked",
    );
    if ($(itemOptionChecked).length > 0) {
      for (var k = 0; k < $(itemOptionChecked).length; k++) {
        for (var k2 = 0; k2 < this.items.length; k2++) {
          if (k2.toString() === $(itemOptionChecked[k]).val()) {
            this.items.splice(k2, 1);
            $(itemOptionChecked[k]).prop("checked", false);
            break;
          }
        }
      }

      this.props.updateItems(this.items);
      this.refresh();
    } else {
      this.showAlert("Please select at least one item");
    }
  };

  handleShowItemsSearch = (indexAddMore) => {
    if (indexAddMore !== -1) {
      this.props.showSearchItems(indexAddMore);
    } else {
      this.props.showSearchItems(-1);
    }
  };

  handleShowItemsFilter = () => {
    this.props.showFilterItems();
  };

  handleChangeItemQty = (index, value) => {
    this.items[index].qtyReceiving = value;

    this.props.updateItems(this.items);
    this.refresh();
  };

  handleBlurChangeItemQty = (index, e) => {
    super.handleBlurItemQty(e);

    this.handleChangeItemQty(index, $(e.target).attr("oldVal"));
  };

  handleShowHideItemByFilter = (item) => {
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
        this.props.filter.keyword &&
        StringHelper.searchLike(item.itemName, this.props.filter.keyword) === -1
      ) {
        status = 0;
      }
      if (status === 0) {
        return "hide";
      }
    }
    return "";
  };

  renderControlItems = () => {
    let isShowActionItems =
      this.isAllowUpdate &&
      (!this.isUpdateForm ||
        (!this.infoPromotion.canCel && !this.infoPromotion.approved));
    return (
      <div>
        <div className="floating-btn" style={{ paddingTop: 0 }}>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              {isShowActionItems && (
                <button
                  type="button"
                  onClick={() => this.handleShowItemsSearch(-1)}
                  className="btn btn-success btn-showpp"
                >
                  1. ADD ITEMS
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="action-detail" style={{ padding: 0 }}>
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              {isShowActionItems && this.items.length ? (
                <button
                  type="button"
                  onClick={this.handleDeleteItems}
                  className="btn btn-danger"
                >
                  Delete items
                </button>
              ) : (
                ""
              )}
            </div>
            {this.isUpdateForm && (
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div className="col-md-offset-2 col-md-7">
                  <Sort
                    sortBy={this.fieldSelected.sortBy}
                    sortOrder={this.fieldSelected.sortOrder}
                    trigger={this.handleSortItemsClient}
                    onChange={this.handleChangeFieldCustom}
                    options={[{ value: "itemName", label: "Name" }]}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  renderComp = () => {
    let items = this.items;

    return (
      <section id={this.idComponent}>
        {this.renderContextMenu()}
        {this.props.isCreate && this.renderControlItems()}

        {items.map((el, elIndex) => (
          <Fragment key={elIndex}>
            <h3>
              # {elIndex + 1}
              <button
                type="button"
                onClick={() => this.handleShowItemsSearch(elIndex)}
                className="btn btn-danger btn-showpp"
                style={{ marginLeft: 15 }}
              >
                Add more
              </button>
            </h3>
            <div className="wrap-table">
              <table className="table table-hover">
                <thead>
                  <tr>
                    {this.isCreate && (
                      <th style={{ width: "5%" }}>
                        <input
                          type="checkbox"
                          value={elIndex}
                          name="itemOption"
                        />
                      </th>
                    )}
                    <th>Item</th>
                    <th>Type</th>
                    <th className="rule-number" style={{ width: "20%" }}>
                      Qty
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {el.map((target, indexTarget) => (
                    <tr key={indexTarget} data-group="itemGroup">
                      {this.isCreate && <td></td>}
                      <td>
                        {target.itemCode} <br />
                        {target.itemName}
                      </td>
                      <td>
                        {target.type === ""
                          ? ""
                          : target.type === 0
                          ? "Buy"
                          : "Get"}
                      </td>
                      <td className="rule-number">
                        {this.isCreate
                          ? StringHelper.formatPrice(target.qtyReceiving)
                          : StringHelper.formatPrice(target.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Fragment>
        ))}

        {items.length === 0 ? (
          <>
            <div className="wrap-table">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th className="rule-number" style={{ width: "20%" }}>
                      Qty
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="table-message">Item not found</div>
          </>
        ) : (
          ""
        )}
      </section>
    );
  };
}
