import { Switch, message } from "antd";
import React, { useState } from "react";

const usePromotionStatus = (service, initialStatus) => {
  // model = PromotionModel
  const [isActive, setIsActive] = useState(initialStatus);
  const handleChangeStatus = async (status) => {
    // status : 0 (1)
    const res = await service({
      status,
    });
    if (res.status) {
      message.success("Update status successfully !!!");
      setIsActive(status === 0 ? false : true);
    } else {
      message.error(res.statusCode + res.message);
    }
  };

  const Component = (props) => {
    return (
      <Switch
        checkedChildren="Active"
        onChange={(checked) => {
          handleChangeStatus(checked ? 1 : 0);
        }}
        unCheckedChildren="Active"
        checked={isActive}
        {...props}
      />
    );
  };
  return { Component };
};

export default usePromotionStatus;
