import { Badge, Calendar } from "antd";
import { checkinData } from "data/oldVersion/mockData/checkin";
import { ArrayHelper } from "helpers";
import moment from "moment";
import React from "react";

const CheckInHistoryDetailsMain = () => {
  const getListData = (value) => {
    const object = ArrayHelper.convertArrayToObject(checkinData, "time");
    const formatedValue = moment(value).format();
    const valueOf = object?.[formatedValue];
    if (valueOf) {
      return [];
    }

    return [];
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return <Calendar mode="month" dateCellRender={dateCellRender} />;
};

export default CheckInHistoryDetailsMain;
