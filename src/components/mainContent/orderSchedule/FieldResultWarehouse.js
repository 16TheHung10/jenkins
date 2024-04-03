import { OrderScheduleContext } from "components/mainContent/orderSchedule";
import React, { useContext, useMemo } from "react";
import SelectBox from "utils/selectBox";

function FieldResultWarehouse(props) {
  const orderScheduleContext = useContext(OrderScheduleContext);

  const hanldeChangeInputSelect = (e) => {
    // const elm = e || { value: "", label: "" };

    orderScheduleContext.selectedDataWarehouse.set(e);
  };

  const bodyContent = useMemo(() => {
    let warehouseOptions = Object.keys(orderScheduleContext.listWarehouse.get)
      .sort()
      .map((x) => {
        return {
          value: orderScheduleContext.listWarehouse.get[x].storeCode,
          label:
            orderScheduleContext.listWarehouse.get[x].storeCode +
            " - " +
            orderScheduleContext.listWarehouse.get[x].storeName,
        };
      });

    return (
      <>
        <SelectBox
          data={warehouseOptions}
          funcCallback={hanldeChangeInputSelect}
          defaultValue={orderScheduleContext.selectedDataWarehouse.get}
          isMode={""}
        />
      </>
    );
  }, [
    orderScheduleContext.selectedDataWarehouse.get,
    orderScheduleContext.listWarehouse.get,
    orderScheduleContext.isUpdateWare.get,
  ]);

  return bodyContent;
}

export default React.memo(FieldResultWarehouse);
