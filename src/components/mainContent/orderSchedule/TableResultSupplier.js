import React, { useContext, useMemo, useEffect } from "react";
import { OrderScheduleContext } from "components/mainContent/orderSchedule";
import DateHelper from "helpers/DateHelper";

function TableResultSupplier(props) {
  const orderScheduleContext = useContext(OrderScheduleContext);

  const handleUpdate = (elm) => {
    const data = orderScheduleContext.dataSupplier.get;
    const result = data.filter((x) =>
      x.supplierCode.includes(elm.supplierCode),
    );
    const target = result.shift();

    orderScheduleContext.isUpdateSupp.set(true);

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

    orderScheduleContext.selectedSupplier.set(target.supplierCode);
    orderScheduleContext.dayOfWeeksSupplierActived.set(arrActive);
    orderScheduleContext.orderCycleSupp.set(target.orderCycle);
  };

  useEffect(() => {
    const selected = orderScheduleContext.selectedSupplier.get;
    const data = orderScheduleContext.dataSupplier.get;
    if (data) {
      const result =
        selected !== ""
          ? data.filter((x) => x.supplierCode.includes(selected))
          : [];

      if (result.length > 0) {
        const target = result.shift();
        handleUpdate(target);
      }

      filterStore();
    }
  }, [orderScheduleContext.selectedSupplier.get]);

  const filterStore = () => {
    var i;
    var x = document.getElementsByClassName("tb-row-supp");
    let suppSelect = orderScheduleContext.selectedSupplier.get;
    for (i = 0; i < x.length; i++) {
      if (
        suppSelect &&
        suppSelect !== "" &&
        x[i].getAttribute("code") !== suppSelect
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
              <th>Supplier name</th>
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
            {orderScheduleContext.dataSupplier.get !== null
              ? orderScheduleContext.dataSupplier.get.map((elm, index) => (
                  <tr
                    key={index}
                    onDoubleClick={() => handleUpdate(elm)}
                    className="tb-row-supp"
                    code={elm.supplierCode}
                  >
                    <td>{elm.supplierName}</td>
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
        {orderScheduleContext.dataSupplier.get === null ||
        orderScheduleContext.dataSupplier.get.length === 0 ? (
          <div className="table-message">Item not found</div>
        ) : null}
      </div>
    );
  }, [orderScheduleContext.dataSupplier.get]);

  return bodyContent;
}

export default React.memo(TableResultSupplier);
