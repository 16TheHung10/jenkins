import { Slider } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { StringHelper } from "helpers";
import "./style.scss";
const CustomSlider = ({ ...props }, ref) => {
  const [value, setValue] = useState({ value1: null, value2: null });
  useEffect(() => {
    if (props.value) {
      const value1 = document.querySelector("#value1");
      const value2 = document.querySelector("#value2");
      value1.innerHTML = props.value[0];
      value2.innerHTML = StringHelper.formatPrice(props.value[1]);
    }
  }, [props.value]);

  useEffect(() => {
    const dotLeft = document.querySelector(".ant-slider-handle-1");
    const dotRight = document.querySelector(".ant-slider-handle-2");

    const value1 = document.createElement("span");
    value1.id = "value1";

    const value2 = document.createElement("span");
    value2.id = "value2";

    dotLeft.appendChild(value1);
    dotRight.appendChild(value2);
  }, []);
  return (
    <div id="slider_wrapper" className="flex flex-col items-start">
      <Slider {...props} dot style={{ width: "100%" }} ref={ref} />
    </div>
  );
};

export default React.forwardRef(CustomSlider);
