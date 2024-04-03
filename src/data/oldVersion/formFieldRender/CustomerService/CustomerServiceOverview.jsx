import cityJson from "data/json/city.json";
import districtJson from "data/json/district.json";
import wardJson from "data/json/ward.json";
import * as yup from "yup";
const CustomerServiceOverview = {
  fieldInputs: ({ selectedCity, selectedDistrict, idNoPlaceHolder }) => [
    {
      name: "firstName",
      label: "First name",
      type: "text",
      labelClass: "required",
      rules: yup
        .string()
        .required("Please enter first name")
        .min(2, "Min length is 2")
        .max(40, "Max length is 40"),
      placeholder: "Enter first name",
      span: 4,
    },
    {
      name: "lastName",
      label: "Last name",
      type: "text",
      labelClass: "required",
      rules: yup
        .string()
        .required("Please enter last name")
        .min(2, "Min length is 2")
        .max(40, "Max length is 40"),
      placeholder: "Enter last name",
      span: 4,
    },

    {
      name: "sex",
      label: "Gender",
      placeholder: "--Gender--",
      labelClass: "required",
      type: "select",
      options: [
        { label: "--Gender--", disabled: true },
        { value: "Nam", label: "Nam" },
        { value: "Nữ", label: "Nữ" },
      ],
      rules: yup.string().required("Gender is required"),
      span: 4,
      allowClear: false,
    },

    {
      name: "idNo",
      disabled: true,
      label: "ID No",
      type: "text",
      disabled: true,
      placeholder: idNoPlaceHolder || "Enter Id no",
      span: 4,
    },
    {
      name: "email",
      disabled: true,
      label: "Email",
      type: "text",
      // labelClass: 'required',
      // rules: yup.string().required('Please enter email'),
      placeholder: "Enter email",
      span: 4,
    },
    {
      name: "registerDate",
      disabled: true,
      label: "Register date",
      type: "date-single",
      disabled: true,
      span: 4,
    },
    // {
    //   name: 'birthday',
    //   label: ' Birth day',
    //   type: 'date-single',
    //   labelClass: 'required',
    //   rules: yup.string().required('Please select a birthday'),
    //   disabledDate: (current) => null,
    //   format: 'DD/MM/YYYY',
    //   disabled: true,
    //   span: 8,
    // },
    {
      name: "cityID",
      label: "City ",
      labelClass: "required",
      type: "select",
      options: [
        { label: "--City--", disabled: true },
        ...(cityJson.map((el) => ({
          value: el.code.toString(),
          label: el.name.replace("Thành phố ", "").replace("Tỉnh ", ""),
        })) || []),
      ],
      rules: yup.string().required("City is required"),

      allowClear: false,
    },
    {
      name: "districtID",
      label: "District",
      placeholder: "District",
      labelClass: "required",
      type: "text",
      type: "select",
      options:
        districtJson
          .filter((el) => +el.province_code === +selectedCity)
          .map((el) => ({ value: el.code.toString(), label: el.name })) || [],
      // .filter((el) => +el.province_code === +selectedCity)
      rules: yup.string().required("District is required"),
    },
    {
      name: "wardID",
      label: "Ward",
      placeholder: "--Ward--",
      labelClass: "required",
      type: "select",
      options:
        wardJson
          .filter((el) => +el.district_code === +selectedDistrict)
          .map((el) => {
            return { value: el.code?.toString(), label: el.name };
          }) || [],
      // .filter((el) => +el.district_code === +selectedDistrict)
      rules: yup.string().required("Ward is required"),
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      labelClass: "required",
      rules: yup.string().required("Please enter address"),
      placeholder: "Enter address",
    },
  ],
};
export default CustomerServiceOverview;
