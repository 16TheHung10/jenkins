//Plugin
import React from "react";
import Select from "react-select";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper } from "helpers";

export default class TableBuyItemGetItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.dataTable = this.props.dataTable || {};

    this.dataSelect = [];
    this.dataItemCodeSelect = [];
    this.dataItemNameSelect = [];

    this.fieldSelected = this.assignFieldSelected({
      promotionBIGI: "",
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
      for (let i = 0; i < elm.groupItem.length; i++) {
        let target = elm.groupItem[i];
        arrBarcode.indexOf(target.itemCode) === -1 &&
          arrBarcode.push(target.itemCode);
        arrItemName.indexOf(target.itemName) === -1 &&
          arrItemName.push(target.itemName);
      }
    });
    let stringArrBarcode = arrBarcode.toString();
    let stringArrItemName = arrItemName.toString();

    let x = document.getElementsByClassName("tb-row-bigi")[index];
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

        for (let i3 = 0; i3 < target2.groupItem.length; i3++) {
          let target3 = target2.groupItem[i3];
          arrkeyItemCode.indexOf(target3.itemCode) === -1 &&
            arrkeyItemCode.push(target3.itemCode);
          arrkeyItemName.indexOf(target3.itemName) === -1 &&
            arrkeyItemName.push(target3.itemName);
        }
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
    let x = document.getElementsByClassName("tb-row-bigi");
    let promSelect = this.fieldSelected.promotionBIGI;
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

  renderTableDetail = (target) => {
    let list = target[0].groupItem || [];
    let newList = [];
    let key = [];
    let objElm = {};

    list.map((item, index) => {
      if (key.indexOf(item.detailCode) === -1) {
        key.push(item.detailCode);

        objElm = {
          [item.detailCode]: {
            [item.method]: {
              itemCode: item.itemCode,
              itemName: item.itemName,
              qty: item.qty,
            },
          },
        };

        newList.push(objElm);
      } else {
        objElm = {
          itemCode: item.itemCode,
          itemName: item.itemName,
          qty: item.qty,
        };

        newList[key.indexOf(item.detailCode)][item.detailCode][item.method] =
          objElm;
      }
    });

    return (
      <>
        {newList.map((el, i) => (
          <React.Fragment key={i}>
            <div className="wrap-table mrt-10 pdlr-100">
              <h5>* {Object.keys(el)[0]}</h5>
              <table className="table table-hover bg-lightseagreen">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Item code</th>
                    <th>Item name</th>
                    <th className="rule-number">Qty</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Buy</td>
                    <td>{newList[i][Object.keys(el)[0]]["Buy"].itemCode}</td>
                    <td>{newList[i][Object.keys(el)[0]]["Buy"].itemName}</td>
                    <td className="rule-number">
                      {newList[i][Object.keys(el)[0]]["Buy"].qty}
                    </td>
                  </tr>
                  <tr>
                    <td>Get</td>
                    <td>{newList[i][Object.keys(el)[0]]["Get"].itemCode}</td>
                    <td>{newList[i][Object.keys(el)[0]]["Get"].itemName}</td>
                    <td className="rule-number">
                      {newList[i][Object.keys(el)[0]]["Get"].qty}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </React.Fragment>
        ))}
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
            <h3>Buy item get item</h3>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Select
                isClearable
                isMulti
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- Promotion --"
                value={promotionOption.filter(
                  (option) => fields.promotionBIGI === option.value,
                )}
                options={promotionOption}
                onChange={(e) =>
                  this.handleChangeFieldCustom(
                    "promotionBIGI",
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
            className="row mrt-10 tb-row-bigi"
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
