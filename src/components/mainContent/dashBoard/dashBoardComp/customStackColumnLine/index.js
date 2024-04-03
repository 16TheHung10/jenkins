import { DualAxes, G2 } from "@ant-design/plots";
import StringHelper from "helpers/StringHelper";
import React, { useEffect, useState } from "react";

const DemoDualAxes = (props) => {
  const [data1, setData1] = useState(props.data1);
  const [data2, setData2] = useState(props.data2);
  const [nHeight, setNHeight] = useState(props.nHeight);
  const { registerTheme } = G2;

  useEffect(() => {
    setNHeight(props.nHeight);
  }, [props.nHeight]);

  // registerTheme('custom-theme', {
  //     colors10: ['#FACDAA', '#F4A49E', '#EE7B91', '#E85285', '#BE408C', '#BE408C'],

  //     /** 20色板 */
  //     colors20: ['#FACDAA', '#F4A49E', '#EE7B91', '#E85285', '#BE408C', '#BE408C', '#942D93'],
  // });
  // const uvBillData = [
  //     {
  //         time: '2019-03',
  //         value: 350,
  //         type: 'bill',
  //     },
  //     {
  //         time: '2019-04',
  //         value: 900,
  //         type: 'bill',
  //     },
  //     {
  //         time: '2019-05',
  //         value: 300,
  //         type: 'bill',
  //     },
  //     {
  //         time: '2019-06',
  //         value: 450,
  //         type: 'bill',
  //     },
  //     {
  //         time: '2019-07',
  //         value: 470,
  //         type: 'bill',
  //     },
  // ];
  // const transformData = [
  //     {
  //         time: '2019-03',
  //         count: 800,
  //     },
  //     {
  //         time: '2019-04',
  //         count: 600,
  //     },
  //     {
  //         time: '2019-05',
  //         count: 400,
  //     },
  //     {
  //         time: '2019-06',
  //         count: 380,
  //     },
  //     {
  //         time: '2019-07',
  //         count: 220,
  //     },
  // ];
  const config = {
    height: nHeight,
    data: [data1, data2],
    xField: props.xField,
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    yField: props.yField,
    yAxis: {
      value: {
        label: {
          formatter: (val) => {
            return StringHelper.formatPrice(val);
          },
        },
      },
      qty: {
        label: {
          formatter: (val) => {
            return StringHelper.formatPrice(val);
          },
        },
      },
    },
    geometryOptions: [
      {
        geometry: "column",
        isStack: true,
        seriesField: "type",
        columnWidthRatio: 0.4,
      },
      {
        geometry: "line",
        color: "transparent",
      },
    ],
    legend: {
      // marker: {
      //     symbol: 'circle',
      //     style: {
      //         lineWidth: 2,
      //         r: 6,
      //         stroke: '#5AD8A6',
      //         fill: '#fff',
      //     },
      // },
      layout: "vertical",
      position: "left",
      itemName: {
        formatter: (val) => `${val}`,
        style: {
          fill: "#333",
        },
      },
    },
    // interactions: [
    //     {
    //         type: 'element-highlight',
    //     },
    //     {
    //         type: 'active-region',
    //     },
    // ],
    animation: false,
    theme: "custom-theme",
    tooltip: {
      formatter: (datum) => {
        if (datum.type) {
          return {
            name: "Gross sales",
            value: StringHelper.formatPrice(datum.value),
          };
        } else {
          return { name: "Qty", value: StringHelper.formatPrice(datum.qty) };
        }
        // return { name: datum.name, value: StringHelper };
      },
    },
  };
  return <DualAxes {...config} />;
};

export default React.memo(DemoDualAxes);

// const BidirectionalBarChart = (props) => {
//     const [data, setData] = useState(props.data);
//     const [nHeight, setNHeight] = useState(props.nHeight);

//     useEffect(() => {
//         setData(props.data);
//     }, [props.data]);

//     useEffect(() => {
//         setNHeight(props.nHeight);

//     }, [props.nHeight]);

//     const config = {
//         height: nHeight,
//         data,
//         xField: props.xField,
//         xAxis: {
//             position: 'bottom',
//         },
//         interactions: [
//             {
//                 type: 'active-region',
//             },
//         ],
//         yField: props.yField,
//         yAxis: {
//             grossSales: {
//                 label: {
//                     formatter: (val) => {
//                         return StringHelper.formatPrice(val)
//                     }
//                 }
//             },
//             qty: {
//                 label: {
//                     formatter: (val) => {
//                         return StringHelper.formatPrice(val)
//                     }
//                 }
//             }
//         },
//         tooltip: {
//             shared: true,
//             showMarkers: false,
//             formatter: (datum) => {
//                 if (datum["series-field-key"] === "grossSales") {
//                     return { name: "Gross sales", value: StringHelper.formatPrice(datum.grossSales) };
//                 }
//                 else {
//                     return { name: "Qty", value: StringHelper.formatPrice(datum.qty) };
//                 }
//                 // return { name: datum.name, value: StringHelper };
//             },
//         },
//         animation:false,
//     };
//     return <BidirectionalBar {...config} />;
// };

// export default React.memo(BidirectionalBarChart);

// import {
//     ComposedChart,
//     Line,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     Area
// } from "recharts";

// const data = [
//     {
//         name: "Page A",
//         uv: 590,
//         pv: 800,
//         amt: 1400,
//         cnt: 490
//     },
//     {
//         name: "Page B",
//         uv: 868,
//         pv: 967,
//         amt: 1506,
//         cnt: 590
//     },
//     {
//         name: "Page C",
//         uv: 1397,
//         pv: 1098,
//         amt: 989,
//         cnt: 350
//     },
//     {
//         name: "Page D",
//         uv: 1480,
//         pv: 1200,
//         amt: 1228,
//         cnt: 480
//     },
//     {
//         name: "Page E",
//         uv: 1520,
//         pv: 1108,
//         amt: 1100,
//         cnt: 460
//     },
//     {
//         name: "Page F",
//         uv: 1400,
//         pv: 680,
//         amt: 1700,
//         cnt: 380
//     }
// ];
// {
//     name: "Page A",
//     uv: 590,
//     pv: 800,
//     amt: 1400,
//     cnt: 490
// },

// const CustomStackColumnLine = (props) => {
//     const [data, setData] = useState(props.data);

//     useEffect(() => {
//         setData(props.data);
//     }, [props.data]);

//     return (
//         <ComposedChart
//             layout="vertical"
//             width={500}
//             height={400}
//             data={data}
//             margin={{
//                 top: 20,
//                 right: 20,
//                 bottom: 20,
//                 left: 20
//             }}
//         >
//             <CartesianGrid stroke="#f5f5f5" />
//             <XAxis type="number" />
//             <YAxis dataKey="name" type="category" scale="band" />
//             <Tooltip />
//             <Legend />
//             {/* <Area dataKey="amt" fill="#8884d8" stroke="#8884d8" /> */}
//             <Bar dataKey="grossSales" barSize={20} fill="#413ea0" />
//             <Line dataKey="qty" stroke="#ff7300" />
//         </ComposedChart>
//     );
// }

// export default React.memo(CustomStackColumnLine);
