import {
  faChevronCircleDown,
  faChevronCircleRight,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const IconExpand = ({ renderComp }) => {
  const [isExtend, setIsExtend] = useState(false);
  const onToggle = () => {
    setIsExtend((prev) => !prev);
  };
  return (
    <div id="extend_wrapper">
      <FontAwesomeIcon
        onClick={onToggle}
        className={`ml-10 icon ${isExtend ? "rotate" : ""}`}
        style={{ fontSize: "25px", cursor: "pointer" }}
        icon={faChevronCircleRight}
      />

      <div className="w-full">
        <div className={`expand_element ${isExtend ? "active" : "inactive"}`}>
          {isExtend ? renderComp() : null}
        </div>
      </div>
    </div>
  );
};

export default IconExpand;
