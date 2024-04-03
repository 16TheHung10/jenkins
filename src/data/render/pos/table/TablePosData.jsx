import { Tag } from "antd";
import moment from "moment";
import React from "react";
import ReactJson from "react-json-view";
const cleanedString = (string) => {
  const res = string
    .replace(/\r\n/g, "")
    .replace(/\n/g, "")
    .replace(/\t/g, "")
    .replace(/\\/g, "")
    .replace(/^"|"$/g, "");
  console.log({ res });
  return res;
};
const TablePosData = {
  columns: () => [
    {
      title: "Invoice ID",
      dataIndex: "invoiceID",
      key: "invoiceID",
      render: (text) => (text ? text : "-"),
      width: 150,
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 100,
      render: (text) => (text ? text : "-"),
      // sorter: (a, b) => a.promotionCode?.localeCompare(b.promotionCode),
    },
    {
      title: "Request",
      dataIndex: "request",
      key: "request",
      render: (text) => {
        return (
          <span style={{ maxWidth: "490px", wordBreak: "break-all" }}>
            {text}
          </span>
        );
      },
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
      render: (text) => {
        return (
          <span style={{ maxWidth: "490px", wordBreak: "break-all" }}>
            {text}
          </span>
        );
      },
      onCell: () => {
        return {
          style: {
            maxWidth: "490px",
            wordBreak: "break-all",
            maxHeight: "100px",
            height: "100px",
            overflow: "auto",
            display: "block",
          },
        };
      },
    },
    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
      width: 150,
      render: (value) => {
        return moment(value).format("DD-MM-YYYY HH:mm:ss");
      },
    },
  ],
};
export default TablePosData;
