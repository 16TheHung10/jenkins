import React from "react";
import { Button, Tag, Typography } from "antd";
import * as yup from "yup";
import { OptionsHelper } from "helpers";
import moment from "moment";
import CONSTANT from "constant";
import Icons from "images/icons";

const CheckVoucherOverview = {
  columns: ({ onUnlock }) => [
    {
      title: "Voucher code",
      dataIndex: "voucherCode",
      key: "voucherCode",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Scan date",
      dataIndex: "scanDate",
      key: "scanDate",
      render: (text) =>
        text
          ? moment(new Date(text))
              .utc()
              .format("HH:mm - " + CONSTANT.FORMAT_DATE_IN_USE)
          : "-",
    },
    {
      title: "Bill code",
      dataIndex: "billCode",
      key: "billCode",
      render: (text) => {
        return text ? (
          <div className="items-center flex gap-10">
            {text}{" "}
            <Icons.EyeOpen
              className="scale-hover "
              style={{
                color: "var(--primary-color)",
                cursor: "pointer",
                fontSize: 16,
              }}
            />
          </div>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => {
        return record?.invoiceType === 4 ? (
          <Button
            onClick={() => onUnlock(record?.voucherCode)}
            className="flex items-center gap-10"
            style={{ flexDirection: "row-reverse" }}
            icon={
              <Icons.Lock className="" style={{ color: "red", fontSize: 16 }} />
            }
          >
            Unlock
          </Button>
        ) : null;
      },
    },
  ],
};
export default CheckVoucherOverview;
