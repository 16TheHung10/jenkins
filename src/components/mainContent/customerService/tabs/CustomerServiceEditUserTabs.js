import React from "react";
import { Tabs } from "antd";
import SmsHistory from "./SmsHistory";
import "./style.scss";
import LogRecent from "./logRecent/LogRecent";
import CheckInfoApp from "./checkInfoApp/CheckInfoApp";
const CustomerServiceEditUserTabs = ({ memberCode, isDrawerOpen }) => {
  const items = [
    {
      key: "1",
      label: `Log recent`,
      children: (
        <LogRecent memberCode={memberCode} isDrawerOpen={isDrawerOpen} />
      ),
    },
    {
      key: "2",
      label: `Log SMS`,
      children: (
        <SmsHistory memberCode={memberCode} isDrawerOpen={isDrawerOpen} />
      ),
    },
  ];
  return <Tabs id="tabs_container" defaultActiveKey="1" items={items} />;
};

export default CustomerServiceEditUserTabs;
