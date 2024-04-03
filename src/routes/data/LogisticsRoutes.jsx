import React from "react";
const LogisticsRoutes = () => {
  return [
    {
      path: "/logistics-storeorder",
      pageComponent: "LogisticsStoreOrder",
      pageTitle: "Logistics store order",
      props: {},
    },
    {
      path: "/logistics-storeorder/:poCode",
      pageComponent: "LogisticsStoreOrderDetail",
      pageTitle: "Logistics store order",
      props: {},
    },
    {
      path: "/logistics-ordersupplier",
      pageComponent: "LogisticsOrderSupplier",
      pageTitle: "Logistics order supplier",
      props: {},
    },
    {
      path: "/logistics-ordersupplier/:poCode",
      pageComponent: "LogisticsOrderSupplierDetail",
      pageTitle: "Logistics order supplier",
      props: {},
    },
  ];
};

export default LogisticsRoutes;
