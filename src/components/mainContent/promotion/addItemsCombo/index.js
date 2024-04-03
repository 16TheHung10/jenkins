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

class SearchItems extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = [];
    this.idComponent =
      this.props.idComponent || "searchItemsPopup" + StringHelper.randomKey();
    this.numberGroup = this.props.numberGroup;
    this.type = this.props.type;

    //Default data
    this.data.categoryTypes = [];
    this.data.categorySubClasses = {};
    this.page = this.props.page || 1;
    this.itemCount = 0;
    this.indexAddMore = this.props.indexAddMore || -1;

    this.selectedItems = {};
    this.fieldSelected.store = this.props.storeCode;
    this.fieldSelected.orderDate = this.props.orderDate;

    this.isRender = true;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.storeCode !== newProps.storeCode) {
      this.fieldSelected.store = newProps.storeCode;
    }

    if (this.type !== newProps.type) {
      this.type = newProps.type;
    }
    // if(this.indexAddMore !== newProps.indexAddMore){
    // 	this.indexAddMore = newProps.indexAddMore;
    // 	this.refresh();
    // }

    if (this.props.orderDate !== newProps.orderDate) {
      this.fieldSelected.orderDate = newProps.orderDate;
      this.handleUpdateState(false);
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
          for (let k in this.items) {
            this.items[k].type = "";
          }
          this.itemCount = response.data.total;
          setTimeout(() => {
            $("#" + this.idComponent)
              .find("[name=discountAmount]")
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

    let countBuy = 0;
    let countGet = 0;

    let newLst = [...this.items];

    for (var i = 0; i < eles.length; i++) {
      var qtyField = $(eles[i]).find("[name='discountAmount']");
      var qtyValue = $(qtyField).val();

      if (qtyValue == 0) {
        // console.log($(eles[i]).attr("data-item-type"))
        if (
          $(eles[i]).attr("data-item-type") !== "" &&
          $(eles[i]).attr("data-item-type") == 0
        ) {
          elesRet[$(eles[i]).attr("data-item-code")] = {
            discountAmount: 0,
            item: newLst[i],
          };
        }
      }

      if (qtyValue > 0) {
        elesRet[$(eles[i]).attr("data-item-code")] = {
          discountAmount: StringHelper.escapeQty(qtyValue),
          item: newLst[i],
        };
      }

      if (this.type === "gift" || this.type === "combo") {
        if (newLst[i].type === 0) {
          countBuy++;
        }
        if (newLst[i].type === 1) {
          countGet++;
        }
      }
    }
    // console.log(elesRet)
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

    if (this.type === "gift" || this.type === "combo") {
      if (Object.keys(elesRet).length !== countBuy + countGet) {
        this.showAlert("Item is missing type");
        return;
      }
    }

    $("#" + this.idComponent)
      .find("[name='discountAmount']")
      .val(0);

    this.props.addItemsToList(elesRet, this.props.indexAddMore);

    this.handleUpdateAddedItemsToSelectedItems(elesRet);

    $("#" + this.idComponent)
      .find("[name=keywordbarcode]")
      .focus()
      .select();
    if (this.type === "gift" || this.type === "combo") {
      this.handleLoadItemsResult();
    }
  };

  handleClickPaging = (page) => {
    this.page = page;
  };

  handleChangeTypeItem = (index, e) => {
    let arr = [...this.items];

    arr[index].type = e ? e.value : "";

    if (arr[index].type === 0) {
      $("#" + this.idComponent)
        .find("[name='discountAmount']")
        .eq(index)
        .val(0);
    } else {
      if (arr[index].type === "") {
        $("#" + this.idComponent)
          .find("[name='discountAmount']")
          .eq(index)
          .val("");
      }
    }

    this.items = arr;

    this.refresh();
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
    let items = [...this.items];

    let optType = [
      { value: 0, label: "Buy" },
      { value: 1, label: "Get" },
    ];

    return (
      <section id={this.idComponent} className="popup-form">
        <div className="form-filter">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="w100pc">Product category:</label>
                <Select
                  isClearable
                  classNamePrefix="select"
                  maxMenuHeight={260}
                  placeholder="--"
                  value={categoryTypeOptions.filter(
                    (option) => option.value === this.fieldSelected.itemType,
                  )}
                  options={categoryTypeOptions}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "itemType",
                      e ? e.value : "",
                      this.handleSearch,
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="w100pc">Sub category:</label>
                <select
                  name="subClass"
                  value={this.fieldSelected.subClass || ""}
                  onChange={(e) => this.handleChangeField(e, this.handleSearch)}
                  className="form-control"
                  required="required"
                >
                  <option value="">--</option>
                  {itemtypeKeys.map((pkey) => (
                    <optgroup key={pkey} label={categoryTypes[pkey]}>
                      {Object.keys(categorySubClasses[pkey]).map((key) => (
                        <option
                          key={key}
                          value={categorySubClasses[pkey][key].subClassCode}
                        >
                          {categorySubClasses[pkey][key].subClassName}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>

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
              <button
                type="button"
                onClick={this.handleAddItems}
                className="btn btn-primary"
              >
                Add items
              </button>
            </div>
          </div>
        </div>
        <div className="wrap-table " style={{ minHeight: 170 }}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Name</th>
                <th>Unit</th>
                <th className="rule-number">Discount item</th>
                {(this.type === "gift" || this.type === "combo") && (
                  <th style={{ width: "20%" }}>Type</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  className={
                    this.selectedItems[item.itemCode] ? "item-highlight" : ""
                  }
                  key={index}
                  data-group="itemContainer"
                  data-item-code={item.itemCode}
                  data-item-type={item.type}
                >
                  <td>{item.itemCode}</td>
                  <td style={{ whiteSpace: "normal" }}>
                    <p style={{ margin: 0 }}>{item.itemName}</p>
                  </td>
                  <td>{item.unit}</td>
                  <td className="rule-number">
                    <input
                      disabled={item.type === 0 ? true : false}
                      type="number"
                      min="0"
                      name="discountAmount"
                      tabIndex={index + 1}
                      onKeyPress={this.handleNextTabIndex}
                      onBlur={super.handleBlurItemQty}
                      defaultValue={item.type === 0 ? "" : item.discountAmount}
                      // value={((this.type === 'combo') && ((item.type !== ""))  && 1)}
                    />
                  </td>

                  <td>
                    <Select
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="All"
                      value={optType.filter(
                        (option) => option.value === item.type,
                      )}
                      options={optType}
                      onChange={(e) => this.handleChangeTypeItem(index, e)}
                    />
                  </td>
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

export default SearchItems;
