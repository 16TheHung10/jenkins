import { Col, Row } from "antd";
import BaseComponent from "components/BaseComponent";
import { createDataTable } from "helpers/FuncHelper";
import StringHelper from "helpers/StringHelper";
import React from "react";
import TableCustom from "utils/tableCustom";

export default class TableCurrentInventoryByItem extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = "listDetail" + StringHelper.randomKey();
    this.items = [];
    this.fieldSelected = "";
    this.itemReport = {
      totalItem: 0,
      totalOpenStock: 0,
      totalRcvQty: 0,
      totalSaleQty: 0,
      totalDeliveryQty: 0,
      totalSOH: 0,
    };
    this.page = 1;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }
    if (newProps.fieldSelected !== this.fieldSelected) {
      this.fieldSelected = newProps.fieldSelected;
    }
    if (newProps.itemReport !== this.itemReport) {
      this.itemReport = newProps.itemReport;
    }

    this.page = 1;
    this.refresh();
  };

  handleHighlight = (qty) => {
    if (qty < 0) {
      return "cl-red";
    }
    return "";
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  highLightText = (txt) => {
    if (txt === "A") {
      return "hl-red";
    } else if (txt === "B") {
      return "hl-yellow";
    } else {
      return "";
    }
  };

  render() {
    const items = this.items;

    let columns = [
      {
        field: "storeCode",
        label: "Store",
        classHead: "fs-10 border-none",
        styleHead: {},
        colSpanHead: "2",
        classBody: "fs-10",
        styleBody: { background: "aliceblue" },
      },
      {
        field: "storeName",
        label: "",
        classHead: "border-none",
        styleHead: {},
        colSpanHead: "0",
        classBody: "fs-10",
        styleBody: { background: "aliceblue" },
      },
      {
        field: "categoryCode",
        label: "Category",
        classHead: "fs-10 border-none",
        styleHead: {},
        colSpanHead: "2",
        classBody: "fs-10",
        styleBody: { background: "ivory" },
      },
      {
        field: "categoryName",
        label: "Category",
        classHead: "fs-10 border-none",
        styleHead: {},
        colSpanHead: "0",
        classBody: "fs-10",
        styleBody: { background: "ivory" },
      },
      {
        field: "itemCode",
        label: "Item",
        classHead: "border-none",
        styleHead: {},
        colSpanHead: "2",
        classBody: "fs-10",
        styleBody: { background: "aliceblue" },
      },
      {
        field: "itemName",
        label: "",
        classHead: "border-none",
        styleHead: {},
        colSpanHead: "0",
        classBody: "fs-10",
        styleBody: { background: "aliceblue" },
      },
      {
        field: "openQty",
        label: "Open stock",
        classHead: "border-none text-right",
        styleHead: {},
        classBody: "fs-10 text-right",
        styleBody: { background: "ivory" },
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: "rcvQty",
        label: "RCV qty",
        classHead: "border-none text-right",
        styleHead: {},
        classBody: "fs-10 text-right",
        styleBody: { background: "aliceblue" },
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: "saleQty",
        label: "Sale qty",
        classHead: "border-none text-right",
        styleHead: {},
        classBody: "fs-10 text-right",
        styleBody: { background: "ivory" },
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: "deliveryQty",
        label: "Delivery qty",
        classHead: "border-none text-right text-right",
        styleHead: {},
        classBody: "fs-10 text-right",
        styleBody: { background: "aliceblue" },
        formatBody: (val) => StringHelper.formatValue(val),
      },
      {
        field: "soh",
        label: "SOH",
        classHead: "border-none text-right",
        styleHead: {},
        classBody: "fs-10 text-right",
        styleBody: { background: "ivory" },
        formatBody: (val) => StringHelper.formatValue(val),
      },
    ];

    const data = createDataTable(items, columns).sort((a, b) =>
      a.storeCode >= b.storeCode ? 1 : -1,
    );

    let totalFooterTable = {
      openQty: 0,
      rcvQty: 0,
      saleQty: 0,
      deliveryQty: 0,
      soh: 0,
    };

    return (
      <Row gutter={16}>
        <Col xl={24}>
          <div className="section-block">
            <Row gutter={16}>
              <Col xl={24}>
                <TableCustom
                  data={data}
                  columns={columns}
                  fullWidth={false}
                  sumFooter={totalFooterTable}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}
