import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "antd";
import React from "react";
import "./sohDashboard.styles.scss";

const DashboardCardHeader = ({
  icon,
  title,
  subTitle,
  iconClass,
  cardClass = "",
  reverse = false,
}) => {
  return (
    <div
      className={`${cardClass} card-wrapper box-shadow w-full flex ${
        reverse ? "flex-row-reverse justify-start" : ""
      }`}
    >
      <div className="content">
        <div className=" flex flex-col items-start">
          <div className="title">{title || "Title"}</div>
          <div className="sub-title">{subTitle || "Sub Title"}</div>
        </div>
      </div>
      <div className="flex items-center icon-wrapper">
        <div className="icon">
          <FontAwesomeIcon className={iconClass} icon={icon} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCardHeader;
