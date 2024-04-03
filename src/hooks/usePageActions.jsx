import React from "react";
import Action from "components/mainContent/Action";

const usePageActions = (actionsLeft, actionsRight) => {
  return ({ className }) => {
    return (
      <Action {...className} leftInfo={actionsLeft} rightInfo={actionsRight} />
    );
  };
};

export default usePageActions;
