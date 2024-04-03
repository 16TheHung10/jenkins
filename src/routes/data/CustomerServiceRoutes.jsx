import React from "react";
const CustomerServiceRoutes = () => {
  return [
    {
      path: "/customer-service",
      pageComponent: "CustomerService",
      pageTitle: "Customer Service",
      props: {
        preLoad: true,
      },
    },
  ];
};

export default CustomerServiceRoutes;
