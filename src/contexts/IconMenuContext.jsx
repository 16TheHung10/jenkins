import React, { createContext, useContext, useEffect, useReducer } from "react";
import { TotalBillActions } from "./actions/TotalBillAction";
import { MockIconData } from "../data/oldVersion/mockData/iconData";

const IconMenuContext = createContext();
const initialState = {
  icons: MockIconData,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ICONS":
      return { ...state, icons: action.payload || [] };
    default:
      return { ...state };
  }
};

export const IconMenuContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <IconMenuContext.Provider value={{ state, dispatch }}>
      {children}
    </IconMenuContext.Provider>
  );
};
const useIconMenuContext = () => {
  const value = useContext(IconMenuContext);
  return value;
};

export default useIconMenuContext;
