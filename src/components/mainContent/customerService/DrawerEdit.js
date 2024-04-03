import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Drawer, Row, message } from 'antd';
import FieldList from 'components/common/fieldList/FieldList';
import CONSTANT from 'constant';
import districtJson from 'data/json/district.json';
import wardJson from 'data/json/ward.json';
import FormField from 'data/oldVersion/formFieldRender';
import { StringHelper } from 'helpers';
import { useFormFields, useShowFilter } from 'hooks';
import CustomerServiceModel from 'models/CustomerServiceModel';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import CustomerServiceEditUserTabs from './tabs/CustomerServiceEditUserTabs';
import CheckInfoApp from './tabs/checkInfoApp/CheckInfoApp';

const DrawerEdit = ({ initialData, onUpdateUserInfo, onClose, onResetPass, ...props }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [appInfo, setAppInfo] = useState(null);

  const handleUpdateUserInfo = (value) => {
    onUpdateUserInfo({
      ...value,
      birthday: moment(value?.birthday).format(CONSTANT.FORMAT_DATE_PAYLOAD),
    });
  };
  const { formInputsWithSpan, onSubmitHandler, reset, getValues, setValue } = useFormFields({
    fieldInputs: FormField.CustomerServiceOverview.fieldInputs({
      selectedCity,
      selectedDistrict,
      idNoPlaceHolder: initialData.idNo,
    }),
    onSubmit: handleUpdateUserInfo,
    watches: ['cityID', 'districtID', 'sex'],
  });

  useEffect(() => {
    const cityID = getValues('cityID');
    const districtID = getValues('districtID');
    const wardID = getValues('wardID');

    // Reset child field if parent is null
    if (!cityID) {
      setValue('districtID', null);
    }
    if (!districtID) {
      setValue('wardID', null);
    }

    // reset child if parent change
    const allCurrentDistrictInCity = districtJson.filter((el) => +el.province_code === +cityID);
    const allCurrentWardInDistrict = wardJson.filter((el) => +el.district_code === +districtID);

    if (allCurrentDistrictInCity?.findIndex((el) => +el.code === +districtID) === -1) {
      setValue('districtID', null);
    }
    if (allCurrentWardInDistrict?.findIndex((el) => +el.code === +wardID) === -1) {
      setValue('wardID', null);
    }

    setSelectedCity(cityID);
    setSelectedDistrict(districtID);
  }, [getValues('districtID'), getValues('cityID')]);

  useEffect(() => {
    const districtID = getValues('districtID');
    if (!districtID) {
      setValue('wardID', null);
    }
  }, [getValues('districtID')]);

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        birthday: moment(initialData.birthday),
        registerDate: moment(initialData.registerDate),
        // idNo: StringHelper.hidePartOfString(initialData.idNo),
        email: StringHelper.hideEmail(initialData.email),
      });
    }
  }, [initialData]);
  const handleClose = () => {
    reset({
      ...initialData,
      birthday: moment(new Date(initialData.birthday)),
      registerDate: moment(initialData.registerDate),
    });
    onClose();
  };

  const renderNote = (elm) => {
    if (!elm) return '-';
    const date = elm?.transactionDate;
    if (!date) return '';
    let count = date && date !== '' ? moment().diff(moment(date).utc(), 'days') : ' - ';
    if (+count === 0) {
      return <span>{`đã giao dịch lúc ${moment(date).utc().format('HH:mm')} hôm nay`}</span>;
    } else if (count > 0 && count < 3) {
      return <span>{`đã giao dịch ${count} ngày trước`}</span>;
    } else if (count > 30 || isNaN(count)) {
      return <span className="cl-red">{`Không có giao dịch trong vòng 30 ngày`}</span>;
    } else {
      return <span>{`đã giao dịch vào ngày ${moment(date).utc().format(CONSTANT.FORMAT_DATE_IN_USE)}`}</span>;
    }
  };

  const handleGetInfoApp = async () => {
    if (!initialData.memberNo) {
      message.error('Invalid member code, please click again');
      return;
    }
    const model = new CustomerServiceModel();
    const res = await model.getInoApp({ memberCode: initialData?.memberNo });
    if (res.status) {
      setAppInfo(res.data.appInfo || { name: 'test' });
    } else {
      message.error(res.message);
    }
  };

  const { isVisible, TriggerComponent } = useShowFilter((props) => {
    return (
      <Button
        className="btn-danger"
        onClick={async () => {
          if (!isVisible) {
            handleGetInfoApp();
          }
          props.onClick();
        }}
      >
        {isVisible ? 'Hide info app' : 'Check info app'}
      </Button>
    );
  });
  return (
    <div>
      <Drawer
        width={'calc(100vw - 266px)'}
        title={
          <Row>
            <Col span={24}>
              <div className="center_vertical justify-content-between">
                <h3 className="m-0">Edit customer #{initialData?.memberNo}</h3>
                <h3 className="m-0">
                  Current point :{' '}
                  <span style={{ color: '#1890ff' }}>{StringHelper.formatPrice(initialData?.totalPoint)}</span>
                  <span style={{ color: '#1890ff' }}>
                    {' '}
                    {` (~ ${StringHelper.formatPrice(Number(initialData?.totalPoint) * 15)} VNĐ)`}
                  </span>
                </h3>
              </div>
            </Col>
          </Row>
        }
        {...props}
        open={props.open}
        onClose={handleClose}
      >
        <Row gutter={[16, 0]}>
          <Col span={24}>
            {renderNote(initialData) ? (
              <>
                <p className="flex items-center transaction_tag">
                  <FontAwesomeIcon
                    style={{
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: 'white',
                      marginRight: '10px',
                    }}
                    icon={faInfoCircle}
                  />
                  <span>
                    {`Khách `} {renderNote(initialData)}
                  </span>
                </p>
              </>
            ) : null}
          </Col>
          <Col span={24}>
            <div className="section-block">
              <form onSubmit={onSubmitHandler}>
                <Row gutter={[16, 0]}>
                  <FieldList fields={formInputsWithSpan} span={6} />
                </Row>

                <Row gutter={[16, 16]} className="justify-start items-center">
                  <Col style={{ textAlign: 'left' }} span={8}>
                    <Button type="primary" htmlType="submit" className="ml-0 btn btn-primary mr-10 btn-danger">
                      Update user info
                    </Button>
                    <Button
                      type="primary"
                      className="btn btn-primary btn-danger mr-10"
                      onClick={onResetPass}
                      htmlType="button"
                    >
                      Reset password
                    </Button>
                    {/* <TriggerComponent /> */}
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
          {/* <Col span={24} className={`mt-15 section-block transition_animate_5 h-full ${isVisible ? 'show' : 'hide'}`}>
            <CheckInfoApp isDrawerOpen={props.open} memberCode={initialData?.memberNo} appInfo={appInfo} />
          </Col> */}
        </Row>

        <Row className="mt-15">
          <CustomerServiceEditUserTabs isDrawerOpen={props.open} memberCode={initialData?.memberNo} />
        </Row>
      </Drawer>
    </div>
  );
};

export default DrawerEdit;
