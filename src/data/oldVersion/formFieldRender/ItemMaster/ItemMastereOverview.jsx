import React from "react";
import { Input, Select, Tag, Typography } from "antd";
import * as yup from "yup";
import { OptionsHelper } from "helpers";
import moment from "moment";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
const ItemMastereOverview = {
  fieldInputs: () => [
    {
      name: "date",
      label: "Apply date",
      labelClass: "required",
      type: "text",
      rules: yup.array().required("Apply date code is required"),
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        {
          value: 0,
          label: "Inactive",
        },
        {
          value: 1,
          label: "Active",
        },
      ],
    },
  ],
  columns: ({ onChange }) => [
    {
      title: "Name",
      width: 400,
      dataIndex: "attributeName",
      key: "attributeName",
      // sorter: (a, b) => a.attributeName?.localeCompare(b.promotionName),
    },

    {
      title: "Attribute Value",
      dataIndex: "attributeValue",
      key: "attributeValue",
      render: (value, record) => {
        const { dataType, attributeValue, attributeID } = record;
        switch (dataType) {
          case "textfield":
            return (
              <Input
                onChange={(e) => {
                  const value = e.target.value;
                  onChange(attributeID, value);
                }}
                placeholder="Enter value"
                className="w-full"
                defaultValue={attributeValue}
              />
            );
          case "select":
            return (
              <Select
                allowClear
                onChange={(value) => {
                  onChange(attributeID, value);
                }}
                defaultValue={attributeValue || null}
                className="w-full"
                options={[
                  { value: "WH0004", label: "WH0004" },
                  { value: "WH0011", label: "WH0011" },
                ]}
                placeholder="Choose value"
              />
            );
        }
      },
    },
    // {
    //   title: 'Key Mapping',
    //   dataIndex: 'keyMapping',
    //   key: 'keyMapping',
    // },
    // {
    //   title: 'Data Type',
    //   dataIndex: 'dataType',
    //   key: 'dataType',
    // },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (value, record) => {
    //     return <BaseButton iconName="edit" onClick={onEditItem}></BaseButton>;
    //   },
    // },
  ],
};
export default ItemMastereOverview;
