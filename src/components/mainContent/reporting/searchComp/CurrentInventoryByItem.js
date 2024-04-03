//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import DateHelper from "helpers/DateHelper";
import StringHelper from "helpers/StringHelper";
import CommonModel from "models/CommonModel";

import ReportingModel from "models/ReportingModel";

import BarcodeComp from "components/mainContent/reporting/autocompleteBarcode";
import TableCurrentInventoryByItem from "components/mainContent/reporting/tableComp/TableCurrentInventoryByItem";
import { handleExportAutoField } from "helpers/ExportHelper";
import { createListOption } from "helpers/FuncHelper";
import ItemModel from "models/ItemModel";

import { Col, Row, Tag } from "antd";
import SelectboxAndCheckbox from "utils/selectboxAndCheckbox";
import {
  FileExcelOutlined,
  FileSearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";

export default class CurrentInventoryByItem extends BaseComponent {
  constructor(props) {
    super(props);

    this.idBarcodeItemRef = React.createRef();
    this.idBarcodeItem = "idBarcodeItem" + StringHelper.randomKey();

    //Default data
    this.data.stores = [];
    this.data.cateSV = [];
    this.data.supplierSV = [];
    this.lstCat = [];
    this.lstSup = [];

    this.sum = {};
    this.itemReport = {
      totalOpenStock: 0,
      totalRcvQty: 0,
      totalSaleQty: 0,
      totalDeliveryQty: 0,
      totalSOH: 0,
    };

    this.itemsOrder = {};

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        itemCode: "",
        categoryCode: "",
        categoryCodeSV: "",
        supplierCode: "",
        supplierCodeSV: "",
        itemCodeFilter: "",
      },
      ["storeCode"],
    );

    this.isRender = true;

    this.isShowFilter = false;
  }

  componentDidMount() {
    this.handleCheckInventory();
    this.handleUpdateState();
  }

  handleCheckInventory = async () => {
    let model = new ReportingModel();
    let date = DateHelper.displayDateFormatMinus(new Date());

    await model.checkStatusAPIinventory(date).then((response) => {
      if (response.status && response.data.storeStatus) {
        this.handleUpdateState();

        if (response.message) {
          if (response.message !== "") {
            this.showAlert(response.message, "error", false);
          }
        }
      } else {
        var elUpdating = document.getElementById("content-updating");
        elUpdating.classList.remove("d-none");
      }
    });

    this.refresh();
  };

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData("store,supplier,group").then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
        this.data.cateSV = response.data.groups;
        this.data.supplierSV = response.data.suppliers;
      }
    });

    let itemModel = new ItemModel();
    await itemModel.getAllItems().then((res) => {
      if (res.status && res.data.items) {
        this.itemsOrder = res.data.items;
      }
    });

    this.refresh();
  };

  handleIsShowFilter = () => {
    this.isShowFilter = !this.isShowFilter;
    this.refresh();
  };

  handleSearch = async () => {
    let fields = this.fieldSelected;

    let count = 0;

    if (fields.itemCode !== "") {
      count += 1;
    }
    if (fields.categoryCodeSV !== "") {
      count += 1;
    }
    if (fields.supplierCodeSV !== "") {
      count += 1;
    }

    if (count == 0) {
      this.showAlert("Please choose at least one option");
      return false;
    }

    let model = new ReportingModel();
    let date = DateHelper.displayDateFormatMinus(new Date());

    await model.checkStatusAPIinventory(date).then((response) => {
      if (response.status && response.data.storeStatus) {
        if (response.message) {
          if (response.message !== "") {
            this.showAlert(response.message, "error", false);
          }
        }

        this.handleGetInventory();
      } else {
        this.showAlert("Data updating", "error", false);
      }
    });

    this.refresh();
  };

  handleGetInventory = async () => {
    let fields = this.fieldSelected;

    let page = "/reporting/stock/";
    let itemCode = fields.itemCode;
    const params = {
      itemCode,
      categoryCode: fields.categoryCodeSV,
      supplierCode: fields.supplierCodeSV,
    };
    let keyPage = "";
    // let keyPage = '/item';

    this.lstCat = [];
    this.lstSup = [];

    let model = new ReportingModel();
    await model
      .getInventoryReport(page, itemCode, keyPage, params)
      .then((res) => {
        if (res.status && res.data) {
          if (res.data.stock) {
            this.items = res.data.stock || [];

            this.items.sort((a, b) => {
              if (a.storeCode > b.storeCode) {
                return -1;
              }
              if (a.storeCode < b.storeCode) {
                return 1;
              }
              return 0;
            });

            let newObjCateory = {};
            let newObjSupplier = {};

            for (let key in res.data.stock) {
              let item = res.data.stock[key];

              if (!newObjCateory[item.categoryCode]) {
                newObjCateory[item.categoryCode] = {
                  value: item.categoryCode,
                  label: item.categoryCode + " - " + item.categoryName,
                };
              }
              if (!newObjSupplier[item.supplierCode]) {
                newObjSupplier[item.supplierCode] = {
                  value: item.categoryCode,
                  label: item.supplierCode + " - " + item.supplierName,
                };
              }
            }

            this.handleSum(res.data.stock);
            this.lstCat = Object.values(newObjCateory);
            this.lstSup = Object.values(newObjSupplier);

            this.itemCodeOpt = createListOption(
              res.data.stock,
              "itemCode",
              "itemName",
            );
          }

          this.refresh();
        } else {
          this.showAlert("API connect fail");
        }
      });
  };

  handleFilter = (listItem) => {
    const fields = this.fieldSelected;
    let list = listItem;

    list =
      fields.supplierCode !== ""
        ? list.filter((e) => e.supplierCode === fields.supplierCode)
        : list;
    list =
      fields.categoryCode !== ""
        ? list.filter((e) => e.categoryCode === fields.categoryCode)
        : list;
    list =
      fields.itemCodeFilter !== ""
        ? list.filter((e) => e.itemCode === fields.itemCodeFilter)
        : list;

    this.handleSum(list);
    return list;
  };

  handleSum = (list) => {
    this.itemReport = {
      totalItem: 0,
      totalOpenStock: 0,
      totalRcvQty: 0,
      totalSaleQty: 0,
      totalDeliveryQty: 0,
      totalSOH: 0,
    };

    for (let k in list) {
      let item = list[k];
      this.itemReport.totalItem += 1;
      this.itemReport.totalOpenStock += parseFloat(item.openStock);
      this.itemReport.totalRcvQty += parseFloat(item.rcvQty);
      this.itemReport.totalSaleQty += parseFloat(item.saleQty);
      this.itemReport.totalDeliveryQty += parseFloat(item.deliveryQty);
      this.itemReport.totalSOH += parseFloat(item.soh);
    }
  };

  handleUpdateFilterBarcode = (itemCode, isFilter) => {
    if (isFilter) {
      this.fieldSelected.itemCode = itemCode;
      // this.refresh();
    }
  };
  // handleUpdateCategorySV = (value) => {
  //     this.fieldSelected.categoryCodeSV = value;
  // };
  // handleUpdateSuppplierSV = (value) => {
  //     this.fieldSelected.supplierCodeSV = value;
  // };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.refresh();
    }
  };

  renderComp() {
    const fields = this.fieldSelected;

    let stores = this.data.stores;
    let cateOpt = createListOption(this.data.cateSV, "groupCode", "groupName");
    let supplierOpt = createListOption(
      this.data.supplierSV,
      "supplierCode",
      "supplierName",
    );

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
        label: this.data.storeCode + " - " + this.data.storeName,
      });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return {
          value: stores[key].storeCode,
          label: stores[key].storeCode + " - " + stores[key].storeName,
        };
      });
    }

    let items = this.handleFilter(this.items);

    return (
      <div className="container-table">
        <div className="col-md-12">
          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={16}>
                    <Row gutter={16}>
                      <Col xl={8}>
                        <label htmlFor="supplierCodeSV" className="w100pc">
                          Supplier:
                          <SelectboxAndCheckbox
                            data={supplierOpt}
                            func={this.updateFilter}
                            keyField={"supplierCodeSV"}
                            value={fields.supplierCodeSV}
                            isMode={""}
                          />
                          {/* <SelectBox
                                                        data={supplierOpt}
                                                        func={this.handleUpdateSuppplierSV}
                                                        // funcCallback={this.resetFilter}
                                                        keyField={'supplierCodeSV'}
                                                        defaultValue={fields.supplierCode}
                                                        isMode={''}
                                                    /> */}
                        </label>
                      </Col>

                      <Col xl={8}>
                        <label htmlFor="categoryCodeSV" className="w100pc">
                          Category:
                          <SelectboxAndCheckbox
                            data={cateOpt}
                            func={this.updateFilter}
                            keyField={"categoryCodeSV"}
                            value={fields.categoryCodeSV}
                            isMode={""}
                          />
                        </label>
                      </Col>

                      <Col xl={8}>
                        <label htmlFor="itemCode" className="w100pc">
                          Barcode:
                        </label>

                        <BarcodeComp
                          idComponent={this.idBarcodeItem}
                          ref={this.idBarcodeItemRef}
                          barCodes={this.itemsOrder}
                          AddBarcode={this.handleAddBarcode}
                          updateFilter={this.handleUpdateFilterBarcode}
                          style={{ height: 30, borderRadius: 2 }}
                        />
                      </Col>
                    </Row>

                    <Row gutter={16} className="mrt-10">
                      <Col xl={24}>
                        <Tag
                          className="h-30 icon-search"
                          onClick={this.handleSearch}
                        >
                          <FileSearchOutlined />{" "}
                          <span className="icon-search-detail">Search</span>
                        </Tag>
                        <Tag
                          icon={<FileExcelOutlined />}
                          className="h-30 icon-excel"
                          onClick={() =>
                            handleExportAutoField(this.items, "inventoryByItem")
                          }
                        >
                          <span className="icon-excel-detail">Export</span>
                        </Tag>
                        <Tag
                          onClick={this.handleIsShowFilter}
                          className="h-30 icon-orange"
                        >
                          <FilterOutlined />
                        </Tag>
                      </Col>
                    </Row>

                    {this.isShowFilter && (
                      <Row gutter={16} className="mrt-10">
                        <Col xl={6}>
                          <label htmlFor="itemCodeFilter" className="w100pc">
                            Items:
                            <SelectboxAndCheckbox
                              data={this.itemCodeOpt}
                              func={this.updateFilter}
                              keyField={"itemCodeFilter"}
                              defaultValue={fields.itemCodeFilter}
                              isMode={""}
                            />
                          </label>
                        </Col>
                      </Row>
                    )}
                  </Col>
                  <Col xl={8}>
                    <div className="bg-note cl-red">
                      <strong>Lưu ý:</strong>
                      <br />
                      - Phiếu hủy phải thực hiện trong ngày. <br />
                      - Các phiếu hủy chưa hoàn thành sẽ tự động xóa vào cuối
                      ngày
                      <br />
                      - Auto lock receiving trong thời gian kiểm kê (dự kiến
                      trong 4 giờ) <br />
                      - Internal transfer chưa xác nhận trước kỳ kiểm kê sẽ bị
                      lock <br />- Hàng raw phải qua ngày mới được quy đổi
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <div className="detail-tab row">
            <div className="col-md-12">
              <div className="row mrt-5">
                <div className="col-md-12">
                  <TableCurrentInventoryByItem
                    items={items}
                    fieldSelected={this.fieldSelected}
                    itemReport={this.itemReport}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            id="content-updating"
            className="detail-tab row d-none pos-absolute"
            style={{
              width: "100%",
              height: "100%",
              top: 0,
              bottom: 0,
              background: "white",
            }}
          >
            <h6 className="cl-red pos-relative" style={{ padding: "0 15px" }}>
              Dữ liệu đang được cập nhật, vui lòng quay lại sau.{" "}
              <button
                onClick={() => super.back("/")}
                type="button"
                className="btn btn-back"
              >
                Back
              </button>
            </h6>
          </div>
        </div>
      </div>
    );
  }
}
