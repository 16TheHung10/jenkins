import React from "react";
import Select from "react-select";
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";

class ItemOrder extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];
    this.itemFilter = [];
    this.idComponent =
      this.props.idComponent || "itemOrderPopup" + StringHelper.randomKey();
    //Default data
    this.data.regions = this.props.regions || [];

    this.fieldSelected.region = "";
    this.fieldSelected.quantityOrderMin = 0;
    this.fieldSelected.quantityOrderMax = 0;
    this.fieldSelected.arithmeticProgression = 0;
    this.fieldSelected.itemID = "";
    this.fieldSelected.deliveryMethod = "";
    this.fieldSelected.isReturnSupplier = "";
    this.isRender = true;
  }

  componentDidMount() {
    // this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    if (this.items !== newProps.items) {
      this.items = newProps.items;
      if (this.fieldSelected.region === "" && this.items.length > 0) {
        this.fieldSelected.quantityOrderMin = this.items[0].quantityOrderMin;
        this.fieldSelected.quantityOrderMax = this.items[0].quantityOrderMax;
        this.fieldSelected.arithmeticProgression =
          this.items[0].arithmeticProgression;
      }
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

        this.fieldSelected.quantityOrderMin =
          this.itemFilter[0].quantityOrderMin;
        this.fieldSelected.quantityOrderMax =
          this.itemFilter[0].quantityOrderMax;
        this.fieldSelected.arithmeticProgression =
          this.itemFilter[0].arithmeticProgression;
        this.fieldSelected.itemID = this.itemFilter[0].itemID;
        this.fieldSelected.deliveryMethod = this.itemFilter[0].deliveryMethod;
        this.fieldSelected.isReturnSupplier =
          this.itemFilter[0].isReturnSupplier;
      }
    } else if (this.items.length > 0) {
      this.itemFilter = this.items;

      this.fieldSelected.quantityOrderMin = this.itemFilter[0].quantityOrderMin;
      this.fieldSelected.quantityOrderMax = this.itemFilter[0].quantityOrderMax;
      this.fieldSelected.arithmeticProgression =
        this.itemFilter[0].arithmeticProgression;
      this.fieldSelected.itemID = this.itemFilter[0].itemID;
      this.fieldSelected.deliveryMethod = this.itemFilter[0].deliveryMethod;
      this.fieldSelected.isReturnSupplier = this.itemFilter[0].isReturnSupplier;
    } else {
      this.fieldSelected.quantityOrderMin = "";
      this.fieldSelected.quantityOrderMax = "";
      this.fieldSelected.arithmeticProgression = "";
      this.fieldSelected.itemID = "";
      this.fieldSelected.deliveryMethod = "";
      this.fieldSelected.isReturnSupplier = "";
    }

    this.refresh();
  };

  handleChange = () => {
    let lstItem = [
      {
        quantityOrderMin: this.fieldSelected.arithmeticProgression,
        quantityOrderMax: this.fieldSelected.quantityOrderMax,
        arithmeticProgression: this.fieldSelected.arithmeticProgression,
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
        this.props.updateItemOrder(lstItem);
      }
    } else {
      this.props.updateItemOrder(lstItem);
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
            {/* <div className='col-md-3'>
									<div className="form-group">
										<label className="w100pc">Return supplier:</label>
										<input
											type="text"
											autoComplete="off"
											className="form-control"
											name="wholesalePrice"
											value={this.fieldSelected.costPrice || ""}
											onChange={(e) => {
												var pattern = new RegExp(/^[1-9]\d*$/);

												if (e.target.value && !pattern.test(e.target.value)) {
													return;
												}

												this.handleChangeFieldCustom("costPrice", e.target.value, this.props.changeField('costPrice', e? e.target.value: ''));
											}}
										
										/>
									</div>
								</div> */}
            {/* <div className='col-md-3'>
									<div className="form-group">
										<label className="w100pc">Delivery method:</label>
										<input
											type="text"
											autoComplete="off"
											className="form-control"
											name="wholesalePrice"
											value={this.fieldSelected.costPrice || ""}
											onChange={(e) => {
												var pattern = new RegExp(/^[1-9]\d*$/);

												if (e.target.value && !pattern.test(e.target.value)) {
													return;
												}

												this.handleChangeFieldCustom("costPrice", e.target.value, this.props.changeField('costPrice', e? e.target.value: ''));
											}}
										
										/>
									</div>
								</div> */}
            {/* <div className='col-md-3'>
							<div className="form-group">
								<label className="w100pc">Qty order min:</label>
								<input
									type="text"
									autoComplete="off"
									className="form-control"
									name="wholesalePrice"
									value={this.fieldSelected.quantityOrderMin || 0}
									onChange={(e) => {
										var pattern = new RegExp(/^\d*\.?\d*$/);

										if (e.target.value && !pattern.test(e.target.value)) {
											return;
										}

										this.handleChangeFieldCustom("quantityOrderMin", e.target.value);
									}}

								/>
							</div>
						</div> */}
            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Qty order max:</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control"
                  name="wholesalePrice"
                  value={this.fieldSelected.quantityOrderMax || 0}
                  onChange={(e) => {
                    var pattern = new RegExp(/^\d*\.?\d*$/);

                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }

                    this.handleChangeFieldCustom(
                      "quantityOrderMax",
                      e.target.value,
                    );
                  }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">MOQ:</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control"
                  name="wholesalePrice"
                  value={this.fieldSelected.arithmeticProgression || 0}
                  onChange={(e) => {
                    var pattern = new RegExp(/^[0-9]\d*$/);

                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }

                    this.handleChangeFieldCustom(
                      "arithmeticProgression",
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

export default ItemOrder;
