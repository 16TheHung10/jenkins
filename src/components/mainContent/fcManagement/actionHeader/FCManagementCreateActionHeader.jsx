import { usePageActions } from "hooks";
import React from "react";

const FCManagementCreateActionHeader = ({ onSave }) => {
  const Action = usePageActions(
    [
      {
        name: "Save",
        actionType: "info",
        action: onSave,
      },
    ],
    [],
  );
  return <Action />;
};

export default FCManagementCreateActionHeader;
