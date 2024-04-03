import { message } from "antd";
import ReportApi from "api/ReportApi";
import MainTable from "components/common/Table/UI/MainTable";
import CONSTANT from "constant";
import FormField from "data/oldVersion/formFieldRender";
import { FieldsSmsReportData } from "data/render/form";
import { useFormFields, useImportExcel, usePagination } from "hooks";
import moment from "moment";
import React, { useEffect, useState } from "react";
import SMSReportFieldComp from "./field/SMSReportFieldComp";

const SMSReport = () => {
  const [smsData, setSmsData] = useState({ value: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { ComponentImport, ComponentExport, dataImported } = useImportExcel();
  const {
    Pagination,
    pageSize,
    pageNumber,
    reset: resetPagination,
    setValues: setPaginValue,
  } = usePagination({ total: smsData?.total });

  const handleSearch = async (value) => {
    if (!value.date) return;
    setIsLoading(true);
    const toDay = moment();
    const diffEndWeek = moment(new Date(value.date))
      .endOf("week")
      .diff(toDay, "days");
    const startDate = moment(new Date(value.date)).startOf("week");
    const endDate =
      diffEndWeek >= 0 ? toDay : moment(new Date(value.date)).endOf("week");
    const params = {
      startDate: startDate.format(CONSTANT.FORMAT_DATE_PAYLOAD),
      endDate: endDate.format(CONSTANT.FORMAT_DATE_PAYLOAD),
      phone: value.phone,
      status: value.status,
      pageNumber,
      pageSize,
    };
    let response = await ReportApi.getReportSMS(params);
    setIsLoading(false);
    if (response.status) {
      setSmsData({ value: response.data?.sms, total: response.data?.total });
    } else {
      message.error(response.message);
    }
  };

  const fieldsHook = useFormFields({
    fieldInputs: FieldsSmsReportData.fieldInputs(),
    onSubmit: handleSearch,
  });

  useEffect(() => {
    handleSearch(fieldsHook.getValues());
  }, [pageNumber, pageSize]);

  return (
    <div className="section-block mt-15">
      <SMSReportFieldComp fieldsProps={fieldsHook} />

      <MainTable
        loading={isLoading}
        className="row_pointer w-fit"
        columns={FormField.ReportOverview.columns()}
        scroll={{ y: "calc(100vh - 380px)" }}
        dataSource={smsData.value || []}
      />
      <Pagination />
    </div>
  );
};

export default SMSReport;
