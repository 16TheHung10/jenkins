import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { message } from 'antd';
import CommonModel from 'models/CommonModel';
import ItemModel from 'models/ItemModel';
import { useLocation } from 'react-router-dom';
import { ArrayHelper } from 'helpers';
import { AppApi, ItemsMasterApi } from 'api';
import { actionCreator } from 'contexts';

export const AppContext = createContext(null);
const initialState = {
  stores: null,
  suppliers: null,
  paymentmethods: null,
  items: null,
  itemOptions: [],
  isLogin: false,
  menus: null,
  breadCrumb: null,
  isMenuCollapsed: false,
  menuObject: null,
  menuObjectID: null,
  fcModelTypes: [],
  isWikiMode: false,
  wikiCode: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORES':
      return { ...state, stores: action.payload };
    case 'SET_WIKI_CODE':
      return { ...state, wikiCode: action.payload };
    case 'TOGGLE_WIKI_MODE':
      return { ...state, isWikiMode: !state.isWikiMode };
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload };
    case 'SET_PAYMENT_METHODS':
      return { ...state, paymentmethods: action.payload };
    case 'SET_ALL_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_ALL_ITEM_OPTIONS':
      return { ...state, itemOptions: action.payload };

    case 'SET_LOGIN':
      return { ...state, isLogin: Boolean(action.payload) };
    case 'SET_MENU':
      return { ...state, menus: action.payload };
    case 'SET_BREAD_CRUMB':
      return { ...state, breadCrumb: action.payload };
    case 'TOGGLE_MENU_COLLAPSE':
      return { ...state, isMenuCollapsed: !state.isMenuCollapsed };
    case 'HIDE_MENU_COLLAPSE':
      return { ...state, isMenuCollapsed: true };
    case 'SET_MENU_OBJECT':
      return { ...state, menuObject: action.payload };
    case 'SET_MENU_OBJECT_ID':
      return { ...state, menuObjectID: action.payload };
    case 'SET_FC_MODEL_TYPES':
      return { ...state, fcModelTypes: action.payload };

    default:
      return { ...state };
  }
};

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();
  const handleGetStoresData = async (event) => {
    if (!localStorage.getItem('isLogin')) return true;
    if (state.stores) return;
    let commonModel = new CommonModel();
    await commonModel.getData('store').then((response) => {
      if (response.status) {
        const stores = response.data.stores || [];
        dispatch(actionCreator('SET_STORES', stores));
      } else {
        message.error(response.message);
      }
    });
  };
  const handleGetSuppliersData = async (event) => {
    if (!localStorage.getItem('isLogin')) return;
    if (state.stores) return;
    let commonModel = new CommonModel();
    await commonModel.getData('suppliers').then((response) => {
      if (response.status) {
        const suppliers = response.data.suppliers || [];
        dispatch(actionCreator('SET_SUPPLIERS', suppliers));
      } else {
        message.error(response.message);
      }
    });
  };

  const handleGetPaymentMethods = async (event) => {
    if (state.paymentmethods) return;
    let commonModel = new CommonModel();
    await commonModel.getData('paymentmethod').then((response) => {
      if (response.status) {
        const paymentmethods = response.data.paymentmethods || [];
        dispatch(actionCreator('SET_PAYMENT_METHODS', paymentmethods));
      } else {
        message.error(response.message);
      }
    });
  };
  const handleFCModelTypes = async (event) => {
    if (state.fcModelTypes?.length > 0) return;
    let commonModel = new CommonModel();
    await commonModel.getData('fctype').then((response) => {
      if (response.status) {
        const fctypes = response.data.fctypes || [];
        dispatch(actionCreator('SET_FC_MODEL_TYPES', fctypes));
      } else {
        message.error(response.message);
      }
    });
  };

  const handleGetAllItem = async () => {
    if (state.items) return;
    let model = new ItemModel();
    await model.getAllItems().then((res) => {
      if (res.status && res.data) {
        if (res.data.items) {
          dispatch(actionCreator('SET_ALL_ITEMS', res.data.items));
        }
      } else {
        message.error(res.message);
      }
    });
  };

  const handleGetItemOptions = async (keyword) => {
    if (!keyword || keyword.length <= 2) return;
    const res = await ItemsMasterApi.getItemOptions(keyword);
    if (res.status) {
      const payload = res.data?.items?.map((item) => {
        return {
          value: item.barcode,
          label: item.barcode + ' - ' + item.itemName,
          key: item.barcode,
        };
      });
      dispatch(actionCreator('SET_ALL_ITEM_OPTIONS', payload));
    } else {
      message.error(res.message);
    }
  };

  const handleGetMenu = async () => {
    const res = await AppApi.getMenu();
    if (res.status) {
      const menu = res.data.listMenu;
      dispatch(actionCreator('SET_MENU', menu));
    } else {
      message.error(res.message);
    }
  };
  const convertTreeToObject = (array, key) => {
    if (!array || array.length === 0 || !key) return null;
    let res = {};
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      res = { ...res, [array[i][key]]: item };
      if (array[i].childrens?.length > 0) {
        const newRes = ArrayHelper.convertTreeToObject(array[i].childrens, key);
        res = { ...res, ...newRes };
      }
    }
    return res;
  };
  const handleComvertTreeMenuToArray = (type, key) => {
    if (state.menus?.length > 0) {
      const menuObject = convertTreeToObject(state.menus, key);
      dispatch(actionCreator(type, menuObject));
    }
  };

  const handleComvertTreeMenuToArrayID = (type, key) => {
    if (state.menus?.length > 0) {
      const menuObject = convertTreeToObject(state.menus, key);
      dispatch(actionCreator(type, menuObject));
    }
  };

  useEffect(() => {
    handleComvertTreeMenuToArray('SET_MENU_OBJECT', 'url');
  }, [state.menus]);

  useEffect(() => {
    let clone = {
      ...state.menuObject,
      [location.pathname]: {
        ...state.menuObject?.[location.pathname],
        url: location.pathname + (location.state || location.search || '?'),
      },
    };
    dispatch(actionCreator('SET_MENU_OBJECT', clone));
  }, [location.state, location.search, location.pathname, Object.values(state?.menuObject || {})?.length]);

  const handleSetStoresLocal = (payload) => {
    dispatch(actionCreator('SET_STORES', payload));
  };
  const handleToggleWikiMod = (payload) => {
    dispatch(actionCreator('TOGGLE_WIKI_MODE', payload));
  };
  const handleSetWikiCode = (payload) => {
    dispatch(actionCreator('SET_WIKI_CODE', payload));
  };

  const value = {
    state,
    dispatch,
    onGetItems: handleGetAllItem,
    onGetItemOptions: handleGetItemOptions,
    onGetMenu: handleGetMenu,
    onGetPaymentMethods: handleGetPaymentMethods,
    onGetStoreData: handleGetStoresData,
    onSetStoreData: handleSetStoresLocal,
    onGetSuppliers: handleGetSuppliersData,
    onGetModelTypes: handleFCModelTypes,
    onToggleWikiMod: handleToggleWikiMod,
    onSetWikiCode: handleSetWikiCode,
    onConvertMenuToArrayID: () => handleComvertTreeMenuToArrayID('SET_MENU_OBJECT_ID', 'id'),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
const useAppContext = () => {
  const value = useContext(AppContext);
  return value;
};
export default useAppContext;
