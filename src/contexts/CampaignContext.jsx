import React, { createContext, useContext, useMemo, useReducer } from "react";
import actionCreator from "./actionCreator";
export const CampaignContext = createContext();
const initialState = {
  campaignData: null,
  awardItems: [],
  itemValid: [],
  campaignTypeInfo: null,
  billConditionPayments: [],
  selectedStoreQR: null,
  isOpenModalQR: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CAMPAIGN_DATA":
      return { ...state, campaignData: action.payload };
    case "SET_AWARD_ITEMS":
      return { ...state, awardItems: action.payload };
    case "SET_ITEM_VALID":
      return Object.assign({}, state, {
        itemValid: action.payload,
      });
    // return { ...state, itemValid: action.payload };
    case "SET_CAMPAIGN_TYPE_INFO":
      return { ...state, campaignTypeInfo: action.payload };
    case "SET_BILL_CONDITION_PAYMENTS":
      return { ...state, billConditionPayments: action.payload };
    case "TOGGLE_MODAL_QR":
      return { ...state, isOpenModalQR: !state.isOpenModalQR };
    case "SET_SELECTED_STORE_QR":
      return { ...state, selectedStoreQR: action.payload };
    default:
      return { ...state };
  }
};

export const CampaignContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSetAwardItems = (data) => {
    dispatch(actionCreator("SET_AWARD_ITEMS", data));
  };

  const handleSetCampaignData = (data) => {
    dispatch(actionCreator("SET_CAMPAIGN_DATA", data));
  };

  const handleSetItemValid = (data) => {
    dispatch(actionCreator("SET_ITEM_VALID", data));
  };

  const handleSetCampaignTypeInfo = (data) => {
    dispatch(actionCreator("SET_CAMPAIGN_TYPE_INFO", data));
  };
  const handleSetBillConditionPayments = (data) => {
    dispatch(actionCreator("SET_BILL_CONDITION_PAYMENTS", data));
  };

  const handleToggleModalQR = () => {
    dispatch(actionCreator("TOGGLE_MODAL_QR"));
  };
  const handleSetSelectedStoreQR = (data) => {
    dispatch(actionCreator("SET_SELECTED_STORE_QR", data));
  };

  const value = useMemo(() => {
    return {
      onSetAwardItems: handleSetAwardItems,
      onSetCampaignData: handleSetCampaignData,
      onSetItemValid: handleSetItemValid,
      onSetCampaignTypeInfo: handleSetCampaignTypeInfo,
      onSetBillConditionPayments: handleSetBillConditionPayments,
      onToggleModalQR: handleToggleModalQR,
      onSetSelectedStoreQR: handleSetSelectedStoreQR,
      state,
    };
  }, [state]);

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

const useCampaignContext = () => {
  const value = useContext(CampaignContext);
  return value;
};
export default useCampaignContext;
