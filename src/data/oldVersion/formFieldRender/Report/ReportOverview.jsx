import React from "react";
import { Tag, Typography } from "antd";
import * as yup from "yup";
import { OptionsHelper } from "helpers";
import moment from "moment";

const ReportOverview = {
  columns: () => [
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: 400,
      render: (text) => text || "-",
      // sorter: (a, b) => a.promotionCode?.localeCompare(b.promotionCode),
    },
    {
      title: "Phone	",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "-",
      // sorter: (a, b) => a.fromDate?.localeCompare(b.fromDate),
    },

    {
      title: "Created date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) =>
        text ? moment(new Date(text)).format("DD/MM/YYYY HH:mm") : "-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Status",
      dataIndex: "response",
      key: "response",
      render: (value, record) => {
        return value.status === "00" ? (
          <Tag color="green">Success</Tag>
        ) : (
          <Tag color="red">Fail</Tag>
        );
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
  ],
};
export default ReportOverview;
