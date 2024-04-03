import React, { Fragment } from "react";

const BasicStatus = ({ type = "active", title }) => {
  const circleFactory = (type) => {
    if (type === "active") {
      return { background: "#3ad83a" };
    } else if (type === "blocked" || type === "inactive") {
      return { background: "red" };
    }
  };
  return (
    <div className="flex items-center justify-center">
      {title ? <p className="m-0 mr-10">{title}</p> : null}
      <div
        className=""
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          ...circleFactory(type),
        }}
      />
    </div>
  );
};

export default BasicStatus;
