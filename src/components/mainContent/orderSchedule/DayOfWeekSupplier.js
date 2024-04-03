import { OrderScheduleContext } from 'components/mainContent/orderSchedule';
import React, { useContext, useMemo } from 'react';

function DayOfWeekSupplier(props) {
  const orderScheduleContext = useContext(OrderScheduleContext);

  const handleChecked = (e) => {
    let elm = e.target;
    let value = elm.value;

    let arr = [...orderScheduleContext.dayOfWeeksSupplierActived.get];

    if (!arr.includes(value)) {
      arr.push(value);
    } else {
      let newArr = arr.filter((ar) => ar !== value);
      arr = newArr;
    }

    orderScheduleContext.dayOfWeeksSupplierActived.set(arr);
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
                checked={orderScheduleContext.dayOfWeeksSupplierActived.get.includes(item) ? true : false}
                onChange={(e) => handleChecked(e)}
                value={item}
              />{' '}
              <span className="d-inline-block">{orderScheduleContext.dayOfWeeks.get[item]}</span>
            </label>
          ))}
        </div>
      </>
    );
  }, [orderScheduleContext.dayOfWeeks.get, orderScheduleContext.dayOfWeeksSupplierActived.get, handleChecked]);

  return bodyContent;
}

export default React.memo(DayOfWeekSupplier);
