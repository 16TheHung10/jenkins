import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table } from "antd";
import React from "react";

export const SOHDashboardTableData = {
  th: () => [
    {
      field: " Item",
      props: {},
    },
    {
      field: "RCV Qty",
      props: {
        sorter: (a, b) => {
          return Number(a.srcQty) - Number(b.srcQty);
        },
      },
    },

    {
      field: "Sale Qty",
      props: {
        sorter: (a, b) => {
          return Number(a.saleQtyqty) - Number(b.saleQtyqty);
        },
      },
    },
    {
      field: "Delivery Qty",
      props: {
        sorter: (a, b) => {
          return Number(a.deliveryQty) - Number(b.deliveryQty);
        },
      },
    },
    {
      field: "Close Date",
      props: {
        sorter: (a, b) => a.closeDateKey.localCompare(b.closeDateKey),
      },
    },
    {
      field: "SOH",
      props: {
        sorter: (a, b) => {
          return Number(a.soh) - Number(b.soh);
        },
      },
    },
  ],

  rowKey: {
    itemCode: "itemCode",
    srcQty: "srcQty",
    saleQtyqty: "saleQtyqty",
    deliveryQty: "deliveryQty",
    closeDateKey: "closeDateKey",
    soh: "soh",
  },
};
