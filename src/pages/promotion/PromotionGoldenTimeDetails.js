import { Tabs, message } from "antd";
import GoldenTimeAddBuyGift from "components/mainContent/promotion/goldenTime/goldenTimeCreate/GoldenTimeAddBuyGift";
import GoldenTimeAddDiscountGift from "components/mainContent/promotion/goldenTime/goldenTimeCreate/GoldenTimeAddDiscountGift";
import GoldenTimeCreate from "components/mainContent/promotion/goldenTime/goldenTimeCreate/GoldenTimeCreate";
import { useHeaderActions, useImportExcel, usePageActions } from "hooks";
import PromotionModel from "models/PromotionModel";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const PromotionGoldenTimeDetail = () => {
  const history = useHistory();
  const params = useParams();
  const [detailData, setDetailData] = useState(null);
  const [currentTimeFrame, setCurrentTimeFrame] = useState(1);

  const handleGetDetails = async () => {
    const model = new PromotionModel();
    const res = await model.getAllGoldenTimePromotionDetails(params.id);
    if (res.status) {
      setDetailData(res.data.promotion);
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    handleGetDetails();
  }, [params.id]);
  const {
    selectFieldRender,
    inputFieldRender,
    datePickerRender,
    renderTimePickerField,
    fieldsState,
    renderSelectField,
    handleSetState,
  } = useHeaderActions();
  const [dataPromotionFreeItem, setDataPromotionFreeItem] = useState(null);
  const [dataPromotionDiscountItem, setDataPromotionDiscountItem] =
    useState(null);
  const [selectedPromotionType, setSelectedPromotionType] = useState("1");

  useEffect(() => {
    if (params.id && detailData) {
      const formatDate = {
        ...detailData,
        GoldenDays: detailData.goldenDays.split(","),
        timePicker: detailData.goldenHours.split(",")?.map((item, index) => ({
          index: index,
          startTime: item?.split("-")[0],
          endTime: item?.split("-")[1],
        })),
        startDate: detailData.fromDate,
        endDate: detailData.toDate,
      };
      setCurrentTimeFrame(detailData?.goldenHours?.split(",")?.length);
      handleSetState(formatDate);

      if (!detailData?.[0]?.discount) {
        setDataPromotionFreeItem(detailData.promotionDetails);
      } else {
        setDataPromotionDiscountItem(detailData.promotionDetails);
      }
    }
  }, [params.id, detailData]);
  const handleSetFreePromotionTableData = (data) => {
    setDataPromotionFreeItem(data);
  };
  const handleSetDiscountPromotionTableData = (data) => {
    setDataPromotionDiscountItem(data);
  };
  const validateBeforeSave = () => {
    if (!fieldsState?.promotionName) {
      message.error("Promotion name is required");
      return false;
    }
    if (!fieldsState?.startDate) {
      message.error("Start date is required");
      return false;
    }
    if (!fieldsState?.endDate) {
      message.error("End date is required");
      return false;
    }
    if (!fieldsState?.storeCode || fieldsState?.storeCode?.length === 0) {
      message.error("Stores  is required");
      return false;
    }

    if (!fieldsState?.GoldenDays) {
      message.error("Golden Days is required");
      return false;
    }
    if (!fieldsState?.timePicker) {
      message.error("Golden Hours is required");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    const model = new PromotionModel();
    let payload = {
      ...fieldsState,
      Type: 1,
      GoldenDays: fieldsState?.GoldenDays
        ? fieldsState?.GoldenDays.join(",")
        : "0,1,2,3,4,5,6",
      GoldenHours: fieldsState?.timePicker
        ? fieldsState?.timePicker
            ?.map((item) => {
              return `${item.startTime}-${item.endTime}`;
            })
            ?.join(",")
        : "0:00-23:59",
    };
    if (validateBeforeSave()) {
      if (selectedPromotionType === "2") {
        if (!dataPromotionFreeItem || dataPromotionFreeItem?.length === 0) {
          message.error("Please add item to promotion");
          return;
        }
        const tableData = (dataPromotionFreeItem || [])?.map((item) => {
          return {
            ...item,
            type: "1",
          };
        });

        payload = {
          ...payload,
          promotionDetails: [...(dataPromotionFreeItem || []), ...tableData],
        };
        const res = await model.updatePrimeTimeBuyGiftPromotion(
          payload,
          params.id,
        );
        if (res.status) {
          message.success("Create free gift promotion successfully !!!");
          history.replace("/promotion-golden-hours");
        } else {
          message.error(res.message);
        }
      } else {
        if (
          !dataPromotionDiscountItem ||
          dataPromotionDiscountItem?.length === 0
        ) {
          message.error("Please add item to promotion");
          return;
        }
        payload = {
          ...payload,
          promotionDetails: [...(dataPromotionDiscountItem || [])],
        };

        const res = await model.createPrimeTimeDiscountGiftPromotion(payload);
        if (res.status) {
          message.success("Create discount gift promotion successfully !!!");
          history.replace("/promotion-golden-hours");
        } else {
          message.error(res.message);
        }
      }
    }
  };

  const Action = usePageActions(
    [
      {
        name: "Save",
        actionType: "info",
        action: handleSave,
      },
    ],
    [],
  );
  const { ComponentImport, ComponentExport, dataImported } = useImportExcel();

  useEffect(() => {
    setDataPromotionFreeItem((prev) => [...(prev || []), ...dataImported]);
  }, [dataImported]);

  const TabItems = [
    {
      key: "1",
      label: `Promotion discount item`,
      children: (
        <GoldenTimeAddDiscountGift
          onSetTableData={handleSetDiscountPromotionTableData}
          tableData={dataPromotionDiscountItem}
          componentImport={<ComponentImport title="Import" />}
          componentExport={
            <ComponentExport title="Export" data={dataPromotionDiscountItem} />
          }
        />
      ),
    },
    {
      key: "2",
      label: `Promotion free item`,
      children: (
        <GoldenTimeAddBuyGift
          onSetTableData={handleSetFreePromotionTableData}
          tableData={dataPromotionFreeItem}
          componentImport={<ComponentImport title="Import" />}
          componentExport={
            <ComponentExport title="Export" data={dataPromotionFreeItem} />
          }
        />
      ),
    },
  ];

  const handleSetSelectedTab = (value) => {
    setSelectedPromotionType(value);
  };

  return (
    <div>
      <Action />
      <div
        className=""
        style={{ overflowY: "scroll", maxHeight: "calc(100vh - 38px - 48px)" }}
      >
        <div className="" style={{ marginBottom: 10 }}>
          <button
            type="button"
            className="btn btn-back"
            style={{ background: "beige" }}
            onClick={history.goBack}
          >
            Back
          </button>
          <h2 className="name-target">New Promotion</h2>
        </div>
        <GoldenTimeCreate
          inputFields={{
            selectFieldRender,
            inputFieldRender,
            datePickerRender,
            renderTimePickerField,
            fieldsState,
            renderSelectField,
          }}
          currentTimeFrame={currentTimeFrame}
          setCurrentTimeFrame={setCurrentTimeFrame}
        />
        <Tabs
          onTabClick={(value) => handleSetSelectedTab(value)}
          defaultActiveKey="1"
          items={TabItems}
        />
      </div>
    </div>
  );
};

export default PromotionGoldenTimeDetail;
