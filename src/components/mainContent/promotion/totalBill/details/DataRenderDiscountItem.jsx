import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Space } from "antd";
import Image from "components/common/Image/Image";
import { OptionsHelper, StringHelper } from "helpers";
import moment from "moment";
import React from "react";
import * as yup from "yup";

const DataRenderDiscountItem = {
  fieldInputs: (stores) => [
    {
      name: "promotionName",
      label: "Promotion Name",
      placeholder: "Promotion name",
      labelClass: "required",
      type: "text",
      rules: yup.string().required(),
    },
    {
      name: "date",
      label: "Date",
      labelClass: "required",
      type: "date-range",
      rules: yup.array().required(),
      disabledDate: (current) => {
        return current && current < moment().endOf("day");
      },
      format: "DD/MM/YYYY",
      max: 100,
    },
    {
      name: "storeCode",
      label: "Store",
      labelClass: "required",
      type: "select",
      options: [
        ...OptionsHelper.convertDataToOptions(
          stores,
          "storeCode",
          "storeCode-storeName",
        ),
      ],
      filterOption: (input, option) => {
        return (option?.label?.toString().toLowerCase() ?? "").includes(
          input.toString().trim().toLowerCase(),
        );
      },
      mode: "multiple",
      maxTagCount: "responsive",
      placeholder: "--All--",
    },
  ],
  columns: ({ onDelete, onEdit }) => [
    {
      title: "Item Code",
      dataIndex: "itemCode",
      key: "itemCode",
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemCode",
    },
    {
      title: "Item image",
      dataIndex: "imageUrl",
      key: "itemImage",
      render: (value) => {
        return (
          <Image
            src={value ? value : "no-image"}
            style={{ height: "50px", aspectRatio: "16/9" }}
          />
        );
      },
    },
    {
      title: "Discount amount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (value) => StringHelper.formatPrice(value),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record, index) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => onEdit(record, index)}
            className="color-primary cursor_pointer"
          />
          <Popconfirm
            title="Delete the item"
            description="Are you sure to delete this item?"
            onConfirm={() => onDelete(index)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              style={{ fontSize: 20 }}
              className="color-danger cursor_pointer"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ],
};
export default DataRenderDiscountItem;
