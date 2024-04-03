import React, { useContext, useMemo, useRef } from "react";

import Partner from "components/mainContent/storeConfig/Partner";
import StoreInput from "components/mainContent/storeConfig/StoreInput";
import NotConfigInput from "components/mainContent/storeConfig/NotConfigInput";
import { AlertHelper } from "helpers";
import StoreConfigModel from "models/StoreConfigModel";

import { StoreContext } from "components/mainContent/storeConfig";
import BaseButton from "components/common/buttons/baseButton/BaseButton";

function FormManage(props) {
  const storeContext = useContext(StoreContext);

  const refPartner = useRef();
  const refStore = useRef();
  const refNotConfig = useRef();

  const isIdUpdate = storeContext.isIdUpdate.get;

  const showAlert = (msg, type = "error") => {
    AlertHelper.showAlert(msg, type);
  };

  const resetForm = () => {
    storeContext.storeItem.set("");
    storeContext.partner.set([{ codeName: "", codeValue: "", template: null }]);

    storeContext.isIdUpdate.set(false);
    storeContext.islock.set(false);
  };

  const handleAdd = () => {
    if (storeContext.storeItem.get === "") {
      refStore.current.hanldeFocusSelect(0);
      showAlert("Please choose store");
      return;
    }

    if (storeContext.storeItem.get !== "") {
      const data = [...storeContext.resData.get];

      for (let i = 0; i < data.length; i++) {
        if (data[i].Name === storeContext.storeItem.get) {
          refStore.current.hanldeFocusSelect(0);
          showAlert("Store already exists, Please action Update!");
          return;
        }
      }
    }

    for (let i = 0; i < storeContext.partner.get.length; i++) {
      if (storeContext.partner.get[i].codeName === "") {
        refPartner.current.hanldeFocusSelect(i);
        showAlert("Please add code to partner");
        return;
      }

      if (
        storeContext.partner.get[i].template === null &&
        storeContext.partner.get[i].codeValue === ""
      ) {
        let target = document.querySelectorAll(".key-codeValue");
        for (let k = 0; k < target.length; k++) {
          if (target[k].value === "") {
            target[k].focus();
            showAlert("Please add value to partner");
            return;
          }
        }
      }

      if (storeContext.partner.get[i].template !== null) {
        let target = document.querySelectorAll(".key-special");

        for (let k = 0; k < target.length; k++) {
          if (target[k].value === "") {
            target[k].focus();
            showAlert("Please add value");
            return;
          }
        }
      }
    }

    let listPartner = {};

    storeContext.partner.get.map((x) => {
      return (listPartner[x.codeName] = x.codeValue
        ? x.codeValue
        : JSON.stringify(x.template));
    });

    const params = {
      Name: storeContext.storeItem.get,
      Config: listPartner,
    };

    let model = new StoreConfigModel();
    model.postStoreConfig(params).then((res) => {
      if (res.status) {
        showAlert(res.message, "success");

        let data = [...storeContext.resData.get, params];
        storeContext.resData.set(data);

        resetForm();
      } else {
        showAlert(res.message);
      }
    });
  };

  const handleUpdate = () => {
    const list = storeContext.partner.get;

    for (let i = 0; i < list.length; i++) {
      if (list[i].codeName === "") {
        refPartner.current.hanldeFocusSelect(i);
        showAlert("Please add code to partner");
        return;
      }

      if (list[i].template === null && list[i].codeValue === "") {
        let target = document.querySelectorAll(".key-codeValue");
        for (let k = 0; k < target.length; k++) {
          if (target[k].value === "") {
            target[k].focus();
            showAlert("Please add value to partner");
            return;
          }
        }
      }

      if (list[i].template !== null) {
        let target = document.querySelectorAll(".key-special");

        for (let k = 0; k < target.length; k++) {
          if (target[k].value === "") {
            target[k].focus();
            showAlert("Please add value");
            return;
          }
        }
      }
    }

    let listPartner = {};

    storeContext.partner.get.map((x) => {
      return (listPartner[x.codeName] = x.codeValue
        ? x.codeValue
        : JSON.stringify(x.template));
    });

    const params = {
      Name: storeContext.storeItem.get,
      Config: listPartner,
    };

    updateDevice(params);
  };

  const updateDevice = async (params) => {
    let answer = window.confirm('Please help me confirm the action "UPDATE"');

    if (answer === true) {
      let model = new StoreConfigModel();
      await model.postStoreConfig(params).then((res) => {
        if (res.status) {
          showAlert(res.message, "success");

          const dataList = [...storeContext.resData.get];
          const pos = dataList.findIndex(
            (x) => x.Name === storeContext.storeItem.get,
          );

          dataList[pos].Config = params.Config;
          storeContext.resData.set(dataList);

          resetForm();
        } else {
          showAlert(res.message);
        }
      });
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleUnlock = () => {
    storeContext.islock.set(!storeContext.islock.get);
  };

  const bodyContent = useMemo(() => {
    return (
      <div className="section-block mt-15 mb-15">
        <div className="form-filter">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4">
                  <StoreInput ref={refStore} />
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="w100pc">&nbsp;</label>

                    {!isIdUpdate && (
                      <BaseButton
                        iconName={"plus"}
                        onClick={handleAdd}
                        style={{ height: 38 }}
                      >
                        Add
                      </BaseButton>
                    )}

                    {isIdUpdate && (
                      <>
                        <button
                          type="button"
                          onClick={handleUpdate}
                          className="btn btn-success"
                          style={{ height: 38 }}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="btn btn-success"
                          style={{ height: 38 }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleUnlock}
                          className="btn btn-success"
                          style={{ height: 38 }}
                        >
                          {storeContext.islock.get ? "Unlock" : "Lock"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {!isIdUpdate && (
                  <div className="col-md-4">
                    <NotConfigInput ref={refNotConfig} />
                  </div>
                )}
              </div>
              <Partner ref={refPartner} />
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    storeContext.storeItem.get,
    storeContext.partner.get,
    storeContext.isIdUpdate.get,
    storeContext.resData.get,
    storeContext.islock.get,
  ]);

  return bodyContent;
}

export default React.memo(FormManage);
