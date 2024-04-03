import { message } from "antd";
import PromotionModel from "models/PromotionModel";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { actionCreator } from "./actionCreator";

const GoldenTimeContext = createContext(null);
const initialState = {
  initialData: null,
  data: null,
  discountTableData: null,
  freeTableData: null,
  currentSearchParams: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_INITIAL_DATA":
      return { ...state, initialData: action.payload };
    case "SET_TABLE_DATA":
      return { ...state, data: action.payload };
    case "SET_DISCOUNT_TABLE_DATA":
      return { ...state, discountTableData: action.payload };
    case "SET_FREE_TABLE_DATA":
      return { ...state, freeTableData: action.payload };
    case "SET_CURRENT_SEARCH_PARAMS":
      return { ...state, currentSearchParams: action.payload };
    default:
      return { ...state };
  }
};

export const GoldenTimeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GoldenTimeContext.Provider value={[state, dispatch]}>
      {children}
    </GoldenTimeContext.Provider>
  );
};
const useGoldenTimeContext = () => {
  const value = useContext(GoldenTimeContext);
  return value;
};
export default useGoldenTimeContext;
