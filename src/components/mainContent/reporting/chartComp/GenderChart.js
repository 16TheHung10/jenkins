import { Pie, measureTextWidth } from "@ant-design/plots";
import StringHelper from "helpers/StringHelper";
import React, { useEffect, useState } from "react";

const DemoPie = (props) => {
  const [data, setData] = useState([]);

  function renderStatistic(containerWidth, text, style) {
    const { width: textWidth, height: textHeight } = measureTextWidth(
      text,
      style,
    );
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(
            Math.pow(R, 2) /
              (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)),
          ),
        ),
        1,
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : "inherit"
    };">${text}</div>`;
  }

  useEffect(() => {
    // Update the document title using the browser API
    setData(props.data);
  });
  // const data = [
  //     {
  //         type: '分类一',
  //         value: 27,
  //     },
  //     {
  //         type: '分类二',
  //         value: 25,
  //     },
  //     {
  //         type: '分类三',
  //         value: 18,
  //     },
  //     {
  //         type: '分类四',
  //         value: 15,
  //     },
  //     {
  //         type: '分类五',
  //         value: 10,
  //     },
  //     {
  //         type: '其他',
  //         value: 5,
  //     },
  // ];
  const config = {
    height: 200,
    width: 270,
    meta: {
      value: {
        formatter: (v) => `${StringHelper.formatQty(v)}`,
      },
    },
    appendPadding: 0,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.5,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{percentage}",
      autoRotate: false,
      style: {
        textAlign: "center",
        fontSize: 9,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: {
        offsetY: -4,
        style: {
          fontSize: "12px",
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: "12px",
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${StringHelper.formatQty(datum.value)}`
            : `${StringHelper.formatQty(
                data.reduce((r, d) => r + d.value, 0),
              )}`;
          return renderStatistic(width, text, {
            fontSize: 12,
          });
        },
      },
    },
  };
  return <Pie {...config} />;
};

export default DemoPie;
