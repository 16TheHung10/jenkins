import React from "react";
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";
import Select from "react-select";

// import BarChart from "./BarChart";
export default class VerticalChartStore extends BaseComponent {
  constructor(props) {
    super(props);

    this.fieldSelected.range = "";

    this.lstOptAVG = [
      {
        value: 1,
        label: "0 - 10M",
      },
      {
        value: 2,
        label: "10M - 20M",
      },
      {
        value: 3,
        label: "20M - 30M",
      },
      {
        value: 4,
        label: "> 30M",
      },
    ];

    this.isRender = true;
  }

  componentDidMount() {
    this.handleHoverChart();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.items !== this.props.items) {
    //     this.handleHoverChart();
    // }

    this.handleHoverChart();
  }

  handleHoverChart = () => {
    var divTooltip = document.querySelector(".wrap-tooltip-chart");
    var tooltip = document.querySelectorAll(".tooltip-chart");

    for (let i = 0; i < tooltip.length; i++) {
      tooltip[i].addEventListener("mousemove", function (e) {
        divTooltip.classList.add("show");
        divTooltip.style.top = e.pageY - 15 + "px";
        divTooltip.style.left = e.pageX + 10 + "px";
        let val = e.target.dataset.grosssale;

        document.querySelector(".value-gs").innerHTML =
          StringHelper.formatPrice(val);
      });

      tooltip[i].addEventListener("mouseout", function (e) {
        divTooltip.classList.remove("show");
        divTooltip.style.top = 0;
        divTooltip.style.left = 0;
        document.querySelector(".value-gs").innerHTML = 0;
      });
    }
  };

  setRangeColor = (value) => {
    if (value > 30000000) {
      return "#00C49F";
    } else if (value > 20000000) {
      return "#0088FE";
    } else if (value > 10000000) {
      return "#FFBB28";
    } else {
      return "#FF8042";
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

  roundMaxNum = (number) => {
    if (number.toString().length > 0) {
      let newFirst = "";
      let newSencond = "";
      let numFirst = number.toString().substring(0, 1);
      let numSecond =
        number.toString().length > 1
          ? number.toString().substring(1, number.toString().length)
          : null;

      if (parseInt(numFirst) === 9) {
        newFirst = "11";
      } else if (parseInt(numFirst) === 8) {
        newFirst = "10";
      } else if (parseInt(numFirst) === 7) {
        newFirst = "9";
      } else if (parseInt(numFirst) === 6) {
        newFirst = "8";
      } else if (parseInt(numFirst) === 5) {
        newFirst = "7";
      } else if (parseInt(numFirst) === 4) {
        newFirst = "6";
      } else if (parseInt(numFirst) === 3) {
        newFirst = "5";
      } else if (parseInt(numFirst) === 2) {
        newFirst = "4";
      } else if (parseInt(numFirst) === 1) {
        newFirst = "3";
      } else {
        newFirst = "2";
      }

      for (var i = 0; i < numSecond.length; i++) {
        newSencond += "0";
      }

      return numSecond ? parseInt(newFirst + newSencond) : parseInt(newFirst);
    }
  };

  handleCreateLine = (value, numLine) => {
    let arr = [];
    if (numLine) {
      let onePer = 100 / (numLine - 1);

      for (let i = 0; i <= numLine - 1; i++) {
        arr.push({
          value: onePer * i,
          label: (onePer * i * value) / 100,
        });
      }
    }

    return arr;
  };

  addRange = (value) => {
    if (value >= 0 && value <= 10000000) {
      return 1;
    } else if (value > 10000000 && value <= 20000000) {
      return 2;
    } else if (value > 20000000 && value <= 30000000) {
      return 3;
    } else {
      return 4;
    }
  };

  handleFilter = (lst) => {
    let newList = lst || [];
    if (lst) {
      newList =
        this.fieldSelected.range !== ""
          ? lst.filter((a) => a.range === this.fieldSelected.range)
          : lst;
    }
    return newList;
  };

  handleChooseRange = (e, value) => {
    var btn = document.querySelectorAll(".btn-range");

    for (let i = 0; i < btn.length; i++) {
      let item = btn[i];

      if (item.classList.contains("active")) {
        item.classList.remove("active");
      }
    }

    var target = e.target;
    target.closest(".btn-range").classList.add("active");
    this.fieldSelected.range = value;
    this.refresh();
  };

  handleSum = (arr) => {
    let sum = 0;

    for (let k in arr) {
      let item = arr[k];
      sum += parseFloat(item.grossSales);
    }

    return sum;
  };

  renderComp() {
    let lstItem = this.props.items || [];
    for (let key in lstItem) {
      let target = lstItem[key];
      target.range = this.addRange(target.grossSales);
    }

    let items = this.handleFilter(lstItem);
    items.sort(function (a, b) {
      return a.storeCode === b.storeCode
        ? 0
        : a.storeCode > b.storeCode
        ? 1
        : -1;
    });

    const grossSale = items.map((obj) => {
      return obj.grossSales;
    });
    const maxGross = Math.max(...grossSale);

    let maxRoundGross = this.roundMaxNum(maxGross);
    let lineArr = this.handleCreateLine(maxRoundGross, 5);
    let avg = (25000000 * 100) / maxRoundGross;

    let lstOptAVG = this.lstOptAVG;
    let mh = items.length <= 10 ? "auto" : 240;

    return (
      <div className="verticalChart">
        <div className="row">
          <div className="col-md-12 fs-i fs-10" style={{ marginBottom: 30 }}>
            <div>
              AVG : <span className="cl-red mrr-10">25M ----</span>
            </div>
            <div
              className="btn-range active pd-4 br-2 cursor d-inline-block mrr-10"
              onClick={(e) => this.handleChooseRange(e, "")}
            >
              View all
            </div>
            <div
              className="btn-range cursor pd-4 br-2 d-inline-block mrr-10"
              onClick={(e) => this.handleChooseRange(e, 1)}
            >
              <span
                className="d-inline-block"
                style={{
                  background: "#FF8042",
                  width: 12,
                  height: 12,
                  verticalAlign: "middle",
                  borderRadius: 2,
                }}
              ></span>{" "}
              {"0 - 10M(<=)"}
            </div>
            <div
              className="btn-range cursor pd-4 br-2 d-inline-block mrr-10"
              onClick={(e) => this.handleChooseRange(e, 2)}
            >
              <span
                className="d-inline-block"
                style={{
                  background: "#FFBB28",
                  width: 12,
                  height: 12,
                  verticalAlign: "middle",
                  borderRadius: 2,
                }}
              ></span>{" "}
              {"10M(>) - 20M(<=)"}
            </div>
            <div
              className="btn-range cursor pd-4 br-2 d-inline-block mrr-10"
              onClick={(e) => this.handleChooseRange(e, 3)}
            >
              <span
                className="d-inline-block"
                style={{
                  background: "#0088FE",
                  width: 12,
                  height: 12,
                  verticalAlign: "middle",
                  borderRadius: 2,
                }}
              ></span>{" "}
              {"20M(>) - 30M(<=)"}
            </div>
            <div
              className="btn-range cursor pd-4 br-2 d-inline-block"
              onClick={(e) => this.handleChooseRange(e, 4)}
            >
              <span
                className="d-inline-block"
                style={{
                  background: "#00C49F",
                  width: 12,
                  height: 12,
                  verticalAlign: "middle",
                  borderRadius: 2,
                }}
              ></span>{" "}
              {"30M(>)"}
            </div>
            <div className="col-md-12">
              <div className="row text-right">
                <div className="d-inline-block pd-5 bg-note">
                  Store: {StringHelper.formatValue(items.length)}
                </div>
                <div className="d-inline-block pd-5 bg-note">
                  Gross sale: {StringHelper.formatValue(this.handleSum(items))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="pos-relative mrt-20">
            {items.length > 0 ? (
              <>
                <div
                  className="row pos-absolute"
                  style={{ left: 0, right: 0, bottom: 0, top: 0 }}
                >
                  <div className="col-md-3"></div>
                  <div className="col-md-9" style={{ height: "100%" }}>
                    <div
                      className="pos-relative"
                      style={{ height: "100%", background: "azure" }}
                    >
                      {lineArr.length > 0 ? (
                        <>
                          {maxRoundGross >= 25000000 ? (
                            <>
                              <span
                                className="pos-absolute"
                                style={{
                                  left: avg + "%",
                                  height: "100%",
                                  width: 1,
                                  borderLeft: "1px dashed rgba(255,0,0,0.4)",
                                  zIndex: 2,
                                }}
                              >
                                {/* <span className="pos-absolute d-inline-block cl-red fw-bold" style={{top:-18,left:'50%',transform: 'translateX(-50%)',zIndex:2}}>{this.countLength(25000000)}</span> */}
                              </span>
                            </>
                          ) : null}
                          {lineArr.map((el, i) => (
                            <span
                              key={i}
                              className="pos-absolute"
                              style={{
                                left: el.value + "%",
                                height: "100%",
                                width: 1,
                                borderLeft: "1px dashed lightgray",
                              }}
                            >
                              <span
                                className="pos-absolute d-inline-block"
                                style={{
                                  top: -18,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  color: "grey",
                                }}
                              >
                                {this.countLength(el.label)}
                              </span>
                            </span>
                          ))}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="pos-relative wrap-dataChart"
                      style={{
                        minHeight: mh,
                        maxHeight: "calc(100vh - 290px)",
                        overflow: "hidden scroll",
                        marginRight: -18,
                      }}
                    >
                      {items.map((el, i) => (
                        <div key={el.storeCode} className="row fs-8">
                          <div
                            className="col-md-3"
                            style={{ lineHeight: "18px", paddingRight: 0 }}
                          >
                            <span className="d-block text-right">
                              {el.storeCode}
                            </span>
                          </div>
                          <div className="col-md-9">
                            <div className="pos-relative">
                              <div
                                className="pos-relative d-inline-block h18 tooltip-chart"
                                data-grosssale={el.grossSales}
                                style={{
                                  background: this.setRangeColor(el.grossSales),
                                  width:
                                    (el.grossSales / maxRoundGross) * 100 + "%",
                                }}
                              >
                                <label
                                  className={"pos-absolute"}
                                  data-grosssale={el.grossSales}
                                  style={{
                                    lineHeight: "18px",
                                    right: 0,
                                    paddingLeft: 5,
                                    transform: "translateX(100%)",
                                  }}
                                >
                                  {this.countLength(el.grossSales)}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>Data not found</div>
            )}

            <div className="wrap-tooltip-chart">
              <div>
                <strong>Gross sales: </strong>
                <span className="value-gs">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
