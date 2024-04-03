import { useAppContext } from 'contexts';
import { OptionsHelper } from 'helpers';
import React, { useCallback } from 'react';

const useCommonOptions = () => {
  const cachedDataJson = localStorage.getItem('cachedData');

  const storeOptions = useCallback(() => {
    if (cachedDataJson) {
      const stores = JSON.parse(cachedDataJson).data?.stores;
      return Object.keys(stores).map((storeCode) => {
        return {
          value: storeCode,
          label: `${storeCode} - ${stores[storeCode]?.storeName}`,
          isFranchise: stores[storeCode]?.isFranchise,
        };
      });
    }
    return [];
  }, [localStorage.getItem('cachedData')]);

  const categoryOptions = useCallback(() => {
    if (cachedDataJson) {
      const groups = JSON.parse(cachedDataJson).data?.groups;
      return Object.keys(groups).map((groupCode) => {
        return {
          value: groupCode,
          label: `${groups[groupCode]?.groupName}`,
        };
      });
    }
    return [];
  }, [localStorage.getItem('cachedData')]);
  const subCategoryOptions = useCallback(() => {
    if (cachedDataJson) {
      const subclasses = JSON.parse(cachedDataJson).data?.subclasses;
      return Object.keys(subclasses).map((subClassCode) => {
        return {
          value: subClassCode,
          label: `${subclasses[subClassCode]?.subClassName}`,
          groupCode: subclasses[subClassCode]?.groupCode,
        };
      });
    }
    return [];
  }, [localStorage.getItem('cachedData')]);
  const subCategoryOptions1 = useCallback(() => {
    for (let i = 0; i < 1000000; i++) {
      console.log({ i });
    }
    if (cachedDataJson) {
      const subclasses = JSON.parse(cachedDataJson).data?.subclasses;
      return Object.keys(subclasses).map((subClassCode) => {
        return {
          value: subClassCode,
          label: `${subclasses[subClassCode]?.subClassName}`,
          groupCode: subclasses[subClassCode]?.groupCode,
        };
      });
    }
    return [];
  }, [localStorage.getItem('cachedData')]);
  const divistionOptions = useCallback(() => {
    if (cachedDataJson) {
      const divisions = JSON.parse(cachedDataJson).data?.divisions;
      return Object.keys(divisions).map((divisionCode) => {
        return {
          value: divisionCode,
          label: `${divisions[divisionCode]?.divisionName}`,
        };
      });
    }
    return [];
  }, [localStorage.getItem('cachedData')]);
  const supplierOptions = useCallback(() => {
    if (cachedDataJson) {
      const suppliers = JSON.parse(cachedDataJson).data?.suppliers;
      return Object.keys(suppliers).map((supplierCode) => {
        return {
          value: suppliers[supplierCode]?.supplierCode,
          label: `${suppliers[supplierCode]?.supplierName}`,
        };
      });
    }
    return [];
  }, [localStorage.getItem('cachedData')]);

  return { storeOptions, categoryOptions, subCategoryOptions, divistionOptions, supplierOptions };
};

export default useCommonOptions;
