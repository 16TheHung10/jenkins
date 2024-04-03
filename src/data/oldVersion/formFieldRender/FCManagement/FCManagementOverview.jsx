import React from "react";
import { Tag, Typography } from "antd";
import * as yup from "yup";
import { OptionsHelper } from "helpers";
import moment from "moment";

const FCManagementOverview = {
  columns: () => [
    {
      title: "Name",
      width: 400,
      dataIndex: "promotionName",
      key: "name",
      render: (text) => <a>{text}</a>,
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Code",
      dataIndex: "promotionCode",
      key: "promotionCode",
      // sorter: (a, b) => a.promotionCode?.localeCompare(b.promotionCode),
    },
    {
      title: "Type",
      dataIndex: "billPromotionType",
      key: "type",
      render: (value, record) => {
        return value === 1 ? (
          <Tag color="green">Buy</Tag>
        ) : (
          <Tag color="blue">Get</Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (value) => {
        return value === 1 ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">InActive</Tag>
        );
      },
    },
    {
      title: "Create date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (value) => {
        return moment(value).format("DD-MM-YYYY");
      },
    },
    {
      title: "From date",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (value) => {
        return moment(value).format("DD-MM-YYYY");
      },
      // sorter: (a, b) => a.fromDate?.localeCompare(b.fromDate),
    },
    {
      title: "To date",
      dataIndex: "toDate",
      key: "toDate",
      render: (value) => {
        return moment(value).format("DD-MM-YYYY");
      },
      // sorter: (a, b) => a.toDate?.localeCompare(b.toDate),
    },
  ],
};
export default FCManagementOverview;
