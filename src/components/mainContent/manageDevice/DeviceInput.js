import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { DeviceContext } from "components/mainContent/manageDevice";
import { arrayToObject } from "helpers/ConvertType";

function DeviceInput(props) {
  const deviceContext = useContext(DeviceContext);

  const hanldeChangeInput = (e) => {
    const { value } = e.target;
    deviceContext.device.set(value);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <div className="form-group">
          <label className="w100pc">Counter:</label>
          <input
            placeholder="Enter device"
            name="deviceInput"
            value={deviceContext.device.get}
            onChange={(e) => hanldeChangeInput(e)}
            className="form-control"
          />
        </div>
      </>
    );
  }, [deviceContext.device.get]);

  return bodyContent;
}
export default React.memo(DeviceInput);
