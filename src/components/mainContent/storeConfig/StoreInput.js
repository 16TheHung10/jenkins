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
import { StoreContext } from "components/mainContent/storeConfig";
import { arrayToObject } from "helpers/ConvertType";

const StoreInput = React.forwardRef((props, ref) => {
  const storeContext = useContext(StoreContext);

  const itemsStoreRef = useRef([]);

  useImperativeHandle(ref, () => ({
    hanldeFocusSelect(index) {
      itemsStoreRef.current[index].focus();
    },
  }));

  const hanldeChangeInputSelect = (e) => {
    const elm = e || { value: "", label: "" };

    storeContext.storeItem.set(elm.value);
  };

  const bodyContent = useMemo(() => {
    let storeOptions = Object.keys(storeContext.storeList.get)
      .sort()
      .map((x) => {
        return {
          value: storeContext.storeList.get[x].storeCode,
          label:
            storeContext.storeList.get[x].storeCode +
            " - " +
            storeContext.storeList.get[x].storeName,
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
            isDisabled={storeContext.isIdUpdate.get}
            classNamePrefix="select"
            value={storeOptions.filter(
              (el) => el.value === storeContext.storeItem.get,
            )}
            options={storeOptions}
            onChange={(e) => hanldeChangeInputSelect(e)}
          />
        </div>
      </>
    );
  }, [
    storeContext.storeItem.get,
    storeContext.storeList.get,
    storeContext.isIdUpdate.get,
  ]);

  return bodyContent;
});

export default React.memo(StoreInput);
