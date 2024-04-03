import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Bullet } from "@ant-design/plots";

const DemoBullet = (props) => {
  const [data, setData] = useState(
    props.data || [
      {
        title: "Current",
        ranges: [100],
        measures: [30, 50],
        target: 100,
      },
    ],
  );

  const [legend, setLegend] = useState(props.legend);

  useEffect(() => {
    setData(props.data);
    setLegend(props.legend);
  }, [props.data, props.legend]);

  const config = {
    data,
    height: 60,
    appendPadding: 10,
    measureField: "measures",
    rangeField: "ranges",
    targetField: "target",
    xField: "title",
    color: {
      range: ["#FFbcb8", "#FFe0b0", "#bfeec8"],
      measure: ["#5B8FF9", "#61DDAA"],
      target: "#bfeec8",
    },
    label: {
      measure: {
        position: "middle",
        style: {
          fill: "#fff",
        },
      },
    },
    xAxis: {
      line: null,
    },
    yAxis: false,
    tooltip: {
      showMarkers: false,
      shared: true,
    },
    legend:
      legend === true
        ? {
            custom: true,
            position: "top",
            items: [
              {
                value: "MOMO",
                name: "MOMO",
                marker: {
                  symbol: "square",
                  style: {
                    fill: "#5B8FF9",
                    r: 5,
                  },
                },
              },
              {
                value: "PAYOO",
                name: "PAYOO",
                marker: {
                  symbol: "square",
                  style: {
                    fill: "#61DDAA",
                    r: 5,
                  },
                },
              },
            ],
          }
        : false,
  };

  return <Bullet {...config} />;
};

export default React.memo(DemoBullet);
