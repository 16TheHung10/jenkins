import Select from "react-select";
import React from "react";
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";

class ItemRegion extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];
    this.itemFilter = [];
    this.idComponent =
      this.props.idComponent || "itemRegionPopup" + StringHelper.randomKey();
    //Default data
    this.data.suppliers = this.props.suppliers || {};
    this.data.regions = this.props.regions || [];
    this.trueFalseOpt = [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ];
    this.fieldSelected.region = "";
    this.fieldSelected.capitalGainYield = 0;
    this.fieldSelected.costPriceRegion = 0;
    this.fieldSelected.entryPrice = 0;
    this.fieldSelected.entryPriceMax = 0;
    this.fieldSelected.entryPriceMin = 0;
    this.fieldSelected.exitPrice = 0;
    this.fieldSelected.isAllowEntryOrder = false;
    this.fieldSelected.isAllowPayingBack = false;
    this.fieldSelected.isCalculateInventory = false;
    this.fieldSelected.isSold = false;
    this.fieldSelected.itemID = "";
    this.fieldSelected.payingBackDay = 0;
    this.fieldSelected.quantityInventoryMax = 0;
    this.fieldSelected.quantityInventoryMin = 0;
    this.fieldSelected.quantitySaleMax = 0;
    this.fieldSelected.quantitySaleMin = 0;
    this.fieldSelected.retailMargin = 0;
    this.fieldSelected.salePrice = 0;
    this.fieldSelected.sellingGainYield = 0;
    this.fieldSelected.supplierCodeRegion = "";
    this.fieldSelected.updatedDate = new Date();
    this.fieldSelected.wholesaleMargin = 0;
    this.fieldSelected.wholesalePrice = 0;

    this.isRender = true;
  }

  componentWillReceiveProps(newProps) {
    if (this.items !== newProps.items) {
      this.items = newProps.items;
      if (this.fieldSelected.region === "" && this.items.length > 0) {
        this.fieldSelected.isAllowEntryOrder = this.items[0].isAllowEntryOrder;
        this.fieldSelected.isAllowPayingBack = this.items[0].isAllowPayingBack;
        this.fieldSelected.isCalculateInventory =
          this.items[0].isCalculateInventory;
        this.fieldSelected.isSold = this.items[0].isSold;
        this.fieldSelected.payingBackDay = this.items[0].payingBackDay;
        this.fieldSelected.quantityInventoryMax =
          this.items[0].quantityInventoryMax;
        this.fieldSelected.quantityInventoryMin =
          this.items[0].quantityInventoryMin;
        this.fieldSelected.salePrice = this.items[0].salePrice;
        this.fieldSelected.supplierCodeRegion =
          this.items[0].supplierCodeRegion;
        this.fieldSelected.wholesalePrice = this.items[0].wholesalePrice;
        this.fieldSelected.costPriceRegion = this.items[0].costPriceRegion;
      }
    }
    if (this.data.suppliers !== newProps.suppliers) {
      this.data.suppliers = newProps.suppliers;
    }
    if (this.data.regions !== newProps.regions) {
      this.data.regions = newProps.regions;
    }

    this.refresh();
  }

  handleGetItem = (target) => {
    if (target && target.value) {
      let result = this.items.filter((el) => el.regionCode === target.value);
      if (result.length > 0) {
        this.itemFilter = result;

        this.fieldSelected.capitalGainYield =
          this.itemFilter[0].capitalGainYield;
        this.fieldSelected.costPriceRegion = this.itemFilter[0].costPriceRegion;
        this.fieldSelected.entryPrice = this.itemFilter[0].entryPrice;
        this.fieldSelected.entryPriceMax = this.itemFilter[0].entryPriceMax;
        this.fieldSelected.entryPriceMin = this.itemFilter[0].entryPriceMin;
        this.fieldSelected.exitPrice = this.itemFilter[0].exitPrice;
        this.fieldSelected.isAllowEntryOrder =
          this.itemFilter[0].isAllowEntryOrder;
        this.fieldSelected.isAllowPayingBack =
          this.itemFilter[0].isAllowPayingBack;
        this.fieldSelected.isCalculateInventory =
          this.itemFilter[0].isCalculateInventory;
        this.fieldSelected.isSold = this.itemFilter[0].isSold;
        this.fieldSelected.itemID = this.itemFilter[0].itemID;
        this.fieldSelected.payingBackDay = this.itemFilter[0].payingBackDay;
        this.fieldSelected.quantityInventoryMax =
          this.itemFilter[0].quantityInventoryMax;
        this.fieldSelected.quantityInventoryMin =
          this.itemFilter[0].quantityInventoryMin;
        this.fieldSelected.quantitySaleMax = this.itemFilter[0].quantitySaleMax;
        this.fieldSelected.quantitySaleMin = this.itemFilter[0].quantitySaleMin;
        this.fieldSelected.retailMargin = this.itemFilter[0].retailMargin;
        this.fieldSelected.salePrice = this.itemFilter[0].salePrice;
        this.fieldSelected.sellingGainYield =
          this.itemFilter[0].sellingGainYield;
        this.fieldSelected.supplierCodeRegion =
          this.itemFilter[0].supplierCodeRegion;
        this.fieldSelected.updatedDate = this.itemFilter[0].updatedDate;
        this.fieldSelected.wholesaleMargin = this.itemFilter[0].wholesaleMargin;
        this.fieldSelected.wholesalePrice = this.itemFilter[0].wholesalePrice;
      }
    } else if (this.items.length > 0) {
      this.itemFilter = this.items;

      this.fieldSelected.capitalGainYield = this.itemFilter[0].capitalGainYield;
      this.fieldSelected.costPriceRegion = this.itemFilter[0].costPriceRegion;
      this.fieldSelected.entryPrice = this.itemFilter[0].entryPrice;
      this.fieldSelected.entryPriceMax = this.itemFilter[0].entryPriceMax;
      this.fieldSelected.entryPriceMin = this.itemFilter[0].entryPriceMin;
      this.fieldSelected.exitPrice = this.itemFilter[0].exitPrice;
      this.fieldSelected.isAllowEntryOrder =
        this.itemFilter[0].isAllowEntryOrder;
      this.fieldSelected.isAllowPayingBack =
        this.itemFilter[0].isAllowPayingBack;
      this.fieldSelected.isCalculateInventory =
        this.itemFilter[0].isCalculateInventory;
      this.fieldSelected.isSold = this.itemFilter[0].isSold;
      this.fieldSelected.itemID = this.itemFilter[0].itemID;
      this.fieldSelected.payingBackDay = this.itemFilter[0].payingBackDay;
      this.fieldSelected.quantityInventoryMax =
        this.itemFilter[0].quantityInventoryMax;
      this.fieldSelected.quantityInventoryMin =
        this.itemFilter[0].quantityInventoryMin;
      this.fieldSelected.quantitySaleMax = this.itemFilter[0].quantitySaleMax;
      this.fieldSelected.quantitySaleMin = this.itemFilter[0].quantitySaleMin;
      this.fieldSelected.retailMargin = this.itemFilter[0].retailMargin;
      this.fieldSelected.salePrice = this.itemFilter[0].salePrice;
      this.fieldSelected.sellingGainYield = this.itemFilter[0].sellingGainYield;
      this.fieldSelected.supplierCodeRegion =
        this.itemFilter[0].supplierCodeRegion;
      this.fieldSelected.updatedDate = this.itemFilter[0].updatedDate;
      this.fieldSelected.wholesaleMargin = this.itemFilter[0].wholesaleMargin;
      this.fieldSelected.wholesalePrice = this.itemFilter[0].wholesalePrice;
    } else {
      this.fieldSelected.capitalGainYield = "";
      this.fieldSelected.costPriceRegion = "";
      this.fieldSelected.entryPrice = "";
      this.fieldSelected.entryPriceMax = "";
      this.fieldSelected.entryPriceMin = "";
      this.fieldSelected.exitPrice = "";
      this.fieldSelected.isAllowEntryOrder = "";
      this.fieldSelected.isAllowPayingBack = "";
      this.fieldSelected.isCalculateInventory = "";
      this.fieldSelected.isSold = "";
      this.fieldSelected.itemID = "";
      this.fieldSelected.payingBackDay = "";
      this.fieldSelected.quantityInventoryMax = "";
      this.fieldSelected.quantityInventoryMin = "";
      this.fieldSelected.quantitySaleMax = "";
      this.fieldSelected.quantitySaleMin = "";
      this.fieldSelected.retailMargin = "";
      this.fieldSelected.salePrice = "";
      this.fieldSelected.sellingGainYield = "";
      this.fieldSelected.supplierCodeRegion = "";
      this.fieldSelected.updatedDate = "";
      this.fieldSelected.wholesaleMargin = "";
      this.fieldSelected.wholesalePrice = "";
    }

    this.refresh();
  };

  handleChange = () => {
    if (this.fieldSelected.supplierCodeRegion === "") {
      this.showAlert("Please choose supplier code region");
      return;
    }

    let lstItem = [
      {
        capitalGainYield: this.fieldSelected.capitalGainYield,
        costPriceRegion: this.fieldSelected.costPriceRegion,
        entryPrice: this.fieldSelected.entryPrice,
        entryPriceMax: this.fieldSelected.entryPriceMax,
        entryPriceMin: this.fieldSelected.entryPriceMin,
        exitPrice: this.fieldSelected.exitPrice,
        isAllowEntryOrder: this.fieldSelected.isAllowEntryOrder,
        isAllowPayingBack: this.fieldSelected.isAllowPayingBack,
        isCalculateInventory: this.fieldSelected.isCalculateInventory,
        isSold: this.fieldSelected.isSold,
        payingBackDay: this.fieldSelected.payingBackDay,
        quantityInventoryMax: this.fieldSelected.quantityInventoryMax,
        quantityInventoryMin: this.fieldSelected.quantityInventoryMin,
        quantitySaleMax: this.fieldSelected.quantitySaleMax,
        quantitySaleMin: this.fieldSelected.quantitySaleMin,
        retailMargin: this.fieldSelected.retailMargin,
        salePrice: this.fieldSelected.salePrice,
        sellingGainYield: this.fieldSelected.sellingGainYield,
        supplierCodeRegion: this.fieldSelected.supplierCodeRegion,
        updatedDate: this.fieldSelected.updatedDate,
        wholesaleMargin: this.fieldSelected.wholesaleMargin,
        wholesalePrice: this.fieldSelected.salePrice,
        itemID: this.fieldSelected.itemID,
        regionCode: this.fieldSelected.region,
      },
    ];

    if (this.fieldSelected.region === "") {
      if (
        window.confirm(
          "Please confirm the application of the changes to all regions",
        ) === true
      ) {
        this.props.updateItemRegion(lstItem);
      }
    } else {
      this.props.updateItemRegion(lstItem);
    }
    this.showAlert("Change successfully", "success");
  };

  renderComp() {
    let items = this.itemFilter;

    let regions = this.data.regions;
    let regionOtp = regions.map((el) => ({
      value: el.regionCode,
      label: el.regionName,
    }));

    let suppliers = Object.values(this.data.suppliers);
    let supplierOptions = suppliers.map((item) => {
      return { value: item.supplierCode, label: item.supplierName };
    });

    return (
      <section
        id={this.idComponent}
        className="popup-form popup-form-additem"
        style={{ maxWidth: "65%", height: "calc(100vh - 85px)" }}
      >
        <div className="form-filter">
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="w100pc">Region:</label>
                <Select
                  isClearable
                  classNamePrefix="select"
                  maxMenuHeight={160}
                  placeholder="-- All regions --"
                  value={regionOtp.filter(
                    (option) => option.value === this.fieldSelected.region,
                  )}
                  options={regionOtp}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "region",
                      e ? e.value : "",
                      this.handleGetItem(e),
                    )
                  }
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="form-group">
                <label className="w100pc op0">.</label>
                <button
                  type="button"
                  onClick={this.handleChange}
                  className="btn btn-success"
                  style={{ height: 38 }}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="wrap-table pp-additem">
          <div className="row mrb-10">
            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Calc inventory:</label>
                <Select
                  classNamePrefix="select"
                  maxMenuHeight={160}
                  placeholder="--"
                  value={this.trueFalseOpt.filter(
                    (option) =>
                      option.value === this.fieldSelected.isCalculateInventory,
                  )}
                  options={this.trueFalseOpt}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "isCalculateInventory",
                      e ? e.value : "",
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Sold:</label>
                <Select
                  classNamePrefix="select"
                  maxMenuHeight={160}
                  placeholder="--"
                  value={this.trueFalseOpt.filter(
                    (option) => option.value === this.fieldSelected.isSold,
                  )}
                  options={this.trueFalseOpt}
                  onChange={(e) =>
                    this.handleChangeFieldCustom("isSold", e ? e.value : "")
                  }
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Allow order:</label>
                <Select
                  classNamePrefix="select"
                  maxMenuHeight={160}
                  placeholder="--"
                  value={this.trueFalseOpt.filter(
                    (option) =>
                      option.value === this.fieldSelected.isAllowEntryOrder,
                  )}
                  options={this.trueFalseOpt}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "isAllowEntryOrder",
                      e ? e.value : "",
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Allow return:</label>
                <Select
                  classNamePrefix="select"
                  maxMenuHeight={160}
                  placeholder="--"
                  value={this.trueFalseOpt.filter(
                    (option) =>
                      option.value === this.fieldSelected.isAllowPayingBack,
                  )}
                  options={this.trueFalseOpt}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "isAllowPayingBack",
                      e ? e.value : "",
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Supplier code region:</label>
                <Select
                  classNamePrefix="select"
                  maxMenuHeight={160}
                  placeholder="--"
                  value={supplierOptions.filter(
                    (option) =>
                      option.value === this.fieldSelected.supplierCodeRegion,
                  )}
                  options={supplierOptions}
                  onChange={(e) =>
                    this.handleChangeFieldCustom(
                      "supplierCodeRegion",
                      e ? e.value : "",
                    )
                  }
                />
              </div>
            </div>

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Whole sale price:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="wholesalePrice"
                                    value={this.fieldSelected.wholesalePrice}
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("wholesalePrice", e.target.value);
                                    }}

                                />
                            </div>
                        </div> */}

            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Selling price:</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control"
                  name="salePrice"
                  value={this.fieldSelected.salePrice}
                  onChange={(e) => {
                    var pattern = new RegExp(/^\d*\.?\d*$/);

                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }

                    this.handleChangeFieldCustom("salePrice", e.target.value);
                  }}
                  disabled
                />
              </div>
            </div>

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Entry price:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="entryPrice"
                                    value={this.fieldSelected.entryPrice}
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("entryPrice", e.target.value);
                                    }}
                                
                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Exit price:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="exitPrice"
                                    value={this.fieldSelected.exitPrice}
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("exitPrice", e.target.value);
                                    }}
                                
                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Qty inventory max:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="quantityInventoryMax"
                                    value={this.fieldSelected.quantityInventoryMax}
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("quantityInventoryMax", e.target.value);
                                    }}

                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Qty inventory min:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="quantityInventoryMin"
                                    value={this.fieldSelected.quantityInventoryMin}
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("quantityInventoryMin", e.target.value);
                                    }}

                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Qty sale max:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="quantitySaleMax"
                                    value={this.fieldSelected.quantitySaleMax}
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("quantitySaleMax", e.target.value);
                                    }}

                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Qty sale min:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="quantitySaleMin"
                                    value={this.fieldSelected.quantitySaleMin}
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("quantitySaleMin", e.target.value);
                                    }}

                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Capital gain yield:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="capitalGainYield"
                                    value={this.fieldSelected.capitalGainYield}
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("capitalGainYield", e.target.value);
                                    }}
                                
                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Selling gain yield:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="sellingGainYield"
                                    value={this.fieldSelected.sellingGainYield }
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("sellingGainYield", e.target.value);
                                    }}
                                
                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Entry price min:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="entryPriceMin"
                                    value={this.fieldSelected.entryPriceMin }
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("entryPriceMin", e.target.value);
                                    }}
                                
                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Entry price max:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="entryPriceMax"
                                    value={this.fieldSelected.entryPriceMax }
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("entryPriceMax", e.target.value);
                                    }}
                                
                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Retail margin:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="retailMargin"
                                    value={this.fieldSelected.retailMargin }
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("retailMargin", e.target.value);
                                    }}
                                
                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Whole sale margin:</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="wholesaleMargin"
                                    value={this.fieldSelected.wholesaleMargin}
                                    onChange={(e) => {
                                        var pattern = new RegExp(/^\d*\.?\d*$/);

                                        if (e.target.value && !pattern.test(e.target.value)) {
                                            return;
                                        }

                                        this.handleChangeFieldCustom("wholesaleMargin", e.target.value);
                                    }}
                                
                                />
                            </div>
                        </div> */}

            {/* <div className='col-md-3'>
                            <div className="form-group">
                                <label className="w100pc">Updated date:</label>

                                <DatePicker
                                    placeholderText="-- Updated date --"
                                    selected={Date.parse(this.fieldSelected.updatedDate)}
                                    onChange={(value) => this.handleChangeFieldCustom("updatedDate", value)}
                                    showTimeInput
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    className="form-control"
                                    autoComplete="off"
                                />
                            </div>
                        </div> */}

            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Cost price region:</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control"
                  name="costPriceRegion"
                  value={this.fieldSelected.costPriceRegion}
                  onChange={(e) => {
                    var pattern = new RegExp(/^\d*\.?\d*$/);

                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }

                    this.handleChangeFieldCustom(
                      "costPriceRegion",
                      e.target.value,
                    );
                  }}
                  disabled
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Return goods term:</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control"
                  name="payingBackDay"
                  value={this.fieldSelected.payingBackDay}
                  onChange={(e) => {
                    var pattern = new RegExp(/^[0-9]\d*$/);

                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }

                    this.handleChangeFieldCustom(
                      "payingBackDay",
                      e.target.value,
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ItemRegion;
