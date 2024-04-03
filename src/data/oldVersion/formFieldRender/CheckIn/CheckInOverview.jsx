import React from "react";
import { Popover, Tooltip } from "antd";
import CONSTANT from "constant";
import { DateHelper } from "helpers";
import moment from "moment";
import * as yup from "yup";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import Icons from "images/icons";

const CheckInOverview = {
  fieldInputs: ({ storeOptions, staffOptions }) => [
    {
      name: "storeCode",
      label: "Store code",
      type: "select",
      labelClass: "required",
      options: storeOptions,
      placeholder: "--Select store--",
      span: 8,
      rules: yup.string().required("Store is required"),
      fixed: "left",
    },
    {
      name: "staffCode",
      label: "Staff code",
      type: "text",
      placeholder: "Enter staff code",
      span: 8,
    },
  ],
  fieldInputsForFilter: () => [
    {
      name: "log",
      label: "Log",
      type: "select",
      placeholder: "-- All --",
      options: [
        {
          value: 1,
          label: "Full logs",
        },
        {
          value: 0,
          label: "Miss logs",
        },
        {
          value: 2,
          label: "Absent",
        },
      ],
    },
  ],
  fieldInputsAddLog: (type) => {
    if (type === "checkin") {
      return [
        {
          name: "checkin",
          label: "Checkin",
          labelClass: "required",
          type: "time-single",
          minuteStep: 15,
          span: 24,
          rules: yup.string().required("Please select time"),
        },
      ];
    }
    if (type === "checkout") {
      return [
        {
          name: "checkout",
          label: "Checkout",
          labelClass: "required",
          type: "time-single",
          span: 24,
          minuteStep: 15,
          rules: yup.string().required("Please select time"),
        },
      ];
    }
    if (type === "fullLog") {
      return [
        {
          name: "checkin",
          label: "Checkin",
          labelClass: "required",
          type: "time-single",
          minuteStep: 15,
          span: 24,
          rules: yup.string().required("Please select time"),
        },
        {
          name: "checkout",
          label: "Checkout",
          labelClass: "required",
          type: "time-single",
          span: 24,
          minuteStep: 15,
          rules: yup.string().required("Please select time"),
        },
      ];
    }
    return null;
  },
  columns: ({ timeRange, onOpenAddLog }) => {
    const allDateInRange =
      DateHelper.getALlDateInRange(timeRange?.[0], timeRange?.[1]) || [];
    let dateColumn = [];
    if (
      allDateInRange &&
      Array.isArray(allDateInRange) &&
      allDateInRange.length > 0
    ) {
    }
    return [
      {
        title: "Employee",
        dataIndex: "employeeATID",
        key: "employeeATID",
        width: 120,
        render: (value, record) => {
          const name = value?.split("-")?.[1];
          const id = value?.split("-")?.[0];
          return (
            <div className="flex flex-col items-start">
              <strong style={{ fontWeight: "bold" }}>{name}</strong>
              <span style={{ color: "#b5b1b1" }}>{id}</span>
            </div>
          );
        },
        // fixed: 'left',
      },

      {
        title: (
          <Tooltip title="Number of working days signed on the contract">
            Reg. shift
          </Tooltip>
        ),
        dataIndex: "contractWorkingDay",
        key: "contractWorkingDay",
        width: 35,
        // fixed: 'left',
        render: (value) => {
          if (!value) return "0";
          return value.length;
        },
      },
      {
        title: (
          <Tooltip title="Total number of log / working day">
            Logs/ work
          </Tooltip>
        ),
        dataIndex: "workingDays",
        key: "workingDays",
        width: 40,
        // fixed: 'left',
        render: (value, record, index) => {
          if (!value) return "0/0";
          const {
            department,
            employeeATID,
            contractWorkingDay,
            workingDays,
            absentDays,
            customID,
            key,
            ...dayData
          } = record;
          let minusLog = 0;
          for (let item of Object.values(dayData)) {
            const firstCheck = item.find((el) => el.inOutMode === 1);
            const lastCheck = item.findLast((el) => el.inOutMode === 2);
            if (!firstCheck && !lastCheck) {
              minusLog += 1;
            } else if (!firstCheck || !lastCheck) {
              minusLog += 0.5;
            }
          }
          return +(value?.length - minusLog) + "/" + value?.length;
        },
      },

      ...allDateInRange?.map((day) => {
        return {
          title: (
            <div
              className="date_cell m-0 text-center "
              style={{ fontSize: "9px" }}
            >
              <span>{moment(day).format("DD/MM")}</span>
              <p
                style={{
                  color: [0, 6].includes(+moment(day).day())
                    ? "red"
                    : "#959494",
                  margin: 0,
                  fontSize: "8px",
                }}
              >
                {DateHelper.getDateOfWeekMoment(
                  +moment(day).day(),
                ).toUpperCase()}{" "}
              </p>
            </div>
          ),
          dataIndex: moment(day).format(CONSTANT.FORMAT_DATE_IN_USE),
          key: moment(day).format(CONSTANT.FORMAT_DATE_IN_USE),
          width: 40,
          render: (value, record, index) => {
            let sortedValueByTime;
            sortedValueByTime = value?.sort((a, b) =>
              a.time.localeCompare(b.time),
            );
            const firstCheckin =
              sortedValueByTime?.find((el) => {
                return el.inOutMode === 1;
              }) || null;
            const lastCheckout =
              sortedValueByTime?.findLast((el) => el.inOutMode === 2) || null;
            let isAbsent = false;
            const isThisDayExistOnContract = record.contractWorkingDay?.find(
              (el) =>
                moment(el.shiftDate).format(CONSTANT.FORMAT_DATE_IN_USE) ===
                moment(day).format(CONSTANT.FORMAT_DATE_IN_USE),
            );
            if (!isThisDayExistOnContract) isAbsent = false;
            else if (
              isThisDayExistOnContract &&
              !firstCheckin &&
              !lastCheckout
            ) {
              isAbsent = true;
            }
            return (
              <div
                className={`flex flex-col ${isAbsent ? "absent" : ""} ${
                  isThisDayExistOnContract &&
                  !isAbsent &&
                  (!lastCheckout || !firstCheckin)
                    ? "miss_log"
                    : ""
                }`}
                style={{
                  borderRadius: "5px",
                }}
              >
                {!firstCheckin && !lastCheckout ? (
                  <span
                    onClick={() => {
                      onOpenAddLog(
                        {
                          ...record,
                          index: index,
                          selectedDate: moment(day).format(
                            CONSTANT.FORMAT_DATE_IN_USE,
                          ),
                        },
                        "fullLog",
                      );
                    }}
                    className="text-center"
                    style={{ color: "var(--primary-color)", fontSize: "10px" }}
                  >
                    <Tooltip placement="top" title="Add log">
                      <Icons.PlusNoRounded />
                    </Tooltip>
                  </span>
                ) : (
                  <div className={``}>
                    <p
                      className={`${
                        firstCheckin ? "check-in log-time-tag" : ""
                      } ${
                        firstCheckin?.isAddLog ? "add-log" : ""
                      } text-center m-0`}
                    >
                      {firstCheckin ? (
                        moment(firstCheckin.time).format("HH:mm")
                      ) : (
                        <span
                          onClick={() => {
                            onOpenAddLog(
                              {
                                ...record,
                                index: index,
                                selectedDate: moment(day).format(
                                  CONSTANT.FORMAT_DATE_IN_USE,
                                ),
                              },
                              "checkin",
                            );
                          }}
                          className="text-center"
                          style={{
                            color: "var(--primary-color)",
                            fontSize: "10px",
                          }}
                        >
                          <Tooltip placement="top" title="Add log">
                            <Icons.PlusNoRounded />
                          </Tooltip>
                        </span>
                      )}
                    </p>
                    <p
                      className={`${
                        lastCheckout ? "check-out log-time-tag" : ""
                      } ${
                        lastCheckout?.isAddLog ? "add-log" : ""
                      } text-center m-0`}
                    >
                      {lastCheckout ? (
                        moment(lastCheckout.time).format("HH:mm")
                      ) : (
                        <span
                          onClick={() => {
                            onOpenAddLog(
                              {
                                ...record,
                                index: index,
                                selectedDate: moment(day).format(
                                  CONSTANT.FORMAT_DATE_IN_USE,
                                ),
                              },
                              "checkout",
                            );
                          }}
                          className="text-center"
                          style={{
                            color: "var(--primary-color)",
                            fontSize: "10px",
                          }}
                        >
                          <Tooltip placement="top" title="Add log">
                            <Icons.PlusNoRounded />
                          </Tooltip>
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            );
          },
        };
      }),
      {
        title: "View more",
        dataIndex: "",
        key: "employeeATID",
        width: 50,
        render: (value, record) => {
          const {
            department,
            employeeATID,
            contractWorkingDay,
            workingDays,
            absentDays,
            customID,
            key,
            ...dayData
          } = record;
          let fullLog = 0;
          let missLog = [];
          return (
            <Popover
              trigger="click"
              placement="right"
              content={
                <div
                  className="symmary-history"
                  style={{ maxHeight: "500px", overflowY: "scroll" }}
                >
                  {Object.keys(dayData)
                    ?.sort((a, b) => a.localeCompare(b))
                    ?.map((item, index) => {
                      const allCheckIn = dayData?.[item]
                        .filter((el) => el.inOutMode === 1)
                        .sort((a, b) => a.time.localeCompare(b.time));
                      const allCheckOut = dayData?.[item]
                        .filter((el) => el.inOutMode === 2)
                        .sort((a, b) => a.time.localeCompare(b.time));
                      return (
                        <div
                          key={`${index}-${item.time}`}
                          className=""
                          style={{ width: "200px", margin: "10px" }}
                        >
                          <p className="color-primary font-bold">
                            Time: {item}
                          </p>
                          <div>
                            <p
                              className="mr-10"
                              style={{
                                display: `${
                                  allCheckIn && allCheckIn.length > 0
                                    ? "block"
                                    : "inline"
                                }`,
                              }}
                            >
                              Check in at :
                            </p>
                            {allCheckIn && allCheckIn.length > 0 ? (
                              <ul>
                                {allCheckIn
                                  ?.sort((a, b) => a.time.localeCompare(b.time))
                                  .map((checkin, index2) => {
                                    return (
                                      <li
                                        style={{
                                          letterSpacing: "3px",
                                          fontWeight: 500,
                                        }}
                                        key={`checkin-${index2}`}
                                      >
                                        {moment(checkin.time).format(
                                          "HH:mm:ss",
                                        )}
                                      </li>
                                    );
                                  })}
                              </ul>
                            ) : (
                              <span
                                className="cl-red"
                                style={{ fontWeight: "600" }}
                              >
                                No check in
                              </span>
                            )}
                          </div>
                          <div>
                            <p
                              className="mr-10"
                              style={{
                                display: `${
                                  allCheckOut && allCheckOut.length > 0
                                    ? "block"
                                    : "inline"
                                }`,
                              }}
                            >
                              Check out at :
                            </p>
                            {allCheckOut && allCheckOut.length > 0 ? (
                              <ul>
                                {allCheckOut
                                  ?.sort((a, b) => a.time.localeCompare(b.time))
                                  .map((checkout, index2) => {
                                    return (
                                      <li
                                        style={{
                                          letterSpacing: "3px",
                                          fontWeight: 500,
                                        }}
                                        key={`checkout-${index2}`}
                                      >
                                        {moment(checkout.time).format(
                                          "HH:mm:ss",
                                        )}
                                      </li>
                                    );
                                  })}
                              </ul>
                            ) : (
                              <span
                                className="cl-red"
                                style={{ fontWeight: "600" }}
                              >
                                No check out
                              </span>
                            )}
                          </div>
                          <hr />
                        </div>
                      );
                    })}
                </div>
              }
              title="More details"
            >
              <BaseButton iconName="search" />
            </Popover>
          );
        },
      },
    ];
  },
};
export default CheckInOverview;
