//Plugin
import React from "react";
import $ from "jquery";
//Custom
import BaseComponent from "components/BaseComponent";
// import ItemModel from 'models/ItemModel';
import { Popover, message } from "antd";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import LoyaltyModel from "models/LoyaltyModel";
import Icons from "images/icons";

class SearchMemberMerge extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];
    this.idComponent = this.props.idComponent;
    //Default data
    this.data.suppliers = [];
    this.data.categoryTypes = [];
    this.data.categorySubClasses = {};
    this.page = this.props.page || 1;
    this.itemCount = 0;

    this.fieldSelected.memberCode = this.props.memberSearch || "";
    this.fieldSelected.phone = this.props.memberPhoneSearch || "";

    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddItems = this.handleAddItems.bind(this);
    this.handleLoadItemsResult = this.handleLoadItemsResult.bind(this);

    this.indexCurrent = 0;
    this.itemRes = 0;

    this.isRender = true;
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {
    // if(this.props.items !== newProps.items){
    // 	this.items = newProps.items;
    // }
    // if(this.fieldSelected.memberCode !== newProps.memberSearch){
    // 	this.fieldSelected.memberCode = newProps.memberSearch;
    // }
    // if(this.fieldSelected.phone !== newProps.memberPhoneSearch){
    // 	this.fieldSelected.phone = newProps.memberPhoneSearch;
    // }
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

  handleLoadMore = () => {
    this.handleLoadItemsResult();
  };

  handleLoadItemsResult() {
    let fields = this.fieldSelected;
    if (!fields.phone) {
      message.error("Please enter phone number");
      return;
    }
    let model = new LoyaltyModel();

    let params = {
      memberCode: fields.memberCode,
      index: this.indexCurrent,
      phone: fields.phone,
    };

    model.getList(params).then((res) => {
      if (res.status && res.data) {
        let newList = res.data.listMember;
        this.items = newList?.slice(0, 1);
        if (newList.length === 30) {
          this.indexCurrent = this.indexCurrent + newList.length;
        }

        this.itemRes = res.data.listMember.length;
        this.refresh();
      }
    });
  }

  handleSearch() {
    this.indexCurrent = 0;
    this.items = [];
    this.handleLoadItemsResult();
  }

  convertSelectedItems(selectedItems) {
    let ret = {};
    for (var index in selectedItems) {
      let item = selectedItems[index];
      if (ret[item.memberCode] === undefined) {
        ret[item.memberCode] = item;
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

  handleAddItems() {
    let optChecked = $("#" + this.idComponent)
      .find("[name=itemRadioOption]:checked")
      .val();
    if (!optChecked) return;
    this.props.addMemberMerge(optChecked);
    this.fieldSelected.phone = "";
    this.items = [];
    this.refresh();
  }

  renderComp() {
    this.selectedItems = this.convertSelectedItems(this.props.selectedItems);

    let items = this.items;
    return (
      <section
        id={this.idComponent}
        className="popup-form section-block mt-15"
        style={{
          height: "100vh",
          minHeight: "100vh",
          top: "0px",
          margin: "0px",
          width: "600px",
          overflow: "hidden",
          zIndex: 99,
        }}
      >
        <div className="form-filter">
          <h3>Select member {this.props.member}</h3>
          <div className="row flex items-end">
            {/* <div className="col-md-6"> */}
            {/* <div className="form-group">
                <label className="w100pc">Member code:</label>
                <input
                  type="text"
                  autoComplete="off"
                  id="memberCode"
                  name="memberCode"
                  value={this.fieldSelected.memberCode || ''}
                  onKeyPress={(e) => this.handleEnterField(e, this.handleSearch)}
                  onChange={this.handleChangeField}
                  className="form-control"
                />
              </div> */}
            {/* </div> */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="w100pc">Phone:</label>
                <input
                  type="text"
                  autoComplete="off"
                  name="phone"
                  value={this.fieldSelected.phone || ""}
                  onKeyPress={(e) =>
                    this.handleEnterField(e, this.handleSearch)
                  }
                  onChange={this.handleChangeField}
                  placeholder="Enter correct phone number"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6 flex items-center">
              <BaseButton
                iconName="search"
                onClick={this.handleSearch}
                className="btn btn-success"
              >
                Search
              </BaseButton>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="w-full flex items-center gap-10">
                <BaseButton
                  iconName="plus"
                  onClick={this.handleAddItems}
                  className="btn btn-primary"
                >
                  Add Member
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <div className="wrap-table htable" style={{ height: 155 }}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th>Member code</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Id No</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, key) => (
                <tr
                  key={key}
                  data-group="itemContainer"
                  data-item-code={item.memberCode}
                >
                  <td>
                    {item.active === 1 ? (
                      <input
                        key={item.memberCode}
                        type="radio"
                        name="itemRadioOption"
                        value={JSON.stringify(item)}
                        data-code={item.memberCode}
                      />
                    ) : (
                      <Popover
                        content={
                          <div>
                            <p>This user is inactive</p>
                          </div>
                        }
                        title="Title"
                      >
                        <Icons.Dot
                          style={{ cursor: "not-allowed", color: "red" }}
                        />
                      </Popover>
                    )}
                  </td>
                  <td>{item.memberCode}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.idNo}</td>
                  <td>{item.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length != 0 ? null : (
            <div className="table-message">Item not found</div>
          )}
        </div>
        {/* {items.length !== 0 && this.itemRes !== 0 ? (
          <div className="text-center">
            <span className="btn btn-loadmore" onClick={this.handleLoadMore}>
              Load more
            </span>
          </div>
        ) : null} */}
      </section>
    );
  }
}

export default SearchMemberMerge;
