import React from "react";

const SecureInput = ({ secure, secureValue, value, test, ...props }) => {
  return (
    <>
      <input
        {...props}
        defaultValue={secure ? "" : value}
        placeholder={secure ? secureValue : props.placeholder}
      />
    </>
  );
};

export default SecureInput;
