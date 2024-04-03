//Plugin
import React from "react";
import $ from "jquery";
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

const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042"];

export default class PieChartComp extends BaseComponent {
  constructor(props) {
    super(props);

    this.id = this.props.id || "idPie" + StringHelper.randomKey();
    this.data = this.props.data || [];
    this.dataKey = this.props.dataKey || "";
    this.color = this.props.color || "#00C49F";
    this.colorold = this.props.colorold || "grey";
    this.isLabelLast = this.props.isLabelLast || true;
    this.dataName = this.props.dataName || "";

    this.isRender = true;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.id !== this.id) {
      this.id = newProps.id;
    }

    if (newProps.data !== this.data) {
      this.data = newProps.data;
    }

    if (newProps.data !== this.data) {
      this.data = newProps.data;
    }

    if (newProps.color !== this.color) {
      this.color = newProps.color;
    }

    if (newProps.colorold !== this.colorold) {
      this.colorold = newProps.colorold;
    }

    if (newProps.isLabelLast !== this.isLabelLast) {
      this.isLabelLast = newProps.isLabelLast;
    }

    if (newProps.dataName !== this.dataName) {
      this.dataName = newProps.dataName;
    }

    this.refresh();
  }

  countLength = (number) => {
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

  handleCalcDashoffset = (c, val) => {
    return ((100 - val) / 100) * c;
  };

  handleCalcDasharray = (r) => {
    return Math.PI * (r * 2);
  };

  handleReturnSvg = (
    w,
    h,
    r1,
    r2,
    percent2,
    value1,
    value2,
    txt = "",
    color = "#000000",
    isLabelLast = true,
    colorold = "grey",
  ) => {
    let proccess = 0;
    let proccessCur = 0;

    if (value1 >= value2) {
      proccess = 50;
      proccessCur = parseFloat(percent2 / 2);
    } else {
      proccess = parseFloat((value1 * 50) / value2);
      proccessCur = 50;
    }

    let width = w;
    let height = h;
    let viewport = "0 0 " + w + " " + h;
    let daold = parseFloat(this.handleCalcDasharray(r1));
    let daCur = parseFloat(this.handleCalcDasharray(r2));
    let dashoffsetPercentOld = parseFloat(
      this.handleCalcDashoffset(daold, proccess),
    );
    let dashoffsetPercentCur = parseFloat(
      this.handleCalcDashoffset(daCur, proccessCur),
    );
    let cxTrans = width / 2;
    let cyTrans = height + 20;
    let transRotate = "rotate(-180,0," + height / 2 + ")";
    let label = txt;

    return (
      <svg className="svg" width={width} height={height} viewport={viewport}>
        <circle
          r={r1}
          cx={cxTrans}
          cy={cyTrans}
          fill="transparent"
          strokeWidth={4}
          stroke={colorold}
          strokeDasharray={daold}
          strokeDashoffset={dashoffsetPercentOld}
          strokeLinecap="butt"
          transform={transRotate}
        ></circle>

        <circle
          r={r2}
          cx={cxTrans}
          cy={cyTrans}
          fill="transparent"
          strokeWidth={2}
          stroke={color}
          strokeDasharray={daCur}
          strokeDashoffset={dashoffsetPercentCur}
          strokeLinecap="butt"
          transform={transRotate}
        ></circle>

        <text
          fontSize="10"
          x="50%"
          y="75%"
          dominantBaseline="top"
          textAnchor="middle"
          fill={"grey"}
          fontWeight="bold"
        >
          {this.countLength(parseInt(value1))}{" "}
        </text>
        {isLabelLast && (
          <text
            fontSize="10"
            x="50%"
            y="85%"
            dominantBaseline="top"
            textAnchor="middle"
            fill={"grey"}
            fontWeight="bold"
          >
            Last
          </text>
        )}

        {value2 > 0 ? (
          <>
            {/* 0-25% */}
            {percent2 / 2 >= 0 && percent2 / 2 < 12.5 && (
              <>
                <text
                  fontSize="10"
                  x="15%"
                  y="75%"
                  dominantBaseline="top"
                  textAnchor="middle"
                  fill={color}
                  fontWeight="bold"
                >
                  {this.countLength(parseInt(value2))}
                </text>
                <text
                  fontSize="10"
                  x="15%"
                  y="87%"
                  dominantBaseline="top"
                  textAnchor="middle"
                  fill={color}
                  fontWeight="bold"
                >
                  Current
                </text>
              </>
            )}

            {/* 25-50% */}
            {percent2 / 2 >= 12.5 && percent2 / 2 < 25 && (
              <>
                <text
                  fontSize="10"
                  x="24%"
                  y="38%"
                  dominantBaseline="top"
                  textAnchor="middle"
                  fill={color}
                  fontWeight="bold"
                >
                  {this.countLength(parseInt(value2))} - Current
                </text>
                <path
                  d={
                    "M" +
                    (width / 2 - r1) +
                    " 42 L" +
                    (width / 2 - r1 + 5) +
                    " 50"
                  }
                  stroke={color}
                />
                <path
                  d={
                    "M" +
                    (width / 2 - r1) +
                    " 42 L" +
                    (width / 2 - r1 - 35) +
                    " 42"
                  }
                  stroke={color}
                />
              </>
            )}

            {/* 50-75% */}
            {percent2 / 2 >= 25 && percent2 / 2 < 37.5 && (
              <>
                <text
                  fontSize="10"
                  x={width / 2 + 20}
                  y="26"
                  dominantBaseline="top"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill={color}
                >
                  {this.countLength(parseInt(value2))} - Current
                </text>
                <path
                  d={"M" + width / 2 + " 38 L" + (width / 2 + 5) + " 30"}
                  stroke={color}
                />
                <path
                  d={"M" + (width / 2 + 5) + " 30 L" + (width / 2 + 35) + " 30"}
                  stroke={color}
                />
              </>
            )}

            {/* 75 100% */}
            {percent2 / 2 >= 37.5 && percent2 / 2 < 50 && (
              <>
                {/* <text fontSize="10" x="80%" y="40%" dominantBaseline="top" textAnchor="middle" fontWeight="bold" fill={color}>{this.countLength(parseInt(value2))} - Current</text>
								<path d={"M"+(width/2 + r1 - 5)+" 50 L"+(width/2 + r1)+" 42"} stroke={color}/>
								<path d={"M"+(width/2 + r1)+" 42 L"+(width/2 + r1 + 35)+" 42"} stroke={color}/> */}
                <text
                  fontSize="10"
                  x={width / 2 + 20}
                  y="26"
                  dominantBaseline="top"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill={color}
                >
                  {this.countLength(parseInt(value2))} - Current
                </text>
                <path
                  d={"M" + width / 2 + " 38 L" + (width / 2 + 5) + " 30"}
                  stroke={color}
                />
                <path
                  d={"M" + (width / 2 + 5) + " 30 L" + (width / 2 + 35) + " 30"}
                  stroke={color}
                />
              </>
            )}

            {/* 100% */}
            {percent2 / 2 >= 50 && (
              <>
                {/* <text fontSize="10" x="86%" y="80%" dominantBaseline="top" textAnchor="middle"  fontWeight="bold" fill={color}>{this.countLength(parseInt(value2))} - <br/>Current</text> */}
                <text
                  fontSize="10"
                  x={width / 2 + 20}
                  y="26"
                  dominantBaseline="top"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill={color}
                >
                  {this.countLength(parseInt(value2))} - Current
                </text>
                <path
                  d={"M" + width / 2 + " 38 L" + (width / 2 + 5) + " 30"}
                  stroke={color}
                />
                <path
                  d={"M" + (width / 2 + 5) + " 30 L" + (width / 2 + 35) + " 30"}
                  stroke={color}
                />
              </>
            )}
          </>
        ) : null}

        <text
          fontSize="10"
          x="50%"
          y="100"
          dominantBaseline="top"
          textAnchor="middle"
          fill={color}
        >
          {label}
        </text>
      </svg>
    );
  };

  handleDraw = (label, valOld, valCur, color, isLabelLast, colorold) => {
    let percent = parseFloat((valCur * 100) / valOld);

    if (isNaN(percent)) {
      percent = 0;
    }

    return this.handleReturnSvg(
      195,
      100,
      35,
      42,
      percent,
      valOld,
      valCur,
      label,
      color,
      isLabelLast,
      colorold,
    );
  };

  renderComp() {
    let obj = {
      valOld:
        this.data && this.data[this.dataKey + "Old"]
          ? parseFloat(this.data[this.dataKey + "Old"])
          : 0,
      valCur:
        this.data && this.data[this.dataKey]
          ? parseFloat(this.data[this.dataKey])
          : 0,
    };

    return (
      <section className="d-inline-block">
        {this.handleDraw(
          this.dataName,
          obj.valOld,
          obj.valCur,
          this.color,
          this.isLabelLast,
          this.colorold,
        )}
      </section>
    );
  }
}
