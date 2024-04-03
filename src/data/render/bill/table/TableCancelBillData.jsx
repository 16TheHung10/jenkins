import { Popover, Tag } from "antd";
import moment from "moment";
import React from "react";
import Icons from "images/icons";
import IconShowUserInfo from "components/common/userInfo/IconShowUserInfo";
import { StringHelper } from "helpers";

const TableCancelBillData = {
  columns: ({ onGetBillDetails }) => [
    {
      title: "Invoice code",
      dataIndex: "invoiceCode",
      key: "invoiceCode",
      width: 170,
      render: (text, record) => {
        return (
          (
            <div className="flex flex-col items-start">
              <p className="m-0 flex  items-center gap-10">
                <span style={{ fontWeight: 500 }}>{text}</span>
                <Icons.Edit
                  onClick={() => onGetBillDetails(record)}
                  style={{ color: "var(--primary-color)", cursor: "pointer" }}
                />
              </p>
              {record.storeCode ? (
                <p className="hint m-0">Store: {record.storeCode}</p>
              ) : null}
            </div>
          ) || +"-"
        );
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },

    {
      title: "Bill amount",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (value, record) => {
        if (value) {
          return (
            <div className="">
              <span>Total: {StringHelper.formatPrice(value)}</span>
              {record.payments?.map((item, index) => {
                return (
                  <p className="m-0 hint">
                    <span>{item.name}</span> :{" "}
                    <span>{StringHelper.formatPrice(item.amount)}</span>
                  </p>
                );
              })}
            </div>
          );
        }
        return "-";
      },
      // sorter: (a, b) => a.promotionCode?.localeCompare(b.promotionCode),
    },
    {
      title: "Status",
      dataIndex: "canceled",
      key: "canceled",
      width: 90,
      render: (value, record) => {
        const { isExpired } = record;
        return value === 1 ? (
          <Tag color="green">Approved </Tag>
        ) : isExpired ? (
          <Tag color="red">Expired</Tag>
        ) : (
          <Tag color="yellow">Processing</Tag>
        );
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (text, record) => {
        return (
          <div>
            <p className="m-0"> {text || +"-"}</p>
            {Boolean(record.approveNote) ? (
              <span className="hint">Approve note: {record.approveNote}</span>
            ) : null}
          </div>
        );
      },
      // sorter: (a, b) => a.toDate?.localeCompare(b.toDate),
    },

    {
      title: "Request by",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 150,
      render: (value, record) => {
        return (
          <div className="m-0">
            {record.requester ? (
              <p className="m-0 text-10">
                By <b className="color-primary">{record.requester}</b>
              </p>
            ) : null}
            <p className="hint m-0">
              at {moment(value).utc().format("DD-MM-YYYY HH:mm")}
            </p>
          </div>
        );
      },
      // sorter: (a, b) => a.fromDate?.localeCompare(b.fromDate),
    },

    {
      title: "Approve by",
      dataIndex: "updatedBy",
      key: "updatedBy",
      width: 120,
      render: (value, record) => {
        const createdDate = record.createdDate;

        return (
          <div className="m-0 ">
            {value ? (
              <p className="m-0 text-10">
                By <b className="color-primary"> {value}</b>
              </p>
            ) : record.isExpired ? (
              <p className="m-0" style={{ color: "#cf1322" }}>
                Expired
              </p>
            ) : (
              <p className="m-0" style={{ color: "#d4b106" }}>
                Waiting
              </p>
            )}
            {value ? (
              <p className="m-0 hint">
                at {moment(createdDate).utc().format("DD-MM-YYYY HH:mm")}
              </p>
            ) : null}
          </div>
        );
      },
    },
  ],
};
export default TableCancelBillData;
