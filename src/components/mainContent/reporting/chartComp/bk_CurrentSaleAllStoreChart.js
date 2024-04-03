//Plugin
import React from "react";
// import $ from 'jquery';
// import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,textAnchor, Legend, ResponsiveContainer } from 'recharts';
import {
  ReferenceLine,
  BarChart,
  Brush,
  Legend,
  Bar,
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

export default class CurrentSaleAllStoreChart extends BaseComponent {
  constructor(props) {
    super(props);

    this.dataChart = [];

    this.isRender = true;
  }

  createDataMonthCategory = () => {
    if (this.props.data) {
      let data = this.props.data;
      this.dataChart = data.sort(function (a, b) {
        if (a.storeCode > b.storeCode) return 1;
        if (a.storeCode < b.storeCode) return -1;
        return 0;
      });

      this.dataChart.map((item) => {
        return {
          storeCode: item.storeCode,
          grossSales: StringHelper.formatValue(item.grossSales),
          billCount: StringHelper.formatValue(item.billCount),
          customerCount: StringHelper.formatValue(item.customerCount),
          qty: StringHelper.formatValue(item.item),
        };
      });
    }
  };

  renderComp() {
    this.createDataMonthCategory();

    return (
      <section id={this.props.id}>
        {this.dataChart.length === 1 ? (
          "Data not found"
        ) : (
          <>
            <ResponsiveContainer
              width={this.dataChart.length > 10 ? "100%" : "50%"}
              height={300}
            >
              <BarChart
                data={this.dataChart}
                margin={{ top: 10, right: 50, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="storeCode"
                  fontSize={10}
                  angle={-35}
                  textAnchor="end"
                  scaleToFit="true"
                  interval={0}
                />
                <YAxis
                  fontSize={10}
                  tickFormatter={(value) => StringHelper.formatValue(value)}
                />
                <Tooltip
                  cursor={{ fill: "ivory" }}
                  formatter={(value) => {
                    return StringHelper.formatValue(value);
                  }}
                />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ lineHeight: "40px" }}
                />

                {this.props.keyChart &&
                  this.props.keyChart === "grossSales" && (
                    <Bar dataKey="grossSales" barSize={15} fill="#82ca9d" />
                  )}
                {this.props.keyChart &&
                  this.props.keyChart === "grossSales" &&
                  this.dataChart.length > 30 && (
                    <Brush
                      y={260}
                      dataKey="storeCode"
                      height={30}
                      startIndex={0}
                      endIndex={29}
                      stroke="#82ca9d"
                    />
                  )}
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </section>
    );
  }
}
