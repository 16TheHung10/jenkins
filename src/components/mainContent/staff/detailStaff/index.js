//Plugin
import React, { Fragment } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

//Custom
import BaseComponent from 'components/BaseComponent';
import { StringHelper } from 'helpers';
import StaffModel from 'models/StaffModel';
import Moment from 'moment';
import CommonModel from 'models/CommonModel';
import cityJson from 'data/json/city.json';
import districtJson from 'data/json/district.json';
import wardJson from 'data/json/ward.json';
import APIHelper from '../../../../helpers/APIHelper';

export default class StaffDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.staffCode = props.staffCode;
    this.statusStaff = props.status;
    this.storeCode = props.storeCode;
    this.isCreate = this.staffCode == undefined;
    this.isUpdate = !this.isCreate;
    this.departmentJson = [];
    this.cityJson = cityJson;
    this.districtJson = districtJson;
    this.wardJson = wardJson;
    this.district = [];
    this.ward = [];
    this.fieldSelected = this.assignFieldSelected(
      {
        staffCode: '',
        birthDay: new Date(),
        startDay: new Date(),
        staffName: '',
        userName: '',
        positionName: '',
        typeUser: '',
        typeStaff: '',
        departmentCode: '',
        phone: '',
        email: '',
        city: '',
        district: '',
        ward: '',
        address: '',
        note: '',
        status: 0,
        resignationDay: new Date(),
      },
      ['storeCode']
    );
    this.handleGetDepartment();
    if (this.isUpdate) {
      this.handleGetDataStaff(this.staffCode);
    }
  }
  componentDidMount() {
    this.handleUpdateState();
  }
  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getDataV2('storeuser').then((response) => {
      if (response.status) {
        console.log('response.data.stores;response.data.stores;', response.data.stores);
        this.data.stores = response.data.stores;
        this.refresh();
      }
    });
  };

  handleSave = async () => {
    let fields = this.fieldSelected;
    let model = new StaffModel();

    if (fields.staffCode === '') {
      this.showAlert('Please enter Staff Code');
      return false;
    }

    if (fields.storeCode === '') {
      this.showAlert('Please enter Store Code');
      return false;
    }

    if (fields.staffName === '') {
      this.showAlert('Please enter Staff Name');
      return false;
    }

    if (fields.startDay === '' || fields.startDay == null || fields.startDay == undefined) {
      this.showAlert('Please enter Start Day');
      return false;
    }

    if (fields.departmentCode === '') {
      this.showAlert('Please enter Position Name');
      return false;
    }

    if (fields.phone === '') {
      this.showAlert('Please enter phone');
      return false;
    }

    if (fields.city === '') {
      this.showAlert('Please enter city');
      return false;
    }

    if (fields.district === '') {
      this.showAlert('Please enter district');
      return false;
    }

    if (fields.ward === '') {
      this.showAlert('Please enter ward');
      return false;
    }
    if (this.isCreate) {
      if (this.checkFCStore(fields.storeCode)) {
        if (!StringHelper.validateStaffCode('FC', fields.staffCode)) {
          this.showAlert('Staff Code does not macth format FYYMMDDXXX for franchise store');
          return false;
        }
      } else {
        if (!StringHelper.validateStaffCode('DS', fields.staffCode)) {
          this.showAlert('Staff Code does not macth format YYMMDDXXX for direct store');
          return false;
        }
      }
    }

    let params = {
      StaffCode: fields.staffCode,
      StaffName: fields.staffName,
      UserName: fields.staffCode,
      Password: '1',
      StaffCodeCreate: '0000',
      CreateDate: Moment().format('YYYY-MM-DD HH:mm:ss'),
      StaffCodeUpdate: '0000',
      UpdateDate: Moment().format('YYYY-MM-DD HH:mm:ss'),
      Birthday: Moment(fields.birthDay).format('YYYY-MM-DD'),
      StartDay: Moment(fields.startDay).format('YYYY-MM-DD'),
      Address: JSON.stringify({
        address: fields.address,
        ward: fields.ward,
        district: fields.district,
        city: fields.city,
      }),
      Phone: fields.phone,
      Email: fields.email,
      Note: fields.note,
      Status: fields.status,
      ResignationDay: Moment(fields.resignationDay).format('YYYY-MM-DD'),
      Number: 1,
      PositionName: this.departmentJson.filter((item) => item.departmentCode === fields.departmentCode)[0].departmentName,
      DepartmentCode: fields.departmentCode,
      TypeStaff: 1,
      StoreCode: fields.storeCode,
      GroupCode: '0',
      TypeUser: fields.typeUser,
      StoreHash: this.data.stores?.[fields.storeCode]?.storeHash || null,
    };

    if (this.isCreate) {
      await model.postStaff(params).then((res) => {
        if (res.status) {
          this.showAlert('Save successfully!', 'success');
        } else {
          this.showAlert(res.message);
        }
      });
    }
    if (this.isUpdate) {
      await model.putStaff(params).then((res) => {
        if (res.status) {
          this.showAlert('Save successfully!', 'success');
        } else {
          this.showAlert(res.message);
        }
      });
    }
  };

  handleGetDepartment() {
    let fields = this.fieldSelected;
    let model = new StaffModel();
    //cityJson =cityJson.map( el => ({value: el.code, label: el.name}) )
    let params = {
      storeCode: this.isCreate ? this.fieldSelected.storeCode : this.storeCode,
    };
    model.getListDepartment(params).then((res) => {
      if (res.status && res.data) {
        this.departmentJson = res.data.departments;

        this.isRender = true;
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  }

  handleGetDataStaff(staffCode) {
    let fields = this.fieldSelected;
    let model = new StaffModel();
    let params = {
      staffCode: staffCode,
      staffName: '',
      statusStaff: this.statusStaff,
      storeCode: this.storeCode,
    };

    model.getListStaff(params).then((res) => {
      if (res.status && res.data) {
        this.items = res.data.staffs;
        if (res.data.staffs.length != 0) {
          fields.staffCode = res.data.staffs[0].staffCode;
          fields.birthDay = new Date(res.data.staffs[0].birthday);
          fields.startDay = new Date(res.data.staffs[0].startDay);
          fields.staffName = res.data.staffs[0].staffName;
          fields.userName = res.data.staffs[0].userName;
          fields.positionName = res.data.staffs[0].positionName;
          fields.typeUser = res.data.staffs[0].typeUser;
          fields.typeStaff = res.data.staffs[0].typeStaff;
          fields.storeCode = res.data.staffs[0].storeCode;
          fields.departmentCode = res.data.staffs[0].departmentCode;
          fields.phone = res.data.staffs[0].phone;
          fields.email = res.data.staffs[0].email;
          fields.city = this.parseAddress(res.data.staffs[0].address).city || 0;
          fields.district = this.parseAddress(res.data.staffs[0].address).district || 0;
          fields.ward = this.parseAddress(res.data.staffs[0].address).ward || 0;
          fields.address = this.parseAddress(res.data.staffs[0].address).address || res.data.staffs[0].address;
          fields.note = res.data.staffs[0].note;
          fields.status = res.data.staffs[0].status;
        }
        this.refresh();
      } else {
        this.showAlert(res.message);
        this.isRender = false;
      }
    });
  }

  parseAddress(address) {
    try {
      return JSON.parse(address);
    } catch (err) {
      return { address: address, ward: 0, district: 0, city: 0 };
    }
  }

  handleChangeCity = () => {
    let fields = this.fieldSelected;
    fields.district = '';
    fields.ward = '';
    this.refresh();
  };

  handleChangeDistrict = () => {
    let fields = this.fieldSelected;
    fields.ward = '';
    this.refresh();
  };
  handleChangeStoreCode = (value) => {
    let model = new StaffModel();
    let params = {
      storeCode: value,
    };
    model.getListDepartment(params).then((res) => {
      let fields = this.fieldSelected;
      if (res.status && res.data) {
        this.departmentJson = res.data.departments;
        fields.departmentCode = '';
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };
  renderComp = () => {
    let fields = this.fieldSelected;
    let positionNameOpt =
      this.departmentJson.map((el) => ({
        value: el.departmentCode,
        label: el.departmentName,
      })) || [];

    let stores = this.data.stores || {};
    let storeKeys = Object.keys(stores);
    const orderStore = {};
    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });

    let storeOptions = [];
    if (storeKeys.length === 0) {
      storeOptions.push({
        value: this.data.storeCode,
        label: this.data.shortName + ' - ' + this.data.storeName,
      });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return {
          value: orderStore[key].storeCode,
          label: orderStore[key].shortName + ' - ' + orderStore[key].storeName,
        };
      });
    }

    //let storeCodeOpt = [{ value: fields.storeCode, label: fields.storeCode}];
    let cityOpt = this.cityJson.map((el) => ({ value: el.code, label: el.name })) || [];
    let district = this.districtJson.filter((el) => el.province_code == fields.city);
    let districtOpt = district.map((el) => ({ value: el.code, label: el.name })) || [];
    let ward = this.wardJson.filter((el) => el.district_code == fields.district);
    let wardOpt = ward.map((el) => ({ value: el.code, label: el.name })) || [];

    let statusOpt = [
      { value: 0, label: 'Working' },
      { value: 1, label: 'Resignation' },
    ];
    return (
      <section className="wrap-section">
        <div className="row header-detail">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <button onClick={() => super.back('/staff')} type="button" className="btn btn-back" style={{ background: 'beige' }}>
              Back
            </button>
            <h2
              style={{
                margin: 10,
                display: 'inline-block',
                verticalAlign: 'middle',
              }}
            >
              {this.isCreate ? 'New staff' : '#' + this.staffCode}
            </h2>
          </div>
        </div>
        <div className="form-filter">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="staffCode" className="w100pc">
                      {' '}
                      Staff Code<span style={{ color: 'red' }}>*</span>:{' '}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="staffCode"
                      placeholder="-- Staff Code --"
                      value={fields.staffCode}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                      disabled={this.isUpdate ? true : false}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="birthday" className="w100pc">
                      {' '}
                      BirthDay:{' '}
                    </label>
                    <DatePicker
                      placeholderText="-- Date of birth --"
                      selected={fields.birthDay}
                      onChange={(value) => this.handleChangeFieldCustom('birthDay', value)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="startDay" className="w100pc">
                      {' '}
                      Start Date<span style={{ color: 'red' }}>*</span>:{' '}
                    </label>
                    <DatePicker
                      placeholderText="-- Start Date --"
                      selected={fields.startDay}
                      onChange={(value) => this.handleChangeFieldCustom('startDay', value)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                {/* <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="userName" className="w100pc"> User Name: </label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            name="userName"
                                            placeholder="-- User Name --"
                                            value={fields.userName}
                                            onChange={(e)=>this.handleChangeField(e)}
                                            className="form-control"
                                            // disabled={this.isCreate ? false : true}
                                        />
                                    </div>
                                </div> */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="staffName" className="w100pc">
                      {' '}
                      Staff Name<span style={{ color: 'red' }}>*</span>:{' '}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="staffName"
                      placeholder="-- Staff Name --"
                      value={fields.staffName}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      {' '}
                      Store<span style={{ color: 'red' }}>*</span>:
                    </label>
                    <Select
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={storeOptions.filter((option) => option.value === fields.storeCode)}
                      options={storeOptions}
                      onChange={(e) => this.handleChangeFieldCustom('storeCode', e ? e.value : '', (value) => this.handleChangeStoreCode(value))}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="positionName" className="w100pc">
                      {' '}
                      Position Name<span style={{ color: 'red' }}>*</span>:{' '}
                    </label>
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- Position Name --"
                      value={positionNameOpt.filter((option) => option.value == fields.departmentCode)}
                      options={positionNameOpt}
                      onChange={(e) => this.handleChangeFieldCustom('departmentCode', e ? e.value : '', this.handleChangePositionName)}
                    />
                  </div>
                </div>
                {/* <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="typeUser" className="w100pc"> Type of User: </label>
                                        <Select
                                            classNamePrefix="select"
                                            maxMenuHeight={260}
                                            placeholder="-- Type of User --"
                                            value={typeUserOpt.filter((option) => option.value == fields.typeUser)}
                                            options={typeUserOpt}
                                            onChange={(e) => this.handleChangeFieldCustom("typeUser", e ? e.value : "", this.handleChangeTypeUser)}
                                        />
                                    </div>
                                </div> */}
                {/* <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="typeStaff" className="w100pc"> Staff Group: </label>
                                        <Select
                                            classNamePrefix="select"
                                            maxMenuHeight={260}
                                            placeholder="-- Staff Group --"
                                            value={typeStaffOpt.filter((option) => option.value == fields.typeStaff)}
                                            options={typeStaffOpt}
                                            onChange={(e) => this.handleChangeFieldCustom("typeStaff", e ? e.value : "", this.handleChangeTypeStaff)}
                                        />
                                    </div>
                                </div> */}

                {/* <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="departmentCode" className="w100pc"> Department Code: </label>
                                        <Select
                                            classNamePrefix="select"
                                            maxMenuHeight={260}
                                            placeholder="-- Department Code --"
                                            value={departmentCodeOpt.filter((option) => option.value == fields.departmentCode)}
                                            options={departmentCodeOpt}
                                            onChange={(e) => this.handleChangeFieldCustom("departmentCode", e ? e.value : "", this.handleChangePositionName)}
                                        />
                                    </div>
                                </div> */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="phone" className="w100pc">
                      {' '}
                      Phone<span style={{ color: 'red' }}>*</span>:{' '}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="phone"
                      placeholder="-- Phone --"
                      value={fields.phone}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="email" className="w100pc">
                      {' '}
                      Email:{' '}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="email"
                      placeholder="-- Email --"
                      value={fields.email}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
              </div>

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
                      value={cityOpt.filter((option) => option.value == fields.city)}
                      options={cityOpt}
                      onChange={(e) => this.handleChangeFieldCustom('city', e ? e.value : '', this.handleChangeCity)}
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
                      value={districtOpt.filter((option) => option.value == fields.district)}
                      options={districtOpt}
                      onChange={(e) => this.handleChangeFieldCustom('district', e ? e.value : '', this.handleChangeDistrict)}
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
                      value={wardOpt.filter((option) => option.value == fields.ward)}
                      options={wardOpt}
                      onChange={(e) => this.handleChangeFieldCustom('ward', e ? e.value : '')}
                    />
                  </div>
                </div>
                <div className="col-md-3">
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
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="note" className="w100pc">
                      {' '}
                      Note:{' '}
                    </label>
                    <textarea
                      type="text"
                      autoComplete="off"
                      name="note"
                      placeholder="-- Note --"
                      value={fields.note}
                      onChange={(e) => this.handleChangeField(e)}
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                {this.isUpdate && (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="status" className="w100pc">
                        {' '}
                        Status:{' '}
                      </label>
                      <Select
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- Status --"
                        value={statusOpt.filter((option) => option.value == fields.status)}
                        options={statusOpt}
                        onChange={(e) => this.handleChangeFieldCustom('status', e ? e.value : '')}
                      />
                    </div>
                  </div>
                )}
                {this.isUpdate && fields.status == 1 && (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="resignationDay" className="w100pc">
                        {' '}
                        ResignationDay<span style={{ color: 'red' }}>*</span>:{' '}
                      </label>
                      <DatePicker
                        placeholderText="-- Resignation Date --"
                        selected={fields.resignationDay}
                        onChange={(value) => this.handleChangeFieldCustom('resignationDay', value)}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        autoComplete="off"
                        // disabled={this.isCreate ? false : true}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {this.isCreate && (
            <div className="row" style={{ fontSize: '13px' }}>
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                Password default: 1 <br />
                Format Staff Code:
                <p style={{ margin: '0px 0px 0px 15px' }}>Direct Store: YYMMDDXXX</p>
                <p style={{ margin: '0px 0px 0px 15px' }}>
                  Franchise: <span style={{ padding: '0px 0px 0px 5px' }}>FYYMMDDXXX</span>
                </p>
              </div>
              <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                <p style={{ margin: '0px 0px 0px 0px' }}>Noted: The new ID will apply at the end of day.</p>
                <p style={{ margin: '0px 0px 0px 15px' }}>F : Franchise</p>
                <p style={{ margin: '0px 0px 0px 15px' }}>YY: Year </p>
                <p style={{ margin: '0px 0px 0px 15px' }}>MM: Month </p>
                <p style={{ margin: '0px 0px 0px 15px' }}>DD: Day </p>
                <p style={{ margin: '0px 0px 0px 15px' }}>XXX: number</p>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };
  checkFCStore(storeCode) {
    let stores = this.data.stores || {};
    let storeKeys = Object.keys(stores);
    const orderStore = {};
    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });

    let storeOptions = [];
    if (storeKeys.length === 0) {
      storeOptions.push({
        storeCode: this.data.storeCode,
        shortName: this.data.shortName,
      });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return {
          storeCode: orderStore[key].storeCode,
          shortName: orderStore[key].shortName,
        };
      });
    }
    let store = storeOptions.filter((item) => item.storeCode == storeCode);
    if (store.length !== 0) {
      return store[0].shortName.startsWith('F');
    }
    return false;
  }
}
