import { DatePicker } from "antd";
import React from "react";

const SecureField = ({ secure, secureValue, renderField }) => {
  return <>{renderField(secure)}</>;
};

export default SecureField;
