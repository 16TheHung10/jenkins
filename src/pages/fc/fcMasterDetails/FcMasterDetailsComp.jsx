import { Col, Drawer, Row } from 'antd';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import FieldList from 'components/common/fieldList/FieldList';
import { useFormFields } from 'hooks';
import { useAppContext } from 'contexts';
import { OptionsHelper } from 'helpers';
import React, { useEffect, useMemo, useState } from 'react';
import './style.scss';
import moment from 'moment';
import StoreFCDetails from './storeFCDetails/StoreFCDetails';
import { useParams } from 'react-router-dom';
import FieldsFcMasterData from '../data/FieldsFcMasterData';

const FcMasterDetailsComp = ({ initialValue, onSubmit }) => {
  const { state: AppState, onGetStoreData, onGetModelTypes } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  useEffect(() => {
    onGetStoreData();
    onGetModelTypes();
  }, []);
  const storeOptions = useMemo(() => {
    const array = Object.values(AppState?.stores || {});
    if (array) {
      const options = OptionsHelper.convertDataToOptions(array, 'storeCode', 'storeCode-storeName');
      return options;
    }
    return [];
  }, [AppState?.stores]);

  const handleSubmit = async (value) => {
    const clone = {
      ...value,
      companyRepresentativeBirthday: moment(value.companyRepresentativeBirthday).format('YYYY-MM-DD'),
      startDay: moment(value.startDay).format('YYYY-MM-DD'),
      openFranchise: moment(value.franchiseDate[0]).format('YYYY-MM-DD'),
      endFranchise: moment(value.franchiseDate[1]).format('YYYY-MM-DD'),
    };
    try {
      setIsLoading(true);
      await onSubmit(clone);
    } catch {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };
  const [isOpenDrawerStore, setIsOpenDrawerStore] = useState(false);
  const handleToggleDrawerStore = () => {
    setIsOpenDrawerStore((prev) => !prev);
  };

  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
  } = useFormFields({
    fieldInputs: FieldsFcMasterData.fieldsInputsDetails({
      isEdit: Boolean(initialValue),
      storeOptions,
      onToggleDrawer: handleToggleDrawerStore,
      fcModelTypesOptions: AppState.fcModelTypes.map((item) => {
        return { value: item.typeID, label: item.typeName };
      }),
    }),
    onSubmit: handleSubmit,
  });
  useEffect(() => {
    if (initialValue) {
      reset({
        ...initialValue,
        companyRepresentativeBirthday: moment(initialValue.companyRepresentativeBirthday),
        startDay: moment(initialValue.startDay),
        franchiseDate: [moment(initialValue.openFranchise), moment(initialValue.endFranchise)],
      });
    } else {
      // reset({
      //   gS25Store: 'VN0033',
      //   franchiseStore: 'VN0033',
      //   name: 'Ascent',
      //   area: 'TP.HCM',
      //   district: 2,
      //   yearOpen: 2022,
      //   yearEnd: 2024,
      //   addressStore: ' 62-62A Quốc Hương, P. Thảo Điền, Q2 (chạy từ XLHN vào, đến gần cuối đường bên tay phải)',
      //   company: 'a',
      //   taxCode: '122345',
      //   addressCompany: '62-62A Đường Quốc Hương, Phường Thảo Điền, TP. Thủ Đức, TP. HCM',
      //   represent: 'a',
      //   contractPeriod: 24,
      //   remainPeriod: 5,
      //   fc: 'External',
      //   adS3Month: 1000000,
      //   acreage: 158.8,
      //   rentalFee: 1000000,
      //   deposit: 1000000,
      //   enterFee: 1000000,
      //   electricitySupport: 123,
      //   disposalSupport: 123,
      //   operationSupport: 123,
      //   accountingSupport: 'accountingSupport',
      //   promotionSupport: 'promotionSupport',
      //   sharingOtherRevenue: 'sharingOtherRevenue',
      //   companyionSupport: 'companyionSupport',
      //   remunerationSupport: 'if Remuneration on Sales of Product < 104,000,000. (104 mil - Renmuneration)\n ( Just 1 years)',
      //   specialSupport: 'specialSupport',
      //   fixSupport: 'fixSupport',
      //   laborSupport: 'laborSupport',
      //   serviceFeeSupport: 'serviceFeeSupport',
      //   note: 'note',
      // });
    }
  }, [initialValue]);

  return (
    <div id="fc_master" className="section-block mt-15">
      <form onSubmit={onSubmitHandler}>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Row gutter={[16, 0]}>
              <FieldList fields={fields} />
            </Row>
          </Col>
        </Row>
        <SubmitBottomButton loading={isLoading} title={`${initialValue ? 'Update' : 'Create'}`} />
      </form>
      <Drawer title={`Store ${initialValue?.storeCode}`} open={isOpenDrawerStore} onClose={handleToggleDrawerStore} className="storeFCDrawer" bodyStyle={{ width: '900px' }}>
        <StoreFCDetails taxCode={params.id} storeCode={initialValue?.storeCode} />
      </Drawer>
    </div>
  );
};

export default FcMasterDetailsComp;
