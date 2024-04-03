import React, { useContext, useMemo, useEffect } from "react";
import { OrderScheduleContext } from "components/mainContent/orderSchedule";
import DateHelper from "helpers/DateHelper";

function TableResultWarehouse(props) {
  const orderScheduleContext = useContext(OrderScheduleContext);

  const handleUpdate = (elm) => {
    const data = orderScheduleContext.dataWarehouse.get;
    const result = data.filter((x) => x.storeCode.includes(elm.storeCode));
    const target = result.shift();

    orderScheduleContext.isUpdateWare.set(true);

    let arrDay = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    let arrActive = [];

    for (let property in elm) {
      arrDay.includes(property) &&
        elm[property] > 0 &&
        arrActive.push(property);
    }

    orderScheduleContext.selectedDataWarehouse.set(target.storeCode);
    orderScheduleContext.dayOfWeeksWarehouseActived.set(arrActive);
    orderScheduleContext.orderCycleWare.set(target.orderCycle);
  };

  useEffect(() => {
    const selected = orderScheduleContext.selectedDataWarehouse.get;
    const data = orderScheduleContext.dataWarehouse.get;

    if (data) {
      const result =
        selected !== ""
          ? data.filter((x) => x.storeCode.includes(selected))
          : [];

      if (result.length > 0) {
        const target = result.shift();
        handleUpdate(target);
      }

      filterStore();
    }
  }, [orderScheduleContext.selectedDataWarehouse.get]);

  const filterStore = () => {
    var i;
    var x = document.getElementsByClassName("tb-row-ware");
    let warehouseSelect = orderScheduleContext.selectedDataWarehouse.get;
    for (i = 0; i < x.length; i++) {
      if (
        warehouseSelect &&
        warehouseSelect !== "" &&
        x[i].getAttribute("code") !== warehouseSelect
      ) {
        x[i].style.display = "none";
      } else {
        x[i].style.display = "table-row";
      }
    }
  };

  const bodyContent = useMemo(() => {
    return (
      <div
        className={"wrap-table table-chart "}
        style={{ overflow: "initial" }}
      >
        <table
          className="table table-hover d-block"
          style={{ maxHeight: "calc(100vh - 256px)", overflow: "auto" }}
        >
          <thead>
            <tr>
              <th>Store name</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
              <th>Sunday</th>
              <th>Order cycle</th>
              <th>Last update</th>
            </tr>
          </thead>
          <tbody>
            {orderScheduleContext.dataWarehouse.get !== null
              ? orderScheduleContext.dataWarehouse.get.map((elm, index) => (
                  <tr
                    key={index}
                    onDoubleClick={() => handleUpdate(elm)}
                    className="tb-row-ware"
                    code={elm.storeCode}
                  >
                    <td>{elm.storeName}</td>
                    <td>{elm.monday}</td>
                    <td>{elm.tuesday}</td>
                    <td>{elm.wednesday}</td>
                    <td>{elm.thursday}</td>
                    <td>{elm.friday}</td>
                    <td>{elm.saturday}</td>
                    <td>{elm.sunday}</td>
                    <td>{elm.orderCycle}</td>
                    <td>{DateHelper.displayDateTime(elm.updatedDate)}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        {orderScheduleContext.dataWarehouse.get === null ||
        orderScheduleContext.dataWarehouse.get.length === 0 ? (
          <div className="table-message">Item not found</div>
        ) : null}
      </div>
    );
  }, [orderScheduleContext.dataWarehouse.get]);

  return bodyContent;
}

export default React.memo(TableResultWarehouse);
