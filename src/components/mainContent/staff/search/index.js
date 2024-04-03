//Plugin
import React from "react";
import Select from "react-select";
//Custom
import BaseComponent from "components/BaseComponent";
import { PageHelper, StringHelper } from "helpers";

import { Col, Row } from "antd";
import BaseButton from "components/common/buttons/baseButton/BaseButton.jsx";
import ListStaff from "components/mainContent/staff/listStaff";
import CommonModel from "models/CommonModel";
import StaffModel from "models/StaffModel";
export default class Search extends BaseComponent {
  constructor(props) {
    super(props);
    this.listStaffRef = React.createRef();
    this.idListComponent = "staff" + StringHelper.randomKey();
    this.departmentJson = [];
    this.itemCount = 0;

    this.fieldSelected = this.assignFieldSelected(
      {
        staffCode: "",
        staffName: "",
        statusStaff: "",
        departmentCode: "",
        storeCode: "",
        page: 1,
        pageSize: 30,
      },
      ["storeCode"],
    );
    // this.fieldSelected.storeCode = AccountState.getInstance().isAdmin() ? 'VN0001' : this.fieldSelected.storeCode;

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        return true;
      },
    );
  }

  handleSearch = () => {
    let fields = this.fieldSelected;
    fields.page = 1;
    PageHelper.pushHistoryState(this.fieldSelected);

    this.handleLoadResult(this.fieldSelected.page, this.fieldSelected.pageSize);

    this.refresh();
  };

  componentDidMount() {
    this.handleUpdateState();
  }

  handleChangeStoreCode = (storeCode) => {
    let model = new StaffModel();
    let params = {
      storeCode: storeCode,
    };
    model.getListDepartment(params).then((res) => {
      let fields = this.fieldSelected;
      if (res.status && res.data) {
        this.departmentJson = res.data.departments;
        fields.departmentCode = "";
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getDataV2("storeuser").then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
        this.handleChangeStoreCode(this.fieldSelected.storeCode);
        this.isRender = true;
        this.refresh();
      }
    });
  };

  handleLoadResult = (page, pageSize) => {
    let fields = this.fieldSelected;
    let model = new StaffModel();
    let params = {
      staffCode: fields.staffCode,
      staffName: fields.staffName,
      statusStaff: fields.statusStaff,
      storeCode: fields.storeCode,
      departmentCode: fields.departmentCode,
      pageNumber: page,
      pageSize: pageSize,
    };

    model.getListStaff(params).then((res) => {
      if (res.status && res.data) {
        this.items = res.data.staffs;
        this.itemCount = res.data.total;
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.page = page;
    this.refresh();
  };
  handleChangePageSize = (pageSize) => {
    let fields = this.fieldSelected;
    fields.pageSize = pageSize;
    this.refresh();
  };

  renderFilter = () => {
    const fields = this.fieldSelected;
    let stores = this.data.stores || {};
    let storeKeys = Object.keys(stores);
    const orderStore = {};
    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });

    let storeOptions = [];
    if (storeKeys.length === 0) {
      storeOptions.push({
        value: this.data.storeCode,
        label: this.data.shortName + " - " + this.data.storeName,
      });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return {
          value: orderStore[key].storeCode,
          label: orderStore[key].shortName + " - " + orderStore[key].storeName,
        };
      });
    }
    let positionNameOpt =
      this.departmentJson.map((el) => ({
        value: el.departmentCode,
        label: el.departmentName,
      })) || [];
    let statusOption = [
      { value: 0, label: "Working" },
      { value: 1, label: "Resignation" },
    ];

    return (
      <div className="form-filter pb-0">
        <Row gutter={[16, 0]} className="form-group">
          {/* STAFF CODE */}
          <Col span={5}>
            <label htmlFor="staffCode">Staff code: </label>
            <input
              type="text"
              autoComplete="off"
              name="staffCode"
              value={fields.staffCode || ""}
              onChange={this.handleChangeField}
              className="form-control"
            />
          </Col>
          <Col span={5}>
            <div className="form-group">
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                autoComplete="off"
                name="staffName"
                value={fields.staffName || ""}
                onChange={this.handleChangeField}
                className="form-control"
              />
            </div>
          </Col>
          <Col span={5}>
            <div className="form-group">
              <label htmlFor="statusStaff" className="w100pc">
                {" "}
                Status:
              </label>
              <Select
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- All --"
                value={statusOption.filter(
                  (option) => option.value === fields.statusStaff,
                )}
                options={statusOption}
                onChange={(e) =>
                  this.handleChangeFieldCustom("statusStaff", e ? e.value : "")
                }
              />
            </div>
          </Col>
          <Col span={5}>
            <div className="form-group">
              <label htmlFor="storeCode" className="w100pc">
                {" "}
                Store:
              </label>
              <Select
                isClearable
                isDisabled={storeOptions.length === 1}
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- All --"
                value={storeOptions.filter(
                  (option) => option.value === fields.storeCode,
                )}
                options={storeOptions}
                onChange={(e) =>
                  this.handleChangeFieldCustom(
                    "storeCode",
                    e ? e.value : "",
                    (value) => this.handleChangeStoreCode(value),
                  )
                }
              />
            </div>
          </Col>
          <Col span={4}>
            <div className="form-group">
              <label htmlFor="departmentCode">Department Code: </label>
              <Select
                classNamePrefix="select"
                isClearable
                maxMenuHeight={260}
                placeholder="-- Position Name --"
                value={positionNameOpt.filter(
                  (option) => option.value == fields.departmentCode,
                )}
                options={positionNameOpt}
                onChange={(e) =>
                  this.handleChangeFieldCustom(
                    "departmentCode",
                    e ? e.value : "",
                  )
                }
              />
            </div>
          </Col>

          <Col span={24}>
            <BaseButton iconName="search" onClick={this.handleSearch}>
              Search
            </BaseButton>
          </Col>
        </Row>
      </div>
    );
  };

  renderList = () => {
    return (
      <ListStaff
        idComponent={this.idListComponent}
        ref={this.listStaffRef}
        items={this.items}
        page={this.fieldSelected.page}
        totalStaffs={this.itemCount}
        handleLoadResult={this.handleLoadResult}
        handleClickPaging={this.handleClickPaging}
        handleChangePageSize={this.handleChangePageSize}
      />
    );
  };

  renderComp = () => {
    return (
      <div className="section-block mt-15 ">
        {this.renderFilter()}
        {this.renderList()}
      </div>
    );
  };
}
