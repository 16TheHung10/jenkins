//Plugin
import React from "react";
// import $ from 'jquery';
// import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,textAnchor, Legend, ResponsiveContainer } from 'recharts';
import {
  AreaChart,
  Legend,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

//Custom
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import { entries } from "lodash";

export default class SaleByTimeChart extends BaseComponent {
  constructor(props) {
    super(props);

    this.dataChart = [];

    this.isRender = true;
  }

  changeLabelTime = (timeRange) => {
    if (timeRange === "00") {
      return "00-01 h";
    }
    if (timeRange === "01") {
      return "01-02 h";
    }
    if (timeRange === "02") {
      return "02-03 h";
    }
    if (timeRange === "03") {
      return "03-04 h";
    }
    if (timeRange === "04") {
      return "04-05 h";
    }
    if (timeRange === "05") {
      return "05-06 h";
    }
    if (timeRange === "06") {
      return "06-07 h";
    }
    if (timeRange === "07") {
      return "07-08 h";
    }
    if (timeRange === "08") {
      return "08-09 h";
    }
    if (timeRange === "09") {
      return "09-10 h";
    }
    if (timeRange === "10") {
      return "10-11 h";
    }
    if (timeRange === "11") {
      return "11-12 h";
    }
    if (timeRange === "12") {
      return "12-13 h";
    }
    if (timeRange === "13") {
      return "13-14 h";
    }
    if (timeRange === "14") {
      return "14-15 h";
    }
    if (timeRange === "15") {
      return "15-16 h";
    }
    if (timeRange === "16") {
      return "16-17 h";
    }
    if (timeRange === "17") {
      return "17-18 h";
    }
    if (timeRange === "18") {
      return "18-19 h";
    }
    if (timeRange === "19") {
      return "19-20 h";
    }
    if (timeRange === "20") {
      return "20-21 h";
    }
    if (timeRange === "21") {
      return "21-22 h";
    }
    if (timeRange === "22") {
      return "22-23 h";
    }
    if (timeRange === "23") {
      return "23-24 h";
    }
  };

  createDataMonthCategory = () => {
    if (this.props.data) {
      let data = this.props.data;
      this.dataChart = Object.keys(data)
        .sort()
        .map((item) => {
          return {
            timeRange: this.changeLabelTime(item),
            totalGrossSales: data[item].totalGrossSales,
            totalInvoiceQty: data[item].totalInvoiceQty,
            totalItemQty: data[item].totalItemQty,
          };
        });
    }
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

  renderComp() {
    this.createDataMonthCategory();

    return (
      <section id={this.props.id}>
        {this.dataChart.length === 1 ? (
          "Data not found"
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={this.dataChart}
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeRange" fontSize={10} />
              <YAxis
                yAxisId="left"
                fontSize={10}
                tickFormatter={(value) => this.countLength(value)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                fontSize={10}
                tickFormatter={(value) => {
                  return this.countLength(value);
                }}
              />
              <Tooltip
                formatter={(value) => {
                  return StringHelper.formatPrice(value);
                }}
              />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="totalGrossSales"
                stroke="rgb(0, 196, 159)"
                fill="rgb(0, 196, 159)"
                name="Gross sales"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="totalItemQty"
                stroke="rgb(255, 187, 40)"
                fill="rgb(255, 187, 40)"
                name="Item"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="totalInvoiceQty"
                stroke="rgb(0, 136, 254)"
                fill="rgb(0, 136, 254)"
                name="Invoice"
              />

              <Legend
                verticalAlign="top"
                wrapperStyle={{ lineHeight: "40px" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </section>
    );
  }
}
