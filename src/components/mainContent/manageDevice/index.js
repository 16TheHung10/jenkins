import React, { useEffect, useState } from "react";

import FormManageDevice from "components/mainContent/manageDevice/FormManageDevice";
import ResultManageDevice from "components/mainContent/manageDevice/ResultManageDevice";
import DeviceModel from "models/DeviceModel";
import CommonModel from "models/CommonModel";
import { StringHelper } from "helpers";
import { showAlert } from "helpers/FuncHelper";

export const DeviceContext = React.createContext();

function ManageDevice(props) {
  const [storeCode, setStoreCode] = useState("");
  const [storeList, setStoreList] = useState({});

  const [device, setDevice] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [ipSettle, setIpSettle] = useState("");
  const [resSettle, setResSettle] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [resData, setResData] = useState(null);

  const [terminals, setTerminals] = useState([{ codeName: "", codeValue: "" }]);
  const [resterminalsPartner, setResterminalsPartner] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [isIdUpdate, setIsIdUpdate] = useState("");

  const [resFacePay, setFacePay] = useState(null);

  const globalState = {
    storeCode: { get: storeCode, set: setStoreCode },
    storeList: { get: storeList, set: setStoreList },
    device: { get: device, set: setDevice },
    ipAddress: { get: ipAddress, set: setIpAddress },
    ipSettle: { get: ipSettle, set: setIpSettle },
    resSettle: { get: resSettle, set: setResSettle },
    resData: { get: resData, set: setResData },
    terminals: { get: terminals, set: setTerminals },
    resterminalsPartner: {
      get: resterminalsPartner,
      set: setResterminalsPartner,
    },
    isIdUpdate: { get: isIdUpdate, set: setIsIdUpdate },
    resFacePay: { get: resFacePay, set: setFacePay },
  };

  const fetchData = async () => {
    let model = new DeviceModel();
    await model.getDevice().then((res) => {
      if (res.status) {
        globalState.resData.set(res.data.terminals);
      }
    });
  };

  const fetchFacePay = async () => {
    let key = StringHelper.randomKey();
    let params = {
      reqId: key,
      cid: "GS25",
      langCode: "VN",
      data: {
        merchantId: "GS25",
      },
    };

    let model = new DeviceModel();
    // await model.getFacePay(params,'https://bank.facepay.vn',10).then((res) => {
    await model.getFacePay(params, "https://portal.gs25.com.vn").then((res) => {
      if (res.code === 0) {
        if (res.data) {
          globalState.resFacePay.set(res.data);
        }
      } else {
        showAlert(res.message);
      }
    });

    // let result = Facepay;

    // globalState.resFacePay.set(result.data);
  };

  const fetchCommon = async () => {
    let model = new CommonModel();
    await model
      .getData("store,terminalpartners,terminalsettles")
      .then((res) => {
        if (res.status) {
          const arr = res.data.terminalpartners || [];
          const arrSettle = res.data.terminalsettles || [];
          globalState.resterminalsPartner.set(objectToArrayNew(arr));
          globalState.resSettle.set(objectToArray(arrSettle));
          globalState.storeList.set(res.data.stores);
        }
      });
  };

  const objectToArray = (objectList) => {
    return Object.keys(objectList).reduce((itemMap, item) => {
      itemMap.push({
        value: item,
        label: objectList[item],
      });
      return itemMap;
    }, []);
  };

  const objectToArrayNew = (objectList) => {
    return Object.keys(objectList).reduce((itemMap, item) => {
      itemMap.push({
        value: objectList[item].key,
        label: objectList[item].value,
      });
      return itemMap;
    }, []);
  };

  useEffect(() => {
    fetchData();
    fetchCommon();
    fetchFacePay();
  }, []);

  return (
    <DeviceContext.Provider value={globalState}>
      <FormManageDevice />
      <ResultManageDevice />
    </DeviceContext.Provider>
  );
}

export default React.memo(ManageDevice);
