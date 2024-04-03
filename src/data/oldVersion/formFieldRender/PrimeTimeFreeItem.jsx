import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Space } from "antd";
import Image from "components/common/Image/Image";
import React from "react";

const PrimeTimeFreeItem = {
  columns: ({ onEdit, onRemove }) => [
    {
      title: "Item code",
      width: 200,
      dataIndex: "itemCode",
      key: "itemCode",
    },
    {
      title: "Item name",
      width: 400,
      dataIndex: "itemName",
      key: "itemName",
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
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
    },

    {
      title: "Actions",
      dataIndex: "action",
      key: "actions",
      render: (_, record, index) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => onEdit(record, index)}
            style={{ fontSize: 20 }}
            className="color-primary cursor_pointer"
          />

          <Popconfirm
            title="Delete the item"
            description="Are you sure to delete this item?"
            onConfirm={() => onRemove(index)}
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
export default PrimeTimeFreeItem;
