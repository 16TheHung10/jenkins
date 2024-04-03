import React from "react";
import { Button, Tag, Typography } from "antd";
import * as yup from "yup";
import { OptionsHelper } from "helpers";
import moment from "moment";
import CONSTANT from "constant";
import Icons from "images/icons";

const StaffOverview = {
  columns: () => [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      key: "staffCode",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.staffCode.localeCompare(b.staffCode),
    },
    {
      title: "Name",
      dataIndex: "staffName",
      key: "staffName",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.staffName.localeCompare(b.staffName),
    },
    {
      title: "Store",
      dataIndex: "storeCode",
      key: "storeCode",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.storeCode.localeCompare(b.storeCode),
    },
    {
      title: "Position",
      dataIndex: "positionName",
      key: "positionName",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.positionName.localeCompare(b.positionName),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (text === 1 ? "Resignation" : "Working"),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Start Date",
      dataIndex: "startDay",
      key: "startDay",
      render: (text) => (text ? moment(text).format("DD/MM/YYYY") : "-"),
      sorter: (a, b) => a.startDay.localeCompare(b.startDay),
    },
  ],
};
export default StaffOverview;
