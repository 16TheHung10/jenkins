import BaseComponent from "components/BaseComponent";
import Paging from "external/control/pagination";
import { handleExportAutoField } from "helpers/ExportHelper";
import { createListOption, createDataTable } from "helpers/FuncHelper";
import StringHelper from "helpers/StringHelper";
import React from "react";

import { Col, Row } from "antd";
import SelectboxAndCheckbox from "utils/selectboxAndCheckbox";
import TableCustom from "utils/tableCustom";

export default class TableSalesByCategory extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listBillDetail" + StringHelper.randomKey();
    this.data = [];
    this.itemReport = {
      totalQty: 0,
      totalGrossSales: 0,
      totalNetSales: 0,
      totalItemDiscount: 0,
    };
    this.fieldSelected.barcode = "";
    this.fieldSelected.divisionCode = "";
    this.fieldSelected.categoryCode = "";
    this.fieldSelected.subCategoryCode = "";
    this.fieldSelected.storeCode = "";

    this.page = 1;
    this.isFilter = this.props.isFilter || false;
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
    if (newProps.isFilter !== this.isFilter) {
      this.isFilter = newProps.isFilter;
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
    this.itemReport.totalItemDiscount = 0;

    for (let k in arr) {
      let item = arr[k];

      this.itemReport.totalQty += parseFloat(item.itemQty) || 0;
      this.itemReport.totalGrossSales += parseFloat(item.grossSales) || 0;
      this.itemReport.totalNetSales += parseFloat(item.netSales) || 0;
      this.itemReport.totalItemDiscount += parseFloat(item.itemDiscount) || 0;
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

    let columns = [
      {
        field: "barcode",
        label: "Item",
        classHead: "fs-10",
        colSpanHead: 2,
        classBody: "fs-10",
        styleBody: { background: "ivory" },
      },
      {
        field: "itemName",
        label: "",
        classHead: "fs-10",
        colSpanHead: 0,
        classBody: "fs-10",
        styleBody: { background: "ivory" },
      },
      {
        field: "divisionCode",
        label: "Division",
        classHead: "fs-10",
        colSpanHead: 2,
        classBody: "fs-10",
        styleBody: { background: "aliceblue" },
      },
      {
        field: "divisionName",
        label: "",
        classHead: "fs-10",
        colSpanHead: 0,
        classBody: "fs-10",
        styleBody: { background: "aliceblue" },
      },
      {
        field: "categoryCode",
        label: "Category",
        classHead: "fs-10",
        colSpanHead: 2,
        classBody: "fs-10",
        styleBody: { background: "ivory" },
      },
      {
        field: "categoryName",
        label: "",
        classHead: "fs-10",
        colSpanHead: 0,
        classBody: "fs-10",
        styleBody: { background: "ivory" },
      },
      {
        field: "subCategoryCode",
        label: "Sub category",
        classHead: "fs-10",
        colSpanHead: 2,
        classBody: "fs-10",
        styleBody: { background: "aliceblue" },
      },
      {
        field: "subCategoryName",
        label: "",
        classHead: "fs-10",
        colSpanHead: 0,
        classBody: "fs-10",
        styleBody: { background: "aliceblue" },
      },
      {
        field: "itemQty",
        label: "Qty",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
        styleBody: { background: "#d3d3d373" },
        formatBody: (val) => StringHelper.formatQty(val),
      },
      {
        field: "itemDiscount",
        label: "Item discount",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
        styleBody: { background: "#d3d3d373" },
        formatBody: (val) => StringHelper.formatPrice(val),
      },
      {
        field: "grossSales",
        label: "Gross sales",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
        styleBody: { background: "#d3d3d373" },
        formatBody: (val) => StringHelper.formatPrice(val),
      },
      {
        field: "netSales",
        label: "Net sales",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
        styleBody: { background: "#d3d3d373" },
        formatBody: (val) => StringHelper.formatPrice(val),
      },
    ];

    if (this.type === "md") {
      columns.push({
        field: "avgCost",
        label: "AVG cost",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
        styleBody: {},
        formatBody: (val) => StringHelper.formatPrice(val),
      });
    }

    let results = createDataTable(data, columns);

    let totalFooterTable = {
      itemQty: 0,
      itemDiscount: 0,
      grossSales: 0,
      netSales: 0,
    };

    if (this.type === "md") {
      totalFooterTable.avgCost = 0;
    }

    return (
      <section id={this.idComponent}>
        {this.isFilter && (
          <Row gutter={16} className="mrt-10">
            <Col span={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={19}>
                    <Row gutter={16}>
                      <Col xl={6}>
                        <label htmlFor="storeCode" className="w100pc">
                          Division:
                          <SelectboxAndCheckbox
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
                          <SelectboxAndCheckbox
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
                          Sub category:
                          <SelectboxAndCheckbox
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
                          <SelectboxAndCheckbox
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
                          data,
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

        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <TableCustom
              data={results}
              columns={columns}
              sumFooter={totalFooterTable}
            />
          </Col>
        </Row>
      </section>
    );
  }
}
