import $ from 'jquery';
import React from 'react';
import BaseComponent from 'components/BaseComponent';
import { StringHelper } from 'helpers';
export default class ListIMDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];
    this.im = this.props.im || {};

    this.isAllowUpdate = false;

    this.idComponent = 'listIMDetail' + StringHelper.randomKey();

    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleChangeItemQty = this.handleChangeItemQty.bind(this);

    this.isRender = true;
  }

  componentDidMount() {
    // this.handleRightClick(this.idComponent);
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps) {
      if (newProps.items) {
        this.items = newProps.items;
      }
      if (newProps.im) {
        this.im = newProps.im;

        if (this.im && this.im.itemID && this.im.itemID !== '') {
          this.isAllowUpdate = true;
        }
      }

      this.refresh();
    }
  };

  handleCheckAll(e) {
    if (this.items.length === 0) {
      this.showAlert('Item not found');
      $(e.target).prop('checked', false);
      return;
    }

    $('#' + this.idComponent)
      .find("[name='itemOption']:visible")
      .prop('checked', e.target.checked);
  }

  handleDeleteIMItems = (items) => {
    if (this.items.includes(items)) {
      this.items.splice(this.items.indexOf(items), 1);
    } else {
      this.showAlert('Items is not exists', 'error');
    }
    this.props.updateIMItems(this.items);
    // var itemOptionChecked = $("#" + this.idComponent).find("[name='itemOption']:checked");
    // if ($(itemOptionChecked).length > 0) {
    //     for (var k = 0; k < $(itemOptionChecked).length; k++) {
    //         for (var k2 = 0; k2 < this.items.length; k2++) {
    //             if (this.items[k2].itemID === $(itemOptionChecked[k]).val()) {
    //                 this.items.splice(k2, 1);
    //                 $(itemOptionChecked[k]).prop("checked", false);
    //                 break;
    //             }
    //         }
    //     }
    //     this.props.updateIMItems(this.items);
    //     this.refresh();
    // } else {
    //     this.showAlert("Please select at least one item");
    // }
  };

  handleShowItemsSearch = () => {
    if (this.props.type === '') {
      this.showAlert('Please choose type for item');
      return;
    }

    if (this.props.type === 0) {
      this.showAlert('Normal items cannot be added');
      return;
    }

    if (this.props.type === 1 && this.items.length === 1) {
      this.showAlert('Convert items cannot be added more than one item');
      return;
    }
    this.props.showSearchItems();
  };

  handleShowItemOrder = () => {
    this.props.showItemOrder();
  };

  handleShowItemRegion = () => {
    this.props.showItemRegion();
  };

  handleChangeItemQty(itemCode, value) {
    let index = this.items.findIndex((x) => x.barCode === itemCode);
    this.items[index].quantity = value;

    this.props.updateIMItems(this.items);

    this.refresh();
  }

  handleBlurChangeItemQty(itemCode, e) {
    super.handleBlurItemQtyDecimal(e);
    // let index = this.items.findIndex(x=>x.itemCode === itemCode);

    this.handleChangeItemQty(itemCode, $(e.target).attr('oldVal'));
  }

  handleGetQtyClass(item) {
    if (item.quantity) {
      if (item.optQty != null && item.quantity > item.optQty) {
        return 'color-red allow-popup';
      }
      if (item.lastWeekOrders != null && item.quantity > item.lastWeekOrders) {
        return 'color-yellow allow-popup';
      }
    }
    return 'allow-popup';
  }

  renderControlItems() {
    let isShowActionItems = this.isAllowUpdate;
    return (
      <div>
        <div className="action-detail" style={{ paddingTop: 0 }}>
          <div className="row">
            <div className="col-md-3">
              {/* {isShowActionItems ? ( */}
              <button type="button" onClick={this.handleDeleteIMItems} className="btn btn-danger">
                Delete items
              </button>
              {/* ) : (
                                ""
                            )} */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderComp() {
    let items = this.items;

    return (
      <section id={this.idComponent}>
        {/* {this.renderContextMenu()} */}
        {/* {this.renderControlItems()} */}
        <div className="wrap-table popup-form-additem" style={{ overflow: 'auto', maxHeight: 'calc(100vh - 170px)' }}>
          <table className="table table-hover">
            <thead>
              <tr>
                {/* {this.isAllowUpdate ? ( */}
                <th className="w10">
                  <input type="checkbox" onClick={this.handleCheckAll} />
                </th>
                {/* ) : null} */}
                <th>Barcode</th>
                <th>Name</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Unit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  data-group="itemGroup"
                  className={'rightclick eachItem' + (item.isError ? ' item-highlight-red' : '')}
                  data-itemid={item.itemID}
                >
                  {/* {this.isAllowUpdate ? ( */}
                  <td className="w10">
                    <input type="checkbox" name="itemOption" value={item.itemID} />
                  </td>
                  {/* ) : null} */}

                  <td>{item.barCode}</td>
                  <td>{item.name}</td>

                  <td className="text-center">
                    {/* {this.isAllowUpdate ? ( */}
                    <input
                      style={{ width: 65 }}
                      type="number"
                      min="0"
                      step={item.moq}
                      className={this.handleGetQtyClass(item)}
                      tabIndex={i + 1}
                      onBlur={(e) => this.handleBlurChangeItemQty(item.barCode, e)}
                      value={StringHelper.escapeQtyDecimal(item.quantity)}
                      name="quantity"
                      onFocus={(e) => this.handleFocus(e)}
                      onKeyPress={(e) => this.handleNextTabIndex(e, true)}
                      onChange={(e) => this.handleChangeItemQty(item.barCode, e.target.value)}
                    />
                  </td>
                  <td className="text-center">{item.unit}</td>
                  <td style={{ width: 110 }}>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={this.handleDeleteIMItems.bind(null, item)}
                      style={{
                        width: 80,
                        height: 28,
                        background: 'black',
                        padding: 0,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length == 0 ? <div className="table-message">No Item</div> : ''}
        </div>
        <div data-group="popupContainer" className="popup-container"></div>
      </section>
    );
  }
}
