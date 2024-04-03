import { Select } from "antd";
import React from "react";

const TableHeaderSelect = ({ field }) => {
  return (
    <div>
      <label htmlFor="storeCode" className="w100pc">
        {field.label}
      </label>
      <Select
        defaultValue={null}
        style={{ width: "100%" }}
        onChange={field.onChange}
        options={field.options}
      />
    </div>
  );
};

export default TableHeaderSelect;
