import React from "react";
import "./style.scss";
import { Switch } from "antd";
const OnlyGreenSwitch = (props) => {
  return (
    <div id="only_green_switch">
      <Switch {...props} />
    </div>
  );
};

export default OnlyGreenSwitch;
