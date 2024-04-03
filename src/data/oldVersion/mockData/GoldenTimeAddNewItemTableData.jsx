import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Tag } from "antd";
import React from "react";

export const GoldenTimeAddNewItemTableData = {
  th: ({ onRemoveItem, disabled }) => [
    {
      field: "Item",
      props: {},
    },
    {
      field: "Quantity",
    },
    {
      field: "Type",
      props: {
        render: (_, record, index) => {
          return (
            <div className="flex " style={{ gap: "5px", fontSize: "20px" }}>
              {record?.type === "1" ? (
                <Tag color="green">GET</Tag>
              ) : (
                <Tag color="orange">BUY</Tag>
              )}
            </div>
          );
        },
      },
    },

    {
      field: "Actions",
      props: {
        width: 100,
        render: (_, record, index) => {
          return (
            <div className="flex " style={{ gap: "5px", fontSize: "20px" }}>
              {disabled ? null : (
                <Popconfirm
                  title="Delete the item"
                  description="Are you sure to delete this item?"
                  onConfirm={() => onRemoveItem(index)}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined className="color-danger cursor_pointer" />
                </Popconfirm>
              )}
            </div>
          );
        },
      },
    },
  ],

  rowKey: {
    itemID: "itemCode-itemName",
    qty: "qty",
    type: "type",
  },
};
