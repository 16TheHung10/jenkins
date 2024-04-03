import React from "react";
import {
  cityOption,
  statusOption,
} from "components/mainContent/store/StoreDetailsComp";

const StoreOPHomeData = {
  fieldInputs: ({ storeOptions, regionOptions }) => {
    return [
      {
        name: "storeCode",
        label: "Store",
        type: "select",
        options: storeOptions,
        placeholder: "--All--",
      },
      {
        name: "storeStatus",
        label: "Status",
        type: "select",
        options: statusOption,
        placeholder: "--Status--",
      },
      {
        name: "regionCode",
        label: "Region",
        type: "select",
        options: regionOptions,
        placeholder: "--All--",
      },
      {
        name: "isFranchise",
        label: "Store Type",
        type: "select",
        options: [
          {
            value: 2,
            label: "Franchise",
          },
          {
            value: 1,
            label: "Direct",
          },
        ],
        placeholder: "--All--",
      },
      {
        name: "city",
        label: "City",
        type: "select",
        options: cityOption,
        placeholder: "--All--",
      },
    ];
  },
};
export default StoreOPHomeData;
