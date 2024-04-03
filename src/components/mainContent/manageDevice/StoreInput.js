import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useImperativeHandle,
} from "react";
import Select from "react-select";
import { DeviceContext } from "components/mainContent/manageDevice";
import { arrayToObject } from "helpers/ConvertType";

const StoreInput = React.forwardRef((props, ref) => {
  const deviceContext = useContext(DeviceContext);

  const itemsStoreRef = useRef([]);

  useImperativeHandle(ref, () => ({
    hanldeFocusSelect(index) {
      itemsStoreRef.current[index].focus();
    },
  }));

  const hanldeChangeInputSelect = (e) => {
    const elm = e || { value: "", label: "" };

    deviceContext.storeCode.set(elm.value);
  };

  const bodyContent = useMemo(() => {
    let storeOptions = Object.keys(deviceContext.storeList.get)
      .sort()
      .map((x) => {
        return {
          value: deviceContext.storeList.get[x].storeCode,
          label:
            deviceContext.storeList.get[x].storeCode +
            " - " +
            deviceContext.storeList.get[x].storeName,
        };
      });

    return (
      <>
        <div className="form-group">
          <label className="w100pc">Store:</label>

          <Select
            ref={(ref) => (itemsStoreRef.current[0] = ref)}
            name="storeCode"
            placeholder="Enter store"
            isClearable
            classNamePrefix="select"
            value={storeOptions.filter(
              (el) => el.value === deviceContext.storeCode.get,
            )}
            options={storeOptions}
            onChange={(e) => hanldeChangeInputSelect(e)}
          />
        </div>
      </>
    );
  }, [
    deviceContext.storeCode.get,
    deviceContext.storeList.get,
    deviceContext.isIdUpdate.get,
  ]);

  return bodyContent;
});

export default React.memo(StoreInput);
