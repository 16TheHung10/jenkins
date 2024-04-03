import { Col, Form, Input, Modal, Row, Skeleton, message } from "antd";
import BillApi from "api/BillApi";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import BillInfo from "components/mainContent/bill/Info";
import CancelBillFieldCompFilter from "components/mainContent/bill/cancelBill/field/CancelBillFieldCompFilter";
import CancelBillTableComp from "components/mainContent/bill/cancelBill/table/CancelBillTableComp";
import CONSTANT from "constant";
import { FieldsRequestCancelBillData } from "data/render/form";
import { ArrayHelper, OptionsHelper, UrlHelper } from "helpers";
import { useFormFields } from "hooks";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import "./style.scss";
const RequestCancelBills = () => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isShowSkeleton, setIsShowSkeleton] = useState(false);
  const [cancelBillsConst, setCancelBillsConst] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);

  // Hooks
  const queryClient = useQueryClient();

  // Select options
  const invoiceCodeOptions = useMemo(() => {
    return cancelBillsConst?.map((item) => {
      return { value: item.invoiceCode, label: item.invoiceCode };
    });
  }, [cancelBillsConst]);

  const storeOptions = useMemo(() => {
    return OptionsHelper.getOptionsWhenValueIsRepeat(
      cancelBillsConst,
      "storeCode",
      ["storeCode"],
    );
  }, [cancelBillsConst]);
  const statusOptions = [
    // {
    //   value: 0,
    //   label: 'Processing',
    // },
    {
      value: 1,
      label: "Approved",
    },
    {
      value: 3,
      label: "Expired",
    },
    {
      value: 4,
      label: "Processing",
    },
  ];

  const openApproveModal = () => {
    setIsApproveModalOpen(true);
  };

  const cancelApproveModal = () => {
    setIsApproveModalOpen(false);
  };

  const handleGetCancelBill = async (value) => {
    const params = {
      date: moment().format(CONSTANT.FORMAT_DATE_PAYLOAD),
    };
    const res = await BillApi.getCancelBills(params);
    if (res.status) {
      const cancelBillsFromResponse = res.data?.listRequest
        ?.sort((a, b) => {
          return moment(b.createdDate).diff(moment(a.createdDate));
        })
        .map((item) => {
          return {
            ...item,
            isAllowApprove:
              item.canceled === 0 &&
              moment(new Date())
                .endOf("day")
                .diff(moment(item.createdDate).utc().startOf("day"), "days") <=
                2,
            isExpired:
              moment(new Date())
                .endOf("day")
                .diff(moment(item.createdDate).utc().startOf("day"), "days") >
                2 && item.canceled === 0,
          };
        });
      const searchParams = UrlHelper.getSearchParamsObject();
      if (searchParams.selectedBill) {
        const selectedBillFromTable = cancelBillsFromResponse?.find(
          (el) => el.invoiceCode === searchParams.selectedBill,
        );
        if (selectedBillFromTable) setSelectedBill(selectedBillFromTable);
      }
      setCancelBillsConst(cancelBillsFromResponse);
      return cancelBillsFromResponse;
    } else {
      message.error(res.message);
    }
  };

  const handleSetQueryData = (data) => {
    queryClient.setQueryData("bill/getAll", data);
  };

  const handleSetBillDetailsQueryData = (data) => {
    queryClient.setQueryData(["bill/details", selectedBill?.invoiceCode], data);
  };

  const filterBill = (value) => {
    const { billAmountFrom, billAmountTo, ...restValue } = value;
    UrlHelper.setSearchParamsFromObject({});
    const clone = ArrayHelper.deepClone(cancelBillsConst);
    let filter = clone?.filter((el) => {
      let flag = true;
      for (let key of Object.keys(restValue)) {
        if (
          restValue[key] !== null &&
          restValue[key] !== undefined &&
          restValue[key] !== ""
        ) {
          if (key === "canceled" && restValue[key] === 3) {
            flag = el.isExpired;
          } else if (key === "canceled" && restValue[key] === 4) {
            flag = !el.isExpired && el.canceled === 0;
          } else flag = el[key] === restValue[key];
        }
      }
      return flag;
    });
    console.log({ value });
    if (billAmountFrom || billAmountTo) {
      if (billAmountFrom && billAmountTo) {
        handleSetQueryData(
          filter.filter(
            (el) => el.amount >= billAmountFrom && el.amount <= billAmountTo,
          ),
        );
      } else if (billAmountFrom) {
        handleSetQueryData(filter.filter((el) => el.amount >= billAmountFrom));
      } else {
        handleSetQueryData(filter.filter((el) => el.amount <= billAmountTo));
      }
    } else handleSetQueryData(filter);
    setSelectedBill(null);
  };

  const fieldsHook = useFormFields({
    fieldInputs: FieldsRequestCancelBillData.fieldInputs(),
    onSubmit: handleGetCancelBill,
  });

  const fieldsHookFilter = useFormFields({
    fieldInputs: FieldsRequestCancelBillData.fieldInputsFilter({
      invoiceCodeOptions,
      storeOptions,
      statusOptions,
    }),
    onSubmit: filterBill,
  });

  const { getValues } = fieldsHookFilter;
  const handleSetSearchParams = (billCode) => {
    UrlHelper.setSearchParamsFromObject({ selectedBill: billCode });
  };

  const getBillDetails = async (billCode, billInfo) => {
    setSelectedBill(billInfo);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(setIsShowSkeleton(true));
      }, 300);
    });
    const res = await BillApi.searchBill({ billCode });
    if (res.status) {
      if (!res.data?.bill) {
        message.error("Bill info is empty");
      }
      handleSetSearchParams(billCode);
      setIsShowSkeleton(false);
      return res.data?.bill;
    } else {
      setIsShowSkeleton(false);
      message.error(res.message);
    }
  };

  const handleApproveBill = async (value) => {
    setIsLoadingApprove(true);
    const { reason } = value;
    if (!billDetailsQuery.data) {
      message.error("Please select a bill");
      return;
    }
    const payload = {
      invoiceCode: billDetailsQuery.data.invoiceCode,
      note: reason,
    };
    const res = await BillApi.approveBill(payload);
    if (res.status) {
      message.success("Approve bill successfully");
      const cloneBillDetails = { ...(billDetailsQuery.data || {}) };
      const clone = JSON.parse(JSON.stringify(billsQuery.data));
      const selectedBillIndex = clone.findIndex(
        (el) => el.invoiceCode === cloneBillDetails.invoiceCode,
      );
      const newBillUpdated = {
        ...clone[selectedBillIndex],
        cloneProcessing: 1,
        canceled: 1,
      };
      clone.splice(selectedBillIndex, 1, newBillUpdated);
      handleSetQueryData(clone);
      let currentBillDetailsQueryData = queryClient.getQueryData([
        "bill/details",
        selectedBill?.invoiceCode,
      ]);
      handleSetBillDetailsQueryData({
        ...currentBillDetailsQueryData,
        invoiceType: 4,
      });
      setCancelBillsConst(clone);
      setSelectedBill(null);
      cancelApproveModal();
    } else {
      message.error(res.message);
    }
    setIsLoadingApprove(false);
  };

  const billsQuery = useQuery({
    queryKey: "bill/getAll",
    queryFn: async () => handleGetCancelBill(fieldsHook.getValues()),
    staleTime: 2 * 60 * 1000,
  });
  const billDetailsQuery = useQuery({
    queryKey: ["bill/details", selectedBill?.invoiceCode],
    queryFn: async () =>
      getBillDetails(selectedBill?.invoiceCode, selectedBill),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(selectedBill?.invoiceCode),
  });

  useEffect(() => {
    setCancelBillsConst(billsQuery.data);
    const searchParams = UrlHelper.getSearchParamsObject();
    if (searchParams.selectedBill) {
      const selectedBillFromTable = billsQuery.data?.find(
        (el) => el.invoiceCode === searchParams.selectedBill,
      );
      setSelectedBill(selectedBillFromTable);
    }
  }, []);
  return (
    <div className="">
      <div id="request_cancel_bill" className="section-block mt-15">
        <Row gutter={[16, 16]}>
          {/* <Col span={24}>
          <CancelBillFieldComp fieldsProps={fieldsHook} TriggerComponentFilter={TriggerComponent} loading={isLoading} />
        </Col> */}
          <Col span={16}>
            <CancelBillFieldCompFilter fieldsProps={fieldsHookFilter} />
          </Col>
          <Col span={8}>
            <div className="bg-note h-full">
              <p className="cl-red">Tất cả yêu cầu hủy hóa đơn từ user</p>
              <p className="cl-red">Dữ liệu được lấy trong 7 ngày gần nhất</p>
              <p className="cl-red">
                Những hóa đơn có yêu cầu hủy quá 2 ngày sẽ không được chấp thuận
              </p>
            </div>
          </Col>

          <Col
            span={billDetailsQuery.data || billDetailsQuery.isLoading ? 17 : 24}
            className="transition_animate_3"
          >
            <CancelBillTableComp
              onGetBillDetails={setSelectedBill}
              data={billsQuery.data || []}
              loading={billsQuery.isLoading}
            />
          </Col>

          {billDetailsQuery.isLoading ? (
            isShowSkeleton ? (
              <Col span={7}>
                <Skeleton active />
              </Col>
            ) : null
          ) : billDetailsQuery.data ? (
            <Col span={7}>
              <div className="flex flex-col items-start gap-10 w-full">
                <div className="section-block relative w-full">
                  <BillInfo
                    info={billDetailsQuery.data}
                    list={billDetailsQuery.data?.items}
                    payment={billDetailsQuery.data.payments}
                  />
                  {(billDetailsQuery.data?.invoiceType !== 4 &&
                    !selectedBill.isExpired) ||
                  selectedBill.isAllowApprove ? (
                    <div className="flex items-center gap-10">
                      <BaseButton
                        iconName="tick"
                        onClick={openApproveModal}
                        className="mt-10"
                      >
                        Approve
                      </BaseButton>
                      <p className="hint m-0">
                        Bạn nhận được yêu cầu requesat hủy hóa đơn từ user{" "}
                        {
                          <b className="color-primary">
                            {selectedBill?.createdBy}
                          </b>
                        }{" "}
                        nhấn approve để chấp nhận hủy
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </Col>
          ) : null}
        </Row>
        <Modal
          footer={false}
          total="Reason"
          open={isApproveModalOpen}
          onCancel={cancelApproveModal}
        >
          <Form onFinish={handleApproveBill} layout="vertical">
            <Form.Item
              label="Reason"
              name="reason"
              rules={[{ required: true, message: "Please input reason" }]}
            >
              <Input.TextArea showCount maxLength={1000} rows={10} />
            </Form.Item>
            <BaseButton
              loading={isLoadingApprove}
              htmlType="submit"
              iconName="tick"
              onClick={openApproveModal}
            >
              Approve
            </BaseButton>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default RequestCancelBills;
