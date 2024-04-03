import React, { createContext, useContext, useReducer } from "react";

export const FCManagementContext = createContext();
const initialState = {
  currentSearchParams: null,
  pagination: {
    pageNumber: 0,
    pageSize: 10,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH_PARAMS":
      return { ...state, currentSearchParams: action.payload };
    case "SET_PAGINATION":
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };
    default:
      return { ...state };
  }
};

export const FCManagementContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FCManagementContext.Provider value={{ state, dispatch }}>
      {children}
    </FCManagementContext.Provider>
  );
};

const useFCManagementContext = () => {
  const value = useContext(FCManagementContext);
  return value;
};
export default useFCManagementContext;
