import React from "react";

const BoxShadow = ({ children, ...props }) => {
  return (
    <div {...props} className="w-full box-shadow">
      {children}
    </div>
  );
};

export default BoxShadow;
