//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";

class FilterItems extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent =
      this.props.idComponent || "filterItemsPopup" + StringHelper.randomKey();
    this.isRender = true;
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleLoadFilterData() {
    this.filterData = {
      suppliers: {},
      itemtypes: {},
      subcates: {},
    };

    var numberDics = {
      suppliers: {},
      itemtypes: {},
      subcates: {},
    };

    var items = this.props.items || [];

    for (let i = 0; i < items.length; i++) {
      var item = items[i];
      this.filterData.suppliers[item.supplierCode] = item.supplierName;
      this.filterData.itemtypes[item.itemType] = item.itemTypeName;
      if (this.filterData.subcates[item.itemType] === undefined) {
        this.filterData.subcates[item.itemType] = {};
      }
      this.filterData.subcates[item.itemType][item.subCategory] =
        item.subCategoryName;

      //Count data
      if (!numberDics.suppliers[item.supplierCode]) {
        numberDics.suppliers[item.supplierCode] = 0;
      }
      numberDics.suppliers[item.supplierCode]++;

      if (!numberDics.subcates[item.subCategory]) {
        numberDics.subcates[item.subCategory] = 0;
      }
      numberDics.subcates[item.subCategory]++;
    }

    for (let key in this.filterData.suppliers) {
      this.filterData.suppliers[key] =
        this.filterData.suppliers[key] +
        " (" +
        (numberDics.suppliers[key] ? numberDics.suppliers[key] : 0) +
        ")";
    }

    for (let key in this.filterData.subcates) {
      for (var key2 in this.filterData.subcates[key]) {
        var total = numberDics.subcates[key2] ? numberDics.subcates[key2] : 0;
        this.filterData.subcates[key][key2] =
          this.filterData.subcates[key][key2] + " (" + total + ")";

        if (!numberDics.itemtypes[key]) {
          numberDics.itemtypes[key] = 0;
        }
        numberDics.itemtypes[key] += total;
      }
    }

    for (let key in this.filterData.itemtypes) {
      this.filterData.itemtypes[key] =
        this.filterData.itemtypes[key] +
        " (" +
        (numberDics.itemtypes[key] ? numberDics.itemtypes[key] : 0) +
        ")";
    }
  }

  handleSearch() {
    this.props.filterListPoDetail(this.fieldSelected);
  }

  renderComp() {
    this.handleLoadFilterData();
    // let suppliers = this.filterData.suppliers;
    // let supplierKeys = Object.keys(suppliers);
    let itemtypes = this.filterData.itemtypes;
    let subcates = this.filterData.subcates;

    let itemtypeKeys = Object.keys(itemtypes);

    return (
      <section id={this.idComponent} className="popup-form w-auto">
        <div className="form-filter">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="w100pc">Product category:</label>
                <select
                  name="itemType"
                  value={this.fieldSelected.itemType || ""}
                  onChange={(e) => this.handleChangeField(e, this.handleSearch)}
                  className="form-control"
                  required="required"
                >
                  <option value="">--</option>
                  {itemtypeKeys.map((key, index) => (
                    <option value={key} key={key}>
                      {itemtypes[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
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
                    <optgroup key={pkey} label={itemtypes[pkey]}>
                      {Object.keys(subcates[pkey]).map((key) => (
                        <option key={key} value={key}>
                          {subcates[pkey][key]}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="w100pc">Keyword:</label>
                <input
                  type="text"
                  autoComplete="off"
                  name="keyword"
                  value={this.fieldSelected.keyword || ""}
                  onChange={(e) => this.handleChangeField(e, this.handleSearch)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default FilterItems;
