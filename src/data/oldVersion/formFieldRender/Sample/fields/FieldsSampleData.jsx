import * as yup from "yup";

const FieldsSampleData = {
  fieldInputs: () => [
    {
      name: "date",
      label: "Apply date",
      labelClass: "required",
      type: "text",
      rules: yup.array().required("Apply date code is required"),
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        {
          value: 0,
          label: "Inactive",
        },
        {
          value: 1,
          label: "Active",
        },
      ],
    },
  ],
};
export default FieldsSampleData;
