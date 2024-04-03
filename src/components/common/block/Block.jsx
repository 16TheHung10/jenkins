import React from "react";

const Block = ({ children, className, ...props }) => {
  return (
    <div className={`section-block mt-15 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Block;
