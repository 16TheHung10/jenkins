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

const NotConfigInput = React.forwardRef((props, ref) => {
  const storeContext = useContext(StoreContext);
  const optionListTerminal = storeContext.resterminalsPartner.get;

  const itemsStoreRef = useRef([]);

  useImperativeHandle(ref, () => ({
    hanldeFocusSelect(index) {
      itemsStoreRef.current[index].focus();
    },
  }));

  const hanldeChangeInputSelect = (e) => {
    const elm = e || { value: "", label: "" };

    storeContext.parterFilter.set(elm.value);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <div className="form-group">
          <label className="w100pc">Not config:</label>

          <Select
            ref={(ref) => (itemsStoreRef.current[0] = ref)}
            name="parterFilter"
            placeholder="Filter Partner"
            isClearable
            classNamePrefix="select"
            value={optionListTerminal.filter(
              (el) => el.value === storeContext.parterFilter.get,
            )}
            options={optionListTerminal}
            onChange={(e) => hanldeChangeInputSelect(e)}
          />
        </div>
      </>
    );
  }, [storeContext.parterFilter.get, optionListTerminal]);

  return bodyContent;
});

export default React.memo(NotConfigInput);
