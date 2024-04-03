import React from "react";
import "./style.scss";
const MainTag = ({ title, ...props }) => {
  return (
    <div id="main_tag" {...props}>
      {title}
    </div>
  );
};

export default MainTag;
