import { Area } from "@ant-design/plots";
import StringHelper from "helpers/StringHelper";
import React, { useEffect, useState } from "react";

const AreaChart = (props) => {
  const [data, setData] = useState(props.data);
  const [xField, setXField] = useState(props.xField);
  const [yField, setYField] = useState(props.yField);
  const [type, setType] = useState(props.type);
  const [color, setColor] = useState(props.color);

  useEffect(() => {
    // asyncFetch();
    setData(props.data);
    setXField(props.xField);
    setYField(props.yField);
    setType(props.type);
  }, [props.data]);

  const config = {
    animation: false,
    data,
    height: 230,
    xField: xField,
    xAxis: {
      range: [0, 1],
    },
    yField: yField,
    yAxis: {
      range: [0, 1],
      label: {
        autoHide: true,
        formatter: (value) => StringHelper.formatPrice(value),
      },
    },
    seriesField: type,
    smooth: true,
    color: color,
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.type === "totalSale" ? "Total sales" : "Customer",
          value: StringHelper.formatPrice(datum.value),
        };
      },
    },
    areaStyle: () => {
      return {
        fill: "l(270) 0:#ffffff 1:" + color,
        lineOpacity: 0,
      };
    },
    legend: {
      layout: "horizontal",
      position: "top",
      itemName: {
        formatter: (datum) =>
          datum === "totalSale" ? "Total sales" : "Customer",
      },
    },
  };

  return <Area {...config} />;
};
export default React.memo(AreaChart);
