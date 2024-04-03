import { Tag } from "antd";
import CONSTANT from "constant";
import moment from "moment";
import React from "react";
const CustomerServiceSMSLog = {
  columns: () => {
    return [
      {
        title: "Message",
        dataIndex: "message",
        key: "message",
        width: 500,
      },

      {
        title: "Send status",
        dataIndex: "response",
        key: "description",
        width: 60,
        render: (value) => {
          return value?.status?.toString() === "00" ? (
            <Tag color="green">{value?.description}</Tag>
          ) : (
            <Tag color="red">{value?.description}</Tag>
          );
        },
      },
      {
        title: "Send date",
        dataIndex: "createdDate",
        key: "createdDate",
        width: 80,
        render: (value) => {
          return value
            ? moment(value).format("HH:mm:ss - " + CONSTANT.FORMAT_DATE_IN_USE)
            : "-";
        },
      },
      // {
      //   title: 'Actions',
      //   dataIndex: 'actions',
      //   key: 'actions',
      //   render: (value, record) => {
      //     return (
      //       <Tag
      //         onClick={() => {
      //           navigator.clipboard.writeText('olala');
      //         }}
      //         color="green"
      //       >
      //         Copy message
      //       </Tag>
      //     );
      //   },
      // },
    ];
  },
};
export default CustomerServiceSMSLog;
