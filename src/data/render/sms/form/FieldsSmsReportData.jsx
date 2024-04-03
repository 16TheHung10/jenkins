import moment from "moment";
import * as yup from "yup";
const weekFormat = "DD/MM";
const customWeekStartEndFormat = (value) => {
  const toDay = moment();
  const diffEndWeek = moment(new Date(value)).endOf("week").diff(toDay, "days");
  const endDate =
    diffEndWeek >= 0 ? toDay : moment(new Date(value)).endOf("week");
  return `${moment(value)
    .startOf("week")
    .format(weekFormat)} ~ ${endDate.format(weekFormat)}`;
};
const FieldsSmsReportData = {
  fieldInputs: () => [
    {
      name: "date",
      label: "Apply date",
      labelClass: "required",
      type: "date-single",
      format: customWeekStartEndFormat,
      picker: "week",
      disabledDate: (current) => {
        return current && current > moment().endOf("day");
      },
      rules: yup.string().required("Apply date is required"),
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      placeholder: "Phone number",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "Success/Fail",
      options: [
        {
          value: "00",
          label: "Success",
        },
        {
          value: "01",
          label: "Fail",
        },
      ],
    },
  ],
  fieldInputsFilter: ({ createdDateOptions, phoneOptions, statusOptions }) => [
    {
      name: "createdDate",
      label: "Apply date",
      type: "select",
      options: createdDateOptions || [],
      placeholder: "-- All --",
      span: 24,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "select",
      options: phoneOptions || [],
      placeholder: "-- All --",
      span: 24,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: statusOptions || [],
      placeholder: "-- Success/Failed --",
      span: 24,
    },
  ],
};
export default FieldsSmsReportData;
