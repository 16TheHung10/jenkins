//Plugin
import React from 'react';
import $ from 'jquery';
import Paging from 'external/control/pagination';
import Select from 'react-select';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper } from 'helpers';
import { StringHelper } from 'helpers';
import CommonModel from 'models/CommonModel';
import ItemMasterModel from 'models/ItemMasterModel';

class SearchItems extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = [];
    this.idComponent = this.props.idComponent || 'searchItemsPopup' + StringHelper.randomKey();
    //Default data
    this.data.suppliers = this.props.suppliers || {};
    this.data.groups = this.props.groups || {};

    this.data.categorySubClasses = this.props.categorySubClasses || {};
    this.data.divisions = this.props.divisions || {};
    this.page = this.props.page || 1;
    this.itemCount = 0;

    this.fieldSelected.supplier = '';
    this.fieldSelected.divisionm = '';
    this.fieldSelected.groupm = '';
    this.fieldSelected.itemType = '';
    this.fieldSelected.subClassm = '';
    this.fieldSelected.keyword = '';
    this.fieldSelected.keywordbarcode = '';

    this.isRender = true;
  }

  componentDidMount() {
    // this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    let status = false;

    if (this.data.suppliers !== newProps.suppliers) {
      this.data.suppliers = newProps.suppliers;
    }

    if (this.data.categorySubClasses !== newProps.categorySubClasses) {
      this.data.categorySubClasses = newProps.categorySubClasses;
    }
    if (this.data.groups !== newProps.groups) {
      this.data.groups = newProps.groups;
    }
    if (this.data.divisions !== newProps.divisions) {
      this.data.divisions = newProps.divisions;
    }

    this.refresh();
  }

  convertSelectedItems(selectedItems) {
    let ret = {};
    for (var index in selectedItems) {
      let item = selectedItems[index];
      if (ret[item.itemID] === undefined) {
        ret[item.itemID] = item;
      }
    }
    return ret;
  }

  handleLoadItemsResult = () => {
    let model = new ItemMasterModel();
    model
      .getItems({
        supplierCode: this.fieldSelected.supplier,
        groupCode: this.fieldSelected.groupm,
        divisionCode: this.fieldSelected.divisionm,
        subClassCode: this.fieldSelected.subClassm,
        itemName: this.fieldSelected.keyword,
        barCode: this.fieldSelected.keywordbarcode.trim(),
        pageNumber: this.page || 1,
        pageSize: 30,
      })
      .then((response) => {
        if (response.status && response.data.itemMaster) {
          this.items = response.data.itemMaster?.map((item) => {
            return { ...item, barCode: item.itemCode, name: item.itemName };
          });
          this.itemCount = response.data.total;
        } else {
          this.items = [];
        }
        this.refresh();
      });
  };

  handleSearch = () => {
    //let countField = 0;
    if (
      !this.fieldSelected.supplier &&
      !this.fieldSelected.divisionm &&
      !this.fieldSelected.groupm &&
      !this.fieldSelected.subClassm &&
      !this.fieldSelected.keyword &&
      !this.fieldSelected.keywordbarcode
    ) {
      this.showAlert('Please select at least one field');
      return;
    }
    // if (this.fieldSelected.supplier !== "" ) countField += 1;

    // if (this.fieldSelected.divisionm !== "" ) {
    // 	countField += 1;

    // 	if ((this.fieldSelected.groupm === "" && this.fieldSelected.subClassm === "")) {
    // 		this.showAlert("Please select group or subclass fields");
    // 		return;
    // 	}
    // }

    // if (this.fieldSelected.groupm !== "" ) countField += 1;

    // if (this.fieldSelected.subClassm !== "" ) countField += 1;

    // if (this.fieldSelected.keyword !== "" ) {
    // 	if (this.fieldSelected.keyword.length <= 2) {
    // 		this.showAlert("Please enter keyword more than 2 characters");
    // 		return;
    // 	}

    // 	countField += 1;

    // 	if ((this.fieldSelected.supplier === "" && this.fieldSelected.divisionm === "" && this.fieldSelected.groupm === "" && this.fieldSelected.subClassm === "")) {
    // 		this.showAlert("Please choose one of the following fields: supplier, product category, category, sub category ");
    // 		return;
    // 	}
    // }

    // if (this.fieldSelected.keywordbarcode !== "") {
    // 	if (this.fieldSelected.keywordbarcode.length <= 2) {
    // 		this.showAlert("Please enter barcode more than 2 characters");
    // 		return;
    // 	}

    // 	countField += 1;

    // 	if ((this.fieldSelected.supplier === "" && this.fieldSelected.divisionm === "" && this.fieldSelected.groupm === "" && this.fieldSelected.subClassm === "")) {
    // 		this.showAlert("Please choose one of the following fields: supplier, product category, category, sub category ");
    // 		return;
    // 	}
    // }

    // if (countField === 0) {
    // 	this.showAlert("Please select at least one field");
    // 	return;
    // }

    this.page = 1;
    this.handleLoadItemsResult();
  };

  handleUpdateAddedItemsToSelectedItems(items) {
    for (var index in items) {
      let item = items[index];
      if (this.selectedItems[index] === undefined) {
        this.selectedItems[index] = item.item;
      }
    }
  }

  handleAddItems = () => {
    var eles = $('#' + this.idComponent).find("[data-group='itemContainer']");

    var elesRet = {};
    for (var i = 0; i < eles.length; i++) {
      var qtyField = $(eles[i]).find("[name='quantity']");
      var qtyValue = $(qtyField).val();

      if (qtyValue > 0) {
        elesRet[$(eles[i]).attr('data-item-code')] = {
          quantity: StringHelper.escapeQtyDecimal(qtyValue),
          item: this.items[i],
        };
      }
    }
    if ($('#' + this.idComponent).is(':hidden')) {
      return;
    }
    if (Object.keys(elesRet).length === 0) {
      this.showAlert('Item not added');
      return;
    }

    if (this.props.type === 1) {
      if (Object.keys(elesRet).length > 1) {
        this.showAlert('Convert items cannot be added more than one item');
        return;
      }
    }

    $('#' + this.idComponent)
      .find("[name='quantity']")
      .val(0);
    this.props.addItemsToList(elesRet);

    this.handleUpdateAddedItemsToSelectedItems(elesRet);
    this.refresh();
    $('#main-content').click();
  };

  handleAddAllItems = () => {
    if (this.props.type !== 2) {
      this.showAlert('This function is only available for combined items');
      return;
    }

    var eles = $('#' + this.idComponent).find("[data-group='itemContainer']");
    var elesRet = {};
    for (var i = 0; i < eles.length; i++) {
      var qtyField = $(eles[i]).find("[name='quantity']");
      var qtyValue = $(qtyField).val();

      if (!$(eles[i]).hasClass('disabel')) {
        elesRet[$(eles[i]).attr('data-item-code')] = {
          quantity: StringHelper.escapeQtyDecimal(qtyValue),
          item: this.items[i],
        };
      }
    }
    if ($('#' + this.idComponent).is(':hidden')) {
      return;
    }
    $('#' + this.idComponent)
      .find("[name='quantity']")
      .val(0);
    this.props.addItemsToList(elesRet);

    this.handleUpdateAddedItemsToSelectedItems(elesRet);
    this.refresh();
    $('#' + this.idComponent)
      .find('[name=keywordbarcode]')
      .focus()
      .select();
  };

  handleClickPaging = (page) => {
    this.page = page;
  };

  findFilterItemOptions(name, keyOption) {
    switch (name) {
      case 'group':
        if (keyOption !== undefined && keyOption !== '') {
          let groupKeys = Object.keys(this.data.groups);

          if (groupKeys.length && this.data.groups !== undefined) {
            let groupsDic = {};
            for (var key in groupKeys) {
              let itemKey = groupKeys[key];

              if (groupsDic[this.data.groups[itemKey]['divisionCode']] === undefined) {
                groupsDic[this.data.groups[itemKey]['divisionCode']] = [];
              }
              groupsDic[this.data.groups[itemKey]['divisionCode']].push(this.data.groups[itemKey]);
            }
            this.data.groups = groupsDic;
          }
          return this.data.groups[keyOption] || [];
        } else {
          return Object.values(this.data.groups);
        }

      case 'subClass':
        if (keyOption !== undefined && keyOption !== '') {
          let groupKeys = Object.keys(this.data.categorySubClasses);

          if (groupKeys.length && this.data.categorySubClasses !== undefined) {
            let groupsSubClass = {};
            for (var keys in groupKeys) {
              let itemKey = groupKeys[keys];

              if (groupsSubClass[this.data.categorySubClasses[itemKey]['groupCode']] === undefined) {
                groupsSubClass[this.data.categorySubClasses[itemKey]['groupCode']] = [];
              }
              groupsSubClass[this.data.categorySubClasses[itemKey]['groupCode']].push(
                this.data.categorySubClasses[itemKey]
              );
            }
            this.data.categorySubClasses = groupsSubClass;
          }
          return this.data.categorySubClasses[keyOption] || [];
        } else {
          return Object.values(this.data.categorySubClasses);
        }

      default:
        break;
    }
  }

  renderComp() {
    let items = this.items;

    if (this.fieldSelected.supplierCode === '' || this.fieldSelected.supplierCode === undefined) {
      items = this.items.filter((target) => target.isLockOrder !== 1);
    }

    this.selectedItems = this.convertSelectedItems(this.props.selectedItems);

    let suppliers = Object.values(this.data.suppliers);
    let supplierOptions = suppliers.map((item) => {
      return { value: item.supplierCode, label: item.supplierName };
    });

    let divisions = Object.values(this.data.divisions);
    let divisionOpt = divisions.map((item) => {
      return { value: item.divisionCode, label: item.divisionName };
    });

    let groups = this.findFilterItemOptions('group', this.fieldSelected.division);
    let groupsOptions = groups.map((item) => {
      return { value: item.groupCode, label: item.groupName };
    });

    let subClasss = this.findFilterItemOptions('subClass', this.fieldSelected.group);
    let subClassOpt = subClasss.map((item) => {
      return { value: item.subClassCode, label: item.subClassName };
    });

    return (
      <section
        id={this.idComponent}
        className="popup-form popup-form-additem"
        style={{ maxWidth: '65%', height: 'calc(100vh - 85px)' }}
      >
        <div className="form-filter">
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="w100pc">Supplier:</label>
                <Select
                  isClearable
                  classNamePrefix="select"
                  maxMenuHeight={160}
                  placeholder="-- All --"
                  value={supplierOptions.filter((option) => option.value === this.fieldSelected.supplier)}
                  options={supplierOptions}
                  onChange={(e) => this.handleChangeFieldCustom('supplier', e ? e.value : '')}
                />
              </div>
            </div>
            {/* <div className="col-md-4">
								<div className='form-group'>	
			                    	<label className='w100pc'>Product category:</label>
			                    	<Select
										isClearable
										classNamePrefix="select"
										maxMenuHeight={260}
										placeholder='--'
										value={categoryTypesOptions.filter(option => option.value === this.fieldSelected.itemType)}
										options={categoryTypesOptions}
										onChange={(e) => this.handleChangeFieldCustom("itemType", e ? e.value : '') }
									/>
			                    </div>
							</div> */}
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="division" className="w100pc">
                  Division:
                </label>
                <Select
                  isClearable
                  classNamePrefix="select"
                  maxMenuHeight={160}
                  placeholder="-- All --"
                  value={divisionOpt.filter((option) => option.value === this.fieldSelected.divisionm)}
                  options={divisionOpt}
                  onChange={(e) =>
                    this.handleChangeFieldCustom('divisionm', e ? e.value : '', () => {
                      this.fieldSelected.groupm = '';
                      this.fieldSelected.subClassm = '';
                      this.refresh();
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="w100pc">Category:</label>
                <Select
                  isClearable
                  classNamePrefix="select"
                  maxMenuHeight={160}
                  placeholder="-- All --"
                  value={groupsOptions.filter((option) => option.value === this.fieldSelected.groupm)}
                  options={groupsOptions}
                  onChange={(e) =>
                    this.handleChangeFieldCustom('groupm', e ? e.value : '', () => {
                      this.fieldSelected.subClassm = '';
                      this.refresh();
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="subClass" className="w100pc">
                  Sub Category:
                </label>
                <Select
                  // isDisabled={ subClassOptions.length === 1 }
                  isClearable
                  classNamePrefix="select"
                  maxMenuHeight={260}
                  placeholder="-- All --"
                  value={subClassOpt.filter((option) => option.value === this.fieldSelected.subClassm)}
                  options={subClassOpt}
                  onChange={(e) => this.handleChangeFieldCustom('subClassm', e ? e.value : '')}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label className="w100pc">Barcode:</label>
                <input
                  type="text"
                  onKeyPress={(e) => this.handleEnterField(e, this.handleSearch)}
                  autoComplete="off"
                  name="keywordbarcode"
                  value={this.fieldSelected.keywordbarcode || ''}
                  onChange={this.handleChangeField}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label className="w100pc">Keyword:</label>
                <input
                  type="text"
                  onKeyPress={(e) => this.handleEnterField(e, this.handleSearch)}
                  autoComplete="off"
                  name="keyword"
                  value={this.fieldSelected.keyword || ''}
                  onChange={this.handleChangeField}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5">
              <button type="button" onClick={this.handleSearch} className="btn btn-success">
                Search
              </button>
              <button type="button" onClick={this.handleAddItems} className="btn btn-primary">
                Add items
              </button>
              <button type="button" onClick={this.handleAddAllItems} className="btn btn-primary">
                Add all
              </button>
            </div>
          </div>
        </div>
        <div className="wrap-table pp-additem" style={{ overflow: 'auto', maxHeight: 'calc(100vh - 305px)' }}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Name</th>
                <th>Unit</th>
                <th className="rule-number">Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, key) => (
                <tr
                  className={this.selectedItems[item.itemID] ? ' item-highlight ' : ''}
                  key={item.itemID}
                  data-group="itemContainer"
                  data-item-code={item.itemID}
                >
                  <td>{item.itemCode}</td>
                  <td>
                    <span>{item.itemName}</span>
                  </td>
                  <td>{item.unit}</td>
                  <td className="rule-number">
                    <input
                      type="number"
                      style={{ width: 65 }}
                      tabIndex={key + 1}
                      min="0"
                      // step={item.moq}
                      name="quantity"
                      // disabled={item.isLockOrder === 1 ? true : false}
                      onKeyPress={this.handleNextTabIndex}
                      onBlur={super.handleBlurItemQty}
                      defaultValue={item.quantity || 0}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? <div className="table-message">Item not found</div> : null}
        </div>
        {/* {items.length !== 0 ? <Paging page={this.page} onClickPaging={this.handleClickPaging} onClickSearch={this.handleLoadItemsResult} itemCount={this.itemCount}/> : ''} */}
      </section>
    );
  }
}

export default SearchItems;
