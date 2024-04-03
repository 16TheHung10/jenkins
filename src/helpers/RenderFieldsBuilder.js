import * as yup from "yup";
import OptionsHelper from "./OptionsHelper";
import { AppContext } from "contexts/AppContext";
import { useAppContext } from "contexts";
import cityJson from "data/json/city.json";
import districtJson from "data/json/district.json";
import wardJson from "data/json/ward.json";
import React from "react";
class RenderFieldBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: useAppContext().state,
    };
  }
  componentDidMount() {
    if (!useAppContext().state.items) {
      useAppContext().onGetItems();
    }
    useAppContext.onGetStoreData();
  }

  static renderInputObject(name, label, placeholder) {
    return {
      name,
      label,
      placeholder,
    };
  }

  selectFactory(type, isRequired, props) {
    switch (type) {
      case "multipleStore":
        return {
          name: "storeCode",
          label: "Store",
          type: "select",
          mode: "multiple",

          maxTagCount: "responsive",
          labelClass: isRequired ? "reuquired" : "",
          options: [
            ...OptionsHelper.convertDataToOptions(
              Object.values(this.state.appState?.stores || {}),
              "storeCode",
              "storeCode-storeName",
            ),
          ],
          // filterOption: (input, option) => {
          //   return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
          // },
          placeholder: "--All--",
          rules: isRequired
            ? yup.array().required("Please select store(s)")
            : null,
          ...props,
        };

      case "singleStore":
        return {
          name: "storeCode",
          label: "Store",
          type: "select",
          labelClass: isRequired ? "required" : "",
          options: [
            ...OptionsHelper.convertDataToOptions(
              Object.values(this.state.appState.stores || {}),
              "storeCode",
              "storeCode-storeName",
            ),
          ],
          // filterOption: (input, option) => {
          //   return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
          // },
          placeholder: "--All--",
          rules: isRequired
            ? yup.string().required("Please select store")
            : null,
          ...props,
        };

      case "multipleItem":
        return {
          name: "itemCode",
          label: "Barcode",
          type: "select",
          mode: "multiple",
          maxTagCount: "responsive",
          options: [
            ...OptionsHelper.convertDataToOptions(
              Object.values(this.state.appState.items),
              "itemCode",
              "itemCode-itemName",
            ),
          ],
          // filterOption: (input, option) => {
          //   return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
          // },
          placeholder: "--All--",
          rules: yup.array().required("Please select item(s)"),
          ...props,
        };

      case "singleItem":
        return {
          name: "itemCode",
          label: "Barcode",
          type: "select",
          options: [
            ...OptionsHelper.convertDataToOptions(
              Object.values(this.state.appState.items),
              "itemCode",
              "itemCode-itemName",
            ),
          ],
          // filterOption: (input, option) => {
          //   return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
          // },
          labelClass: isRequired ? "required" : "",
          placeholder: "--All--",
          rules: yup.string().required("Please select item"),
          ...props,
        };

      case "storeStatus":
        return {
          name: "storeStatus",
          label: "Store status",
          type: "select",
          options: [
            {
              value: 0,
              label: "Open",
            },
            {
              value: 1,
              label: "Close",
            },
            {
              value: 2,
              label: "Hold",
            },
          ],
          labelClass: isRequired ? "required" : "",
          placeholder: "--Status--",
          rules: yup.number().required("Status is required"),
          ...props,
        };

      case "status":
        return {
          name: "status",
          label: "Status",
          labelClass: isRequired ? "required" : "",
          type: "select",
          options: [
            {
              value: 1,
              label: "Active",
            },
            {
              value: 0,
              label: "Inactive",
            },
          ],
          placeholder: "--Status--",
          rules: isRequired
            ? yup.number().required("Status is required")
            : null,
          ...props,
        };

      case "fcModel":
        return {
          name: "fcModel",
          label: "Franchise Model",
          type: "select",
          options: [
            { value: "Office", label: "Office" },
            { value: "Residence", label: "Residence" },
            { value: "Hospitality", label: "Hospitality" },
            { value: "Apartment", label: "Apartment" },
            { value: "School", label: "School" },
          ],
          labelClass: isRequired ? "required" : "",
          placeholder: "--Franchise model--",
          rules: yup.string().required("Franchise model is required"),
          ...props,
        };

      case "fcCity":
        return {
          name: "fcCity",
          label: "City FC",
          placeholder: "City",
          labelClass: isRequired ? "required" : "",
          type: "select",
          options:
            cityJson.map((el) => ({
              value: el.code,
              label: el.name.replace("Thành phố ", "").replace("Tỉnh ", ""),
            })) || [],
          rules: yup.string().required("Franchise city is required"),
          ...props,
        };
      case "fcDistrict":
        return {
          name: "fcDistrict",
          label: "District",
          placeholder: "District",
          labelClass: "required",
          type: "text",
          type: "select",
          options: districtJson,
          // .filter((el) => +el.province_code === +selectedCity)
          rules: yup.string().required("Franchise district is required"),
          ...props,
        };
      case "fcWard":
        return {
          name: "fcWard",
          label: "Ward",
          placeholder: "Ward",
          labelClass: "required",
          type: "select",
          options: wardJson,
          // .filter((el) => +el.district_code === +selectedDistrict)
          rules: yup.string().required("Franchise ward is required"),
          ...props,
        };
      default:
        return null;
    }
  }

  inputTextFactory(type, isRequired) {
    switch (type) {
      case "promotionName":
        return {
          ...RenderFieldBuilder.renderInputObject(
            "promotionName",
            "Promotion name",
            "Enter promotion name",
          ),
          labelClass: isRequired ? "required" : "",
          type: "text",
          rules: isRequired ? yup.string().required() : null,
        };
      case "fcContactName":
        return {
          ...RenderFieldBuilder.renderInputObject(
            "fcContactName",
            "Franchise Full Name",
            "Enter Franchise Full Name",
          ),
          labelClass: isRequired ? "required" : "",
          type: "text",
          rules: isRequired ? yup.string().required() : null,
        };
      case "fcMobile":
        return {
          ...RenderFieldBuilder.renderInputObject(
            "fcMobile",
            "Franchise Mobile",
            "Enter Franchise Mobile",
          ),
          labelClass: isRequired ? "required" : "",
          type: "text",
          rules: isRequired ? yup.string().required() : null,
        };
      case "fcEmail":
        return {
          ...RenderFieldBuilder.renderInputObject(
            "fcEmail",
            "Franchise Email",
            "Enter Franchise Email",
          ),
          labelClass: isRequired ? "required" : "",
          type: "text",
          rules: isRequired ? yup.string().required() : null,
        };
      case "fcCompanyInfor":
        return {
          ...RenderFieldBuilder.renderInputObject(
            "fcCompanyInfor",
            "Franchise Company Infor",
            "Enter Franchise Company Infor",
          ),
          labelClass: isRequired ? "required" : "",
          type: "text",
          rules: isRequired ? yup.string().required() : null,
        };
      case "fcTaxCode":
        return {
          ...RenderFieldBuilder.renderInputObject(
            "fcTaxCode",
            "Franchise TaxCode",
            "Enter Franchise TaxCode",
          ),
          labelClass: isRequired ? "required" : "",
          type: "text",
          rules: isRequired ? yup.string().required() : null,
        };
      case "fcAddress":
        return {
          ...RenderFieldBuilder.renderInputObject(
            "fcAddress",
            "Address",
            "Enter Franchise Address",
          ),
          labelClass: isRequired ? "required" : "",
          type: "text",
          rules: isRequired ? yup.string().required() : null,
        };
      default:
        return null;
    }
  }
  inputNumberFactory(type, isRequired) {
    switch (type) {
      case "discountAmount":
        return {
          ...RenderFieldBuilder.renderInputObject(
            "discountAmount",
            "Discount amount",
            "Enter discount amount",
          ).bind(RenderFieldBuilder),
          type: "number",
          rules: isRequired ? yup.string().required() : null,
        };
      case "billAmount":
        return {
          ...this.renderInputObject(
            "billAmount",
            "Bill amount",
            "Enter bill amount",
          ).bind(RenderFieldBuilder),
          type: "number",
          rules: isRequired ? yup.string().required() : null,
        };
      default:
        return null;
    }
  }

  datePickerFactory(type, isRequired, props) {
    switch (type) {
      case "single":
        return {
          name: "date",
          label: "Apply date",
          type: "date-single",
          labelClass: isRequired ? "required" : "",
          rules: isRequired
            ? yup.string().required("Please select a apply date")
            : null,
          format: "DD/MM/YYYY",
          ...props,
        };
      case "range":
        return {
          name: "date",
          label: "Apply date",
          type: "date-range",
          labelClass: isRequired ? "required" : "",
          rules: isRequired
            ? yup.array().required("Please select a apply date")
            : null,
          format: "DD/MM/YYYY",
          ...props,
        };
      default:
        return null;
    }
  }
}
RenderFieldBuilder.contextType = AppContext;
export default RenderFieldBuilder;
