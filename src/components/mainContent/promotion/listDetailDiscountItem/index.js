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
import Paging from "external/control/pagination";

export default class ListDetailDiscountItem extends BaseComponent {
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
          if (
            this.items[k2].itemCode.toString() === $(itemOptionChecked[k]).val()
          ) {
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

  handleCheckAll = () => {
    if (this.items.length === 0) {
      this.showAlert("Item not found", "error");
      this.refs.itemsOption.checked = false;
      return;
    }

    if (this.refs.itemsOption.checked === true) {
      $("#" + this.idComponent)
        .find("[name=itemOption]")
        .not(":disabled")
        .prop("checked", true);
    } else {
      $("#" + this.idComponent)
        .find("[name=itemOption]")
        .not(":disabled")
        .prop("checked", false);
    }
  };

  renderComp = () => {
    let items = this.items;

    return (
      <section id={this.idComponent}>
        {this.renderContextMenu()}

        <div className="wrap-table table-chart" style={{ overflow: "initial" }}>
          {items.length > 0 ? (
            <div className="row">
              <div className="col-md-12 text-left">
                <div style={{ display: "inline-block" }}>
                  <Paging
                    page={this.page}
                    onClickPaging={this.handleClickPaging}
                    onClickSearch={this.handleLoadResult}
                    itemCount={this.itemCount}
                    listItemLength={this.items.length}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <table
            className="table d-block w-full"
            style={{ maxHeight: "calc(100vh - 230px)", overflow: "auto" }}
          >
            <thead>
              <tr className="tr-sticky">
                <th className="fs-12 w10">
                  <input
                    type="checkbox"
                    ref="itemsOption"
                    name="itemsOption"
                    onChange={this.handleCheckAll}
                  />
                </th>
                <th className="fs-12">Item</th>

                {/* <th>Type</th> */}
                {/* <th className="rule-number" style={{ width: '20%' }}>Qty</th> */}
                <th className="fs-12 rule-number">Discount amount</th>
              </tr>
            </thead>

            <tbody>
              {items.length > 0 &&
                items.map((target, indexTarget) => (
                  <tr key={indexTarget}>
                    <td>
                      <input
                        key={target.itemCode}
                        type="checkbox"
                        name="itemOption"
                        value={target.itemCode}
                        data-code={target.itemCode}
                      />
                    </td>
                    <td className="fs-12">
                      {target.itemCode} <br />
                      {target.itemName}
                    </td>

                    {/* <td>
                                            {
                                                target.type === "" ? "" : (target.type === 0 ? "Buy" : "Get")
                                            }
                                        </td> */}
                    {/* <td className="rule-number">{this.isCreate ? StringHelper.formatPrice(target.qty) : StringHelper.formatPrice(target.qty)}</td> */}
                    <td className="fs-12 rule-number">
                      {this.isCreate
                        ? StringHelper.formatPrice(target.discountAmount)
                        : StringHelper.formatPrice(target.discountAmount)}
                    </td>
                  </tr>
                ))}
              {/* {
                                el.map((target, indexTarget) => (
                                    <tr
                                        key={indexTarget}
                                        data-group="itemGroup"
                                    >
                                        {this.isCreate && <td></td>}
                                        <td>{target.itemCode} <br />{target.itemName}</td>
                                        <td>
                                            {
                                                target.type === "" ? "" : (target.type === 0 ? "Buy" : "Get")
                                            }
                                        </td>
                                        <td className="rule-number">{this.isCreate ? StringHelper.formatPrice(target.qtyReceiving) : StringHelper.formatPrice(target.qty)}</td>

                                    </tr>
                                ))
                            } */}
            </tbody>
          </table>
        </div>
        {/* {
                    items.map((el, elIndex) => (
                        <Fragment key={elIndex}>
                            <h3>
                                # {elIndex + 1}
                                <button type="button" onClick={() => this.handleShowItemsSearch(elIndex)} className="btn btn-danger btn-showpp" style={{ marginLeft: 15 }}>
                                    Add more
                                </button>
                            </h3>
                            <div className="wrap-table">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            {
                                                this.isCreate && <th style={{ width: '5%' }}>
                                                    <input type="checkbox" value={elIndex} name="itemOption" />
                                                </th>
                                            }
                                            <th>Item</th>
                                            <th>Type</th>
                                            <th className="rule-number" style={{ width: '20%' }}>Qty</th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            el.map((target, indexTarget) => (
                                                <tr
                                                    key={indexTarget}
                                                    data-group="itemGroup"
                                                >
                                                    {this.isCreate && <td></td>}
                                                    <td>{target.itemCode} <br />{target.itemName}</td>
                                                    <td>
                                                        {
                                                            target.type === "" ? "" : (target.type === 0 ? "Buy" : "Get")
                                                        }
                                                    </td>
                                                    <td className="rule-number">{this.isCreate ? StringHelper.formatPrice(target.qtyReceiving) : StringHelper.formatPrice(target.qty)}</td>

                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Fragment>
                    ))
                } */}

        {/* {items.length === 0 ?
                    (
                        <>
                            <div className="wrap-table">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Type</th>
                                            <th className="rule-number" style={{ width: '20%' }}>Discount amount</th>

                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div className="table-message">Item not found</div>
                        </>
                    )
                    : ""} */}
      </section>
    );
  };
}
