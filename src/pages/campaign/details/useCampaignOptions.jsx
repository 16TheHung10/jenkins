import React, { useEffect, useMemo, useRef } from 'react';
import { OptionsHelper } from 'helpers';
import { useAppContext } from 'contexts';
const useCampaignOptions = ({ itemSearch }) => {
  const searchItemRef = useRef();
  const { state: AppState, onGetStoreData, onGetItems, onGetPaymentMethods, onGetItemOptions } = useAppContext();
  useEffect(() => {
    onGetStoreData();
    onGetItems();
    onGetPaymentMethods();
  }, []);

  useEffect(() => {
    if (searchItemRef.current) {
      clearTimeout(searchItemRef.current);
    }
    searchItemRef.current = setTimeout(() => {
      onGetItemOptions(itemSearch);
    }, [500]);
    return () => {
      clearTimeout(searchItemRef.current);
    };
  }, [itemSearch]);
  const storeOptions = useMemo(() => {
    const array = Object.values(AppState?.stores || {});
    if (array) {
      const options = OptionsHelper.convertDataToOptions(array, 'storeCode', 'storeCode-storeName');
      return options;
    }
    return [];
  }, [AppState?.stores]);

  const paymentOptions = useMemo(() => {
    const array = Object.values(AppState?.paymentmethods || {});
    if (array) {
      const options = OptionsHelper.convertDataToOptions(array, 'methodCode', 'methodName');
      return options;
    }
    return [];
  }, [AppState.paymentmethods]);

  const itemOptions = useMemo(() => {
    const array = Object.values(AppState?.items || {});
    if (array) {
      const options = OptionsHelper.convertDataToOptions(array, 'itemCode', 'itemCode-itemName');
      return options;
    }
    return [];
  }, [AppState.items]);
  return { storeOptions, itemOptions, paymentOptions };
};

export default useCampaignOptions;
