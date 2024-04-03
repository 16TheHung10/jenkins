import React, { Component } from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";

import { createListOption } from "helpers/FuncHelper";
import Paging from "external/control/pagination";
import { handleExportAutoField } from "helpers/ExportHelper";

import { Col, Row } from "antd";
import SelectBox from "utils/selectBox";

export default class TableSalesByCategoryMD extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listBillDetail" + StringHelper.randomKey();
    this.data = [];
    this.itemReport = {
      totalQty: 0,
      totalGrossSales: 0,
      totalNetSales: 0,
      totalUnitPrice: 0,
      totalItemDiscount: 0,
    };
    this.fieldSelected.barcode = "";
    this.fieldSelected.divisionCode = "";
    this.fieldSelected.categoryCode = "";
    this.fieldSelected.subCategoryCode = "";
    this.fieldSelected.storeCode = "";

    this.page = 1;
    this.type = this.props.type || "";
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.data !== this.data) {
      this.data = newProps.data;
    }
    if (newProps.type !== this.type) {
      this.type = newProps.type;
    }
    if (newProps.storeCode !== this.fieldSelected.storeCode) {
      this.fieldSelected.storeCode = newProps.storeCode;
    }

    this.refresh();
  };

  formatKeyDate = (dateKey) => {
    let newDate = "";
    if (dateKey) {
      newDate =
        dateKey.toString().slice(0, 4) +
        "-" +
        dateKey.toString().slice(4, 6) +
        "-" +
        dateKey.toString().slice(6, 8);
    }

    return newDate;
  };

  handleSumSaleByCate = (arr) => {
    this.itemReport.totalQty = 0;
    this.itemReport.totalGrossSales = 0;
    this.itemReport.totalNetSales = 0;
    // this.itemReport.totalUnitPrice = 0;
    this.itemReport.totalItemDiscount = 0;
    this.itemReport.totalCostAmt = 0;

    for (let k in arr) {
      let item = arr[k];

      this.itemReport.totalQty += parseFloat(item.itemQty) || 0;
      this.itemReport.totalGrossSales += parseFloat(item.grossSales) || 0;
      this.itemReport.totalNetSales += parseFloat(item.netSales) || 0;
      // this.itemReport.totalUnitPrice += (parseFloat(item.unitPrice) * parseFloat(item.itemQty) || 0);
      this.itemReport.totalItemDiscount += parseFloat(item.itemDiscount) || 0;
      this.itemReport.totalCostAmt +=
        parseFloat(item.costPrice) * parseFloat(item.itemQty) || 0;
    }
  };

  handleFilter = (lst) => {
    let arr = [];

    arr =
      this.fieldSelected.divisionCode !== ""
        ? lst.filter((a) => a.divisionCode === this.fieldSelected.divisionCode)
        : lst;
    arr =
      this.fieldSelected.categoryCode !== ""
        ? arr.filter((a) => a.categoryCode === this.fieldSelected.categoryCode)
        : arr;
    arr =
      this.fieldSelected.subCategoryCode !== ""
        ? arr.filter(
            (a) => a.subCategoryCode === this.fieldSelected.subCategoryCode,
          )
        : arr;
    arr =
      this.fieldSelected.barcode !== ""
        ? arr.filter((a) => a.barcode === this.fieldSelected.barcode)
        : arr;

    this.handleSumSaleByCate(arr);
    return arr;
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.refresh();
    }
  };

  handleDataExport = (arr) => {
    // let oldArr = [...arr] || [];
    let newArr = [...arr] || [];

    this.typeColExport = {};

    //         for (let key in oldArr) {
    //             let item = oldArr[key];
    //             let newCostAmount = parseFloat(item.costPrice) * parseFloat(item.itemQty);

    //             item.costAmt = newCostAmount;

    //             newArr.push(item);
    //         }
    // console.log(newArr)

    this.typeColExport.grossSales = "number";
    this.typeColExport.itemDiscount = "number";
    this.typeColExport.itemQty = "number";
    this.typeColExport.netSales = "number";
    this.typeColExport.totalCostPrice = "number";

    return newArr;
  };

  render() {
    let fields = this.fieldSelected;
    let data = this.handleFilter(this.data) || [];

    let itemsIndex =
      data.length > 1
        ? data.filter(
            (el, i) => i >= (this.page - 1) * 30 && i < this.page * 30,
          )
        : data;

    let optItem = createListOption(this.data, "barcode", "itemName");
    let optDivision = createListOption(
      this.data,
      "divisionCode",
      "divisionName",
    );
    let optCategory = createListOption(
      this.data,
      "categoryCode",
      "categoryName",
    );
    let optSubcategory = createListOption(
      this.data,
      "subCategoryCode",
      "subCategoryName",
    );

    return (
      <section id={this.idComponent}>
        {data.length > 0 && (
          <Row>
            <Col span={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={19}>
                    <Row gutter={16}>
                      <Col xl={6}>
                        <label htmlFor="storeCode" className="w100pc">
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
                      <Col xl={6}>
                        <label htmlFor="storeCode" className="w100pc">
                          Category:
                          <SelectBox
                            data={optCategory}
                            func={this.updateFilter}
                            keyField={"categoryCode"}
                            defaultValue={fields.categoryCode}
                            isMode={""}
                          />
                        </label>
                      </Col>
                      <Col xl={6}>
                        <label htmlFor="storeCode" className="w100pc">
                          Category:
                          <SelectBox
                            data={optSubcategory}
                            func={this.updateFilter}
                            keyField={"subCategoryCode"}
                            defaultValue={fields.subCategoryCode}
                            isMode={""}
                          />
                        </label>
                      </Col>
                      <Col xl={6}>
                        <label htmlFor="storeCode" className="w100pc">
                          Item:
                          <SelectBox
                            data={optItem}
                            func={this.updateFilter}
                            keyField={"barcode"}
                            defaultValue={fields.barcode}
                            isMode={""}
                          />
                        </label>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={5}>
                    <label className="w100pc op-0">.</label>
                    <button
                      onClick={() => {
                        handleExportAutoField(
                          this.handleDataExport(data),
                          "salebycategory",
                          ["sumQty"],
                          [
                            {
                              storeCode:
                                this.fieldSelected.storeCode !== ""
                                  ? this.fieldSelected.storeCode
                                  : "",
                            },
                          ],
                          this.typeColExport,
                        );
                        this.fieldSelected.storeCodeCateExport = "";
                        this.storeCodeCateExport = [];
                        this.refresh();
                      }}
                      type="button"
                      className="btn btn-danger h-30"
                    >
                      Export
                    </button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        )}

        <div
          className="wrap-tb table-chart mrt-10"
          style={{ maxHeight: "calc(100vh - 243px)", overflow: "auto" }}
        >
          {data.length > 0 ? (
            // <div className="row">
            <div className="col-md-12 text-right">
              <div style={{ display: "inline-block" }}>
                <Paging
                  page={this.page}
                  onClickPaging={this.handleClickPaging}
                  onClickSearch={() => console.log()}
                  itemCount={data.length}
                />
              </div>
            </div>
          ) : (
            // </div>
            ""
          )}
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Item</th>
                <th></th>
                <th>Division</th>
                <th></th>
                <th>Category</th>
                <th></th>
                <th>Sub category</th>
                <th></th>
                <th className="rule-number">Qty</th>
                <th className="rule-number">Item discount</th>
                {/* <th className="rule-number">Unit price</th> */}
                <th className="rule-number">Gross sales</th>
                <th className="rule-number">Net sales</th>
                {this.type === "md" && (
                  <th className="rule-number">Cost Amt</th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* {
                                itemsIndex.length === 0 ?
                                    <tr>
                                        <td colSpan={12} className="table-message">Item not found</td>
                                    </tr>
                                    : null
                            } */}
              {itemsIndex.length > 0 &&
                itemsIndex.map((item, index) => (
                  <tr key={index} data-group="itemGroup">
                    <td style={{ background: "ivory" }}>{item.barcode}</td>
                    <td style={{ background: "ivory" }}>{item.itemName}</td>
                    <td style={{ background: "aliceblue" }}>
                      {item.divisionCode}
                    </td>
                    <td style={{ background: "aliceblue" }}>
                      {item.divisionName}
                    </td>
                    <td style={{ background: "ivory" }}>{item.categoryCode}</td>
                    <td style={{ background: "ivory" }}>{item.categoryName}</td>
                    <td style={{ background: "aliceblue" }}>
                      {item.subCategoryCode}
                    </td>
                    <td style={{ background: "aliceblue" }}>
                      {item.subCategoryName}
                    </td>
                    <td className="rule-number">
                      {StringHelper.formatQty(item.itemQty)}
                    </td>
                    <td className="rule-number">
                      {StringHelper.formatQty(item.itemDiscount)}
                    </td>
                    {/* <td className="rule-number">{StringHelper.formatQty(parseFloat(item.unitPrice) * parseFloat(item.itemQty))}</td> */}
                    <td className="rule-number">
                      {StringHelper.formatPrice(item.grossSales)}
                    </td>
                    <td className="rule-number">
                      {StringHelper.formatPrice(item.netSales)}
                    </td>
                    {this.type === "md" && (
                      <td className="rule-number">
                        {StringHelper.formatPrice(item.totalCostPrice)}
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
            {itemsIndex.length !== 0 &&
            Object.keys(this.itemReport).length > 0 ? (
              <tfoot>
                <tr style={{ left: 0, bottom: 0 }}>
                  <td colSpan={8}>Total</td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.totalQty)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(this.itemReport.totalItemDiscount)}
                  </td>
                  {/* <td className="rule-number">{StringHelper.formatQty(this.itemReport.totalUnitPrice)}</td> */}
                  <td className="rule-number">
                    {StringHelper.formatPrice(this.itemReport.totalGrossSales)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(this.itemReport.totalNetSales)}
                  </td>
                  {this.type === "md" && <td className="rule-number"></td>}
                </tr>
              </tfoot>
            ) : null}
          </table>
          {itemsIndex.length === 0 ? (
            <div className="table-message">Item not found</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}
