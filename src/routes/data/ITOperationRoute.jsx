import React from "react";

const ITOperationRoute = () => {
  return [
    {
      path: "/device-management",
      pageComponent: "DeviceManagement",
      pageTitle: "Device Management",
      props: {},
    },

    {
      path: "/setting/cache",
      pageComponent: "Setting",
      pageTitle: "Setting",
      props: {},
    },
    {
      path: "/report-sale-log",
      pageComponent: "ReportSaleLog",
      pageTitle: "Report Sale Log",
      props: {},
    },
    {
      path: "/report-sales-store-async",
      pageComponent: "ReportStoreSalesProcessAsync",
      pageTitle: "Sales Store",
      props: {},
    },
    {
      path: "/message-log/pos",
      pageComponent: "PosLog",
      pageTitle: "POS Log",
      props: {},
    },
    {
      path: "/monitorreport",
      pageComponent: "MonitorReport",
      pageTitle: "Monitor Report",
      props: {},
    },
    {
      path: "/message-notify",
      pageComponent: "MessageNotify",
      pageTitle: "Message Notify",
      props: {},
    },
    {
      path: "/store-config",
      pageComponent: "StoreConfig",
      pageTitle: "Store Config",
      props: {},
    },
    {
      path: "/quick-pos-notify",
      pageComponent: "QuickPosNotify",
      pageTitle: "Quick Pos Notify",
      props: {},
    },
    {
      path: "/pos-notify",
      pageComponent: "POSNotify",
      pageTitle: "POS Notify",
      props: {},
    },
  ];
};

export default ITOperationRoute;
