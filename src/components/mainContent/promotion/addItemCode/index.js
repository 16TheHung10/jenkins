//Plugin
import React from "react";
import $ from "jquery";
import Paging from "external/control/pagination";
import Select from "react-select";
//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import CommonModel from "models/CommonModel";
import PromotionModel from "models/PromotionModel";

class SearchItemCode extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = [];
    this.idComponent =
      this.props.idComponent ||
      "SearchItemCodePopup" + StringHelper.randomKey();
    this.numberGroup = this.props.numberGroup;

    //Default data
    this.data.categoryTypes = [];
    this.data.categorySubClasses = {};
    this.page = this.props.page || 1;
    this.itemCount = 0;

    this.fieldSelected.orderDate = this.props.orderDate;

    this.isRender = true;
  }

  componentDidMount() {
    // this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.storeCode !== newProps.storeCode) {
      this.fieldSelected.store = newProps.storeCode;
    }

    if (this.props.orderDate !== newProps.orderDate) {
      this.fieldSelected.orderDate = newProps.orderDate;
      // this.handleUpdateState(false);
    }

    if (this.numberGroup !== newProps.numberGroup) {
      this.numberGroup = newProps.numberGroup;
      this.refresh();
    }
  }

  convertSubClassToDic(subClasses) {
    let ret = {};
    for (var item in subClasses) {
      let itemType = subClasses[item].itemType;
      if (!ret[itemType]) {
        ret[itemType] = [];
      }
      ret[itemType].push(subClasses[item]);
    }
    return ret;
  }

  handleUpdateState = async (refreshCommon = true) => {
    if (refreshCommon) {
      let commonModel = new CommonModel();
      await commonModel.getData("categorytype,subclass").then((response) => {
        if (response.status) {
          if (response.data.subclasses) {
            this.data.categorySubClasses = this.convertSubClassToDic(
              response.data.subclasses,
            );
          }
          if (response.data.categoryTypes) {
            this.data.categoryTypes = response.data.categoryTypes;
          }
        }
      });
    }

    this.refresh();
  };

  handleLoadItemsResult = () => {
    let model = new PromotionModel();
    model
      .getItems({
        itemType: this.fieldSelected.itemType,
        subClassCode: this.fieldSelected.subClass,
        keyword: this.fieldSelected.keyword,
        keywordbarcode: this.fieldSelected.keywordbarcode,
        page: this.page || 1,
      })
      .then((response) => {
        if (response.status && response.data.items.length !== 0) {
          this.items = response.data.items;
          this.itemCount = response.data.total;
          setTimeout(() => {
            $("#" + this.idComponent)
              .find("[name=qtyReceiving]")
              .eq(0)
              .focus()
              .select();
          }, 0);
        } else {
          this.items = [];
        }
        this.refresh();
      });
  };

  handleSearch = () => {
    this.page = 1;
    this.handleLoadItemsResult();
  };

  convertSelectedItems(selectedItems) {
    let ret = {};
    for (var index in selectedItems) {
      let item = selectedItems[index];
      for (var elm in item) {
        let target = item[elm];

        if (ret[target.itemCode] === undefined) {
          ret[target.itemCode] = target;
        }
      }
    }
    return ret;
  }

  handleUpdateAddedItemsToSelectedItems(items) {
    for (var index in items) {
      let item = items[index];
      if (this.selectedItems[index] === undefined) {
        this.selectedItems[index] = item.item;
      }
    }
  }

  handleAddItems = () => {
    var eles = $("#" + this.idComponent).find("[data-group='itemContainer']");
    var elesRet = {};

    for (var i = 0; i < eles.length; i++) {
      var qtyField = $(eles[i]).find("[name='qtyReceiving']");
      var qtyValue = $(qtyField).val();

      var disCountField = $(eles[i]).find("[name='discountAmount']");
      var disCountValue = $(disCountField).val();

      if (qtyValue > 0) {
        elesRet[$(eles[i]).attr("data-item-code")] = {
          qtyReceiving: StringHelper.escapeQty(qtyValue),
          discountAmount: StringHelper.escapeQty(disCountValue),
          item: this.items[i],
        };
      }
    }

    if ($("#" + this.idComponent).is(":hidden")) {
      return;
    }

    if (Object.keys(elesRet).length === 0) {
      this.showAlert("Item not added");
      $("#" + this.idComponent)
        .find("[name=keywordbarcode]")
        .focus()
        .select();
      return;
    }

    $("#" + this.idComponent)
      .find("[name='qtyReceiving']")
      .val(0);
    $("#" + this.idComponent)
      .find("[name='discountAmount']")
      .val(0);
    this.props.addItemsToList(elesRet);

    this.handleUpdateAddedItemsToSelectedItems(elesRet);
    $("#" + this.idComponent)
      .find("[name=keywordbarcode]")
      .focus()
      .select();
  };

  handleClickPaging = (page) => {
    this.page = page;
  };

  renderComp() {
    this.selectedItems = this.convertSelectedItems(this.props.selectedItems);

    let categoryTypes = this.data.categoryTypes;
    let categoryTypeKeys = Object.keys(categoryTypes);
    let categoryTypeOptions = categoryTypeKeys.map((key) => {
      return { value: key, label: categoryTypes[key] };
    });
    let categorySubClasses = this.data.categorySubClasses;
    let itemtypeKeys = Object.keys(categorySubClasses);
    let items = this.items;
    return (
      <section id={this.idComponent} className="popup-form">
        <div className="form-filter">
          {/* <div className='row'>
						<div className="col-md-6">
							<div className='form-group'>
								<label className='w100pc'>Product category:</label>
								<Select
									isClearable
									classNamePrefix="select"
									maxMenuHeight={260}
									placeholder='--'
									value={categoryTypeOptions.filter(option => option.value === this.fieldSelected.itemType)}
									options={categoryTypeOptions}
									onChange={(e) => this.handleChangeFieldCustom("itemType", e ? e.value : '', this.handleSearch)}
								/>
							</div>
						</div>

						<div className='col-md-6'>
							<div className='form-group'>
								<label className='w100pc'>Sub category:</label>
								<select name='subClass'
									value={this.fieldSelected.subClass || ''}
									onChange={(e) => this.handleChangeField(e, this.handleSearch)}
									className="form-control"
									required="required">
									<option value=''>--</option>
									{
										itemtypeKeys.map((pkey) => (
											<optgroup key={pkey} label={categoryTypes[pkey]}>
												{Object.keys(categorySubClasses[pkey]).map((key) => <option key={key} value={categorySubClasses[pkey][key].subClassCode}>{categorySubClasses[pkey][key].subClassName}</option>)}
											</optgroup>
										))
									}
								</select>
							</div>
						</div>
					</div> */}

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="w100pc">Barcode:</label>
                <input
                  type="text"
                  autoComplete="off"
                  name="keywordbarcode"
                  value={this.fieldSelected.keywordbarcode || ""}
                  onKeyPress={(e) =>
                    this.handleEnterField(e, this.handleSearch)
                  }
                  onChange={this.handleChangeField}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="w100pc">Keyword:</label>
                <input
                  type="text"
                  autoComplete="off"
                  name="keyword"
                  value={this.fieldSelected.keyword || ""}
                  onKeyPress={(e) =>
                    this.handleEnterField(e, this.handleSearch)
                  }
                  onChange={this.handleChangeField}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <button
                type="button"
                onClick={this.handleSearch}
                className="btn btn-success"
              >
                Search
              </button>
              {/* <button type="button" onClick={this.handleAddItems} className="btn btn-primary">Add items</button> */}
            </div>
          </div>
        </div>
        <div className="wrap-table htable">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Action</th>
                {/* <th className="rule-number">Qty</th> */}
              </tr>
            </thead>
            <tbody>
              {items.map((item, key) => (
                <tr
                  className={
                    this.selectedItems[item.itemCode] ? "item-highlight" : ""
                  }
                  key={key}
                  data-group="itemContainer"
                  data-item-code={item.itemCode}
                >
                  <td>{item.itemCode}</td>
                  <td style={{ whiteSpace: "normal" }}>
                    <p style={{ margin: 0 }}>{item.itemName}</p>
                  </td>
                  <td>{item.unit}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => this.props.addItemCodeToList(item)}
                    >
                      Add
                    </button>
                  </td>
                  {/* <td className="rule-number"><input type='number' min="0" name='qtyReceiving' tabIndex={key + 1} onKeyPress={this.handleNextTabIndex} onBlur={super.handleBlurItemQty} defaultValue={item.qtyReceiving} /></td> */}
                </tr>
              ))}
            </tbody>
          </table>
          {items.length != 0 ? null : (
            <div className="table-message">Item not found</div>
          )}
        </div>
        {items.length !== 0 ? (
          <Paging
            page={this.page}
            onClickPaging={this.handleClickPaging}
            onClickSearch={this.handleLoadItemsResult}
            itemCount={this.itemCount}
          />
        ) : (
          ""
        )}
      </section>
    );
  }
}

export default SearchItemCode;
