import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Rose } from "@ant-design/plots";

const RoseChartComp = (props) => {
  const [data, setData] = useState(props.data);
  const [xField, setXField] = useState(props.xField);
  const [yField, setYField] = useState(props.yField);

  useEffect(() => {
    setData(props.data);
    setXField(props.xField);
    setYField(props.yField);
  }, [props.data, props.xField, props.yField]);

  const config = {
    data,
    xField: xField,
    yField: yField,
    seriesField: xField,
    radius: 0.9,
    label: {
      offset: -15,
    },
  };
  return <Rose {...config} />;
};

export default React.memo(RoseChartComp);
