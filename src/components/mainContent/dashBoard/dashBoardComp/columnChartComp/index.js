import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";
import StringHelper from "helpers/StringHelper";

const dataFake = [
  { city: "city 1", type: "type A", value: 14500 },
  { city: "city 1", type: "type B", value: 8500 },
  { city: "city 2", type: "type A", value: 9000 },
  { city: "city 2", type: "type B", value: 8500 },
  { city: "city 3", type: "type A", value: 16000 },
  { city: "city 3", type: "type B", value: 5000 },
  { city: "city 4", type: "type A", value: 14000 },
  { city: "city 4", type: "type B", value: 9000 },
  { city: "city 5", type: "type A", value: 14000 },
  { city: "city 5", type: "type B", value: 9000 },
  { city: "city 6", type: "type A", value: 9000 },
  { city: "city 6", type: "type B", value: 8500 },
  { city: "city 7", type: "type A", value: 17000 },
  { city: "city 7", type: "type B", value: 6000 },
  { city: "city 8", type: "type A", value: 18000 },
  { city: "city 8", type: "type B", value: 11000 },
];

const ColumnChart = (props) => {
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

  // const asyncFetch = () => {
  //     fetch('https://gw.alipayobjects.com/os/antfincdn/PC3daFYjNw/column-data.json')
  //         .then((response) => response.json())
  //         .then((json) => setData(json))
  //         .catch((error) => {
  //             console.log('fetch data failed', error);
  //         });
  // };

  const config = {
    data,
    height: 230,
    xField: xField, //city

    yField: yField, //value
    yAxis: {
      label: {
        autoHide: true,
        formatter: (value) => StringHelper.formatPrice(value),
      },
    },
    tooltip: {
      formatter: (el) => {
        return { name: el.type, value: StringHelper.formatPrice(el.value) };
      },
    },

    seriesField: type, //type
    isGroup: true,
    maxColumnWidth: 15,
    columnStyle: {
      radius: [20, 20, 0, 0],
      fill: color,
    },
    color: color,
  };

  return <Column {...config} />;
};

export default React.memo(ColumnChart);
