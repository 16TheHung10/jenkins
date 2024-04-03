import { OrderScheduleContext } from "components/mainContent/orderSchedule";
import React, { useContext, useMemo } from "react";

import SelectBox from "utils/selectBox";

function FieldResultSupplier(props) {
  const orderScheduleContext = useContext(OrderScheduleContext);

  const hanldeChangeInputSelect = (e) => {
    orderScheduleContext.selectedSupplier.set(e);
  };

  const bodyContent = useMemo(() => {
    let supplierOptions = Object.keys(orderScheduleContext.listSupplier.get)
      .sort()
      .map((x) => {
        return {
          value: orderScheduleContext.listSupplier.get[x].supplierCode,
          label:
            orderScheduleContext.listSupplier.get[x].supplierCode +
            " - " +
            orderScheduleContext.listSupplier.get[x].supplierName,
        };
      });

    return (
      <>
        <SelectBox
          data={supplierOptions}
          funcCallback={hanldeChangeInputSelect}
          defaultValue={orderScheduleContext.selectedSupplier.get}
          isMode={""}
        />
      </>
    );
  }, [
    orderScheduleContext.selectedSupplier.get,
    orderScheduleContext.listSupplier.get,
    orderScheduleContext.isUpdateSupp.get,
  ]);

  return bodyContent;
}

export default React.memo(FieldResultSupplier);
