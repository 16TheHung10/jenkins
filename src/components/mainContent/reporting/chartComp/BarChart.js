import "./styleChartStore.scss";

import React, { useEffect, useRef } from "react";

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    drawChart();
  }, []);

  const drawChart = () => {
    const canvas = chartRef.current;
    const ctx = canvas.getContext("2d");

    // Tính toán kích thước biểu đồ
    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    const barWidth = 40;
    const gap = 20;
    const maxValue = Math.max(...data.map((item) => item.grossSales));
    const scaleY = chartHeight / maxValue;

    // Vẽ các cột
    data.forEach((item, index) => {
      const x = index * (barWidth + gap);
      const y = chartHeight - item.grossSales * scaleY;
      const height = item.grossSales * scaleY;
      const color = getRandomColor();

      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, height);

      ctx.fillStyle = "#000";
      ctx.fillText(item.storeCode, x, chartHeight + 20);
      ctx.fillText(item.grossSales.toString(), x, y - 10);
    });
  };

  // Hàm lấy màu ngẫu nhiên
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return <canvas ref={chartRef} width={400} height={300} />;
};

export default BarChart;
