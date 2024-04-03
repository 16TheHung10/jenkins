import React from 'react';
import Select from 'react-select';
import BaseComponent from 'components/BaseComponent';
import { PageHelper, StringHelper } from 'helpers';
import CommonModel from 'models/CommonModel';
import List from 'components/mainContent/itemMaster/listIM';
import ItemMasterModel from 'models/ItemMasterModel';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import AppMessage from 'message/reponse.message';
import Paging from 'utils/paging';
import { Pagination } from 'antd';
class SearchIM extends BaseComponent {
  constructor(props) {
    super(props);

    this.listRef = React.createRef();
    this.idListComponent = 'list' + StringHelper.randomKey();

    this.data.suppliers = {};
    this.data.groups = {};
    this.data.categorySubClasses = {};
    this.data.divisions = {};
    this.isSearchWithStore = false;
    this.items = [];

    this.fieldSelected = this.assignFieldSelected({
      supplier: '',
      divisionm: '',
      groupm: '',
      subClassm: '',
      keyword: '',
      keywordbarcode: '',
      storeCode: '',
    });

    this.isAutoload = false;

    PageHelper.updateFilters(this.fieldSelected, function (filters) {
      return true;
    });
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  handleSearch = (refresh = false) => {
    if (
      !this.fieldSelected.supplier &&
      !this.fieldSelected.divisionm &&
      !this.fieldSelected.groupm &&
      !this.fieldSelected.subClassm &&
      !this.fieldSelected.keyword &&
      !this.fieldSelected.keywordbarcode &&
      !this.fieldSelected.storeCode
    ) {
      AppMessage.info('Please select at least one field');
      return;
    }
    PageHelper.pushHistoryState(this.fieldSelected);
    this.handleLoadItemsResult();
  };

  handleLoadItemsResult = (page = 1) => {
    if (this.fieldSelected.storeCode) {
      this.isSearchWithStore = true;
    } else {
      this.isSearchWithStore = false;
    }
    this.refresh();
    let model = new ItemMasterModel();

    model
      .getItems({
        supplierCode: this.fieldSelected.supplier,
        groupCode: this.fieldSelected.groupm,
        divisionCode: this.fieldSelected.divisionm,
        subClassCode: this.fieldSelected.subClassm,
        itemName: this.fieldSelected.keyword,
        barCode: this.fieldSelected.keywordbarcode.trim(),
        storeCode: this.fieldSelected.storeCode,
        pageNumber: page,
        pageSize: 30,
      })
      .then((response) => {
        if (response.status && response.data.itemMaster) {
          this.items = response.data.itemMaster;
          this.itemCount = response.data.total;
        } else {
          this.items = [];
        }
        this.refresh();
      });
  };

  handleUpdateState = async (event) => {
    let commonModel = new CommonModel();
    await commonModel.getData('supplier,division,subclass,group,store').then((response) => {
      if (response.status) {
        if (response.data.suppliers) {
          this.data.suppliers = response.data.suppliers || {};
        }
        if (response.data.divisions) {
          this.data.divisions = response.data.divisions || {};
        }
        if (response.data.subclasses) {
          this.data.categorySubClasses = response.data.subclasses || {};
        }

        if (response.data.groups) {
          this.data.groups = response.data.groups;
        }
        if (response.data.stores) {
          this.data.stores = response.data.stores;
        }
      }
    });

    this.refresh();
  };

  handleUpdateItems = (items) => {
    this.items = items;
    this.refresh();
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

  renderFilter() {
    let suppliers = Object.values(this.data?.suppliers);
    let supplierOptions = suppliers.map((item) => {
      return { value: item.supplierCode, label: item.supplierName };
    });

    let divisions = Object.values(this.data?.divisions);
    let divisionOpt = divisions.map((item) => {
      return { value: item.divisionCode, label: item.divisionName };
    });

    let stores = Object.values(this.data?.stores || {});
    let storeOptions = stores.map((item) => {
      return { value: item.storeCode, label: `${item.storeCode} - ${item.storeName}` };
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
      <div className="section-block mt-15 mb-15 app_container">
        <div className="form-filter" style={{ fontSize: 11 }}>
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="w100pc">Store:</label>
                    <Select
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={storeOptions.filter((option) => option.value === this.fieldSelected.storeCode)}
                      options={storeOptions}
                      onChange={(e) => {
                        this.refresh();
                        this.handleChangeFieldCustom('storeCode', e ? e.value : '');
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
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
                <div className="col-md-3">
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
                <div className="col-md-3">
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

                <div className="col-md-3">
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

                <div className="col-md-3">
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

                <div className="col-md-3">
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
                  <BaseButton iconName={'search'} onClick={this.handleSearch}>
                    Search
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  handlePageChange = (pageNumber) => {
    if (pageNumber === this.page) return;
    this.page = pageNumber;
    this.refresh();
  };
  renderList() {
    return (
      <div className="section-block mb-15 app_container">
        <List
          idComponent={this.idListComponent}
          page={this.fieldSelected.page}
          sortBy={this.fieldSelected.sortBy}
          sortOrder={this.fieldSelected.sortOrder}
          onClickSearch={this.handleSearch}
          suppliers={this.data.suppliers}
          divisions={this.data.divisions}
          groups={this.data.groups}
          categorySubClasses={this.data.categorySubClasses}
          ref={this.listRef}
          items={this.items}
          searchParams={this.fieldSelected}
          isSearchWithStore={this.isSearchWithStore}
        />
        {this.itemCount > 0 ? (
          <div className="w-full center">
            <Pagination
              current={this.page || 1}
              total={this.itemCount}
              pageSize={30}
              onChange={(page) => {
                console.log({ page });
                this.page = page;
                this.refresh();
                this.handleLoadItemsResult(page);
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  renderComp() {
    return (
      <section>
        {this.renderFilter()}
        {this.renderList()}
      </section>
    );
  }
}

export default SearchIM;
