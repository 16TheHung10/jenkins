import { Form, message } from "antd";
import MainTable from "components/common/Table/UI/MainTable";
import { actionCreator, useAppContext, useTotalBillContext } from "contexts";
import { TotalBillActions } from "contexts/actions";
import formFieldRender from "data/oldVersion/formFieldRender";
import { ObjectHelper, StringHelper } from "helpers";
import { useFormFields, usePageActions, usePaginationTable } from "hooks";
import PromotionModel from "models/PromotionModel";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import PromotionTotalBillMainFields from "./PromotionTotalBillMainFields";

const ActionHeader = ({}) => {
  const history = useHistory();
  const handleCreate = () => {
    history.push("/promotion-total-bill/create");
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
  return <Action />;
};

const PromotionTotalBillMain = () => {
  const queryClient = useQueryClient();
  //  EDIT
  const [form] = Form.useForm();
  const { state: TotalBillStateContext, dispatch: TotalBillDispatchContext } =
    useTotalBillContext();
  const {
    state: AppStateContext,
    dispatch: AppDispatchContext,
    onGetStoreData,
  } = useAppContext();
  // END EDIT
  useEffect(() => {
    onGetStoreData();
  }, []);
  const location = useLocation();
  const history = useHistory();
  const [params, setParams] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const fetchAllData = useCallback(async (params) => {
    const model = new PromotionModel();
    if (!params.startDate) {
      return;
    }
    const res = await model.getAllTotalBillPromotion(params);
    if (res.status) {
      let data = res.data;
      return data;
    } else {
      message.error(res.message);
      return null;
    }
  }, []);
  const paginationProps = usePaginationTable();

  const totalBillMainQuery = useQuery({
    queryKey: [
      "TotalBillMain",
      {
        ...params,
        pageNumber: paginationProps.current,
        pageSize: paginationProps.pageSize,
      },
    ],
    queryFn: () =>
      fetchAllData({
        ...params,
        pageNumber: paginationProps.current,
        pageSize: paginationProps.pageSize,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(params),
  });

  const handleSubmit = async (value) => {
    let payload = {
      ...value,
      startDate: moment(value.date?.[0]).format("YYYY-MM-DD"),
      endDate: moment(value.date?.[1]).format("YYYY-MM-DD"),
    };
    const { date, ...formatedParams } =
      ObjectHelper.removeAllNullValue(payload);
    setParams(formatedParams);
    // totalBillMainQuery.refetch({ queryKey: ['TotalBillMain', formatedParams] });
  };

  const {
    formInputsWithSpan: formInputs,
    onSubmitHandler,
    reset,
    getValues,
    setValue,
  } = useFormFields({
    fieldInputs: formFieldRender.TotalBillMain.fieldInputs(
      Object.values(AppStateContext.stores || {}),
    ),
    onSubmit: handleSubmit,
  });

  const navigateEdit = (url) => {
    history.push(url);
  };

  // Reset value of input field
  useEffect(() => {
    if (location.search) {
      let object = StringHelper.convertSearchParamsToObject(location.search);
      object = ObjectHelper.removeAllNullValue({
        ...object,
        date: [moment(object.startDate), moment(object.startDate)],
        storeCode: object.storeCode ? object.storeCode?.split(",") : [],
      });
      const { date, ...format } = object;
      setParams({ ...format });
      reset({
        ...object,
        date: [moment(object.startDate), moment(object.endDate)],
      });
    }
  }, []);
  useEffect(() => {
    TotalBillDispatchContext(
      actionCreator(TotalBillActions.SET_CURRENT_SEARCH_PARAMS, params),
    );
    if (params) {
      const searchString = StringHelper.convertObjectToSearchParams(params);
      history.replace(searchString);
    }
  }, [params]);
  if (totalBillMainQuery.isLoading) {
    return <h1>...LOADING...</h1>;
  }
  return (
    <div className="">
      <ActionHeader />

      <div
        className="section-block mt-15"
        style={{ width: "900px", maxWidth: "100%" }}
      >
        <Form form={form} component={false}>
          <PromotionTotalBillMainFields
            onSubmit={onSubmitHandler}
            fields={formInputs}
            data={totalBillMainQuery?.data?.promotions}
            fieldsValue={{
              ...getValues(),
              startDate: moment(getValues()?.date?.[0]).format("YYYY-MM-DD"),
              endDate: moment(getValues()?.date?.[1]).format("YYYY-MM-DD"),
            }}
          />
        </Form>
        <MainTable
          className="row_pointer w-full"
          pagination={{
            total: totalBillMainQuery?.data?.total,
            ...paginationProps,
          }}
          onRow={(record) => {
            return {
              onClick: (event) => {
                history.push(
                  `/promotion-total-bill/edit/${record.promotionCode}`,
                );
              },
            };
          }}
          columns={formFieldRender.TotalBillMain.columns({ navigateEdit })}
          dataSource={totalBillMainQuery?.data?.promotions
            ?.map((item, index) => ({
              ...item,
              key: `total-bill-main-${index}`,
            }))
            .sort((a, b) => b.promotionCode?.localeCompare(a?.promotionCode))}
        />
      </div>
    </div>
  );
};

export default PromotionTotalBillMain;
