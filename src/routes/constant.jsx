import React from "react";
export const ROUTER_CONSTANT = {
  LOYALTY: {
    MAIN: "/loyalty",
    MERGE_MEMBER: "/loyalty/merge",
  },
};

export const ROUTES = {
  Error: {
    path: "/error",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },
  Login: {
    path: "/login",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },
  Root: {
    path: "/",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },
  Campaigns: {
    path: "/campaigns",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },
  CreateCampaigns: {
    path: "/campaigns/create",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },

  UserManual: {
    path: "/user-manual",
    pageComponent: "UserManual",
    pageTitle: "User Manual",
    props: {},
  },
  FcManagement: {
    path: "/fc-management",
    pageComponent: "FCManagement",
    pageTitle: "Franchise management",
    props: {},
  },
  TraceLog: {
    path: "/trace-log",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },
  CreateFcManagement: {
    path: "/fc-management/create",
    pageComponent: "FCManagementCreate",
    pageTitle: "Franchise management",
    props: {},
  },
  EditFcManagementDetails: {
    path: "/fc-management/edit/:id",
    pageComponent: "FCManagementEdit",
    pageTitle: "Franchise management",
    props: {},
  },
  VoucherPayment: {
    path: "/voucher-payment",
    pageComponent: "CheckVoucher",
    pageTitle: "Voucher payment",
    props: {},
  },
  MessageDetails: {
    path: "/message/:type",
    pageComponent: "PageMessage",
    pageTitle: "Message",
    props: {
      isShowHeader: false,
      isShowSidebar: false,
    },
  },
  CallbackDetails: {
    path: "/callback/:type",
    pageComponent: "PageCallback",
    pageTitle: "Callback",
    props: {
      isShowHeader: false,
      isShowSidebar: false,
    },
  },
  Payroll: {
    path: "/payroll",
    pageComponent: "Payroll",
    pageTitle: "Store Payroll",
    props: {},
  },
  HOPayroll: {
    path: "/payroll",
    pageComponent: "HOPayroll",
    pageTitle: "HO Payroll",
    props: {},
  },

  TransactionPayment: {
    path: "/transaction-payment",
    pageComponent: "TransactionPayment",
    pageTitle: "Transaction Payment",
    props: {},
  },
  ManagementScreen2: {
    path: "/management-screen2",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },

  SohDashboard: {
    path: "/soh/dashboard",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },

  PromotionDiscountList: {
    path: "/promotion-discount-list",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },
  CreatePromotionDiscountList: {
    path: "/promotion-discount-list/create",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },
  PromotionDiscountListDetails: {
    path: "/promotion-discount-list/:orderCode",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },

  CreateUser: {
    path: "/user/create",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },
  UserId: {
    path: "/user/:userID",
    pageComponent: "",
    pageTitle: "",
    props: {},
  },
};
