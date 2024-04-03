import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { DeviceContext } from "components/mainContent/manageDevice";

function AddressInput(props) {
  const deviceContext = useContext(DeviceContext);

  const hanldeChangeInput = (e) => {
    const { value } = e.target;
    deviceContext.ipAddress.set(value);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <div className="form-group">
          <label className="w100pc">IP address:</label>
          <input
            placeholder="Enter IP address"
            name="ipAddressInput"
            value={deviceContext.ipAddress.get}
            onChange={(e) => hanldeChangeInput(e)}
            className="form-control"
          />
        </div>
      </>
    );
  }, [deviceContext.ipAddress.get]);

  return bodyContent;
}
export default React.memo(AddressInput);
