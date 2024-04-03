import { message } from "antd";
import PromotionGoldenTimeSearch from "components/mainContent/promotion/goldenTime/goldenTimeSearch/PromotionGoldenTimeSearch";
import GoldenTimeTableContent from "components/mainContent/promotion/goldenTime/goldentImeTableContent/GoldentImeTableContent";
import { useHeaderActions, usePageActions } from "hooks";
import PromotionModel from "models/PromotionModel";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const PromotionGoldenTime = () => {
  const history = useHistory();

  const [tableData, setTableData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedEditRow, setSelectedEditRow] = useState(null);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const { selectFieldRender, inputFieldRender, datePickerRender, fieldsState } =
    useHeaderActions();

  const handleCreate = () => {
    history.push("/promotion-golden-hours/create");
  };

  const Action = usePageActions(
    [
      {
        name: "New",
        actionType: "info",
        action: handleCreate,
      },
    ],
    [],
  );

  const handleGetData = (params) => {
    let model = new PromotionModel();
    model.getAllGoldenTimePromotion(params).then((res) => {
      if (res.status && res.data) {
        if (res.data.promotions) {
          setTableData(res.data.promotions);
        }
      } else {
        message.error(res.message);
      }
    });
  };

  const handleSearch = () => {
    // if (!fieldsState?.promotionName) {
    //   message.error('Please enter promotion code');
    //   return;
    // }
    // if (!fieldsState?.storeCode) {
    //   message.error('Please select store code');
    //   return;
    // }
    if (!fieldsState?.startDate) {
      message.error("Please enter start date");
      return;
    }

    if (!fieldsState?.endDate) {
      message.error("Please enter end date");
      return;
    }

    // if (!fieldsState?.status) {
    //   message.error('Please select status');
    //   return;
    // }
    let params = {
      name: fieldsState?.promotionName || "",
      startDate: fieldsState?.startDate || "",
      endDate: fieldsState?.endDate || "",
      status: fieldsState?.status || "",
      pageNumber: 1,
      pageSize: 30,
      store: fieldsState?.storeCode || "",
    };
    handleGetData(params);
  };

  const handleClickOnRow = (record) => {
    history.push(`promotion-golden-hours/detail/${record.promotionCode}`);
  };
  return (
    <div>
      <Action />
      <PromotionGoldenTimeSearch
        inputFields={{
          selectFieldRender,
          inputFieldRender,
          datePickerRender,
          fieldsState,
        }}
        onSearch={handleSearch}
      />

      <GoldenTimeTableContent
        data={tableData}
        onClickOnRow={handleClickOnRow}
      />
    </div>
  );
};

export default PromotionGoldenTime;
