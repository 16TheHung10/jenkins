import React from "react";
const AuthRoutes = () => {
  return [
    {
      path: "/login",
      pageComponent: "Login",
      pageTitle: "Login",
      props: {
        isShowHeader: false,
        isShowSidebar: false,
      },
    },
  ];
};

export default AuthRoutes;
