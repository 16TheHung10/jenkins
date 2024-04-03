import { G2, Pie } from '@ant-design/plots';
import StringHelper from 'helpers/StringHelper';
import React, { useEffect, useState } from 'react';

const PieChartComp = (props) => {
  const G = G2.getEngine('canvas');
  const [data, setData] = useState(props.data);
  const [nHeight, setNHeight] = useState(props.nHeight);

  useEffect(() => {
    // asyncFetch();
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    // asyncFetch();
    setNHeight(props.nHeight);
  }, [props.nHeight]);

  const cfg = {
    renderer: 'svg',
    height: nHeight,
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    animation: false,
    legend: {
      layout: 'vertical',
      position: 'right',
      maxRow: 10,
    },

    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.type,
          value: StringHelper.formatPrice(datum.value),
        };
      },
    },
    // label: false,
    label: {
      type: 'spiders',
      offset: '-20%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 10,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          //...
        },
        content: 'Custom Label', // Here you can add custom label inside donut pie chart
      },
    },
  };
  const config = cfg;
  return <Pie {...config} />;
};

export default React.memo(PieChartComp);
