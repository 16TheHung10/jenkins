import CheckinRoutes from "./CheckinRoutes";
import ContentRoutes from "./ContentRoutes";
import CustomerServiceRoutes from "./CustomerServiceRoutes";
import FeedbackRoutes from "./FeedbackRoutes";
import ITOperationRoute from "./ITOperationRoute";
import LogisticsRoutes from "./LogisticsRoutes";
import MarketingRoutes from "./MarketingRoutes";
import MerchandiserRoutes from "./MerchandiserRoutes";
import StoreRoutes from "./StoreRoutes";
import UsersAndRolesRoutes from "./UsersAndRolesRoutes";
import MainContent from "components/mainContent/MainContent";
import SidebarMenu from "../components/layouts/sidebar/SidebarMenu";
import Header from "components/layouts/header/Header";
import BillRoutes from "./BillRoutes";
import { Col, Row } from "antd";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import React from "react";
import AuthRoutes from "./data/AuthRoutes";

export const Routes = () => {
  const renderRoute = (
    pageName,
    content,
    isShowHeader = true,
    isShowSlideBar = true,
    preLoad = false,
  ) => {
    return (
      <div className="wrap-main ">
        <Row>
          <Col span={24}>
            <div className="flex">
              {isShowSlideBar ? <SidebarMenu /> : null}
              <div
                className="flex flex-col flex-1 relative"
                style={{ background: "#f0f2f5" }}
              >
                {isShowHeader ? (
                  <Header pageName={pageName} preLoad={preLoad} />
                ) : null}
                <div className="flex-1" style={{ marginTop: 46 }}>
                  {content}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };
  const RoutesData = [
    ...CheckinRoutes(),
    ...ContentRoutes(),
    ...CustomerServiceRoutes(),
    ...FeedbackRoutes(),
    ...ITOperationRoute(),
    ...LogisticsRoutes(),
    ...MarketingRoutes(),
    ...MerchandiserRoutes(),
    ...StoreRoutes(),
    ...UsersAndRolesRoutes(),
    ...BillRoutes(),
    ...AuthRoutes(),
  ];
  return RoutesData.map((item) => {
    return (
      <Route
        exact
        path={item.path}
        render={(props) =>
          renderRoute(
            item.pageTitle,
            <MainContent
              page={item.pageComponent}
              params={props.match.params}
              {...props}
              {...item.props}
            />,
          )
        }
      />
    );
  });
};
