import { Col, Modal, Row, message } from 'antd';
import Action from 'components/mainContent/Action';
import { useAppContext, useStoreOperationContext } from 'contexts';
import cityJson from 'data/json/city.json';
import districtJson from 'data/json/district.json';
import FormField from 'data/oldVersion/formFieldRender';
import wardJson from 'data/json/ward.json';
import { OptionsHelper } from 'helpers';
import { useFormFields } from 'hooks';
import CommonModel from 'models/CommonModel';
import StoreModel from 'models/StoreModel';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

export let statusOption = [
  { value: 0, label: 'Open' },
  { value: 1, label: 'Closed' },
  { value: 2, label: 'Hold' },
];
export let locationTypeOption = [
  { value: 'Office', label: 'Office' },
  { value: 'Residence', label: 'Residence' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'School', label: 'School' },
  { value: 'Special', label: 'Special' },
];
export let cityOption =
  cityJson.map((el) => ({
    value: el.name.replace('Thành phố ', '').replace('Tỉnh ', ''),
    label: el.name.replace('Thành phố ', '').replace('Tỉnh ', ''),
  })) || [];

export let bankPaymentOption = [
  { value: 'credit', label: 'Credit Card' },
  { value: 'ocb', label: 'OCB' },
  { value: 'vcb', label: 'Vietcombank' },
];

export let numberOfCounterOption = [
  { value: 1, label: '1 Pos' },
  { value: 2, label: '2 Pos' },
  { value: 3, label: '3 Pos' },
  { value: 4, label: '4 Pos' },
];
export let cityOptionFC = cityJson?.map((el) => ({
  value: el.code,
  label: el.name,
}));

const StoreDetailsComp = ({ initialStoreCode }) => {
  const { state, dispatch } = useStoreOperationContext();
  const { state: AppState, dispatch: AppDispatch, onGetStoreData, onGetModelTypes } = useAppContext();
  useEffect(() => {
    onGetStoreData();
    onGetModelTypes();
  }, []);
  const history = useHistory();
  const params = useParams();
  const actionRef = useRef();
  const [status, setStatus] = useState(null);
  const [isFranchiseStore, setIsFranchiseStore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const handleChangeSwitch = (value) => {
    setIsFranchiseStore(value);
  };

  useEffect(() => {
    handleFetchRegion();
  }, []);

  const handleGetStoresData = async () => {
    let storeModel = new StoreModel();
    const res = await storeModel.getListStore({ storeCode: initialStoreCode });
    if (res.status) {
      const store = res.data?.stores?.[0];
      return store;
    } else {
      message.error(res.message);
    }
  };

  const storeQuery = useQuery({
    queryKey: ['storeDetail', initialStoreCode, params.id],
    queryFn: handleGetStoresData,
    enabled: Boolean(initialStoreCode),
  });

  const store = useMemo(() => {
    return {
      ...storeQuery.data,
      storeName: '',
      storeCode: '',
      openedDate: moment(storeQuery.data?.openedDate),
    };
  }, [storeQuery.isFetching, initialStoreCode]);

  useEffect(() => {
    if (store.storeFC) {
      alert('Can not convert this store');
      history.replace('/store');
    }
  }, [store]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (value) => {
    if (!isModalOpen) {
      showModal();
      return;
    }
    let startDate = moment(value.fcLifeCycle?.[0]).format('YYYY-MM-DD');
    const endDate = moment(value.fcLifeCycle?.[1]).format('YYYY-MM-DD');

    if (startDate === endDate) {
      startDate = '';
    }
    const payload = (value = {
      ...value,
      status: 1,
      openedDate: moment(value.openedDate).format('YYYY-MM-DD'),
      ipAddress: '10.2.' + (parseInt(value.storeCode.substring(2, value.storeCode.length)) + 20 - 255) + '.',
      fcStartDate: startDate,
      fcEndDate: endDate,
      isFranchiseStore: store.fcModel === '' ? true : false,
      oldStoreCode: initialStoreCode,
      isCHTT: true,
      fcAddress: `${value.fcAddress},${value.fcWard},${value.fcDistrict},${value.fcCity}`,
    });
    const model = new StoreModel();
    const res = await model.postStore(payload);
    if (res.status) {
      message.success('Create a new store successfully!!!');
      handleCancel();
      setTimeout(() => {
        // history.goBack();
      }, 500);
    } else {
      message.error(res.message);
    }
  };

  const regionOption = useMemo(() => OptionsHelper.convertDataToOptions(state?.regions, 'regionCode', 'regionCode-regionName'));

  // ------------------Hooks ----------------------------------------------------
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const districtOption = useMemo(() => {
    const options = districtJson.filter((el) => +el.province_code === +selectedCity).map((el) => ({ value: el.code, label: el.name })) || [];
    return options;
  }, [selectedCity]);
  const wardOption = useMemo(() => {
    const options = wardJson.filter((el) => +el.district_code === +selectedDistrict).map((el) => ({ value: el.code, label: el.name })) || [];
    return options;
  }, [selectedDistrict]);
  const fieldInpus = () => {
    if (!isFranchiseStore) {
      return [
        ...FormField.StoreOP.fieldInputs({
          locationTypeOption,
          statusOption,
          cityOption,
          regionOption,
          bankPaymentOption,
          numberOfCounterOption,
        }),
        ...FormField.StoreOP.fieldInputsFC({
          cityOptionFC,
          fanchiseModelOptions: AppState.fcModelTypes.map((item) => {
            return { value: item.typeID, label: item.typeName };
          }),
          districtOption,
          wardOption,
        }),
      ];
    }
    return [
      ...FormField.StoreOP.fieldInputs({
        locationTypeOption,
        statusOption,
        cityOption,
        regionOption,
        bankPaymentOption,
        numberOfCounterOption,
      }),
    ];
  };
  const { formInputs, onSubmitHandler, reset, getValues, setValue } = useFormFields({
    fieldInputs: fieldInpus(),
    onSubmit: handleSubmit,
    watches: ['fcCity', 'fcDistrict'],
  });
  // ------------------END Hooks ----------------------------------------------------
  useEffect(() => {
    setStatus(store?.status);
  }, [store]);

  useEffect(() => {
    if (store.fcModel === '') {
      setIsFranchiseStore(false);
    } else {
      setIsFranchiseStore(true);
    }
  }, [store]);

  useEffect(() => {
    if (store) {
      reset({ ...store });
    }
  }, [store, isFranchiseStore]);

  useEffect(() => {
    const cityCode = getValues().fcCity;
    setSelectedCity(cityCode);
  }, [getValues().fcCity]);

  useEffect(() => {
    const districtCode = getValues().fcDistrict;
    setSelectedDistrict(districtCode);
  }, [getValues().fcDistrict]);

  const renderAction = () => {
    let actionLeftInfo = [];
    let actionRightInfo = [];
    actionLeftInfo.push({
      name: 'Convert',
      actionType: 'save',
      action: onSubmitHandler,
      hide: false,
      actionName: 'save',
    });
    actionRightInfo.push();
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} ref={actionRef} />;
  };

  if (storeQuery.isLoading) {
    return <h1 style={{ textAlign: 'center' }}>...LOADING...</h1>;
  }

  if (storeQuery.isError) {
    message.error('Something went wrong');
    return;
  }
  return (
    <section className="wrap-section">
      <Modal title={<p className="cl-red">Chú ý !!!</p>} open={isModalOpen} onOk={onSubmitHandler} onCancel={handleCancel}>
        <p>Bạn có chắc muốn chuyển đổi?</p>
      </Modal>

      <div className="row header-detail">
        <div className="" style={{ marginBottom: 10 }}>
          {renderAction()}
        </div>
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
          <button onClick={() => history.goBack()} type="button" className="btn btn-back" style={{ background: 'beige' }}>
            Back
          </button>
          <h3
            style={{
              margin: 10,
              display: 'inline-block',
              verticalAlign: 'middle',
              textTransform: 'uppercase',
            }}
          >
            {params.id ? 'Edit #' + params.id : 'Convert to ' + (store?.storeFC === '' ? 'franchise' : 'store')}
          </h3>
        </div>
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 flex gap-10">
          <p className="cl-red" style={{ fontWeight: 'bold' }}>
            Noted :
          </p>
          <div className="">
            <p className="cl-red m-0">Format Normal Store Code : VNXXXX ( XXXX: number )</p>
          </div>
        </div>
      </div>
      <div className="form-filter p-0">
        <form>
          <div className="section-block">
            <Row gutter={16}>
              {formInputs?.slice(0, 15)?.map((item, index) => {
                return (
                  <Col span={6} key={`field-${index}`} className="mb-10">
                    {item}
                  </Col>
                );
              })}
            </Row>
          </div>

          <div className="section-block mt-15">
            {store.storeFC !== '' ? null : <p>Franchise infomation:</p>}
            <Row gutter={16}>
              {formInputs?.slice(15)?.map((item, index) => {
                return (
                  <Col span={6} key={`field-${index}`} className="mb-10">
                    {item}
                  </Col>
                );
              })}
            </Row>
          </div>
        </form>
      </div>
    </section>
  );
};

export default StoreDetailsComp;
