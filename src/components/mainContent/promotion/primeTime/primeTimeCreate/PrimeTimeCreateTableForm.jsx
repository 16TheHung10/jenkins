import { Row, Tabs } from "antd";
import React, { useState } from "react";

const PrimeTimeCreateTableForm = ({ TabItems }) => {
  return (
    <div className="box-shadow w-full mt-0">
      <Row gutter={[16, 16]} className="w-full">
        {TabItems}
      </Row>
    </div>
  );
};

export default PrimeTimeCreateTableForm;
