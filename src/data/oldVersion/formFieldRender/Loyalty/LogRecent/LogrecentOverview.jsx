import React from "react";
import { Tag, Typography } from "antd";
import * as yup from "yup";
import { OptionsHelper } from "helpers";
import moment from "moment";
import CONSTANT from "constant";

const LogrecentOverview = {
  fieldInputsFilter: ({
    paymentOptions,
    itemOptions,
    invoiceCodeOptions,
    eventOptions,
  }) => [
    {
      name: "paymentResponse",
      label: "Payment method",
      type: "select",
      options: paymentOptions,
      placeholder: "--Payment method--",
      span: 4,
    },
    {
      name: "invoiceCodeFilter",
      label: "Invoice Code",
      type: "select",
      placeholder: "--Created by--",
      options: invoiceCodeOptions,
      span: 4,
    },
    {
      name: "originalEventName",
      label: "Event",
      type: "select",
      placeholder: "--Event--",
      options: eventOptions,
      span: 4,
    },
    {
      name: "itemCodeGroup",
      label: "Item code",
      type: "select",
      placeholder: "--Item--",
      options: itemOptions,
      span: 4,
    },
  ],
  columns: () => [
    {
      title: "Invoice Code",
      width: 400,
      dataIndex: "invoiceCode",
      key: "invoiceCode",
      render: (text) => <a>{text}</a>,
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Event name",
      dataIndex: "eventName",
      key: "eventName",
      // sorter: (a, b) => a.promotionCode?.localeCompare(b.promotionCode),
    },
    {
      title: "Point",
      dataIndex: "transactionPoint",
      key: "transactionPoint",
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      children: [
        {
          title: "Item code",
          dataIndex: "ItemCode",
          key: "ItemCode",
          render: (value, record) => {
            return value ? value : "-";
          },
        },
        {
          title: "Item name",
          dataIndex: "itemName",
          key: "itemName",
          render: (value) => {
            return value ? value : "-";
          },
        },
        {
          title: "Item nameQty",
          dataIndex: "Qty",
          key: "Qty",
          render: (value) => {
            return value ? value : "-";
          },
        },
        {
          title: "SalePrice",
          dataIndex: "SalePrice",
          key: "SalePrice",
          render: (value) => {
            return value ? value : "-";
          },
        },
      ],
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Create date",
      dataIndex: "createDate",
      key: "createDate",
      render: (value) => {
        return (
          <span style={{ color: "var(--primary-color" }}>
            {moment(value).format(CONSTANT.FORMAT_DATE_IN_USE)}
          </span>
        );
      },
    },
    {
      title: "Create by",
      dataIndex: "createdBy",
      key: "createdBy",
      // sorter: (a, b) => a.toDate?.localeCompare(b.toDate),
    },
  ],
};
export default LogrecentOverview;
