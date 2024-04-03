import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import React from "react";

export const GoldenTimeAddNewDiscountItemTableData = {
  th: ({ onRemoveItem, onEditItem, disabledEdit }) => [
    {
      field: "Item",
      props: {},
    },
    {
      field: "Discount",
    },

    {
      field: "Actions",
      props: {
        width: 100,
        render: (_, record, index) => {
          return (
            <>
              {disabledEdit ? null : (
                <div className="flex " style={{ gap: "5px", fontSize: "20px" }}>
                  <EditOutlined
                    onClick={() => onEditItem(record, index)}
                    className="color-primary cursor_pointer"
                  />
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
                </div>
              )}
            </>
          );
        },
      },
    },
  ],

  rowKey: {
    itemID: "itemCode-itemName",
    discountAmount: "discountAmount",
  },
};
