import { PageWithNavActions } from "contexts/actions";
import React, { createContext, useContext, useMemo, useReducer } from "react";
const PageWithNavContext = createContext();

const initialState = {
  actionLeft: [],
  actionRight: [],
  isVisible: true,
  activeTab: "",
  hiddenTabType: [],
};
const reducer = (state, action) => {
  switch (action.type) {
    case PageWithNavActions.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    case PageWithNavActions.SET_ACTIONS_LEFT:
      return { ...state, actionLeft: action.payload };
    case PageWithNavActions.SET_ACTIONS_RIGHT:
      return { ...state, actionRight: action.payload };
    case PageWithNavActions.SET_VISIBLE:
      return { ...state, isVisible: action.payload };
    default:
      return;
  }
};
export const PageWithNavProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );
  return (
    <PageWithNavContext.Provider value={value}>
      {children}
    </PageWithNavContext.Provider>
  );
};

const usePageWithNavContext = () => {
  const value = useContext(PageWithNavContext);
  return value;
};
export default usePageWithNavContext;
