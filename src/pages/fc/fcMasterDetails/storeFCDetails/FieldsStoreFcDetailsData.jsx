import * as yup from "yup";

const FieldsStoreFcDetailsData = {
  fieldsInputsDetails: () => {
    const isDisabled = true;
    const fields = [
      {
        name: "storeCode",
        label: "Store code",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "storeName",
        label: "Store Name",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "phone",
        label: "Phone internal",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "region",
        label: "Region",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "openedDate",
        label: "Opened Date",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: 0, label: "Open" },
          { value: 1, label: "Closed" },
          { value: 2, label: "Hold" },
        ],
        span: 8,
        disabled: isDisabled,
      },
      {
        name: "locationType",
        label: "Location Type",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "lattitude",
        label: "Lattitude",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "longtitude",
        label: "Longtitude",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "area",
        label: "Area",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },

      {
        name: "city",
        label: "City",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "address",
        label: "Address",
        type: "text",
        span: 16,
        readOnly: isDisabled,
      },

      {
        name: "fcModel",
        label: "Fc Model",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },

      {
        name: "fcStartDate",
        label: "Fc Start Date",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
      {
        name: "fcEndDate",
        label: "Fc End Date",
        type: "text",
        span: 8,
        readOnly: isDisabled,
      },
    ];

    return fields;
  },
};
export default FieldsStoreFcDetailsData;
