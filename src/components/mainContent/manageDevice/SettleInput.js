import React, { useContext, useRef, useMemo } from 'react';
import Select from 'react-select';
import { DeviceContext } from 'components/mainContent/manageDevice';

const SettleInput = React.forwardRef((props, ref) => {
  const deviceContext = useContext(DeviceContext);
  const itemsRef = useRef(null);
  const optionList = deviceContext.resSettle.get;

  const hanldeChangeInputSelect = (e, index) => {
    const elm = e || { value: '', label: '' };

    deviceContext.ipSettle.set(elm.value);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <div className="form-group">
          <label className="w100pc">EDC Banking Settlement</label>
          <Select
            ref={(ref) => (itemsRef.current = ref)}
            name="ipSettleInput"
            placeholder="Enter code"
            isClearable
            classNamePrefix="select"
            value={optionList.filter((el) => el.value === deviceContext.ipSettle.get)}
            options={optionList}
            onChange={(e) => hanldeChangeInputSelect(e)}
          />
        </div>
      </>
    );
  }, [deviceContext.ipSettle.get, deviceContext.resSettle.get]);

  return bodyContent;
});
export default React.memo(SettleInput);
