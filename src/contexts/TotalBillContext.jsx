import React, { createContext, useContext, useEffect, useReducer } from "react";
import { TotalBillActions } from "contexts/actions";

const TotalBillContext = createContext();
const initialState = {
  homeData: null,
  detailData: null,
  discountTableData: null,
  freeTableData: null,
  currentSearchParams: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case TotalBillActions.SET_HOME_DATA:
      return { ...state, homeData: action.payload };
    case TotalBillActions.SET_DISCOUNT_TABLE_DATA:
      return { ...state, discountTableData: action.payload };
    case TotalBillActions.SET_FREE_TABLE_DATA:
      return { ...state, freeTableData: action.payload };
    case TotalBillActions.SET_CURRENT_SEARCH_PARAMS:
      return { ...state, currentSearchParams: action.payload };
    default:
      return { ...state };
  }
};

export const TotalBillContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TotalBillContext.Provider value={{ state, dispatch }}>
      {children}
    </TotalBillContext.Provider>
  );
};
const useTotalBillContext = () => {
  const value = useContext(TotalBillContext);
  return value;
};
export default useTotalBillContext;
