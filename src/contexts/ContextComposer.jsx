import React, { Component, Fragment } from "react";
import { AppContextProvider } from "./AppContext";
import { GoldenTimeContextProvider } from "./GoldenTimeContext";
import { TotalBillContextProvider } from "./TotalBillContext";
import { StoreOperationContextProvider } from "./StoreOperationContext";
import { FCManagementContextProvider } from "./FCManagementContext";
import { IconMenuContextProvider } from "./IconMenuContext";
import { PageWithNavProvider } from "./PageWithNavContext";
import { DataProvider } from "./DataContext";
import { CampaignContextProvider } from "./CampaignContext";

const ContextComposer = ({ children }) => {
  const providers = [
    AppContextProvider,
    GoldenTimeContextProvider,
    TotalBillContextProvider,
    StoreOperationContextProvider,
    FCManagementContextProvider,
    IconMenuContextProvider,
    PageWithNavProvider,
    DataProvider,
    CampaignContextProvider,
  ];
  return (
    <Fragment>
      {providers.reduce((current, Component) => {
        return <Component>{current}</Component>;
      }, children)}
    </Fragment>
  );
};

export default ContextComposer;
