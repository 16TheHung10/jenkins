import React, { createContext, useContext, useMemo, useReducer } from "react";

const StoreOperationContext = createContext(null);
const initialState = {
  fields: null,
  pageNumber: 1,
  pageSize: 10,
  stores: null,
  regions: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELDS":
      return {
        ...state,
        fields: { ...state.fields, ...action.payload },
      };
    case "SET_PAGE_NUMBER":
      return {
        ...state,
        pageNumber: action.payload,
      };
    case "SET_PAGE_SIZE":
      return {
        ...state,
        pageSize: action.payload,
      };
    case "SET_STORES":
      return {
        ...state,
        stores: action.payload,
      };
    case "SET_REGIONS":
      return {
        ...state,
        regions: action.payload,
      };
    default:
      return { ...state };
  }
};

export const StoreOperationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <StoreOperationContext.Provider value={value}>
      {children}
    </StoreOperationContext.Provider>
  );
};
const useStoreOperationContext = () => {
  const value = useContext(StoreOperationContext);
  return value;
};

export default useStoreOperationContext;
