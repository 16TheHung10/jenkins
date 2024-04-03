//Plugin
import React, { PureComponent } from "react";
// import $ from 'jquery';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  textAnchor,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";

//Custom
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import DateHelper from "helpers/DateHelper";
import moment from "moment";

export default class RechartArea extends BaseComponent {
  constructor(props) {
    super(props);

    this.title = this.props.title || "Barchart";
    this.dataChart = this.props.data || [];

    this.isRender = true;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.dataChart !== newProps.data) {
      this.dataChart = newProps.data;
    }

    if (this.title !== newProps.title) {
      this.dataCtitlehart = newProps.title;
    }
  };

  createDataMonthCategory = (data, arrField) => {
    var newData = [];

    newData = data.map((item) => {
      return {
        customer: item.customer,
        totalSale: item.totalSale,
        date: item.date ? moment(item.date).format("DD/MM") : "",
      };
    });

    return newData;
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
    // var data = this.createDataMonthCategory(this.dataChart);
    var data = Object.values(this.dataChart) || [];

    return (
      <div>
        {data.length === 1 ? (
          "Data not found"
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" />
              <YAxis
                yAxisId="right"
                fontSize={10}
                tickFormatter={(value) => {
                  return this.countLength(value);
                }}
              />
              <YAxis
                yAxisId="left"
                orientation="right"
                fontSize={10}
                tickFormatter={(value) => {
                  return StringHelper.formatPrice(value);
                }}
              />
              <Tooltip
                formatter={(value) => {
                  return StringHelper.formatPrice(value);
                }}
              />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ lineHeight: "40px" }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                name="Customer"
                dataKey="customer"
                stroke="#ffc658"
                fill="#ffc658"
                activeDot={{ r: 8 }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                name="Bill"
                dataKey="billCount"
                stroke="#82ca9d"
                fill="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </AreaChart>

            {/* <BarChart data={data}
								margin={{top: 0,
									right: 20,
									left: 20,
									bottom: 10,}}>
							<CartesianGrid strokeDasharray="3 3" />
			
							<XAxis dataKey="date" angle={-45} textAnchor="end"/>
							<YAxis fontSize={10}
								tickFormatter={value => {
									return StringHelper.formatPrice(value);
							}}/>
							<Tooltip
								formatter={value => {
									return StringHelper.formatPrice(value);
							}}/>
							<Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }}/>
							<Bar  name="Customer" dataKey="customer"  fill="#82ca9d" />
						</BarChart> */}
          </ResponsiveContainer>
        )}
      </div>
    );
  }
}
