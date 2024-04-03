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

export default class ListDetailDiscountList extends BaseComponent {
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

    this.isRender = true;
  }

  // check soh function
  componentDidMount = () => {
    this.handleRightClick(this.idComponent);
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

  renderControlItems = () => {
    let isShowActionItems =
      this.isAllowUpdate &&
      (!this.isUpdateForm ||
        (!this.infoPromotion.canCel && !this.infoPromotion.approved));
    return (
      <div>
        <div className="action-detail" style={{ padding: 0 }}>
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              {isShowActionItems && this.items.length ? (
                <button
                  type="button"
                  onClick={this.handleDeleteItems}
                  style={{ height: 38 }}
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
        {this.renderControlItems()}

        <div className="wrap-table mrt-10">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>
                  <input
                    type="checkbox"
                    ref="itemsOption"
                    name="itemsOption"
                    onChange={this.handleCheckAll}
                  />
                </th>
                <th>Item</th>
                {/* <th>Type</th> */}
                {/* <th className="rule-number" style={{ width: '20%' }}>Qty</th> */}
                {/* <th className="rule-number" style={{ width: '20%' }}>Discount amount</th> */}
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
                    <td>
                      {target.itemCode} <br />
                      {target.itemName}
                    </td>
                    {/* <td>
                                            {
                                                target.type === "" ? "" : (target.type === 0 ? "Buy" : "Get")
                                            }
                                        </td> */}
                    {/* <td className="rule-number">{this.isCreate ? StringHelper.formatPrice(target.qty) : StringHelper.formatPrice(target.qty)}</td> */}
                    {/* <td className="rule-number">{this.isCreate ? StringHelper.formatPrice(target.discountAmount) : StringHelper.formatPrice(target.discountAmount)}</td> */}
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
