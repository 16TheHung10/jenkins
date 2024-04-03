//Plugin
import React from "react";
import Select from "react-select";
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
    this.supplier = "";
    this.timeTyping = 0;
  }

  handleLoadFilterData() {
    this.filterData = {
      suppliers: {},
      itemtypes: {},
      subcates: {},
      groups: {},
    };

    var numberDics = {
      suppliers: {},
      itemtypes: {},
      subcates: {},
      groups: {},
    };

    var items = this.props.items || [];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      this.filterData.suppliers[item.supplierCode] = item.supplierName;
      this.filterData.groups[item.groupCode] = item.groupName;
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

      if (!numberDics.groups[item.groupCode]) {
        numberDics.groups[item.groupCode] = 0;
      }
      numberDics.suppliers[item.groupCode]++;

      if (!numberDics.subcates[item.subCategory]) {
        numberDics.subcates[item.subCategory] = 0;
      }
      numberDics.subcates[item.subCategory]++;
    }

    for (var k in this.filterData.suppliers) {
      this.filterData.suppliers[k] =
        this.filterData.suppliers[k] +
        " (" +
        (numberDics.suppliers[k] ? numberDics.suppliers[k] : 0) +
        ")";
    }

    for (var key in this.filterData.subcates) {
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

    for (var k3 in this.filterData.itemtypes) {
      this.filterData.itemtypes[k3] =
        this.filterData.itemtypes[k3] +
        " (" +
        (numberDics.itemtypes[k3] ? numberDics.itemtypes[k3] : 0) +
        ")";
    }
  }

  handleSearch() {
    this.props.filterListIODetail(this.fieldSelected);
  }

  handleSearchInput = () => {
    clearTimeout(this.timeTyping);
    this.timeTyping = setTimeout(this.handleSearch, 475);
  };

  renderComp() {
    this.handleLoadFilterData();
    let suppliers = this.filterData.suppliers;
    let supplierOptions = Object.keys(suppliers).map((key) => {
      return { value: key, label: suppliers[key] };
    });
    let itemtypes = this.filterData.itemtypes;
    let itemtypeOptions = Object.keys(itemtypes).map((key) => {
      return { value: key, label: itemtypes[key] };
    });
    let groups = this.filterData.groups;
    let groupOptions = Object.keys(groups).map((key) => {
      return { value: key, label: groups[key] };
    });

    let subcates = this.filterData.subcates;
    let itemtypeKeys = Object.keys(itemtypes);

    return (
      <section id={this.idComponent} className="popup-form w-auto">
        <div className="form-filter">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="w100pc">Supplier:</label>
                <Select
                  isClearable
                  classNamePrefix="select"
                  placeholder="-- All --"
                  value={supplierOptions.filter(
                    (option) => option.value === this.fieldSelected.supplier,
                  )}
                  options={supplierOptions}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "supplier",
                      e ? e.value : "",
                      this.handleSearch,
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="w100pc">Product category:</label>
                <Select
                  isClearable
                  classNamePrefix="select"
                  placeholder="-- All --"
                  value={itemtypeOptions.filter(
                    (option) => option.value === this.fieldSelected.itemType,
                  )}
                  options={itemtypeOptions}
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
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="w100pc">Category:</label>
                <Select
                  isClearable
                  classNamePrefix="select"
                  placeholder="-- All --"
                  value={groupOptions.filter(
                    (option) => option.value === this.fieldSelected.group,
                  )}
                  options={groupOptions}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "group",
                      e ? e.value : "",
                      this.handleSearch,
                    )
                  }
                />
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
                  onChange={(e) =>
                    this.handleChangeField(e, this.handleSearchInput)
                  }
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="w100pc">Barcode:</label>
                <input
                  type="text"
                  autoComplete="off"
                  name="barcode"
                  value={this.fieldSelected.barcode || ""}
                  onChange={(e) =>
                    this.handleChangeField(e, this.handleSearchInput)
                  }
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
