import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, useImperativeHandle } from 'react';
import Select from 'react-select';
import { DeviceContext } from 'components/mainContent/manageDevice';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';

const Terminals = React.forwardRef((props, ref) => {
  const deviceContext = useContext(DeviceContext);
  const inputList = deviceContext.terminals.get;
  const setInputList = deviceContext.terminals.set;
  const optionListTerminal = deviceContext.resterminalsPartner.get;

  const itemsRef = useRef([]);

  useImperativeHandle(ref, () => ({
    hanldeFocusSelect(index) {
      itemsRef.current[index].focus();
    },
  }));

  const hanldeChangeInputSelect = (e, index) => {
    const elm = e || { value: '', label: '' };

    const list = [...inputList];

    list[index]['codeName'] = elm.value;
    setInputList(list);
  };

  const hanldeAddInput = () => {
    setInputList([...inputList, { codeName: '', codeValue: '' }]);
  };

  const hanldeChangeInput = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const hanldeRemoveInput = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-4">
                <label>E-payment:</label>
              </div>
              <div className="col-md-4">
                <label>Detail:</label>
              </div>
            </div>

            {inputList.map((x, i) => {
              return (
                <div key={i} className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      {optionListTerminal && optionListTerminal.length !== 0 && (
                        <Select
                          ref={(ref) => (itemsRef.current[i] = ref)}
                          name="codeName"
                          placeholder="Enter code"
                          isClearable
                          classNamePrefix="select"
                          value={optionListTerminal.filter((el) => el.value === inputList[i]['codeName'])}
                          options={optionListTerminal}
                          onChange={(e) => hanldeChangeInputSelect(e, i)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <input
                        name="codeValue"
                        placeholder="Enter value"
                        value={x.codeValue}
                        onChange={(e) => hanldeChangeInput(e, i)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group flex flex-col " style={{ gap: 15 }}>
                      {inputList.length !== 1 && (
                        <BaseButton iconName="minus" onClick={() => hanldeRemoveInput(i)}></BaseButton>
                      )}
                      {inputList.length - 1 === i && <BaseButton iconName="plus" onClick={hanldeAddInput}></BaseButton>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }, [inputList, optionListTerminal]);

  return bodyContent;
});
export default React.memo(Terminals);
