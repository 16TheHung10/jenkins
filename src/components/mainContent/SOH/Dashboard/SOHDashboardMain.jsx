import SOHHeader from "./Header/SOHHeader";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import SOHDashboardTable from "./Table/SOHDashboardTable";
import ItemMasterModel from "models/ItemMasterModel";
import { useHeaderActions } from "hooks";
import { message } from "antd";
import { StringHelper } from "helpers";

const SOHDashboardMain = () => {
  const actions = useHeaderActions();
  const [stocks, setStocks] = useState(null);
  const [originStocks, setOriginStocks] = useState(null);

  const getSOHByStore = async (params) => {
    const model = new ItemMasterModel();
    const res = await model.getSOHByStore(params);
    if (res.status) {
      setStocks(res?.data?.stocks);
      setOriginStocks(res?.data?.stocks);
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    if (actions.fieldsState?.storeCode) {
      getSOHByStore(actions.fieldsState);
    }
  }, [actions.fieldsState?.storeCode]);

  const dataTable = useMemo(() => {
    return stocks?.map((item) => ({
      ...item,
      closeDateKey: StringHelper.formatStringToTime(
        item.closeDateKey?.toString(),
      ),
    }));
  }, [stocks]);
  const summaryObject = useMemo(() => {
    let object = {};
    if (dataTable) {
      for (let value of dataTable) {
        let rcvQty = (object.rcvQty || 0) + Number(value.rcvQty);
        let saleQty = (object.saleQty || 0) + Number(value.saleQty);
        let deliveryrcvQty =
          (object.deliveryQty || 0) + Number(value.deliveryQty);
        let soh = (object.soh || 0) + Number(value.soh);
        object = {
          ...object,
          rcvQty,
          saleQty,
          soh: Number(soh),
          deliveryrcvQty,
        };
      }
    }
    return object;
  }, [dataTable]);

  const summaryObjectAll = useMemo(() => {
    let object = {};
    if (originStocks) {
      for (let value of originStocks) {
        let rcvQty = (object.rcvQty || 0) + Number(value.rcvQty);
        let saleQty = (object.saleQty || 0) + Number(value.saleQty);
        let deliveryrcvQty =
          (object.deliveryQty || 0) + Number(value.deliveryQty);
        let soh = (object.soh || 0) + Number(value.soh);
        object = {
          ...object,
          rcvQty,
          saleQty,
          soh: Number(soh),
          deliveryrcvQty,
        };
      }
    }
    return object;
  }, [originStocks]);

  return (
    <Fragment>
      <SOHHeader actions={actions} data={summaryObjectAll} />
      <SOHDashboardTable dataTable={dataTable} summary={summaryObject} />
    </Fragment>
  );
};

export default SOHDashboardMain;
