import { usePageActions } from "hooks";
import React from "react";
import { useHistory } from "react-router-dom";

const FCManagementOverviewActionHeader = () => {
  const history = useHistory();

  const handleCreate = () => {
    history.push("/fc-management/create");
  };

  const Action = usePageActions(
    [
      {
        name: "New",
        actionType: "info",
        action: handleCreate,
      },
    ],
    [],
  );
  return <Action />;
};

export default FCManagementOverviewActionHeader;
