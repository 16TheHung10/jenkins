import * as yup from "yup";

const DataRenderEditDiscountItem = {
  fieldInputs: (itemOptions, selectedItem) => {
    return [
      {
        name: "itemCode",
        label: "Item",
        placeholder: "Select item",
        // labelClass: 'required',
        type: "select",
        options: itemOptions,
        disabled: true,
        rules: yup.string().required("Item is required"),
      },
      {
        name: "discountAmount",
        label: "Discount amount (VNĐ)",
        placeholder: "Discount amount",
        labelClass: "required",
        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        parser: (value) => value.replace(/\s?VNĐ\s?|(,*)/g, ""),
        type: "number",
        step: 1000,
        min: 1000,
        max: selectedItem?.salePrice || 1000,
        rules: yup
          .number()
          .typeError("Discount amount must be a number")
          .required("Discount amount is required"),
      },
    ];
  },
};
export default DataRenderEditDiscountItem;
