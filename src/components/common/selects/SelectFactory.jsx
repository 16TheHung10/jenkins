import { useAppContext } from "contexts";
import { OptionsHelper } from "helpers";
import React, { useEffect } from "react";

const SelectFactory = () => {
  const { state: appState, onGetStoreData } = useAppContext();
  useEffect(() => {
    onGetStoreData();
  }, []);
  const factory = (type) => {
    switch (type) {
      case "multipleStore":
        return {
          name: "storeCode",
          label: "Store",
          type: "select",
          mode: "multiple",
          maxTagCount: "responsive",
          options: [
            ...OptionsHelper.convertDataToOptions(
              appState.stores,
              "storeCode",
              "storeCode-storeName",
            ),
          ],
          filterOption: (input, option) => {
            return (option?.label?.toString().toLowerCase() ?? "").includes(
              input.toString().trim().toLowerCase(),
            );
          },
          placeholder: "--All--",
          rules: yup.array().required("Please select store(s)"),
        };
      case "singleStore":
        return {
          name: "storeCode",
          label: "Store",
          type: "select",
          maxTagCount: "responsive",
          options: [
            ...OptionsHelper.convertDataToOptions(
              appState.stores,
              "storeCode",
              "storeCode-storeName",
            ),
          ],
          filterOption: (input, option) => {
            return (option?.label?.toString().toLowerCase() ?? "").includes(
              input.toString().trim().toLowerCase(),
            );
          },
          placeholder: "--All--",
          rules: yup.string().required("Please select store"),
        };
      case "status":
        return {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            {
              value: "1",
              label: "Active",
            },
            {
              value: "0",
              label: "Inactive",
            },
          ],
          placeholder: "--Status--",
          rules: yup.string().required("Status is required"),
        };
    }
  };
  return <div></div>;
};

export default SelectFactory;
