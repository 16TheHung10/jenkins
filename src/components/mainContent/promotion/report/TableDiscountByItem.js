//Plugin
import React from "react";
import Select from "react-select";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper } from "helpers";

export default class TableDiscountByItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.dataTable = this.props.dataTable || {};

    this.dataSelect = [];
    this.dataItemCodeSelect = [];
    this.dataItemNameSelect = [];

    this.fieldSelected = this.assignFieldSelected({
      promotionDBI: "",
      itemCode: "",
      itemName: "",
    });

    this.isRender = true;
  }

  componentDidMount = () => {
    this.handleCreateSelectOption();

    Object.keys(this.dataTable).map((prom, index) => {
      this.handleAddAtrr(index, this.dataTable[prom]);
    });
  };

  handleAddAtrr = (index, data) => {
    let arrItemName = [];
    let arrBarcode = [];
    data.map((elm) => {
      arrBarcode.indexOf(elm.discount.itemCode) === -1 &&
        arrBarcode.push(elm.discount.itemCode);
      arrItemName.indexOf(elm.discount.itemName) === -1 &&
        arrItemName.push(elm.discount.itemName);
    });
    let stringArrBarcode = arrBarcode.toString();
    let stringArrItemName = arrItemName.toString();

    let x = document.getElementsByClassName("tb-row-dbi")[index];
    x.setAttribute("barcode", stringArrBarcode);
    x.setAttribute("itemname", stringArrItemName);
  };

  handleCreateSelectOption = () => {
    let arr = Object.keys(this.dataTable);
    let arrkeyItemCode = [];
    let arrkeyItemName = [];

    for (let i = 0; i < arr.length; i++) {
      let target = arr[i];

      let obj = {
        value: target,
        label: target,
      };

      this.dataSelect.push(obj);

      for (let i2 = 0; i2 < this.dataTable[target].length; i2++) {
        let target2 = this.dataTable[target][i2];

        arrkeyItemCode.indexOf(target2.discount.itemCode) === -1 &&
          arrkeyItemCode.push(target2.discount.itemCode);
        arrkeyItemName.indexOf(target2.discount.itemName) === -1 &&
          arrkeyItemName.push(target2.discount.itemName);
      }
    }

    for (let i = 0; i < arrkeyItemCode.length; i++) {
      let target = arrkeyItemCode[i];

      let obj = {
        value: target,
        label: target,
      };

      this.dataItemCodeSelect.push(obj);
    }

    for (let i = 0; i < arrkeyItemName.length; i++) {
      let target = arrkeyItemName[i];

      let obj = {
        value: target,
        label: target,
      };

      this.dataItemNameSelect.push(obj);
    }
  };

  hanldeFilter = () => {
    let x = document.getElementsByClassName("tb-row-dbi");
    let promSelect = this.fieldSelected.promotionDBI;
    let itemCodeSelect = this.fieldSelected.itemCode;
    let itemNameSelect = this.fieldSelected.itemName;

    for (let i = 0; i < x.length; i++) {
      x[i].style.display = "block";

      if (
        promSelect &&
        promSelect !== "" &&
        !promSelect.includes(x[i].getAttribute("code"))
      ) {
        x[i].style.display = "none";
      }

      if (
        itemCodeSelect &&
        itemCodeSelect !== "" &&
        !x[i].getAttribute("barcode").includes(itemCodeSelect)
      ) {
        x[i].style.display = "none";
      }

      if (
        itemNameSelect &&
        itemNameSelect !== "" &&
        !x[i].getAttribute("itemName").includes(itemNameSelect)
      ) {
        x[i].style.display = "none";
      }
    }

    this.refresh();
  };

  componentWillReceiveProps = (newProps) => {
    if (newProps && newProps.dataTable) {
      this.dataTable = newProps.dataTable;
      this.refresh();
    }
  };

  renderTablePublic = (target) => {
    let elm = target && target[0];

    return (
      <>
        <div className="wrap-table htable">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Promotion code</th>
                <th>Promotion name</th>
                <th className="rule-date">Start date</th>
                <th className="rule-date">End date</th>
                <th className="rule-date">Created date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{elm.promotionCode}</td>
                <td>{elm.promotionName}</td>
                <td className="rule-date">
                  {elm.startDate && DateHelper.displayDateTime(elm.startDate)}
                </td>
                <td className="rule-date">
                  {elm.endDate && DateHelper.displayDateTime(elm.endDate)}
                </td>
                <td className="rule-date">
                  {elm.createdDate &&
                    DateHelper.displayDateTime(elm.createdDate)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  };

  handleShowList = (e) => {};

  renderTableDetail = (target) => {
    let list = target || [];

    return (
      <>
        <div>
          {/* <button type="button" className="btn btn-success" style={{background: "black",float:"left"}} onClick={(e)=>this.handleShowList(e)}>
                        Show/Hide
                    </button> */}

          <div
            className="wrap-table mrt-10 htable pdlr-100"
            style={{ width: "auto", paddingRight: 100 }}
          >
            <table className="table table-hover bg-lightseagreen">
              <thead>
                <tr>
                  <th>Item code</th>
                  <th>Item name</th>
                  <th className="rule-number">Discount price</th>
                </tr>
              </thead>
              <tbody>
                {list.map((elm, index) => (
                  <tr key={index}>
                    <td>{elm.discount.itemCode}</td>
                    <td>{elm.discount.itemName}</td>
                    <td className="rule-number">
                      {StringHelper.formatPrice(elm.discount.discountPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  renderComp = () => {
    let fields = this.fieldSelected;
    let promotionOption = this.dataSelect || [];
    let itemNameOption = this.dataItemNameSelect || [];
    let itemCodeOption = this.dataItemCodeSelect || [];

    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <h3>Discount by item</h3>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Select
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- Promotion --"
                value={promotionOption.filter(
                  (option) => fields.promotionDBI === option.value,
                )}
                options={promotionOption}
                onChange={(e) =>
                  this.handleChangeFieldCustom(
                    "promotionDBI",
                    e ? e.value : "",
                    this.hanldeFilter,
                  )
                }
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Select
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- Barcode --"
                value={itemCodeOption.filter(
                  (option) => fields.itemCode === option.value,
                )}
                options={itemCodeOption}
                onChange={(e) =>
                  this.handleChangeFieldCustom(
                    "itemCode",
                    e ? e.value : "",
                    this.hanldeFilter,
                  )
                }
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Select
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- Item name --"
                value={itemNameOption.filter(
                  (option) => fields.itemName === option.value,
                )}
                options={itemNameOption}
                onChange={(e) =>
                  this.handleChangeFieldCustom(
                    "itemName",
                    e ? e.value : "",
                    this.hanldeFilter,
                  )
                }
              />
            </div>
          </div>
        </div>
        {Object.keys(this.dataTable).map((prom, index) => (
          <div
            className="row mrt-10 tb-row-dbi"
            key={index}
            code={prom}
            barcode=""
            itemname=""
          >
            <div className="col-md-12">
              <h4># {prom}</h4>
              {this.renderTablePublic(this.dataTable[prom])}
              {this.renderTableDetail(this.dataTable[prom])}
            </div>
          </div>
        ))}
      </>
    );
  };
}
