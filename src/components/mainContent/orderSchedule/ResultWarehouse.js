import React, { useContext, useMemo } from "react";

import FieldResultWarehouse from "components/mainContent/orderSchedule/FieldResultWarehouse";
import DayOfWeekWarehouse from "components/mainContent/orderSchedule/DayOfWeekWarehouse";
import OrderCycleWare from "components/mainContent/orderSchedule/OrderCycleWare";
import TableResultWarehouse from "components/mainContent/orderSchedule/TableResultWarehouse";
import AlertHelper from "helpers/AlertHelper";
import ReportModel from "models/ReportingModel";

import { OrderScheduleContext } from "components/mainContent/orderSchedule";
import { Col, Row, Space } from "antd";

function ResultWarehouse(props) {
  const orderScheduleContext = useContext(OrderScheduleContext);

  const showAlert = (msg, type = "error") => {
    AlertHelper.showAlert(msg, type);
  };

  const resetForm = () => {
    orderScheduleContext.selectedDataWarehouse.set("");
    orderScheduleContext.dayOfWeeksWarehouseActived.set([]);
    orderScheduleContext.orderCycleWare.set(0);
    orderScheduleContext.isUpdateWare.set(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleAdd = async () => {
    if (orderScheduleContext.selectedDataWarehouse.get === "") {
      showAlert("Please input warehouse");
      return;
    }

    const activedDay = [...orderScheduleContext.dayOfWeeksWarehouseActived.get];
    const orderCycle = orderScheduleContext.orderCycleWare.get;

    const params = {
      input: orderScheduleContext.selectedDataWarehouse.get,
      orderCycle: orderCycle,
    };

    for (let elm in activedDay) {
      params[activedDay[elm]] = 1;
    }

    let obj = {
      type: "orderschedule",
      body: params,
    };

    let answer = window.confirm("Please help me confirm the action");
    if (answer === true) {
      let model = new ReportModel();
      await model.updateDataReport(obj).then((res) => {
        if (res.status) {
          showAlert(res.message, "success");
          orderScheduleContext.fetchData.get();
          resetForm();
        } else {
          showAlert(res.message);
        }
      });
    }
  };

  return (
    <section>
      <div className="form-filter pd-0">
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={24}>
                  <h3 className="name-target">Warehouse</h3>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xl={6}>
                  <FieldResultWarehouse />
                </Col>
                <Col xl={4}>
                  <OrderCycleWare />
                </Col>
                <Col xl={14}>
                  <DayOfWeekWarehouse />
                </Col>
              </Row>
              <Row gutter={16} className="mrt-10">
                <Col xl={24}>
                  <Space size={"small"}>
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="btn btn-success h-30"
                    >
                      {!orderScheduleContext.isUpdateWare.get
                        ? "Add"
                        : "Update"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-success h-30"
                    >
                      {!orderScheduleContext.isUpdateWare.get
                        ? "Reset"
                        : "Cancel"}
                    </button>
                  </Space>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <div className="mrt-10">
        <TableResultWarehouse />
      </div>
    </section>
  );
}

export default React.memo(ResultWarehouse);
