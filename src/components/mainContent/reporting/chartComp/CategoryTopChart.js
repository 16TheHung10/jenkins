//Plugin
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

//Custom
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default class CategoryTopChart extends BaseComponent {
  constructor(props) {
    super(props);

    this.dataChart = [];

    this.isRender = true;
  }

  createData = () => {
    if (this.props.data && this.props.keyName) {
      let data = this.props.data;
      let arr = this.props.keyName;
      // console.log(data)
      // this.dataChart = [
      // 	{ name: "All", value: data[arr[0]] },
      // 	{ name: "Male", value: data[arr[1]] },
      // 	{ name: "Female", value: data[arr[2]] },
      // 	{ name: "Undefined", value: data[arr[3]] },
      // ];
    }
  };

  renderComp() {
    this.createData();

    return (
      <section id={this.props.id} className="d-inline-block">
        {this.dataChart.length === 1 ? (
          "Data not found"
        ) : (
          <PieChart
            width={330}
            height={180}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={this.dataChart}
              cx={165}
              cy={140}
              outerRadius={80}
              fill="#8884d8"
              label={(item) => {
                return StringHelper.formatPrice(item.value);
              }}
              // formatter={value => {
              // 	return StringHelper.formatPrice(value);
              // }}
            >
              {this.dataChart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => {
                return StringHelper.formatPrice(value);
              }}
            />
            <Legend />
          </PieChart>
        )}
      </section>
    );
  }
}
