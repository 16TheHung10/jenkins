// import "./styles.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { PieChart, Pie, Legend, Tooltip } from "recharts";

function PieChartTop(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let arr = [];

    for (let i in props.data) {
      let item = props.data[i];
      arr.push({
        name: item.itemName,
        value: item.qty,
      });
    }

    setData(arr);
  }, [props.data]);

  const bodyContent = useMemo(() => {
    return (
      <PieChart width={300} height={180}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data}
          cx={150}
          cy={90}
          outerRadius={60}
          fill="#8884d8"
          label
        />

        <Tooltip />
      </PieChart>
    );
  }, [data]);

  return bodyContent;
}

export default React.memo(PieChartTop);
