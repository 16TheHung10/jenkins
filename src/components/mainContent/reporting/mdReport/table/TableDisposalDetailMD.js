import React, { Component, Fragment } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import { createListOption } from "helpers/FuncHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { handleExportAutoField } from "helpers/ExportHelper";

import { Col, Row } from "antd";
import SelectBox from "utils/selectBox";

export default class TableDisposalDetailMD extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listBillDetail" + StringHelper.randomKey();
    this.sumDisposalDetail = {
      saleQty: 0,
      grossSales: 0,
      disposalQty: 0,
      disposalPrice: 0,
    };

    this.fieldSelected.divisionCode = "";
  }

  handleSortTime = (data) => {
    let lstSort = {};
    let newArr = Object.values(data).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    for (let i in newArr) {
      let el = newArr[i];
      lstSort[el.divisionCode.toString().trim()] = el;
    }

    return lstSort;
  };

  // renderContextMenu = () => {
  // 	return (
  //         <div className="context menu">
  //             <ul className="menu-options">
  // 				<li className="menu-option" onClick={ (e) => this.props.checkBill($(this.getCurrentTarget()).attr('data-itemid')) }>
  // 					<i><FontAwesomeIcon icon={faCheck}/></i>Bill detail</li>
  //             </ul>
  //         </div>
  //     )
  // }

  // componentDidMount() {
  // 	this.handleRightClick(this.idComponent);
  // }

  handleSum = (obj) => {
    let newObj = {
      saleQty: 0,
      grossSales: 0,
      disposalQty: 0,
      disposalPrice: 0,
    };
    for (let key in obj) {
      let item = obj[key];

      newObj.saleQty += item.saleQty;
      newObj.grossSales += item.grossSales;
      newObj.disposalQty += item.disposalQty;
      newObj.disposalPrice += item.disposalPrice;
    }

    return newObj;
  };

  handleFilter = (arr) => {
    let newArr = arr.sort((a, b) => {
      let keyA1 = a.divisionCode;
      let keyB1 = b.divisionCode;

      let keyA2 = new Date(a.date);
      let keyB2 = new Date(b.date);

      if (keyA1 < keyB1) return -1;
      if (keyA1 > keyB1) return 1;
      if (keyA2 < keyB2) return -1;
      if (keyA2 > keyB2) return 1;
      return 0;
    });

    newArr =
      this.fieldSelected.divisionCode !== ""
        ? newArr.filter(
            (el) => el.divisionCode === this.fieldSelected.divisionCode,
          )
        : newArr;

    return newArr;
  };

  showHideRowName = (lst, item, key, index) => {
    let isShow = true;

    if (lst[index - 1] && item[key] === lst[index - 1][key]) {
      return false;
    }

    return isShow;
  };

  showHideRowNum = (lst, item, key, key2, index) => {
    let isShow = true;

    if (
      lst[index - 1] &&
      item[key] === lst[index - 1][key] &&
      item[key2] === lst[index - 1][key2]
    ) {
      return false;
    }

    return isShow;
  };

  showHideLabel = (lst, item, key, index) => {
    let label = item[key];

    if (lst[index - 1] && label === lst[index - 1][key]) {
      return "";
    }

    if (typeof label === "number") {
      label = StringHelper.formatValue(label);
    }

    return label;
  };

  countRowSpanName = (lst, key, value) => {
    let count = 0;

    for (let k in lst) {
      let item = lst[k];
      if (item[key] == value) {
        count++;
      }
    }

    return count;
  };

  countRowSpanNum = (lst, key, value, key2, value2) => {
    let count = 0;

    for (let k in lst) {
      let item = lst[k];
      if (item[key] == value) {
        if (item[key2] == value2) {
          count++;
        }
      }
    }

    return count;
  };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.refresh();
    }
  };

  render() {
    const fields = this.fieldSelected;
    let optDivision =
      createListOption(this.props.items, "divisionCode", "divisionName").sort(
        (a, b) => a.value - b.value,
      ) || [];

    let items = this.handleFilter(this.props.items);
    let obj = this.handleSortTime(this.props.data) || {};

    this.sumDisposalDetail = this.handleSum(obj);

    return (
      <section id={this.idComponent}>
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={19}>
                  <Row gutter={16}>
                    <Col xl={8}>
                      <label htmlFor="divisionCode" className="w100pc">
                        Division:
                        <SelectBox
                          data={optDivision}
                          func={this.updateFilter}
                          keyField={"divisionCode"}
                          defaultValue={fields.divisionCode}
                          isMode={""}
                        />
                      </label>
                    </Col>
                    <Col xl={8}>
                      <label htmlFor="methodcode" className="w100pc">
                        &nbsp;
                      </label>
                      <button
                        onClick={() =>
                          handleExportAutoField(items, "reportdisposalexport")
                        }
                        type="button"
                        className="btn btn-danger h-30"
                      >
                        Export filter
                      </button>
                    </Col>
                  </Row>
                </Col>
                <Col xl={5}></Col>
              </Row>
            </div>
          </Col>
        </Row>
        {/* <div className='row mrb-10'>
                    <div className="col-md-2">
                        <label htmlFor="divisionCode" className="w100pc">
                            Division:
                        </label>
                        <Select
                            isClearable
                            classNamePrefix="select"
                            name="divisionCode"
                            maxMenuHeight={260}
                            placeholder="--"
                            value={optDivision.filter((option) => option.value === this.fieldSelected.divisionCode)}
                            options={optDivision}
                            onChange={(e) => this.handleChangeFieldCustom("divisionCode", e ? e.value : "")}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="methodcode" className="w100pc" style={{ opacity: 0 }}>.</label>
                        <button

                            onClick={() => handleExportAutoField(items, "reportdisposalexport")}
                            type="button"
                            className="btn btn-danger"
                            style={{ height: "38px", marginRight: 0 }}
                        >
                            Export filter
                        </button>
                    </div>

                </div> */}
        <div className="wrap-tb table-chart mrt-10">
          <table
            className={
              "table table-hover " + (Object.keys(obj).length > 0 && "mH-370")
            }
            style={{
              maxHeight: "calc(100vh - 183px)",
              overflow: "auto",
              display: "block",
            }}
          >
            <thead>
              <tr>
                <th rowSpan={2}>Division</th>
                <th colSpan={2} className="text-center">
                  Total Sale<span className="line-cyan"></span>
                </th>
                <th colSpan={2} className="text-center">
                  Total Disposal<span className="line-orange"></span>
                </th>
                <th rowSpan={2}>Category</th>
                <th rowSpan={2}>Item</th>
                <th rowSpan={2}></th>
                <th colSpan={2} className="text-center">
                  Sale<span className="line-cyan"></span>
                </th>
                <th colSpan={2} className="text-center">
                  Disposal<span className="line-orange"></span>
                </th>
                <th rowSpan={2} className="rule-date">
                  Date
                </th>
              </tr>

              <tr>
                <th className="text-center">qty</th>
                <th className="text-center">price</th>
                <th className="text-center">qty</th>
                <th className="text-center">price</th>
                <th className="text-center">qty</th>
                <th className="text-center">price</th>
                <th className="text-center">qty</th>
                <th className="text-center">price</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 &&
                items.map((item, index) => (
                  <tr key={item.barcode}>
                    {this.showHideRowName(
                      items,
                      item,
                      "divisionName",
                      index,
                    ) && (
                      <td
                        rowSpan={this.countRowSpanName(
                          items,
                          "divisionName",
                          item.divisionName,
                        )}
                        className={"bg-beige"}
                        style={{
                          verticalAlign: "top",
                          position: "sticky",
                          top: 50,
                        }}
                      >
                        {item.divisionCode} -{" "}
                        {this.showHideLabel(items, item, "divisionName", index)}
                      </td>
                    )}
                    {this.showHideRowNum(
                      items,
                      item,
                      "divisionName",
                      "totalsaleQty",
                      index,
                    ) && (
                      <td
                        rowSpan={this.countRowSpanNum(
                          items,
                          "divisionName",
                          item.divisionName,
                          "totalsaleQty",
                          item.totalsaleQty,
                        )}
                        className={"bg-beige"}
                        style={{
                          verticalAlign: "top",
                          position: "sticky",
                          top: 50,
                        }}
                      >
                        {this.showHideLabel(items, item, "totalsaleQty", index)}
                      </td>
                    )}

                    {this.showHideRowNum(
                      items,
                      item,
                      "divisionName",
                      "totalgrossSales",
                      index,
                    ) && (
                      <td
                        rowSpan={this.countRowSpanNum(
                          items,
                          "divisionName",
                          item.divisionName,
                          "totalgrossSales",
                          item.totalgrossSales,
                        )}
                        className={"bg-beige"}
                        style={{
                          verticalAlign: "top",
                          position: "sticky",
                          top: 50,
                        }}
                      >
                        {this.showHideLabel(
                          items,
                          item,
                          "totalgrossSales",
                          index,
                        )}
                      </td>
                    )}

                    {this.showHideRowNum(
                      items,
                      item,
                      "divisionName",
                      "totaldisposalQty",
                      index,
                    ) && (
                      <td
                        rowSpan={this.countRowSpanNum(
                          items,
                          "divisionName",
                          item.divisionName,
                          "totaldisposalQty",
                          item.totaldisposalQty,
                        )}
                        className={"bg-beige"}
                        style={{
                          verticalAlign: "top",
                          position: "sticky",
                          top: 50,
                        }}
                      >
                        {this.showHideLabel(
                          items,
                          item,
                          "totaldisposalQty",
                          index,
                        )}
                      </td>
                    )}

                    {this.showHideRowNum(
                      items,
                      item,
                      "divisionName",
                      "totaltotalSalePrice",
                      index,
                    ) && (
                      <td
                        rowSpan={this.countRowSpanNum(
                          items,
                          "divisionName",
                          item.divisionName,
                          "totaltotalSalePrice",
                          item.totaltotalSalePrice,
                        )}
                        className={"bg-beige"}
                        style={{
                          verticalAlign: "top",
                          position: "sticky",
                          top: 50,
                        }}
                      >
                        {this.showHideLabel(
                          items,
                          item,
                          "totaltotalSalePrice",
                          index,
                        )}
                      </td>
                    )}

                    {/* <td>{StringHelper.formatValue(item.totalsaleQty)}</td>
                                        <td>{StringHelper.formatValue(item.totalgrossSales)}</td>
                                        <td>{StringHelper.formatValue(item.totaldisposalQty)}</td>
                                        <td>{StringHelper.formatValue(item.totaltotalSalePrice)}</td> */}
                    <td>{item.categoryName}</td>
                    <td>{item.barcode}</td>
                    <td>
                      <span style={{ width: 200 }} className="d-inline-block">
                        {item.itemName}
                      </span>
                    </td>
                    <td
                      className="rule-number"
                      style={{ background: "aliceblue" }}
                    >
                      {StringHelper.formatValue(item.saleQty)}
                    </td>
                    <td className="rule-number" style={{ background: "ivory" }}>
                      {StringHelper.formatValue(item.grossSales)}
                    </td>
                    <td
                      className={
                        "rule-number " +
                        (item.disposalQty > item.saleQty ? "bg-yellow" : "")
                      }
                      style={{ background: "aliceblue" }}
                    >
                      {StringHelper.formatValue(item.disposalQty)}
                    </td>
                    <td className="rule-number" style={{ background: "ivory" }}>
                      {StringHelper.formatValue(item.totalSalePrice)}
                    </td>
                    <td
                      className="rule-date"
                      style={{ background: "aliceblue" }}
                    >
                      {DateHelper.displayDate(item.date)}
                    </td>
                  </tr>
                ))}

              {/* {
                                Object.keys(obj).length > 0 ? Object.keys(obj).map((elm,index)=>
                                    <Fragment key={"elm"+elm+index.toString()}>
                                        {
                                            Object.keys(obj[elm].categoryGroup).map((el,indexEl)=>
                                                <Fragment key={elm+"el"+el+indexEl.toString()}>
                                                    {
                                                        obj[elm].categoryGroup[el].details.sort(function(a, b) { return new Date(a.date) - new Date(b.date) }).map((item,indexItem) => 
                                                            <tr key={item.barcode+StringHelper.randomKey()}>
                                                                <td className={((indexItem === 0 && indexEl === 0) ? "" : 'brt-0')} >{(indexItem === 0 && indexEl === 0) ? obj[elm].divisionName : ""}</td>
                                                                <td className={'rule-number ' + ((indexItem === 0 && indexEl === 0) ? "" : 'brt-0')} style={{background:'aliceblue'}}>{(indexItem === 0 && indexEl === 0) ? StringHelper.formatValue(obj[elm].saleQty) : ""}</td>
                                                                <td className={'rule-number ' + ((indexItem === 0 && indexEl === 0) ? "" : 'brt-0')} style={{background:'ivory'}}>{(indexItem === 0 && indexEl === 0) ? StringHelper.formatPrice(obj[elm].grossSales) : ""}</td>
                                                                <td className={'rule-number ' + ((indexItem === 0 && indexEl === 0) ? "" : 'brt-0')} style={{background:'aliceblue'}}>{(indexItem === 0 && indexEl === 0) ? StringHelper.formatValue(obj[elm].disposalQty) : ""}</td>
                                                                <td className={'rule-number ' + ((indexItem === 0 && indexEl === 0) ? "" : 'brt-0')} style={{background:'ivory'}}>{(indexItem === 0 && indexEl === 0) ? StringHelper.formatPrice(obj[elm].disposalPrice) : ""}</td>

                                                                <td className={'' + (indexItem === 0 ? "" : 'brt-0')}>{indexItem === 0 ? obj[elm].categoryGroup[el].categoryName : ""}</td>

                                                                <td>{item.barcode}</td>
                                                                <td><span style={{width: 200}} className="d-inline-block">{item.itemName}</span></td>
                                                                <td className='rule-number' style={{background:'aliceblue'}}>{StringHelper.formatValue(item.saleQty)}</td>
                                                                <td className='rule-number' style={{background:'ivory'}}>{StringHelper.formatPrice(item.grossSales)}</td>
                                                                <td className={'rule-number ' + ((item.disposalQty > item.saleQty ) ? 'bg-yellow' : '')} style={{background:'aliceblue'}}>{StringHelper.formatValue(item.disposalQty)}</td>
                                                                <td className='rule-number' style={{background:'ivory'}}>{StringHelper.formatPrice(item.totalSalePrice)}</td>
                                                                <td className='rule-date' style={{background:'aliceblue'}}>{DateHelper.displayDate(item.date)}</td>
                                                            </tr>
                                                        )
                                                    }
                                                </Fragment>
                                            )
                                        }
                                    </Fragment>
                                ) : null
                            } */}
            </tbody>

            {Object.keys(obj).length > 0 ? (
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.sumDisposalDetail.saleQty)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.sumDisposalDetail.grossSales)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.sumDisposalDetail.disposalQty)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(
                      this.sumDisposalDetail.disposalPrice,
                    )}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  {/* <td className='rule-number'>{StringHelper.formatQty(this.sumDisposalDetail.saleQty)}</td>
                                    <td className='rule-number'>{StringHelper.formatQty(this.sumDisposalDetail.salePrice)}</td>
                                    <td className='rule-number'>{StringHelper.formatQty(this.sumDisposalDetail.disposalQty)}</td>
                                    <td className='rule-number'>{StringHelper.formatQty(this.sumDisposalDetail.disposalPrice)}</td> */}
                  <td></td>
                </tr>
              </tfoot>
            ) : null}
          </table>
          {Object.keys(obj).length === 0 ? (
            <div className="fs-12 table-message">Search ...</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}
