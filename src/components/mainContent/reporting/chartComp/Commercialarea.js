import React, { PureComponent } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import StringHelper from "helpers/StringHelper";

export default class Example extends PureComponent {
  static demoUrl = "https://codesandbox.io/s/customized-legend-event-l19fo";

  state = {
    opacity: {
      uv: 1,
      pv: 1,
    },
  };

  handleMouseEnter = (o) => {
    const { dataKey } = o;
    const { opacity } = this.state;

    this.setState({
      opacity: { ...opacity, [dataKey]: 0.5 },
    });
  };

  handleMouseLeave = (o) => {
    const { dataKey } = o;
    const { opacity } = this.state;

    this.setState({
      opacity: { ...opacity, [dataKey]: 1 },
    });
  };

  countLength = (number) => {
    if (number.toString().length > 9) {
      let newNum = number.toString().substring(0, number.toString().length - 9);
      return StringHelper.formatPrice(newNum) + "B";
    } else if (number.toString().length > 6) {
      let newNum = number.toString().substring(0, number.toString().length - 6);
      return StringHelper.formatPrice(newNum) + "M";
    } else if (number.toString().length > 3) {
      let newNum = number.toString().substring(0, number.toString().length - 3);
      return StringHelper.formatPrice(newNum) + "T";
    } else {
      return StringHelper.formatPrice(number);
    }
  };

  render() {
    const { opacity } = this.state;

    const colorArr = [
      "#ff0000",
      "#ff7f00",
      "#ffff00",
      "#00ff00",
      "#0000ff",
      "#4b0082",
      "#8f00ff",
    ];

    return (
      <div style={{ width: "100%" }}>
        {this.props.data.length !== 0 && (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              width={500}
              height={300}
              data={this.props.data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="commercialArea" fontSize={10} />

              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="rgb(0, 196, 159)"
                fontSize={10}
                tickFormatter={(value) => {
                  // return StringHelper.formatPrice(value);
                  return this.countLength(value);
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="rgb(136, 132, 216)"
                fontSize={10}
                tickFormatter={(value) => {
                  // return StringHelper.formatPrice(value);
                  return this.countLength(value);
                }}
              />
              <Tooltip
                formatter={(value) => {
                  return StringHelper.formatPrice(value);
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="grossSales"
                fill="rgb(0, 196, 159)"
                barSize={20}
                name="Gross sales"
              />
              <Bar
                yAxisId="right"
                dataKey="customerCount"
                fill="rgb(136, 132, 216)"
                barSize={20}
                name="Customer"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
}
