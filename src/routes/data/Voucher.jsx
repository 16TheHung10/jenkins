import MainContent from "components/mainContent/MainContent";
import React from "react";
import { Route } from "react-router-dom";

const VoucherRoute = ({ render }) => {
  return (
    <Route
      exact
      path="/voucher"
      render={(props) =>
        render("Voucher", <MainContent page="Voucher" {...props} />)
      }
    />
  );
};

export default VoucherRoute;
