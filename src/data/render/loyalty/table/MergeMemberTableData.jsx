import { Tag } from "antd";
import React from "react";

const MergeMemberTableData = {
  columns: () => [
    {
      title: "Name",
      width: 200,
      dataIndex: "promotionName",
      key: "name",
      render: (text, record) => {
        const { firstName, lastName } = record;
        if (!firstName && !lastName) return "";
        return `${firstName} ${lastName}`;
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => text || "-",
    },
    {
      title: "Total point",
      dataIndex: "totalPoint",
      key: "totalPoint",
      render: (text, record) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (value, record) => {
        if (record.delete !== 0) return <Tag color="red">Deleted</Tag>;
        return value === 1 ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        );
      },
    },
    {
      title: "Reason lock",
      dataIndex: "note",
      key: "note",
      width: 500,
      render: (text, record) => text || "-",
    },
  ],
};
export default MergeMemberTableData;
