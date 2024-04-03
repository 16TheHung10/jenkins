import { Collapse, Tabs, message } from 'antd';
import BaseComponent from 'components/BaseComponent';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import cityJson from 'data/json/city.json';
import districtJson from 'data/json/district.json';
import wardJson from 'data/json/ward.json';
import CommingSoonImage from 'images/comingSoon.png';
import Icons from 'images/icons';
import CommonModel from 'models/CommonModel';
import StoreModel from 'models/StoreModel';
import Moment from 'moment';
import React, { Fragment } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import StoreApi from '../../../../api/StoreApi';
import POSManagement from '../../../../pages/POS/POSManagement';
import PaymentOfStore from '../../../../pages/store/payments/PaymentOfStore';
import SectionWithTitle from '../../../common/section/SectionWithTitle';
import StoreDetailsWrapper from '../../../layouts/wrapper/store/storeDetails/StoreDetailsWrapper';
import MoreStoreInfomation from './moreStoreInfomation/MoreStoreInfomation';
import { mainContentRef } from '../../MainContent';
export default class StoreDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.type = props.type;
    this.storeCode = props.storeCode;
    this.storeStatus = props.storeStatus;
    this.cityJson = cityJson;
    this.data.regions = [];
    this.districtJson = districtJson;
    this.wardJson = wardJson;
    this.tabRef = React.createRef();
    this.moreStoreInfo = [];
    this.fcModelOptions = [];
    this.fieldSelected = this.assignFieldSelected({
      storeCode: '',
      storeName: '',
      regionCode: '',
      numberOfCounter: 1,
      address: '',
      bankPayment: '',
      isFanchiseStore: false,
      ipAddress: '10.2.',
      storeStatus: 0,
      //isCHTT : false,
      phone: '',
      email: '',
      taxCode: '0314658576',
      webSite: '',
      fax: '',
      area: 0.0,
      lattitude: 0.0,
      longtitude: 0.0,
      openedDate: new Date(),
      fcModel: '',
      fcStartDate: new Date(),
      fcEndDate: new Date(),
      city: '',
      locationType: '',
      fcContactName: '',
      fcCompanyInfor: '',
      fcAddress: '',
      fcCity: '',
      fcDistrict: '',
      fcWart: '',
      fcTaxCode: '',
      fcEmail: '',
      fcMobile: '',
      fcModelTypeOptions: [],
    });
    if (this.type == 'Update') {
      this.handleGetStore();
    }
    if (this.type == 'Create') {
      this.isRender = true;
    }
  }

  handleGetFCModelTypeOptions = async () => {
    let commonModel = new CommonModel();
    const response = await commonModel.getData('fctype');
    if (response.status) {
      const fctypes = response.data.fctypes?.map((item) => ({ value: item.typeID, label: item.typeName })) || [];
      this.fcModelTypeOptions = [...fctypes];
      this.refresh();
    } else {
      message.error(response.message);
    }
  };
  componentDidMount = () => {
    this.handleGetRegions();
    this.handleGetFCModelTypeOptions();
    this.type !== 'Create' && this.handleGetMoreStoreInfomation();
  };

  handleGetStore = () => {
    let storeModel = new StoreModel();
    let paramsGetStore = {
      storeCode: this.storeCode,
      storeName: '',
      regionCode: '',
      storeStatus: '',
      pageNumber: 1,
      pageSize: 1,
    };
    storeModel.getListStore(paramsGetStore).then((response) => {
      if (response.status) {
        if (response.data.stores.length > 0) {
          this.fieldSelected.storeCode = response.data.stores[0].storeCode;
          this.fieldSelected.storeName = response.data.stores[0].storeName;
          this.fieldSelected.regionCode = response.data.stores[0].regionCode;
          this.fieldSelected.address = response.data.stores[0].address;
          this.fieldSelected.storeStatus = response.data.stores[0].status;
          this.fieldSelected.isFanchiseStore = response.data.stores[0].isCHTT;
          //this.fieldSelected.isCHTT = response.data.stores[0].isCHTT;
          this.fieldSelected.phone = response.data.stores[0].phone;
          this.fieldSelected.email = response.data.stores[0].email;
          this.fieldSelected.taxCode = response.data.stores[0].taxCode;
          this.fieldSelected.webSite = response.data.stores[0].webSite;
          this.fieldSelected.fax = response.data.stores[0].fax;
          this.fieldSelected.area = response.data.stores[0].area;
          this.fieldSelected.lattitude = response.data.stores[0].lattitude;
          this.fieldSelected.longtitude = response.data.stores[0].longtitude;
          this.fieldSelected.openedDate = new Date(response.data.stores[0].openedDate);
          this.fieldSelected.fcModel = response.data.stores[0].fcModel;
          this.fieldSelected.fcStartDate = new Date(response.data.stores[0].fcStartDate);
          this.fieldSelected.fcEndDate = new Date(response.data.stores[0].fcEndDate);
          this.fieldSelected.city = response.data.stores[0].city;
          this.fieldSelected.locationType = response.data.stores[0].locationType;
          this.fieldSelected.fcContactName = response.data.stores[0].fcContactName;
          this.fieldSelected.fcCompanyInfor = response.data.stores[0].fcCompanyInfor;
          this.fieldSelected.fcTaxCode = response.data.stores[0].fcTaxCode;
          this.fieldSelected.fcEmail = response.data.stores[0].fcEmail;
          this.fieldSelected.fcMobile = response.data.stores[0].fcMobile;

          let fcAddressRaw = response.data.stores[0].fcAddress;
          let fcAddressRawArr = fcAddressRaw.split(', ');

          if (fcAddressRaw && fcAddressRawArr.length > 3) {
            const indexOfEndAddress = String(fcAddressRaw).indexOf(', Phường') === -1 ? String(fcAddressRaw).indexOf(', Xã') : String(fcAddressRaw).indexOf(', Phường');
            this.fieldSelected.fcAddress = String(fcAddressRaw).substring(0, indexOfEndAddress);
            this.fieldSelected.fcCity = this.cityJson.find((element) => element.name === fcAddressRawArr[fcAddressRawArr.length - 1]).code;
            this.fieldSelected.fcDistrict = this.districtJson.find((element) => element.name === fcAddressRawArr[fcAddressRawArr.length - 2]).code;
            this.fieldSelected.fcWard = this.wardJson.find((element) => element.name === fcAddressRawArr[fcAddressRawArr.length - 3] && element.district_code === this.fieldSelected.fcDistrict).code;
          }

          this.refresh();
        } else {
          this.showAlert('System Error');
        }
      } else {
        this.showAlert(response.message);
      }
    });
  };

  handleSave = async () => {
    let fields = this.fieldSelected;

    if (fields.storeCode === '') {
      this.showAlert('Please enter Store Code');
      return false;
    }

    if (fields.storeCode !== '' && this.type == 'Create') {
      let reg = new RegExp('^[V][N][0-9][0-9][0-9][0-9]$');
      if (!reg.test(fields.storeCode)) {
        this.showAlert('Store Code does not match format VNXXXX');
        return false;
      }
    }

    if (fields.storeName === '') {
      this.showAlert('Please enter Store Name');
      return false;
    }

    if (fields.regionCode === '') {
      this.showAlert('Please enter Region');
      return false;
    }
    if (fields.city === '') {
      this.showAlert('Please enter City');
      return false;
    }
    if (fields.address === '') {
      this.showAlert('Please enter Address');
      return false;
    }

    if (this.Type == 'Create' && fields.bankPayment === '') {
      this.showAlert('Please enter Bank Payment');
      return false;
    }

    if (fields.area == '') {
      fields.area = 0.0;
    }

    if (fields.lattitude == '') {
      fields.lattitude = 0.0;
    }

    if (fields.longtitude == '') {
      fields.longtitude = 0.0;
    }
    if (fields.locationType === '') {
      this.showAlert('Please enter Location Type');
      return false;
    }
    if (fields.isFanchiseStore) {
      if (fields.fcModel === '') {
        this.showAlert('Please enter Fanchise Model');
        return false;
      }
      if (fields.fcStartDate === null) {
        this.showAlert('Please enter Fanchise StartDate');
        return false;
      }
      if (fields.fcEndDate === null) {
        this.showAlert('Please enter Fanchise EndDate');
        return false;
      }

      if (fields.fcContactName === '') {
        this.showAlert('Please enter Fanchise Full Name');
        return false;
      }
      if (fields.fcMobile === '') {
        this.showAlert('Please enter Fanchise Mobile');
        return false;
      }
      if (fields.fcEmail === '') {
        this.showAlert('Please enter Fanchise Email');
        return false;
      }
      if (fields.fcCompanyInfor === '') {
        this.showAlert('Please enter Fanchise Company Infor');
        return false;
      }
      if (fields.fcTaxCode === '') {
        this.showAlert('Please enter Fanchise TaxCode');
        return false;
      }
      if (fields.fcCity === '') {
        this.showAlert('Please enter FC Company Address');
        return false;
      }
      if (fields.fcDistrict === '') {
        this.showAlert('Please enter FC Company Address');
        return false;
      }
      if (fields.fcWard === '') {
        this.showAlert('Please enter FC Company Address');
        return false;
      }
      if (fields.fcAddress === '') {
        this.showAlert('Please enter FC Company Address');
        return false;
      }
    }

    let params = {
      StoreCode: fields.storeCode,
      StoreName: fields.storeName,
      RegionCode: fields.regionCode,
      ShortName: fields.isFanchiseStore ? 'F' + fields.storeCode : fields.storeCode,
      Address: fields.address,
      ipAddress: fields.ipAddress + (parseInt(fields.storeCode.substring(2, fields.storeCode.length)) + 20 - 255) + '.',
      Fax: Moment(fields.openedDate).format('YYYY-MM-DD'),
      NumberOfCounter: fields.numberOfCounter,
      Bank: fields.bankPayment,
      Email: fields.email,
      Phone: fields.phone,
      TaxCode: fields.taxCode,
      IsCHTT: fields.isFanchiseStore,
      WebSite: fields.webSite,
      Status: fields.storeStatus,
      Area: fields.area,
      Lattitude: fields.lattitude,
      Longtitude: fields.longtitude,
      OpenedDate: Moment(fields.openedDate).format('YYYY-MM-DD'),
      FCModel: fields.fcModel,
      FCStartDate: fields.isFanchiseStore ? Moment(fields.fcStartDate).format('YYYY-MM-DD') : Moment().format('YYYY-MM-DD'),
      FCEndDate: fields.isFanchiseStore ? Moment(fields.fcEndDate).format('YYYY-MM-DD') : Moment().format('YYYY-MM-DD'),
      City: fields.city,
      LocationType: fields.locationType,

      FCContactName: fields.fcContactName,
      FCCompanyInfor: fields.fcCompanyInfor,
      FCAddress: fields.isFanchiseStore
        ? fields.fcAddress +
          ', ' +
          this.wardJson.find((element) => element.code === fields.fcWard).name +
          ', ' +
          this.districtJson.find((element) => element.code === fields.fcDistrict).name +
          ', ' +
          this.cityJson.find((element) => element.code === fields.fcCity).name
        : '',
      FCTaxCode: fields.fcTaxCode,
      FCEmail: fields.fcEmail,
      FCMobile: fields.fcMobile,
    };
    let model = new StoreModel();
    if (this.type == 'Create') {
      await model.postStore(params).then((res) => {
        if (res.status) {
          super.targetLink('/store/' + fields.storeCode);
          this.showAlert('Save successfully!', 'success');
        } else {
          this.showAlert(res.message);
        }
      });
    }
    if (this.type == 'Update') {
      await model.putStore(params).then((res) => {
        if (res.status) {
          this.showAlert('Save successfully!', 'success');
        } else {
          this.showAlert(res.message);
        }
      });
    }
  };

  handleGetRegions = async () => {
    let model = new CommonModel();
    await model.getRegion().then((response) => {
      if (response.status) {
        if (response.data.regions != null && response.data.regions.size != 0) {
          this.data.regions = response.data.regions;
        }
        this.refresh();
      }
    });
  };

  handleChangeCity = () => {
    let fields = this.fieldSelected;
    fields.fcDistrict = '';
    fields.fcWard = '';
    this.refresh();
  };

  handleChangeDistrict = () => {
    let fields = this.fieldSelected;
    fields.fcWard = '';
    this.refresh();
  };
  handleGetMoreStoreInfomation = async () => {
    const res = await StoreApi.getMoreStoreInfo(this.storeCode);

    if (res.status) {
      this.moreStoreInfo = res.data.storeInfors;
      this.refresh();
    } else {
      message.error(res.message);
    }
  };
  viewMap = (lat, long) => {
    var url = 'https://maps.google.com/?saddr=Current+Location&daddr=' + lat + ',' + long;
    window.open(url, '_blank').focus();
  };
  renderComp = () => {
    const tabItems = [
      {
        key: '1',
        label: 'Counters',
        children: <POSManagement />,
      },
      {
        key: '2',
        label: 'Payment methods',
        children: <PaymentOfStore />,
        // children: <img src={CommingSoonImage} style={{ width: '300px' }} />,
      },
      /* The above code is declaring an array called `fanchiseModelOptions` which contains objects
   representing different options for a franchise model. Each object has a `value` property and a
   `label` property, which represent the value and label of the option respectively. */
    ];
    let fields = this.fieldSelected;
    let regionCodeOptions = this.data.regions.map((el) => ({
      value: el.regionCode,
      label: el.regionName,
    }));
    let fanchiseModelOptions = this.fcModelTypeOptions;
    let numberOfCounterOptions = [
      { value: 1, label: '1 Pos' },
      { value: 2, label: '2 Pos' },
      { value: 3, label: '3 Pos' },
      { value: 4, label: '4 Pos' },
    ];
    let bankPaymentOptions = [
      { value: 'credit', label: 'Credit Card' },
      { value: 'ocb', label: 'OCB' },
      { value: 'vcb', label: 'Vietcombank' },
    ];
    let storeStatusOptions = [{ value: 0, label: 'Open' }, { value: 1, label: 'Close' }, , { value: 2, label: 'Hold' }];
    let cityOpt =
      this.cityJson.map((el) => ({
        value: el.name.replace('Thành phố ', '').replace('Tỉnh ', ''),
        label: el.name.replace('Thành phố ', '').replace('Tỉnh ', ''),
      })) || [];
    let locationTypeOptions = [
      { value: 'Office', label: 'Office' },
      { value: 'Residence', label: 'Residence' },
      { value: 'Hospitality', label: 'Hospitality' },
      { value: 'Apartment', label: 'Apartment' },
      { value: 'School', label: 'School' },
      { value: 'Special', label: 'Special' },
    ];
    let cityOpt1 = this.cityJson.map((el) => ({ value: el.code, label: el.name })) || [];
    let district = this.districtJson.filter((el) => el.province_code == fields.fcCity);
    let districtOpt = district.map((el) => ({ value: el.code, label: el.name })) || [];
    let ward = this.wardJson.filter((el) => el.district_code == fields.fcDistrict);
    let wardOpt = ward.map((el) => ({ value: el.code, label: el.name })) || [];

    return (
      <StoreDetailsWrapper type={this.type}>
        <section className="wrap-section pb-15">
          <div className="section-block mt-15">
            <div className="mb-10">
              <div className="row header-detail">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                  <h3
                    className="center gap-10"
                    style={{
                      margin: 10,
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                  >
                    {this.type == 'Create' ? (
                      'New Store'
                    ) : (
                      <>
                        <Icons.Store /> STORE {this.storeCode}
                      </>
                    )}
                  </h3>
                </div>
              </div>
              <div className="form-filter">
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="row">
                      <div className={this.type == 'Create' ? 'col-md-2' : 'col-md-3'}>
                        <div className="form-group">
                          <label htmlFor="storeCode" className="w100pc">
                            {' '}
                            Store Code<span style={{ color: 'red' }}>*</span>:{' '}
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            name="storeCode"
                            placeholder="-- Store Code --"
                            value={fields.storeCode}
                            onChange={(e) => this.handleChangeField(e)}
                            className="form-control"
                            disabled={this.type == 'Update' ? true : false}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="storeName" className="w100pc">
                            {' '}
                            Store Name<span style={{ color: 'red' }}>*</span>:{' '}
                          </label>
                          <input
                            disabled={this.type !== 'Create'}
                            type="text"
                            autoComplete="off"
                            name="storeName"
                            placeholder="-- Store Name --"
                            value={fields.storeName}
                            onChange={(e) => this.handleChangeField(e)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="email" className="w100pc">
                            {' '}
                            Email:{' '}
                          </label>
                          <input type="text" autoComplete="off" name="email" placeholder="-- Email --" value={fields.email} onChange={(e) => this.handleChangeField(e)} className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="phone" className="w100pc">
                            {' '}
                            Phone Internal:{' '}
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            name="phone"
                            placeholder="-- Phone --"
                            value={fields.phone}
                            //onChange={(e) => this.handleChangeField(e)}
                            onChange={(e) => {
                              let pattern = new RegExp(/^[0-9\b]+$/);
                              if (e.target.value && !pattern.test(e.target.value)) {
                                return;
                              }
                              this.handleChangeFieldCustom('phone', e.target.value);
                            }}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="regionCode" className="w100pc">
                            Region<span style={{ color: 'red' }}>*</span>:
                          </label>
                          <Select
                            classNamePrefix="select"
                            maxMenuHeight={260}
                            placeholder="-- Region --"
                            value={regionCodeOptions.filter((option) => option.value === fields.regionCode)}
                            options={regionCodeOptions}
                            onChange={(e) => this.handleChangeFieldCustom('regionCode', e ? e.value : '')}
                          />
                        </div>
                      </div>
                      <div className={this.type == 'Create' ? 'col-md-2' : 'col-md-3'}>
                        <div className="form-group">
                          <label htmlFor=">openedDate" className="w100pc">
                            Opened Date:
                          </label>
                          <DatePicker
                            placeholderText="-- Opend Date --"
                            selected={fields.openedDate}
                            onChange={(value) => this.handleChangeFieldCustom('openedDate', value)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            autoComplete="off"
                            // disabled={this.isCreate ? false : true}
                          />
                        </div>
                      </div>
                      <div className={this.type == 'Create' ? 'col-md-2' : 'col-md-3'}>
                        <div className="form-group">
                          <label htmlFor="storeStatus" className="w100pc">
                            Status<span style={{ color: 'red' }}>*</span>:
                          </label>
                          <Select
                            classNamePrefix="select"
                            maxMenuHeight={260}
                            placeholder="-- All --"
                            value={storeStatusOptions.filter((option) => option.value === fields.storeStatus)}
                            options={storeStatusOptions}
                            onChange={(e) => this.handleChangeFieldCustom('storeStatus', e ? e.value : '')}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="fcModel" className="w100pc">
                            Location Type<span style={{ color: 'red' }}>*</span>:{' '}
                          </label>
                          <Select
                            classNamePrefix="select"
                            maxMenuHeight={260}
                            placeholder="-- Location Type --"
                            value={locationTypeOptions.filter((option) => option.value === fields.locationType)}
                            options={locationTypeOptions}
                            onChange={(e) => this.handleChangeFieldCustom('locationType', e ? e.value : '')}
                          />
                        </div>
                      </div>
                      {this.type == 'Create' && (
                        <div className="col-md-2">
                          <div className="form-group">
                            <label htmlFor="numberOfCounter" className="w100pc">
                              Number Of Counter
                              <span style={{ color: 'red' }}>*</span>:
                            </label>
                            <Select
                              classNamePrefix="select"
                              maxMenuHeight={260}
                              placeholder="-- All --"
                              value={numberOfCounterOptions.filter((option) => option.value === fields.numberOfCounter)}
                              options={numberOfCounterOptions}
                              onChange={(e) => this.handleChangeFieldCustom('numberOfCounter', e ? e.value : '')}
                              isDisabled={this.type == 'Update' ? true : false}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row">
                      <div className={this.type == 'Create' ? 'col-md-2' : 'col-md-3'}>
                        <div className="form-group">
                          <label htmlFor="regionCode" className="w100pc">
                            City<span style={{ color: 'red' }}>*</span>:
                          </label>
                          <Select
                            classNamePrefix="select"
                            maxMenuHeight={260}
                            placeholder="-- City --"
                            value={cityOpt.filter((option) => option.value === fields.city)}
                            options={cityOpt}
                            onChange={(e) => this.handleChangeFieldCustom('city', e ? e.value : '', this.handleChangeCity)}
                          />
                        </div>
                      </div>
                      <div className={this.type == 'Create' ? 'col-md-5' : 'col-md-6'}>
                        <div className="form-group">
                          <label htmlFor="address" className="w100pc">
                            {' '}
                            Address<span style={{ color: 'red' }}>*</span>:{' '}
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            name="address"
                            placeholder="-- Address --"
                            value={fields.address}
                            onChange={(e) => this.handleChangeField(e)}
                            className="form-control"
                          />
                        </div>
                      </div>

                      {this.type == 'Create' && (
                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="bankPayment" className="w100pc">
                              Bank Payment
                              <span style={{ color: 'red' }}>*</span>:
                            </label>
                            <Select
                              classNamePrefix="select"
                              maxMenuHeight={260}
                              placeholder="-- Bank Payment --"
                              value={bankPaymentOptions.filter((option) => option.value === fields.bankPayment)}
                              options={bankPaymentOptions}
                              onChange={(e) => this.handleChangeFieldCustom('bankPayment', e ? e.value : '')}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="area" className="w100pc">
                            Area:{' '}
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            name="area"
                            placeholder="-- Area --"
                            value={fields.area}
                            onChange={(e) => {
                              var pattern = new RegExp(/^\d*\.?\d*$/);

                              if (e.target.value && !pattern.test(e.target.value)) {
                                return;
                              }
                              this.handleChangeFieldCustom('area', e.target.value);
                            }}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="lattitude" className="w100pc">
                            Lattitude:{' '}
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            name="lattitude"
                            placeholder="-- Lattitude --"
                            value={fields.lattitude}
                            onChange={(e) => this.handleChangeField(e)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="longtitude" className="w100pc">
                            Longtitude:{' '}
                          </label>
                          <div className="flex items-center gap-10">
                            <input
                              type="text"
                              autoComplete="off"
                              name="longtitude"
                              placeholder="-- Longtitude --"
                              value={fields.longtitude}
                              onChange={(e) => this.handleChangeField(e)}
                              className="form-control"
                            />
                            <BaseButton iconName="map" onClick={() => this.viewMap(fields.lattitude, fields.longtitude)}>
                              View map
                            </BaseButton>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="isFanchiseStore" className="">
                            Fanchise Store:{' '}
                          </label>
                          <input
                            type="checkbox"
                            style={{ marginLeft: '5px' }}
                            name="isFranchiseStore"
                            checked={fields.isFanchiseStore}
                            value={fields.isFanchiseStore}
                            onChange={(e) => this.handleChangeFieldCustom('isFanchiseStore', e.target.value == 'false')}
                          />
                        </div>
                      </div>
                    </div>
                    {fields.isFanchiseStore && (
                      <Fragment>
                        <SectionWithTitle title="Franchise">
                          <div className="row">
                            {fields.isFanchiseStore && (
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="fcModel" className="w100pc">
                                    Fanchise Model<span style={{ color: 'red' }}>*</span>:{' '}
                                  </label>
                                  <Select
                                    classNamePrefix="select"
                                    maxMenuHeight={260}
                                    placeholder="-- Fanchise Model --"
                                    value={fanchiseModelOptions?.filter((option) => option.value === fields.fcModel)}
                                    options={fanchiseModelOptions}
                                    onChange={(e) => this.handleChangeFieldCustom('fcModel', e ? e.value : '')}
                                  />
                                </div>
                              </div>
                            )}
                            {fields.isFanchiseStore && (
                              <Fragment>
                                <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor="fcStartDate" className="w100pc">
                                      Fanchise StartDate<span style={{ color: 'red' }}>*</span>:{' '}
                                    </label>
                                    <DatePicker
                                      placeholderText="-- Fanchise StartDate --"
                                      selected={fields.fcStartDate}
                                      onChange={(value) => this.handleChangeFieldCustom('fcStartDate', value)}
                                      dateFormat="dd/MM/yyyy"
                                      className="form-control"
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>

                                <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor=">fcEndDate" className="w100pc">
                                      Fanchise EndDate<span style={{ color: 'red' }}>*</span>:
                                    </label>
                                    <DatePicker
                                      placeholderText="-- Fanchise EndDate --"
                                      selected={fields.fcEndDate}
                                      onChange={(value) => this.handleChangeFieldCustom('fcEndDate', value)}
                                      dateFormat="dd/MM/yyyy"
                                      className="form-control"
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>
                              </Fragment>
                            )}
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor=">fcContactName" className="w100pc">
                                  Fanchise Full Name<span style={{ color: 'red' }}>*</span>:
                                </label>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  name="fcContactName"
                                  placeholder="-- FC Contact Name --"
                                  value={fields.fcContactName}
                                  onChange={(e) => this.handleChangeField(e)}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor=">fcMobile" className="w100pc">
                                  Fanchise Mobile<span style={{ color: 'red' }}>*</span>:
                                </label>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  name="fcMobile"
                                  placeholder="-- FC Mobile --"
                                  value={fields.fcMobile}
                                  //onChange={(e) => this.handleChangeField(e)}
                                  onChange={(e) => {
                                    let pattern = new RegExp(/^[0-9\b]+$/);
                                    if (e.target.value && !pattern.test(e.target.value)) {
                                      return;
                                    }
                                    this.handleChangeFieldCustom('fcMobile', e.target.value);
                                  }}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor=">fcEmail" className="w100pc">
                                  Fanchise Email<span style={{ color: 'red' }}>*</span>:
                                </label>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  name="fcEmail"
                                  placeholder="-- FC Email --"
                                  value={fields.fcEmail}
                                  onChange={(e) => this.handleChangeField(e)}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor=">fcCompanyInfor" className="w100pc">
                                  Fanchise Company Infor<span style={{ color: 'red' }}>*</span>:
                                </label>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  name="fcCompanyInfor"
                                  placeholder="-- Fanchise Company Infor --"
                                  value={fields.fcCompanyInfor}
                                  onChange={(e) => this.handleChangeField(e)}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor=">fcTaxCode" className="w100pc">
                                  Fanchise TaxCode<span style={{ color: 'red' }}>*</span>:
                                </label>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  name="fcTaxCode"
                                  placeholder="-- Fanchise TaxCode --"
                                  value={fields.fcTaxCode}
                                  //onChange={(e) => this.handleChangeField(e)}
                                  onChange={(e) => {
                                    let pattern = new RegExp(/^[0-9\b]+$/);
                                    if (e.target.value && !pattern.test(e.target.value)) {
                                      return;
                                    }
                                    this.handleChangeFieldCustom('fcTaxCode', e.target.value);
                                  }}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                        </SectionWithTitle>

                        <SectionWithTitle title="Franchise Address" className="mt-15">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="city" className="w100pc">
                                  {' '}
                                  City<span style={{ color: 'red' }}>*</span>:{' '}
                                </label>
                                <Select
                                  classNamePrefix="select"
                                  maxMenuHeight={260}
                                  placeholder="-- City --"
                                  value={cityOpt1.filter((option) => option.value == fields.fcCity)}
                                  options={cityOpt1}
                                  onChange={(e) => this.handleChangeFieldCustom('fcCity', e ? e.value : '', this.handleChangeCity)}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="district" className="w100pc">
                                  {' '}
                                  District<span style={{ color: 'red' }}>*</span>:{' '}
                                </label>
                                <Select
                                  classNamePrefix="select"
                                  maxMenuHeight={260}
                                  placeholder="-- District --"
                                  value={districtOpt.filter((option) => option.value == fields.fcDistrict)}
                                  options={districtOpt}
                                  onChange={(e) => this.handleChangeFieldCustom('fcDistrict', e ? e.value : '', this.handleChangeDistrict)}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="ward" className="w100pc">
                                  Ward<span style={{ color: 'red' }}>*</span>:
                                </label>
                                <Select
                                  classNamePrefix="select"
                                  maxMenuHeight={260}
                                  placeholder="-- Ward --"
                                  value={wardOpt.filter((option) => option.value == fields.fcWard)}
                                  options={wardOpt}
                                  onChange={(e) => this.handleChangeFieldCustom('fcWard', e ? e.value : '')}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor=">fcAddress" className="w100pc">
                                  Address<span style={{ color: 'red' }}>*</span>:
                                </label>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  name="fcAddress"
                                  placeholder="-- Address --"
                                  value={fields.fcAddress}
                                  onChange={(e) => this.handleChangeField(e)}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                        </SectionWithTitle>
                      </Fragment>
                    )}
                  </div>
                </div>
              </div>
              {this.type == 'Create' && (
                <div className="row" style={{ fontSize: '14px' }}>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <p style={{ margin: '0px 0px 0px 0px', fontWeight: 'bold' }}>Noted</p>
                    <p style={{ margin: '0px 0px 0px 15px' }}>Format Normal Store Code: VNXXXX</p>
                    <p style={{ margin: '0px 0px 0px 25px' }}>XXXX: number</p>
                  </div>
                </div>
              )}
              <BaseButton iconName="send" htmlType="button" onClick={this.handleSave}>
                Save
              </BaseButton>
            </div>
          </div>
          {this.type !== 'Create' && (
            <>
              <MoreStoreInfomation data={this.moreStoreInfo || []} storeCode={this.storeCode} />
              <div className="section-block mt-15" ref={this.tabRef}>
                <Tabs
                  defaultActiveKey="1"
                  items={tabItems}
                  onChange={(key) => {
                    console.log({ key });
                    if (this.tabRef.current)
                      setTimeout(() => {
                        this.tabRef.current.scrollIntoView({
                          behavior: 'smooth',
                        });
                      }, 100);
                  }}
                />
              </div>
            </>
          )}
        </section>
      </StoreDetailsWrapper>
    );
  };
}
