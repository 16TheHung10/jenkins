//Plugin
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, FileHelper, PageHelper, StringHelper } from "helpers";

import ListSearch from "components/mainContent/logistics/listSearchOrderSupplier";
import CommonModel from "models/CommonModel";
import DownloadModel from "models/DownloadModel";
import LogisticsModel from "models/LogisticsModel";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BaseButton from "components/common/buttons/baseButton/BaseButton";

export default class Search extends BaseComponent {
  constructor(props) {
    super(props);

    this.listSearchRef = React.createRef();
    this.idListComponent = "logistics" + StringHelper.randomKey();

    //Default data
    this.data.stores = [];
    this.data.suppliers = [];
    this.items = [];
    this.importData = [];

    //Data Selected
    this.fieldSelected = this.assignFieldSelected(
      {
        orderStartDate: new Date(),
        orderEndDate: new Date(),
        deliveryStartDate: new Date(),
        deliveryEndDate: new Date(),
        page: 1,
        supplier: "",
      },
      ["storeCode"],
    );

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        if (filters["orderStartDate"]) {
          filters["orderStartDate"] = new Date(filters["orderStartDate"]);
        }
        if (filters["orderEndDate"]) {
          filters["orderEndDate"] = new Date(filters["orderEndDate"]);
        }
        if (filters["deliveryStartDate"]) {
          filters["deliveryStartDate"] = new Date(filters["deliveryStartDate"]);
        }
        if (filters["deliveryEndDate"]) {
          filters["deliveryEndDate"] = new Date(filters["deliveryEndDate"]);
        }
        return true;
      },
    );

    this.isRender = true;
  }

  componentDidMount = () => {
    this.handleUpdateState();
  };

  handleUpdateState = async (event) => {
    let commonModel = new CommonModel();
    await commonModel.getData("store,supplier").then((response) => {
      if (response.status) {
        if (response.data.stores) {
          this.data.stores = response.data.stores || [];
        }
        if (response.data.suppliers) {
          this.data.suppliers = response.data.suppliers || [];
        }
      }
    });

    this.refresh();
  };

  handleSearch = () => {
    let fields = this.fieldSelected;

    // if (fields.supplier === "") {
    //     this.showAlert("Please enter supplier");
    //     return false;
    // }

    this.items = [];
    PageHelper.pushHistoryState(this.fieldSelected);

    this.handleLoadResult();

    this.refresh();
  };

  handleExport = () => {
    let fields = this.fieldSelected;
    let model = new LogisticsModel();

    let params = {
      type: "ordersupplier",
      storeCode: fields.storeCode,
      supplier: fields.supplier,
      orderStartDate:
        fields.orderStartDate !== ""
          ? DateHelper.displayDateFormat(fields.orderStartDate)
          : "",
      orderEndDate:
        fields.orderEndDate !== ""
          ? DateHelper.displayDateFormat(fields.orderEndDate)
          : "",
      deliveryStartDate:
        fields.deliveryStartDate !== ""
          ? DateHelper.displayDateFormat(fields.deliveryStartDate)
          : "",
      deliveryEndDate:
        fields.deliveryEndDate !== ""
          ? DateHelper.displayDateFormat(fields.deliveryEndDate)
          : "",
      page: fields.page,
    };

    model.exportSupplier(params).then((res) => {
      if (res.status && res.data) {
        let downloadModel = new DownloadModel();
        downloadModel.get(res.data.downloadUrl, null, null, ".xls");
      } else {
        this.isSuccess = false;
        this.showAlert(res.message || "Can not import file");
      }

      this.refresh();
    });
  };

  handleLoadResult = () => {
    let fields = this.fieldSelected;
    let model = new LogisticsModel();

    let params = {
      type: "ordersupplier",
      storeCode: fields.storeCode,
      supplier: fields.supplier,
      orderStartDate:
        fields.orderStartDate !== ""
          ? DateHelper.displayDateFormat(fields.orderStartDate)
          : "",
      orderEndDate:
        fields.orderEndDate !== ""
          ? DateHelper.displayDateFormat(fields.orderEndDate)
          : "",
      deliveryStartDate:
        fields.deliveryStartDate !== ""
          ? DateHelper.displayDateFormat(fields.deliveryStartDate)
          : "",
      deliveryEndDate:
        fields.deliveryEndDate !== ""
          ? DateHelper.displayDateFormat(fields.deliveryEndDate)
          : "",
      page: fields.page,
    };

    model.getList(params).then((res) => {
      if (res.status && res.data.poList) {
        this.items = res.data.poList;
        this.itemCount = res.data.total;
      }
      this.refresh();
    });
  };

  isValidForSend() {
    return this.importData != null && this.importData.length != 0;
  }

  handleSendImport = () => {
    const fields = this.fieldSelected;

    let stockImport = [];
    if (!this.isValidForSend()) {
      this.showAlert("Please choose file CSV");
      return;
    }

    stockImport = this.importData.map((item) => {
      let itemSplit = item.split(",");
      return itemSplit;
    });

    let obj = {
      details: stockImport,
    };

    var model = new LogisticsModel();
    model.postFileImportOrderSup(obj).then((response) => {
      if (response.status && response.data) {
        this.showAlert("File was sent", "success");
        this.cancel();

        let downloadModel = new DownloadModel();
        downloadModel.get(response.data.downloadUrl, null, null, ".xls");
      } else {
        this.showAlert(response.message || "Can not import file");
      }

      this.refresh();
    });
  };

  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.page = page;
    this.refresh();
  };

  finishUploadFile = (textFile) => {
    this.importData = textFile;
    this.refresh();
  };

  renderFilter = () => {
    const fields = this.fieldSelected;

    let stores = this.data.stores;
    let orderStore = {};
    let storeOptions = [];

    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });

    if (Object.keys(stores).length === 0) {
      let obj = {
        value: this.data.storeCode,
        label: this.data.storeCode + " - " + this.data.storeName,
      };
      storeOptions.push(obj);
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        let obj = {
          value: stores[key].storeCode,
          label: stores[key].storeCode + " - " + stores[key].storeName,
        };
        return obj;
      });
    }

    let suppliers = this.data.suppliers;
    let suppliersKeys = Object.keys(suppliers);
    let supplierOptions = suppliersKeys.map((key) => {
      return {
        value: suppliers[key].supplierCode,
        label: suppliers[key].supplierName,
      };
    });

    return (
      <div className="form-filter app_container p-0 mt-15">
        <div className="row">
          <div className="col-md-12">
            <div className="section-block">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Store
                    </label>
                    <Select
                      isDisabled={storeOptions.length === 1}
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={storeOptions.filter(
                        (option) =>
                          option.value === this.fieldSelected.storeCode,
                      )}
                      options={storeOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "storeCode",
                          e ? e.value : "",
                        )
                      }
                    />
                  </div>
                </div>
                {/* STORE */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="supplier" className="w100pc">
                      Supplier
                    </label>
                    <Select
                      isDisabled={supplierOptions.length === 1}
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={supplierOptions.filter(
                        (option) =>
                          option.value === this.fieldSelected.supplier,
                      )}
                      options={supplierOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "supplier",
                          e ? e.value : "",
                        )
                      }
                    />
                  </div>
                </div>

                {/* DATE */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="w100pc">Order date: </label>
                    <div className="row">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="Start date"
                          selected={fields.orderStartDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "orderStartDate",
                              value,
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={fields.orderStartDate ? true : false}
                        />
                      </div>
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="End date"
                          selected={fields.orderEndDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom("orderEndDate", value)
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={fields.orderEndDate ? true : false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="w100pc">Delivery date: </label>
                    <div className="row ">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="Start date"
                          selected={fields.deliveryStartDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "deliveryStartDate",
                              value,
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={fields.deliveryStartDate ? true : false}
                        />
                      </div>
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <DatePicker
                          placeholderText="End date"
                          selected={fields.deliveryEndDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom(
                              "deliveryEndDate",
                              value,
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          autoComplete="off"
                          isClearable={fields.deliveryEndDate ? true : false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>File csv:</span>
                      <a
                        title="Download file csv"
                        href="https://api.gs25.com.vn:8091/storemanagement/share/template/logistic/OrderSupplierTemplate.csv"
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={faQuestionCircle} />
                        Download File CSV
                      </a>
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-file"
                      id={this.idImport}
                      onChange={(e) =>
                        FileHelper.uploadFiles(e, this.finishUploadFile)
                      }
                      accept=".csv"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-9 flex items-center gap-10">
                  <BaseButton iconName={"search"} onClick={this.handleSearch}>
                    Search
                  </BaseButton>
                  <BaseButton
                    iconName={"export"}
                    color="green"
                    onClick={this.handleExport}
                  >
                    Export
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderList = () => {
    return (
      <ListSearch
        idComponent={this.idListComponent}
        ref={this.listSearchRef}
        page={this.fieldSelected.page}
        items={this.items}
        handleLoadResult={this.handleLoadResult}
        autoload={this.isAutoload}
        handleClickPaging={this.handleClickPaging}
        itemCount={this.itemCount}
      />
    );
  };

  renderComp = () => {
    return (
      <div>
        {this.renderFilter()}
        {this.renderList()}
      </div>
    );
  };
}
