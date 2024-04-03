import { OrderScheduleContext } from 'components/mainContent/orderSchedule';
import React, { useContext, useMemo } from 'react';

function DayOfWeekWarehouse(props) {
  const orderScheduleContext = useContext(OrderScheduleContext);

  const handleChecked = (e) => {
    let elm = e.target;
    let value = elm.value;

    let arr = [...orderScheduleContext.dayOfWeeksWarehouseActived.get];

    if (!arr.includes(value)) {
      arr.push(value);
    } else {
      let newArr = arr.filter((ar) => ar !== value);
      arr = newArr;
    }

    orderScheduleContext.dayOfWeeksWarehouseActived.set(arr);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <div className="h-30 flex" style={{ alignItems: 'center' }}>
          Day of week: &nbsp;
          {Object.keys(orderScheduleContext.dayOfWeeks.get).map((item, i) => (
            <label key={i} style={{ marginRight: 10, verticalAlign: 'middle' }}>
              <input
                className="d-inline-block"
                type="checkbox"
                name="dayOfWeeks"
                checked={orderScheduleContext.dayOfWeeksWarehouseActived.get.includes(item) ? true : false}
                onChange={(e) => handleChecked(e)}
                value={item}
              />{' '}
              <span className="d-inline-block">{orderScheduleContext.dayOfWeeks.get[item]}</span>
            </label>
          ))}
        </div>
      </>
    );
  }, [orderScheduleContext.dayOfWeeks.get, orderScheduleContext.dayOfWeeksWarehouseActived.get, handleChecked]);

  return bodyContent;
}

export default React.memo(DayOfWeekWarehouse);
