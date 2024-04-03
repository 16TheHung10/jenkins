import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
} from "react";
import Select from "react-select";
import { StoreContext } from "components/mainContent/storeConfig";
import BaseButton from "components/common/buttons/baseButton/BaseButton";

const Partner = React.forwardRef((props, ref) => {
  const storeContext = useContext(StoreContext);
  const inputList = storeContext.partner.get;
  const setInputList = storeContext.partner.set;
  const optionListTerminal = storeContext.resterminalsPartner.get;

  const itemsRef = useRef([]);

  useImperativeHandle(ref, () => ({
    hanldeFocusSelect(index) {
      itemsRef.current[index].focus();
    },
  }));

  const hanldeChangeInputSelect = (e, index) => {
    const elm = e || { value: "", label: "" };

    const list = [...inputList];

    list[index]["codeName"] = elm.value;
    if (storeContext.listTemplate.get.includes(elm.value)) {
      let obj = {};
      storeContext.keepPartner.get[elm.value].template.map((x) => {
        obj[x] = "";
      });

      list[index]["template"] = obj;
    } else {
      list[index]["template"] = null;
    }
    setInputList(list);
  };

  const hanldeAddInput = () => {
    setInputList([
      ...inputList,
      { codeName: "", codeValue: "", template: null },
    ]);
  };

  const hanldeChangeInput = (e, index, template) => {
    const { name, value } = e.target;
    const list = [...inputList];

    if (template) {
      list[index]["template"][name] = value;
    } else {
      list[index][name] = value;
    }
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
            <label>Partner:</label>

            {inputList.map((x, i) => {
              return (
                <div key={i} className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <Select
                        ref={(ref) => (itemsRef.current[i] = ref)}
                        name="codeName"
                        placeholder="Enter code"
                        isClearable
                        classNamePrefix="select"
                        value={optionListTerminal.filter(
                          (el) => el.value === inputList[i]["codeName"],
                        )}
                        options={optionListTerminal}
                        onChange={(e) => hanldeChangeInputSelect(e, i)}
                      />
                      {/* {optionListTerminal && optionListTerminal.length !== 0 && (
                                                <Select
                                                    ref={(ref) => (itemsRef.current[i] = ref)}
                                                    name="codeName"
                                                    placeholder="Enter code"
                                                    isClearable
                                                    classNamePrefix="select"
                                                    value={optionListTerminal.filter((el) => el.value === inputList[i]["codeName"])}
                                                    options={optionListTerminal}
                                                    onChange={(e) => hanldeChangeInputSelect(e, i)}
                                                />
                                            )} */}
                    </div>
                  </div>

                  {(x.template === undefined || x.template === null) && (
                    <div className="col-md-4">
                      <div className="form-group">
                        <input
                          name="codeValue"
                          placeholder="Enter value"
                          value={x.codeValue}
                          disabled={storeContext.islock.get}
                          onChange={(e) => hanldeChangeInput(e, i)}
                          className="form-control key-codeValue"
                        />
                      </div>
                    </div>
                  )}

                  {x.template !== null && (
                    <div className="col-md-4">
                      {Object.keys(x.template).map((x2, i2) => {
                        return (
                          <div key={i2} className="row">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label className="w100pc">{x2}:</label>
                                <input
                                  name={x2}
                                  disabled={storeContext.islock.get}
                                  placeholder={"Enter " + i + " " + x2}
                                  value={inputList[i]["template"][x2]}
                                  onChange={(e) =>
                                    hanldeChangeInput(e, i, "template")
                                  }
                                  className="form-control key-special"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="col-md-4">
                    <div
                      className="form-group flex flex-col"
                      style={{ gap: 15 }}
                    >
                      {inputList.length !== 1 && (
                        <BaseButton
                          iconName="minus"
                          onClick={() => hanldeRemoveInput(i)}
                        ></BaseButton>
                      )}
                      {inputList.length - 1 === i && (
                        <BaseButton
                          iconName="plus"
                          onClick={hanldeAddInput}
                        ></BaseButton>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }, [inputList, optionListTerminal, storeContext.islock.get]);

  return bodyContent;
});
export default React.memo(Partner);
