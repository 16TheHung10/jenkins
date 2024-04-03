import { useAppContext, useStoreOperationContext } from 'contexts';
import StoreOPHomeData from 'data/oldVersion/formFieldRender/StoreOPHome';
import { OptionsHelper } from 'helpers';
import { useFormFields, usePagination } from 'hooks';
import CommonModel from 'models/CommonModel';
import StoreModel from 'models/StoreModel';
import OperationSearchAction from 'pages/store/Operation/OperationSearchAction';
import OperationTableContent from 'pages/store/Operation/OperationTableContent/OperationTableContent';
import React, { memo, useEffect, useMemo } from 'react';

const OperationStore = () => {
  const { state, dispatch } = useStoreOperationContext();

  const { state: AppState, onGetStoreData } = useAppContext();
  useEffect(() => {
    onGetStoreData();
  }, []);
  const regionOptions = useMemo(() =>
    OptionsHelper.convertDataToOptions(state?.regions, 'regionCode', 'regionCode-regionName')
  );
  const storeOptions = useMemo(() => {
    const array = Object.values(AppState?.stores || {});
    if (array) {
      const options = OptionsHelper.convertDataToOptions(array, 'storeCode', 'storeCode-storeName');
      return options;
    }
    return [];
  }, [AppState?.stores]);

  const handleFetchRegion = async () => {
    let commonModel = new CommonModel();
    await commonModel.getRegion().then((response) => {
      if (response.status) {
        if (response.data.regions != null && response.data.regions.size != 0) {
          dispatch({ type: 'SET_REGIONS', payload: response.data.regions });
        }
      }
    });
  };
  const { Pagination, pageSize, pageNumber, reset: resetPagination } = usePagination({ total: state.stores?.total });

  const handleSubmit = async (value, pageNumberParams) => {
    if (pageNumberParams) {
      resetPagination();
    }
    for (let key of Object.keys(value)) {
      if (value?.[key] === undefined || value?.[key] === null) {
        if (key === 'isFranchise') {
          value[key] = 0;
        } else value[key] = '';
      }
    }
    let storeModel = new StoreModel();
    let params = {
      ...value,
      storeStatus:
        value?.storeStatus === 0
          ? 'OPEN'
          : value?.storeStatus === 1
          ? 'CLOSED'
          : value?.storeStatus === 2
          ? 'HOLD'
          : '',
      pageNumber: pageNumberParams ? pageNumberParams : pageNumber,
      pageSize,
      storeName: '',
    };
    await storeModel.getListOperationStore(params).then((response) => {
      if (response.status) {
        dispatch({ type: 'SET_STORES', payload: response.data });
      }
    });
  };

  // --------------------------------------END FUNCTIONS--------------------------------------

  // --------------------------------------USE_EFFECT--------------------------------------

  const {
    formInputs,
    onSubmitHandler,
    handleSubmit: handleSubmitHookForm,
  } = useFormFields({
    fieldInputs: StoreOPHomeData.fieldInputs({ storeOptions, regionOptions }),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    handleFetchRegion();
  }, []);

  useEffect(() => {
    onSubmitHandler();
  }, [pageSize, pageNumber]);

  const handleSubmitClick = handleSubmitHookForm((value) => {
    handleSubmit(value, 1);
  });
  return (
    <div className="flex flex-col item-center justify-center h-full">
      <OperationSearchAction fields={formInputs} onSubmit={handleSubmitClick} />
      <OperationTableContent Pagination={Pagination} />
    </div>
  );
};

export default memo(OperationStore);
