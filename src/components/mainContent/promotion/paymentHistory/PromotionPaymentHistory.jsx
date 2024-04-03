import React, { useEffect, useState } from "react";
import MainTable from "components/common/Table/UI/MainTable";
import FormField from "data/oldVersion/formFieldRender";
import { useLocation, useParams } from "react-router-dom";
import LogApi from "api/LogApi";
import { useFormFields } from "hooks";
import moment from "moment";
import CONSTANT from "constant";
import { Col, Row, message } from "antd";
import FieldList from "components/common/fieldList/FieldList";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import { useAppContext } from "contexts";
import SectionWithTitle from "components/common/section/SectionWithTitle";
import { UrlHelper } from "helpers";

const PromotionPaymentHistory = ({ data }) => {
  const [histories, setHistories] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { state: AppState, onGetItems, onGetSuppliers } = useAppContext(0);
  useEffect(() => {
    if (!AppState.items) {
      onGetItems();
    }
  }, [AppState.items]);
  useEffect(() => {
    if (!AppState.suppliers) {
      onGetSuppliers();
    }
  }, [AppState.suppliers]);

  const params = useParams();
  const id = params?.partners;
  const handleGetHistorys = async (value) => {
    if (!value.date || !value.date?.[0]) return;
    const params = {
      startDate: value.date[0]
        ? moment(value.date?.[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD)
        : "",
      endDate: value.date[1]
        ? moment(value.date?.[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD)
        : "",
      type: 8,
      ObjectID: id,
    };
    setIsLoading(true);
    const res = await LogApi.getLogs(params);
    setIsLoading(false);
    if (res.status) {
      const logs = res.data.logs;
      const formatRes = [];
      for (let logIndex in logs) {
        let log = logs[logIndex];
        const message = log.message ? JSON.parse(log.message) : null;
        if (message?.Data) {
          for (let dataItem of message.Data) {
            const items = dataItem.items;
            const suppliers = dataItem.suppliers;
            const n = Math.max(items.length, suppliers.length);
            if (n === 0) {
              formatRes.push({
                ...log,
                ...dataItem,
                updatedDate: message.UpdatedDate,
                promotionName: dataItem.name,
                rowSpan: 1,
                item: null,
                isOdd: Boolean(logIndex % 2 !== 0),
                supplier: null,
              });
            }
            for (let i = 0; i < n; i++) {
              if (i === 0) {
                formatRes.push({
                  ...log,
                  ...dataItem,
                  updatedDate: message.UpdatedDate,
                  promotionName: dataItem.name,
                  rowSpan: n,
                  isOdd: Boolean(logIndex % 2 !== 0),
                  item: items[i] || null,
                  supplier: suppliers[i] || null,
                });
              } else {
                formatRes.push({
                  ...log,
                  ...dataItem,
                  updatedDate: message.UpdatedDate,
                  title: null,
                  requestDate: null,
                  promotionGS25: null,
                  promotionPartner: null,
                  promotionName: null,
                  docCode: undefined,
                  isOdd: Boolean(logIndex % 2 !== 0),
                  item: items[i] || null,
                  supplier: suppliers[i] || null,
                });
              }
            }
          }
        }
      }
      setHistories(formatRes);
    } else {
      message.error(res.message);
    }
  };
  const {
    formInputsWithSpan: fields,
    onSubmitHandler: onSearch,
    reset,
  } = useFormFields({
    fieldInputs: FormField.PromotionPaymentHistoryOverview.fields(),
    onSubmit: handleGetHistorys,
  });

  useEffect(() => {
    const searchParamsObject = UrlHelper.getSearchParamsObject();
    const date = searchParamsObject.startDate
      ? [
          moment(searchParamsObject.startDate),
          moment(searchParamsObject.endDate),
        ]
      : null;
    reset({ date });
    handleGetHistorys({ date });
  }, []);
  return (
    <SectionWithTitle title="History">
      <form onSubmit={onSearch}>
        <Row gutter={[16, 0]}>
          <FieldList fields={fields} />
          <div className="flex items-center">
            <BaseButton iconName="search" htmlType="submit">
              Search
            </BaseButton>
          </div>
        </Row>
      </form>
      <MainTable
        loading={isLoading}
        className="w-fit"
        columns={FormField.PromotionPaymentHistoryOverview.columns({
          items: AppState.items,
        })}
        scroll={{ y: "calc(100vh - 218px)" }}
        dataSource={histories}
      />
    </SectionWithTitle>
  );
};

export default PromotionPaymentHistory;
