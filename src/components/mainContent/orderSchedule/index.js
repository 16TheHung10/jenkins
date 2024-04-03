import React, { useEffect, useState } from "react";

import ResultSupplier from "components/mainContent/orderSchedule/ResultSupplier";
import ResultWarehouse from "components/mainContent/orderSchedule/ResultWarehouse";

import { changeTab } from "helpers/FuncHelper";
import CommonModel from "models/CommonModel";
import ReportModel from "models/ReportingModel";

export const OrderScheduleContext = React.createContext();

function OrderSchedule(props) {
  const [dataSupplier, setDataSupplier] = useState(null);
  const [listSupplier, setListSupplier] = useState({});
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [dayOfWeeksSupplierActived, setDayOfWeeksSupplierActived] = useState(
    [],
  );
  const [orderCycleSupp, setOrderCycleSupp] = useState(0);
  const [isUpdateSupp, setIsUpdateSupp] = useState(false);

  const [dataWarehouse, setDataWarehouse] = useState(null);
  const [listWarehouse, setListWarehouse] = useState({});
  const [selectedDataWarehouse, setSelectedDataWarehouse] = useState("");
  const [dayOfWeeksWarehouseActived, setDayOfWeeksWarehouseActived] = useState(
    [],
  );
  const [orderCycleWare, setOrderCycleWare] = useState(0);
  const [isUpdateWare, setIsUpdateWare] = useState(false);

  const [dayOfWeeks, setDayOfWeeks] = useState({
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  });

  const fetchData = async () => {
    const type = "orderschedule";
    let model = new ReportModel();

    await model.getDataReporting(type).then((res) => {
      if (
        res.status &&
        res.data.schedulesupplier &&
        res.data.schedulewarehouse
      ) {
        globalState.dataSupplier.set(res.data.schedulesupplier);
        globalState.dataWarehouse.set(res.data.schedulewarehouse);
      }
    });
  };

  const fetchSelect = async () => {
    let model = new CommonModel();

    await model.getData("supplier,store").then((res) => {
      if (res.status && res.data.stores && res.data.suppliers) {
        globalState.listSupplier.set(res.data.suppliers);
        globalState.listWarehouse.set(res.data.stores);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSelect();
  }, []);

  const globalState = {
    dataSupplier: { get: dataSupplier, set: setDataSupplier },
    listSupplier: { get: listSupplier, set: setListSupplier },
    selectedSupplier: { get: selectedSupplier, set: setSelectedSupplier },
    dayOfWeeksSupplierActived: {
      get: dayOfWeeksSupplierActived,
      set: setDayOfWeeksSupplierActived,
    },
    orderCycleSupp: { get: orderCycleSupp, set: setOrderCycleSupp },
    isUpdateSupp: { get: isUpdateSupp, set: setIsUpdateSupp },

    dataWarehouse: { get: dataWarehouse, set: setDataWarehouse },
    listWarehouse: { get: listWarehouse, set: setListWarehouse },
    selectedDataWarehouse: {
      get: selectedDataWarehouse,
      set: setSelectedDataWarehouse,
    },
    dayOfWeeksWarehouseActived: {
      get: dayOfWeeksWarehouseActived,
      set: setDayOfWeeksWarehouseActived,
    },
    orderCycleWare: { get: orderCycleWare, set: setOrderCycleWare },
    isUpdateWare: { get: isUpdateWare, set: setIsUpdateWare },

    dayOfWeeks: { get: dayOfWeeks, set: setDayOfWeeks },
    fetchData: { get: fetchData },
  };

  return (
    <OrderScheduleContext.Provider value={globalState}>
      <div className="row">
        <div>
          <div
            className=" top-menu"
            style={{
              margin: "0 -15px",
              padding: "4px 15px 0px 15px",
              overflow: "hidden",
            }}
          >
            <button
              className="btn-orderschedule-tab btn active"
              onClick={(e) =>
                changeTab(
                  "detail-tab",
                  "tab-supplier",
                  e,
                  "btn-orderschedule-tab",
                )
              }
            >
              Supplier
            </button>
            <button
              className="btn-orderschedule-tab btn"
              onClick={(e) =>
                changeTab(
                  "detail-tab",
                  "tab-warehouse",
                  e,
                  "btn-orderschedule-tab",
                )
              }
            >
              Warehouse
            </button>
          </div>
        </div>
      </div>
      <div id="tab-supplier" className="detail-tab mrt-5">
        <ResultSupplier />
      </div>
      <div
        id="tab-warehouse"
        className="detail-tab mrt-5"
        style={{ display: "none" }}
      >
        <ResultWarehouse />
      </div>
    </OrderScheduleContext.Provider>
  );
}

export default React.memo(OrderSchedule);
