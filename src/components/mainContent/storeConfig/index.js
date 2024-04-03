import React, { useEffect, useState } from "react";

import FormManage from "components/mainContent/storeConfig/FormManage";
import ResultManage from "components/mainContent/storeConfig/ResultManage";
import StoreConfigModel from "models/StoreConfigModel";
import CommonModel from "models/CommonModel";
import { AlertHelper } from "helpers";

export const StoreContext = React.createContext();

const StoreConfig = React.forwardRef((props, ref) => {
  const [storeItem, setStoreItem] = useState("");
  const [parterFilter, setParterFilter] = useState("");
  const [storeList, setStoreList] = useState({});
  const [listTemplate, setListTemplate] = useState([]);
  const [keepPartner, setKeepPartner] = useState({});

  const [resData, setResData] = useState(null);
  const [partner, setPartner] = useState([
    { codeName: "", codeValue: "", template: null },
  ]);
  const [resterminalsPartner, setResterminalsPartner] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [isIdUpdate, setIsIdUpdate] = useState(false);
  const [islock, setIslock] = useState(false);

  const globalState = {
    storeItem: { get: storeItem, set: setStoreItem },
    parterFilter: { get: parterFilter, set: setParterFilter },
    storeList: { get: storeList, set: setStoreList },
    listTemplate: { get: listTemplate, set: setListTemplate },
    keepPartner: { get: keepPartner, set: setKeepPartner },
    resData: { get: resData, set: setResData },
    partner: { get: partner, set: setPartner },
    resterminalsPartner: {
      get: resterminalsPartner,
      set: setResterminalsPartner,
    },
    isIdUpdate: { get: isIdUpdate, set: setIsIdUpdate },
    islock: { get: islock, set: setIslock },
  };

  const fetchData = async () => {
    let model = new StoreConfigModel();
    await model.getStoreConfig().then((res) => {
      if (res.status) {
        globalState.resData.set(res.data.config);
      }
    });
  };

  const fetchCommon = async () => {
    let model = new CommonModel();
    await model.getData("store,terminalpartners").then((res) => {
      if (res.status) {
        const arr = res.data.terminalpartners || [];

        getListTemplate(arr);
        globalState.keepPartner.set(arr);
        globalState.resterminalsPartner.set(objectToArray(arr));
        globalState.storeList.set(res.data.stores);
      }
    });
  };

  const getListTemplate = (objectList) => {
    let arr = [];
    for (const item in objectList) {
      if (objectList[item].template !== null) {
        arr.push(item);
      }
    }

    globalState.listTemplate.set(arr);
  };

  const objectToArray = (objectList) => {
    return Object.keys(objectList).reduce((itemMap, item) => {
      itemMap.push({
        value: objectList[item].key,
        label: objectList[item].value,
      });
      return itemMap;
    }, []);
  };

  const showAlert = (msg, type = "error") => {
    AlertHelper.showAlert(msg, type);
  };

  useEffect(() => {
    fetchData();
    fetchCommon();
  }, []);

  return (
    <StoreContext.Provider value={globalState}>
      <FormManage />
      <ResultManage />
    </StoreContext.Provider>
  );
});

export default React.memo(StoreConfig);
