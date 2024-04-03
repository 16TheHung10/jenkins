import { Column } from "@ant-design/plots";
import StringHelper from "helpers/StringHelper";
import React, { useEffect, useState } from "react";

const DemoColumn = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Update the document title using the browser API
    setData(props.data);
  }, [props.data]);

  const config = {
    height: 180,
    data,
    xField: "name",
    yField: "value",
    yAxis: {
      label: {
        formatter: (value) => {
          return StringHelper.formatPrice(value);
        },
      },
    },
    label: {
      position: "middle",
      // 'top', 'bottom', 'middle',

      style: {
        fill: "#000000",
        opacity: 0.6,
        fontSize: 9,
      },

      formatter: ({ value }) => StringHelper.formatPrice(value),
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    seriesField: "name",

    tooltip: {
      formatter: (item) => {
        return { name: item.name, value: StringHelper.formatPrice(item.value) };
      },
    },
  };

  return <Column {...config} />;
};

export default DemoColumn;
