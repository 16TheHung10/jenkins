//Plugin
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  Sector,
} from "recharts";

//Custom
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 120;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize="10"
        fontWeight={700}
      >
        {countLength(value)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 8}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize="10"
      >
        {payload.name}
      </text>
    </g>
  );
};

const countLength = (number) => {
  if (number.toString().length > 9) {
    let newNum = number.toString().substring(0, number.toString().length - 9);
    let refix = number
      .toString()
      .substring(number.toString().length - 9, number.toString().length - 7);
    return StringHelper.formatPrice(newNum) + "." + refix + " B";
  } else if (number.toString().length > 6) {
    let newNum = number.toString().substring(0, number.toString().length - 6);
    let refix = number
      .toString()
      .substring(number.toString().length - 6, number.toString().length - 4);
    return StringHelper.formatPrice(newNum) + "." + refix + " M";
  } else if (number.toString().length > 3) {
    let newNum = number.toString().substring(0, number.toString().length - 3);
    let refix = number
      .toString()
      .substring(number.toString().length - 3, number.toString().length - 1);
    return StringHelper.formatPrice(newNum) + "." + refix + " T";
  } else {
    return StringHelper.formatPrice(number);
  }
};

export default class PieChartCurrentSale extends BaseComponent {
  constructor(props) {
    super(props);
    this.dataAll = [];
    this.data = [];
    this.data2 = [];
    this.data3 = [];
    this.data4 = [];
    this.data5 = [];

    this.isRender = true;
  }

  // componentWillReceiveProps(newProps) {}

  createData = () => {
    if (this.props.data) {
      this.dataAll = this.props.data;
      let data = this.dataAll;

      this.data = [{ name: "Total bill", value: data.totalInvoice || 0 }];
      this.data2 = [
        { name: "Total gross sale", value: data.totalGrossSales || 0 },
      ];
      this.data3 = [{ name: "Total item", value: data.totalQty || 0 }];
      this.data4 = [{ name: "Total net sale", value: data.totalNetSales || 0 }];
      this.data5 = [{ name: "Total customer", value: data.totalCustomer || 0 }];
    }
  };

  renderPie = (data, innerRadius, outerRadius, color, x, y) => {
    return (
      <Pie
        activeIndex={0}
        activeShape={renderActiveShape}
        dataKey="value"
        data={data}
        cx={x}
        cy={y}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        fill={color}
      />
    );
  };

  renderComp() {
    this.createData();

    return (
      <section id={this.props.id} className="d-inline-block">
        <PieChart width={800} height={150}>
          {this.renderPie(this.data2, 35, 40, "#00C49F", 100, 60)}
          {this.renderPie(this.data4, 35, 40, "#FF8042", 250, 60)}
          {this.renderPie(this.data, 35, 40, "#0088FE", 400, 60)}
          {this.renderPie(this.data3, 35, 40, "#FFBB28", 550, 60)}
          {this.renderPie(this.data5, 35, 40, "rgb(136, 132, 216)", 700, 60)}
        </PieChart>
        {this.data.length > 0 ||
        this.data2.length > 0 ||
        this.data3.length > 0 ||
        this.data4.length > 0 ||
        this.data5.length > 0 ? (
          <p className="fs-i fs-8">
            <strong>T</strong>: Thousand, <strong>M</strong>: Million,{" "}
            <strong>B</strong>: Billion
          </p>
        ) : null}
      </section>
    );
  }
}
