//Plugin
import React from "react";
// import $ from 'jquery';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScrollContainer,
  textAnchor,
  Legend,
  ResponsiveContainer,
} from "recharts";

//Custom
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";

export default class CurrentSaleAllChart extends BaseComponent {
  constructor(props) {
    super(props);

    this.dataChart = [];

    this.isRender = true;
  }

  createDataMonthCategory = () => {
    this.dataChart =
      this.props.data.map((item) => {
        return {
          timeRange: item.timeRange,
          totalGrossSales: item.totalGrossSales,
          totalNetSales: item.totalNetSales,
          customerNum: item.totalQty,
        };
      }) || [];
  };

  renderComp() {
    // this.createDataMonthCategory();

    return (
      <section id={this.props.id}>
        {this.dataChart.length === 1 ? (
          "Data not found"
        ) : (
          <ResponsiveContainer width="100%" height={305}>
            <BarChart
              data={this.dataChart}
              margin={{ top: 30, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeRange" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip
                formatter={(value) => {
                  return StringHelper.formatPrice(value);
                }}
              />
              <Bar
                stackId="a"
                name="Bill counting"
                dataKey="totalQty"
                fill="#ffc658"
              />
              <Bar
                stackId="a"
                name="Customer counting"
                dataKey="totalGrossSales"
                fill="#8884d8"
              />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    );
  }
}
