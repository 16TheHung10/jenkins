import React from "react";
import * as yup from "yup";

const StoreOPCreateFormFields = {
  fieldInputs: ({
    regionOption,
    cityOption,
    statusOption,
    locationTypeOption,
    numberOfCounterOption,
    bankPaymentOption,
  }) => [
    {
      name: "storeCode",
      label: "Store Code",
      placeholder: "Store Code",
      labelClass: "required",
      type: "text",
      rules: yup
        .string()
        .trim()
        .required("Store code is required")
        .matches(
          /^VN\d{4}$/,
          'The value must match the string "VNXXXX" where XXXX is a number.',
        ),
    },
    {
      name: "storeName",
      label: "Store Name",
      placeholder: "Store Name",
      labelClass: "required",
      type: "text",
      rules: yup.string().trim().required("Store name is required"),
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Email",
      labelClass: "required",
      type: "text",
      rules: yup
        .string()
        .trim()
        .email("Invalid email")
        .required("Store email is required"),
    },
    {
      name: "phone",
      label: "Phone internal",
      placeholder: "Phone internal",
      type: "text",
      labelClass: "required",
      rules: yup.string().trim().required("Phone internal is required"),
    },
    //   --------------------------------
    {
      name: "regionCode",
      label: "Region",
      labelClass: "required",
      type: "select",
      options: regionOption,
      placeholder: "--Region--",
      rules: yup.string().required("Region is required"),
    },
    {
      name: "city",
      label: "City",
      labelClass: "required",
      type: "select",
      options: cityOption,
      placeholder: "--City--",
      rules: yup.string().required("City is required"),
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Address",
      labelClass: "required",
      type: "text",
      rules: yup.string().trim().required("Address is required"),
    },
    {
      name: "area",
      label: "Area",
      placeholder: "Area",
      labelClass: "required",
      type: "text",
      rules: yup.string().trim().required("Area is required"),
    },
    {
      name: "lattitude",
      label: "Lattitude",
      placeholder: "Lattitude",
      labelClass: "required",
      type: "text",
      rules: yup
        .string()
        .trim()
        .required("Lattitude is required")
        .matches(/^[0-9.]+$/, { message: "Invalid lattitude" }),
    },
    {
      name: "longtitude",
      label: "Longtitude",
      placeholder: "Longtitude",
      labelClass: "required",
      type: "text",
      rules: yup
        .string()
        .trim()
        .required("Longtitude is required")
        .matches(/^[0-9.]+$/, { message: "Invalid longtitude" }),
    },
    // ---------------------------
    {
      name: "numberOfCounter",
      label: "Number Of Counter",
      labelClass: "required",
      type: "select",
      options: numberOfCounterOption,
      placeholder: "--Number Of Counter--",
      rules: yup.string().required("Number Of Counter is required"),
    },

    {
      name: "bank",
      label: "Bank Payment",
      labelClass: "required",
      type: "select",
      options: bankPaymentOption,
      placeholder: "--Bank Payment--",
      rules: yup.string().required("Bank Payment is required"),
    },
    // ----------------------

    {
      name: "openedDate",
      label: "Opened Date",
      placeholder: "Opened Date",
      labelClass: "required",
      type: "date-single",
      rules: yup.string().required("Open date is required"),
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: statusOption,
      labelClass: "required",
      placeholder: "--Status--",
      rules: yup.string().required("Status is required"),
    },
    // -----------------------------

    // -----------------------------

    {
      name: "locationType",
      label: "Location Type",
      type: "select",
      options: locationTypeOption,
      labelClass: "required",
      placeholder: "--Location type--",
      rules: yup.string().required("Location type is required"),
    },
    // {
    //   name: 'isFranchiseStore',
    //   label: 'Is Franchise Store',
    //   type: 'switch',
    //   labelClass: 'required',
    //   defaultChecked: false,
    //   defaultValue: false,
    // },
  ],

  fieldInputsFC: ({
    fanchiseModelOptions,
    cityOptionFC,
    wardOption,
    districtOption,
    onChangeCityFC,
  }) => [
    {
      name: "fcModel",
      label: "Franchise Model",
      type: "select",
      options: fanchiseModelOptions,
      labelClass: "required",
      placeholder: "--Franchise model--",
      rules: yup.string().required("Franchise model is required"),
    },
    {
      name: "fcLifeCycle",
      label: "Franchise constract time",
      labelClass: "required",
      type: "date-range",
      format: "DD/MM/YYYY",
      rules: yup.array().required("Franchise constract time is required"),
    },

    {
      name: "fcContactName",
      label: "Franchise Full Name",
      placeholder: "Fanchise Full Name",
      labelClass: "required",
      type: "text",
      rules: yup.string().trim().required("Franchise full name is required"),
    },
    {
      name: "fcMobile",
      label: "Franchise Mobile",
      placeholder: "Fanchise Mobile",
      labelClass: "required",
      type: "text",
      rules: yup.string().trim().required("Franchise mobile is required"),
    },
    {
      name: "fcEmail",
      label: "Franchise Email",
      placeholder: "Fanchise Email",
      labelClass: "required",
      type: "text",
      rules: yup.string().trim().required("Franchise email is required"),
    },
    {
      name: "fcCompanyInfor",
      label: "Franchise Company Infor",
      placeholder: "Fanchise Company Infor",
      labelClass: "required",
      type: "text",
      rules: yup.string().trim().required("Franchise company info is required"),
    },
    {
      name: "fcTaxCode",
      label: "Franchise TaxCode",
      placeholder: "Fanchise TaxCode",
      labelClass: "required",
      type: "text",
      rules: yup.string().trim().required("Franchise tax code is required"),
    },
    {
      name: "fcCity",
      label: "City FC",
      placeholder: "City",
      labelClass: "required",
      type: "select",
      options: cityOptionFC,
      rules: yup.string().required("Franchise city is required"),
    },
    {
      name: "fcDistrict",
      label: "District",
      placeholder: "District",
      labelClass: "required",
      type: "text",
      type: "select",
      options: districtOption,
      rules: yup.string().required("Franchise district is required"),
    },
    {
      name: "fcWard",
      label: "Ward",
      placeholder: "Ward",
      labelClass: "required",
      type: "select",
      options: wardOption,
      rules: yup.string().required("Franchise ward is required"),
    },
    {
      name: "fcAddress",
      label: "Address",
      placeholder: "Address",
      labelClass: "required",
      type: "text",
      rules: yup.string().trim().required("Franchise address is required"),
    },
  ],
};
export default StoreOPCreateFormFields;
