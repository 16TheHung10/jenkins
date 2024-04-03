import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import Action from "components/mainContent/Action";

const ActionHeader = () => {
  const history = useHistory();

  const handleMoveMember = () => {
    history.push("/customer-service");
  };

  const handleMoveBill = () => {
    history.push("/bill-management-customer");
  };
  const handleMoveCancelAccount = () => {
    history.push("/request-cancel-accounts");
  };
  const renderAction = () => {
    let actionLeftInfo = [
      {
        name: "Member search",
        actionType: "info",

        action: handleMoveMember,
      },
      {
        name: "Bill search",
        actionType: "info",
        action: handleMoveBill,
      },
      {
        name: "Request cancel account",
        actionType: "info",
        action: handleMoveCancelAccount,
      },
    ];
    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  };
  return <Fragment>{renderAction()}</Fragment>;
};

export default ActionHeader;
