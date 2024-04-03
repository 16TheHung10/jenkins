import { OrderScheduleContext } from 'components/mainContent/orderSchedule';
import React, { useContext, useMemo } from 'react';

function OrderCycleWare(props) {
  const orderScheduleContext = useContext(OrderScheduleContext);

  const hanldeChangeInput = (e) => {
    const { value } = e.target;
    orderScheduleContext.orderCycleWare.set(value);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <div className="form-group">
          <label className="w100pc" style={{ flexDirection: 'row', gap: 10 }}>
            Order cycle:{' '}
            <input
              style={{
                width: 50,
                display: 'inline-block',
                textAlign: 'center',
              }}
              value={orderScheduleContext.orderCycleWare.get}
              onChange={(e) => hanldeChangeInput(e)}
              className="form-control h-30"
            />
          </label>
        </div>
      </>
    );
  }, [orderScheduleContext.orderCycleWare.get]);

  return bodyContent;
}

export default React.memo(OrderCycleWare);
