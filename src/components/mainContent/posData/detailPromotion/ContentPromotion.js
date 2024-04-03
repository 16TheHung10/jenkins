//Plugin
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import BarCodeInputComp from "components/mainContent/posData/barCodeInput/BarCodeInput";
import SuppplierInputComp from "components/mainContent/posData/barCodeInput/SupplierInput";
import Moment from "moment";
import ItemsListComp from "components/mainContent/posData/barCodeInput/ItemsList";

export default class ContentPromotion extends BaseComponent {
  constructor(props) {
    super(props);
    this.barcodeInputRef = React.createRef();
    this.supplierInputRef = React.createRef();
    this.listItemsRef = React.createRef();
    this.items = props.items;
    this.suppliers = props.suppliers;

    this.itemSelected = [];
    this.data = props.dataPromotion;
    this.idBarCodeInputComp = "items" + StringHelper.randomKey();
    this.idSupplierInputComp = "supplier" + StringHelper.randomKey();
    this.fieldSelected = this.assignFieldSelected({
      promotionName: "",
      image: "",
      startDate: new Date(),
      endDate: new Date(),
      promotionGS25: "",
      promotionPartner: "",
      isOnItem: false,
      items: [],
      totalItemValueMin: 0.0,
      matchedItemMin: 0,
      totalValueMin: 0.0,
      dependentType: 0,
      groupSupplierName: "",
      docLink: "",
      docCode: "",
    });
  }

  getDataContent = () => {
    let fields = this.fieldSelected;

    if (fields.promotionName === "") {
      this.showAlert("Please enter title of promotion");
      return false;
    }
    if (fields.docLink === "") {
      this.showAlert("Please enter doc link");
      return false;
    }
    if (fields.docCode === "") {
      this.showAlert("Please enter doc code");
      return false;
    }

    if (fields.startDate === "") {
      this.showAlert("Please enter Start Date");
      return false;
    }

    if (fields.endDate === "") {
      this.showAlert("Please enter End Date");
      return false;
    }

    if (
      Moment(fields.startDate).format("YYYY/MM/DD") >
      Moment(fields.endDate).format("YYYY/MM/DD")
    ) {
      this.showAlert("End Date must be longer than Start Date");
      return false;
    }

    if (
      Moment(fields.endDate).format("YYYY/MM/DD") <
      Moment().format("YYYY/MM/DD")
    ) {
      this.showAlert("End Date must be longer than now");
      return false;
    }

    if (fields.totalItemValueMin === "") {
      this.showAlert("Please enter Minimum item");
      return false;
    }

    if (fields.matchedItemMin === "") {
      this.showAlert("Please enter Minimum matching item");
      return false;
    }

    if (fields.totalValueMin === "") {
      this.showAlert("Please enter Minimum invoice value");
      return false;
    }

    let params = {
      name: this.fieldSelected.promotionName,
      image: "",
      startDate: Moment(this.fieldSelected.startDate).format("YYYY-MM-DD") + "",
      endDate: Moment(this.fieldSelected.endDate).format("YYYY-MM-DD") + "",
      promotionGS25: this.fieldSelected.promotionGS25,
      promotionPartner: this.fieldSelected.promotionPartner,
      isOnItem: this.fieldSelected.isOnItem,
      items:
        this.fieldSelected.dependentType === 0
          ? this.listItemsRef.current.items.map((item) => {
              return item.itemCode;
            })
          : [],
      totalItemValueMin: this.fieldSelected.totalItemValueMin,
      matchedItemMin: this.fieldSelected.matchedItemMin,
      totalValueMin: this.fieldSelected.totalValueMin,
      dependentType: this.fieldSelected.dependentType,
      groupSupplierName: this.fieldSelected.groupSupplierName,
      suppliers:
        this.fieldSelected.dependentType === 1
          ? this.listItemsRef.current.items.map((item) => {
              return item.supplierCode;
            })
          : [],
      docCode: this.fieldSelected.docCode,
      docLink: this.fieldSelected.docLink,
    };
    return params;
  };

  handleAddItems = () => {
    let itemsCode = "";
    if (this.fieldSelected.dependentType === 0) {
      itemsCode = this.barcodeInputRef.current.getItemsCodeSelected();
    }
    if (this.fieldSelected.dependentType === 1) {
      itemsCode = this.supplierInputRef.current.getSupplierSelected();
    }

    if (itemsCode == "") {
      this.showAlert("Please input barcode");
      return false;
    }

    if (this.itemSelected.length !== 0) {
      for (var i in this.itemSelected) {
        if (
          this.itemSelected[i].itemCode === itemsCode ||
          this.itemSelected[i].supplierCode === itemsCode
        ) {
          this.showAlert("Items duplicate");
          return false;
        }
      }
    }

    if (this.items[itemsCode] && this.fieldSelected.dependentType === 0) {
      this.itemSelected.unshift(this.items[itemsCode]);
    } else if (
      this.suppliers["S" + itemsCode] &&
      this.fieldSelected.dependentType === 1
    ) {
      this.itemSelected.unshift(this.suppliers["S" + itemsCode]);
    } else {
      this.showAlert("Items is not exists");
      return false;
    }
    this.refresh();
  };

  componentWillReceiveProps = (newProps) => {
    if (newProps && newProps.dataPromotion) {
      this.data = newProps.dataPromotion;
      this.fieldSelected.promotionName =
        this.data.name != null ? this.data.name : "";
      this.fieldSelected.startDate =
        this.data != null ? new Date(this.data.startDate) : new Date();
      this.fieldSelected.endDate =
        this.data != null ? new Date(this.data.endDate) : new Date();
      this.fieldSelected.promotionGS25 =
        this.data != null ? this.data.promotionGS25 : "";
      this.fieldSelected.promotionPartner =
        this.data != null ? this.data.promotionPartner : "";
      this.fieldSelected.isOnItem =
        this.data.isOnItem != null ? this.data.isOnItem : false;
      this.fieldSelected.items = this.data != null ? this.data.items : "";
      this.fieldSelected.totalItemValueMin =
        this.data != null ? this.data.totalItemValueMin : 0.0;
      this.fieldSelected.matchedItemMin =
        this.data != null ? this.data.matchedItemMin : 0;
      this.fieldSelected.totalValueMin =
        this.data != null ? this.data.totalValueMin : 0.0;
      this.fieldSelected.dependentType =
        this.data != null ? this.data.dependentType : 0;
      this.fieldSelected.groupSupplierName =
        this.data != null ? this.data.groupSupplierName : 0;
      this.fieldSelected.suppliers =
        this.data != null ? this.data.suppliers : "";
      this.fieldSelected.docLink = this.data != null ? this.data.docLink : "";
      this.fieldSelected.docCode = this.data != null ? this.data.docCode : "";
    }

    if (newProps && newProps.items) {
      this.items = newProps.items;
    }

    if (newProps && newProps.suppliers) {
      this.suppliers = newProps.suppliers;
    }

    this.itemSelected = [];
    for (var i in this.fieldSelected.items) {
      let itemsCode = this.fieldSelected.items[i];
      if (this.items[itemsCode]) {
        this.itemSelected.push(this.items[itemsCode]);
      }
    }
    for (var item in this.fieldSelected.suppliers) {
      let itemsCode = this.fieldSelected.suppliers[item];
      if (this.suppliers["S" + itemsCode]) {
        this.itemSelected.push(this.suppliers["S" + itemsCode]);
      }
    }
    this.refresh();
  };

  handleChangeDependentOn = (value) => {
    this.fieldSelected.groupSupplierName = "";
    this.itemSelected = [];
  };

  renderComp = () => {
    let fields = this.fieldSelected;
    let dependentOptions = [
      { value: 0, label: "By Item" },
      { value: 1, label: "By Supplier" },
    ];
    return (
      <section className="wrap-section">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="promotionName" className="w100pc">
                  Title<span style={{ color: "red" }}>*</span>:{" "}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="promotionName"
                  placeholder="-- Promotion Name --"
                  value={fields.promotionName}
                  onChange={(e) => this.handleChangeField(e)}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <h5>Promotion Code</h5>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="promotionGS25" className="w100pc">
                  {" "}
                  By GS25:{" "}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="promotionGS25"
                  placeholder="-- Promotion GS25 --"
                  value={fields.promotionGS25}
                  onChange={(e) => this.handleChangeField(e)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="promotionPartner" className="w100pc">
                  {" "}
                  By Partner:{" "}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="promotionPartner"
                  placeholder="-- Promotion Partner --"
                  value={fields.promotionPartner}
                  onChange={(e) => this.handleChangeField(e)}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Docs */}
          <div className="row">
            <h5>Docs</h5>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="docLink" className="w100pc">
                  {" "}
                  Doc link{" "}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="docLink"
                  placeholder="-- Doc link --"
                  value={fields.docLink}
                  onChange={(e) => this.handleChangeField(e)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="docCode" className="w100pc">
                  {" "}
                  Doc code{" "}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="docCode"
                  placeholder="-- Doc code --"
                  value={fields.docCode}
                  onChange={(e) => this.handleChangeField(e)}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <h5>Condition</h5>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="startDate" className="w100pc">
                  {" "}
                  Start Date<span style={{ color: "red" }}>*</span>:{" "}
                </label>
                <DatePicker
                  placeholderText="-- Start Date --"
                  selected={fields.startDate}
                  onChange={(value) =>
                    this.handleChangeFieldCustom("startDate", value)
                  }
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="endDate" className="w100pc">
                  {" "}
                  End Date<span style={{ color: "red" }}>*</span>:{" "}
                </label>
                <DatePicker
                  placeholderText="-- End Date --"
                  selected={fields.endDate}
                  onChange={(value) =>
                    this.handleChangeFieldCustom("endDate", value)
                  }
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="matchedItemMin" className="w100pc">
                  Minimum matching item<span style={{ color: "red" }}>*</span>:{" "}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="matchedItemMin"
                  placeholder="-- Matched Item Min --"
                  value={fields.matchedItemMin}
                  onChange={(e) => {
                    var pattern = new RegExp(/^[0-9\b]+$/);

                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }
                    this.handleChangeFieldCustom(
                      "matchedItemMin",
                      e.target.value,
                    );
                  }}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="totalItemValueMin" className="w100pc">
                  Minimum item<span style={{ color: "red" }}>*</span>:{" "}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="totalItemValueMin"
                  placeholder="-- Total Item Value Min --"
                  value={fields.totalItemValueMin}
                  onChange={(e) => {
                    var pattern = new RegExp(/^[0-9\b]+$/);

                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }
                    this.handleChangeFieldCustom(
                      "totalItemValueMin",
                      e.target.value,
                    );
                  }}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="totalValueMin" className="w100pc">
                  Minimum invoice value<span style={{ color: "red" }}>*</span>:{" "}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="totalValueMin"
                  placeholder="-- Total Value Min --"
                  value={fields.totalValueMin}
                  onChange={(e) => {
                    var pattern = new RegExp(/^[0-9\b]+$/);

                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }
                    this.handleChangeFieldCustom(
                      "totalValueMin",
                      e.target.value,
                    );
                  }}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="isOnItem" className="">
                  Allow send item to partners:{" "}
                </label>
                <input
                  type="checkbox"
                  style={{ marginLeft: "5px" }}
                  name="isOnItem"
                  checked={fields.isOnItem}
                  value={fields.isOnItem}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "isOnItem",
                      e.target.value == "false",
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div className="row"></div>
        </div>

        <div className="col-md-6">
          <div className="row">
            <div className="col-md-8">
              {fields.dependentType === 0 && (
                <div className="form-group">
                  <label htmlFor="items" className="">
                    Add Item(s):{" "}
                  </label>
                  <BarCodeInputComp
                    idComponent={this.idBarCodeInputComp}
                    ref={this.barcodeInputRef}
                    items={this.items}
                  />
                </div>
              )}
              {fields.dependentType === 1 && (
                <div className="form-group">
                  <label htmlFor="suppliers" className="">
                    Add Supplier(s):{" "}
                  </label>
                  <SuppplierInputComp
                    idComponent={this.idSupplierInputComp}
                    ref={this.supplierInputRef}
                    suppliers={this.suppliers}
                  />
                </div>
              )}
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="w100pc" style={{ opacity: 0 }}>
                  .
                </label>
                <button
                  type="button"
                  className="btn btn-success col-md-12"
                  onClick={this.handleAddItems}
                  style={{ background: "black" }}
                >
                  {fields.dependentType === 0 ? "Add item" : "Add supplier"}
                </button>
              </div>
            </div>
          </div>
          <div className="section-block">
            <div className="row">
              <div className="col-md-12">
                <ItemsListComp
                  displayType={this.fieldSelected.dependentType}
                  itemsSelected={this.itemSelected}
                  ref={this.listItemsRef}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
}
