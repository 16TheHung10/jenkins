import { Col, Row } from "antd";
import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import React, { Fragment, useEffect, useMemo } from "react";
import DashboardCardHeader from "./DashboardCardHeader/DashboardCardHeader";
import { useHeaderActions } from "hooks";
import { useAppContext } from "contexts";
const CardHeaderData = ({ dataObject }) => {
  const data = useMemo(() => {
    return Object.keys(dataObject)?.map((item, index) => {
      return {
        col: 6,
        key: index,
        title: dataObject?.[item]?.toFixed(2),
        icon: faTicketAlt,
        subTitle: "Current sales",
        iconClass: "color-primary",
      };
    });
  }, [dataObject]);

  return data?.map((item, index) => {
    return (
      <Col span={item.col || 6} key={`card-header-${index}`}>
        <DashboardCardHeader {...item} />
      </Col>
    );
  });
};

const SOHHeader = ({ actions, data }) => {
  const { renderSelectField } = actions;
  const { state, dispatch, onGetStoreData } = useAppContext();
  useEffect(() => {
    onGetStoreData();
  }, []);
  const storeArray = useMemo(() => {
    if (state.stores) {
      return Object.keys(state.stores)?.map((item) => {
        return state.stores[item];
      });
    }
    return [];
  }, [state.stores]);
  return (
    <Fragment>
      <Row gutter={16} className="mt-10">
        <Col span={6}>
          {renderSelectField(storeArray, "storeCode", "storeName", "Store", {
            placeholder: "--ALL--",
          })}
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
        <CardHeaderData dataObject={data} />
      </Row>
    </Fragment>
  );
};

export default SOHHeader;
