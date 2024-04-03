import React from "react";

const CustomField = ({ label, fieldComponent }) => {
  return (
    <div className="flex flex-col justify-center">
      <label>{label}</label>
      {fieldComponent}
    </div>
  );
};

export default CustomField;
