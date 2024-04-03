import { message } from "antd";
import { usePromotionStatus } from "hooks";
import PromotionModel from "models/PromotionModel";
import React from "react";

const UpdatePromotionStatus = ({ service, initialData, ...props }) => {
  const { Component: StatusSwitch } = usePromotionStatus(
    service,
    initialData === 1 ? true : false,
  );
  return <StatusSwitch {...props} />;
};

export default UpdatePromotionStatus;
