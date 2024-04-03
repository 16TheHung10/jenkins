import React, { useContext, useMemo } from "react";

import FieldResultSupplier from "components/mainContent/orderSchedule/FieldResultSupplier";
import DayOfWeekSupplier from "components/mainContent/orderSchedule/DayOfWeekSupplier";
import OrderCycleSupp from "components/mainContent/orderSchedule/OrderCycleSupp";
import TableResultSupplier from "components/mainContent/orderSchedule/TableResultSupplier";
import AlertHelper from "helpers/AlertHelper";
import ReportModel from "models/ReportingModel";

import { OrderScheduleContext } from "components/mainContent/orderSchedule";
import { Col, Row, Space } from "antd";

function ResultSupplier(props) {
  const orderScheduleContext = useContext(OrderScheduleContext);

  const showAlert = (msg, type = "error") => {
    AlertHelper.showAlert(msg, type);
  };

  const resetForm = () => {
    orderScheduleContext.selectedSupplier.set("");
    orderScheduleContext.dayOfWeeksSupplierActived.set([]);
    orderScheduleContext.orderCycleSupp.set(0);
    orderScheduleContext.isUpdateSupp.set(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleAdd = async () => {
    if (orderScheduleContext.selectedSupplier.get === "") {
      showAlert("Please input supplier");
      return;
    }

    const activedDay = [...orderScheduleContext.dayOfWeeksSupplierActived.get];
    const orderCycle = orderScheduleContext.orderCycleSupp.get;

    const params = {
      input: orderScheduleContext.selectedSupplier.get,
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

  const bodyContent = useMemo(() => {
    return (
      <section>
        <div className="form-filter pd-0">
          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={24}>
                    <h3 className="name-target">Supplier</h3>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xl={6}>
                    <FieldResultSupplier />
                  </Col>
                  <Col xl={4}>
                    <OrderCycleSupp />
                  </Col>
                  <Col xl={14}>
                    <DayOfWeekSupplier />
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
                        {!orderScheduleContext.isUpdateSupp.get
                          ? "Add"
                          : "Update"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-success h-30"
                      >
                        {!orderScheduleContext.isUpdateSupp.get
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
          <TableResultSupplier />
        </div>
      </section>
    );
  }, [orderScheduleContext.isUpdateSupp]);

  return bodyContent;
}

export default React.memo(ResultSupplier);
