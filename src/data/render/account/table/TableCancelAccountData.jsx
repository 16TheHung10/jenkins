import { Popconfirm, Popover, Tag } from "antd";
import moment from "moment";
import React from "react";
import Icons from "images/icons";
import BaseButton from "components/common/buttons/baseButton/BaseButton";

const TableCancelAccountData = {
  columns: ({ onApproveCancelAccount }) => [
    {
      title: "Member",
      dataIndex: "memberCode",
      key: "memberCode",
      width: 150,
      render: (text, record) => {
        const { firstName, lastName } = record;
        return Boolean(text) ? (
          <p className="m-0 flex flex-col items-start">
            <b className="font-bold">{firstName + " " + lastName}</b>
            <span className="hint">{text}</span>
          </p>
        ) : null;
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Mem.phone",
      dataIndex: "phone",
      key: "phone",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionCode?.localeCompare(b.promotionCode),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionCode?.localeCompare(b.promotionCode),
    },
    {
      title: "Status",
      dataIndex: "deleted",
      key: "deleted",
      width: 100,
      render: (value, record) => {
        return value === 1 ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="orange">Processing</Tag>
        );
      },
    },

    {
      title: "Request date",
      dataIndex: "requestDate",
      key: "requestDate",
      width: 120,
      render: (value) => {
        return moment(value).utc().format("DD-MM-YYYY HH:mm");
      },
      // sorter: (a, b) => a.fromDate?.localeCompare(b.fromDate),
    },
    // {
    //   title: "Created by",
    //   dataIndex: "createdBy",
    //   key: "createdBy",
    //   width: 120,
    //   render: (value, record) => {
    //     const createdDate = record.createdDate;
    //     return (
    //       <div className="m-0">
    //         <b className="color-primary">{value}</b>
    //         <p className="hint m-0">
    //           {" "}
    //           at {moment(createdDate).utc().format("DD-MM-YYYY HH:mm")}
    //         </p>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "Updated by",
    //   dataIndex: "updatedBy",
    //   key: "updatedBy",
    //   width: 120,
    //   render: (value, record) => {
    //     const updatedDate = record.updatedDate;
    //     return (
    //       <div className="m-0">
    //         <b className="color-primary">{value}</b>
    //         <p className="hint m-0">
    //           {" "}
    //           at {moment(updatedDate).utc().format("DD-MM-YYYY HH:mm")}
    //         </p>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 120,
      render: (value, record, index) => {
        const { memberCode, reason, updatedDate } = record;
        if (record.deleted) {
          return moment(updatedDate).utc().format("DD-MM-YYYY HH:mm");
        }
        return (
          <Popconfirm
            title="Are you sure?"
            okText="Approve"
            onConfirm={() => {
              onApproveCancelAccount(record, index);
            }}
          >
            <BaseButton iconName="tick" color="green">
              Approve
            </BaseButton>
          </Popconfirm>
        );
      },
    },
  ],
};
export default TableCancelAccountData;
