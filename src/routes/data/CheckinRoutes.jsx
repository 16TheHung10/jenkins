import React from "react";
const CheckinRoutes = () => {
  return [
    {
      path: "/check-in-history",
      pageComponent: "CheckInHistory",
      pageTitle: "Check in History",
      props: {},
    },
    {
      path: "/check-in-history-iframe",
      pageComponent: "CheckInHistory",
      pageTitle: "Check in History",
      props: {
        isShowHeader: false,
        isShowSidebar: false,
      },
    },
  ];
};

export default CheckinRoutes;
