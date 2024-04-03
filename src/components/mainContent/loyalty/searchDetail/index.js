//Plugin
import { DatePicker, Empty, Modal, Popconfirm, Popover, Select, Switch, message } from 'antd';
import $ from 'jquery';
import React from 'react';
import DatePickerReact from 'react-datepicker';
//Custom
import BaseComponent from 'components/BaseComponent';
import cityJson from 'data/json/city.json';
import districtJson from 'data/json/district.json';
import wardJson from 'data/json/ward.json';
import { DateHelper, StringHelper } from 'helpers';
import Icons from 'images/icons';
import LoyaltyModel from 'models/LoyaltyModel';
import Moment from 'moment';

import LoyaltyApi from 'api/LoyaltyApi';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SecureInput from 'components/common/inputs/SecureInput';
import CONSTANT from 'constant';
import { AppContext } from 'contexts/AppContext';
import moment from 'moment';
import LogRecent from '../../customerService/tabs/logRecent/LogRecent';
import './style.scss';
export default class SearchDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.reasonBlockRef = React.createRef();
    this.ismModalOpen = false;
    this.blockUserError = null;
    this.addItemRef = React.createRef();
    this.idSearchItemsComponent = 'searchItemPopup' + StringHelper.randomKey();

    this.infoMember = {};
    this.memberCode = this.props.memberCode || '';

    this.isCreate = this.memberCode === '';
    this.isUpdateForm = this.memberCode !== '';
    this.isEditPhone = true;
    this.phone = '';
    this.isEditDiscount = true;
    this.discount = '';
    this.memberPoint = {};
    this.itemLogRecent = [];
    this.itemPaymentTrans = [];
    // this.addressCity = {};
    this.voucher = [];
    this.voucherConst = [];
    this.deposit = [];
    this.depositConst = [];
    this.selectedTuLanhRow = null;
    this.updateExpiredDateTuLanhValue = null;

    this.selectedTuQuaTangRow = null;
    this.updateExpiredDateTuQuaTangValue = null;

    this.cityJson = cityJson;
    this.districtJson = districtJson;
    this.wardJson = wardJson;
    this.district = [];
    this.ward = [];

    this.gender = [
      { label: 'Male', value: 'Nam' },
      { label: 'Female', value: 'Nu' },
    ];
    this.active = [
      { label: 'Active', value: 1 },
      { label: 'Lock', value: 0 },
    ];

    this.fieldSelected = this.assignFieldSelected({
      memberCode: '',
      firstName: '',
      lastName: '',
      phone: '',
      birthDate: new Date(),
      email: '',
      idNo: '',
      passport: '',
      address: '',
      gender: 'male',
      active: 0,
      discount: 0,
      registerDate: new Date(),
      membermerge: '',
      reason: '',
      point: '',
      district: '',
      city: '',
      ward: '',
      invoiceCodeLog: '',
      startDate: new Date(),
      date: new Date(),
      endDate: new Date(),
      partnerSource: '',
    });

    if (!this.isUpdateForm) {
      this.isRender = true;
    }
  }

  componentDidMount = () => {
    this.handleUpdateState();
  };
  onBlockUser = async () => {
    const reason = this.reasonBlockRef.current?.value;
    if (!reason) {
      this.blockUserError = { message: 'Please enter a reason' };
      this.reasonBlockRef.current.focus();
      this.refresh();
      return;
    }
    const res = await LoyaltyApi.blockUserForever(this.memberCode, reason);
    if (res.status) {
      message.success('Delete user successfully');
      this.targetLink('/loyalty');
    } else {
      message.error(res.message);
    }
  };
  handleUpdateState = async () => {
    let fields = this.fieldSelected;

    if (this.memberCode !== '') {
      let model = new LoyaltyModel();
      await model.getItemDetail(this.memberCode).then((res) => {
        if (res.status) {
          if (res.data?.member?.delete === 1) {
            super.getActionMenu().showHideActionItem(['save', 'approve', 'delete'], false);
          }
          this.infoMember = res.data.member;
          fields.firstName = this.infoMember?.firstName || '';
          fields.lastName = this.infoMember?.lastName || '';
          fields.phone = this.infoMember?.phone || '';
          this.phone = this.infoMember?.phone || '';
          fields.birthDate = null;
          // this.isCreate
          //   ? null
          //   : this.infoMember.birthDate
          //   ? new Date(this.infoMember.birthDate)
          //   : new Date();
          fields.email = this.infoMember?.email || '';
          fields.passport = this.infoMember?.passport || '';
          fields.address = this.infoMember?.address || '';
          fields.city = this.infoMember?.city || '';
          fields.district = this.infoMember?.district || '';
          fields.ward = this.infoMember?.ward || '';
          fields.gender = this.infoMember?.gender || '';
          fields.memberCode = this.infoMember?.memberCode || '';
          fields.idNo = this.infoMember?.idNo || '';
          fields.active = this.infoMember?.active || 0;
          fields.discount = this.infoMember?.discount || 0;
          fields.delete = this.infoMember.delete;
          fields.note = this.infoMember.note;

          this.discount = this.infoMember?.discount || '';
          fields.registerDate = this.infoMember?.registerDate ? new Date(this.infoMember?.registerDate) : new Date();
          fields.partnerSource = this.infoMember?.partnerSource || '';

          this.handleGetPoint();
          // this.handleGetLogTrans();
          // this.handleGetPaymentTrans();

          // this.refresh();
        } else {
          this.targetLink('/loyalty');
          this.showAlert(res.message);
        }
      });
    }

    this.refresh();
  };

  handleGetPoint = async () => {
    let model = new LoyaltyModel();

    if (this.memberCode !== '') {
      await model.getPoint(this.memberCode).then((res) => {
        if (res.status) {
          this.memberPoint = res.data.point;
        }
        this.refresh();
      });
    }
  };

  handleSave = async () => {
    let fields = this.fieldSelected;
    let model = new LoyaltyModel();

    if (fields.firstName === '') {
      this.showAlert('Please enter first name');
      return false;
    }

    if (fields.lastName === '') {
      this.showAlert('Please enter last name');
      return false;
    }

    if (fields.phone === '') {
      this.showAlert('Please enter phone');
      return false;
    }

    if (fields.phone.length < 10) {
      this.showAlert('Incorrect phone number');
      return false;
    }

    if (this.isCreate) {
      let params = {
        firstName: fields.firstName,
        lastName: fields.lastName,
        phone: fields.phone,
        birthDate: fields.birthDate?.toISOString(),
        email: fields.email,
        passport: fields.passport,
        address: fields.address,
        gender: fields.gender,
      };

      await model.createMember(params).then((res) => {
        if (res.status && res.data.memberCode) {
          this.targetLink('/loyalty/' + res.data.memberCode, '/loyalty');
          this.showAlert('Save successfully!', 'success');
        } else {
          this.showAlert(res.message);
        }
      });
    } else {
      let params = {
        memberCode: fields.memberCode,
        body: {
          firstName: fields.firstName,
          lastName: fields.lastName,
          phone: fields.phone,
          birthDate: fields.birthDate?.toISOString(),
          email: fields.email,
          passport: fields.passport,
          address: fields.address,
          gender: fields.gender,
        },
      };
      await model.updateInfo(params).then((res) => {
        if (res.status) {
          this.showAlert(res.message, 'success');
        } else {
          this.showAlert(res.message);
        }
      });
    }
  };

  handleActionMergePoint = async () => {
    let fields = this.fieldSelected;
    let model = new LoyaltyModel();
    let params = {
      memberCode: fields.memberCode,
      body: {
        reason: fields.reason,
        memberCode: fields.membermerge,
      },
    };

    if (fields.reason === '') {
      this.showAlert('Please enter reason');
      return false;
    }

    if (fields.active === 0) {
      this.showAlert('Please active member');
      return false;
    }

    if (fields.membermerge === '') {
      this.showAlert('Please choose member merge point');
      return false;
    }

    await model.mergePoint(params).then((res) => {
      if (res.status) {
        this.showAlert(res.message, 'success');
      } else {
        this.showAlert(res.message);
      }
      this.refresh();
    });
  };
  // phone
  handleChangePhone = async () => {
    let fields = this.fieldSelected;
    let model = new LoyaltyModel();
    let params = {
      memberCode: fields.memberCode,
      phone: fields.phone,
    };

    if (this.isEditPhone === true) {
      this.showAlert('Please edit phone number');
      return false;
    }

    await model.changePhone(params).then((res) => {
      if (res.status) {
        this.showAlert(res.message, 'success');
        this.isEditPhone = false;
      } else {
        this.showAlert(res.message);
      }
      this.refresh();
    });
  };
  handleEditPhone = () => {
    this.isEditPhone = false;
    this.refresh();
  };
  handleCancelPhone = () => {
    this.isEditPhone = true;
    this.fieldSelected.phone = this.phone;
    this.refresh();
  };
  // --------------
  // discount
  handleEditDiscount = () => {
    this.isEditDiscount = false;
    this.refresh();
  };
  handleCancelDiscount = () => {
    this.isEditDiscount = true;
    this.fieldSelected.discount = this.discount;
    this.refresh();
  };
  handleChangeDiscount = async () => {
    let fields = this.fieldSelected;
    let model = new LoyaltyModel();
    let params = {
      memberCode: fields.memberCode,
      discount: fields.discount,
    };

    if (this.isEditDiscount === true) {
      this.showAlert('Please edit discount number');
      return false;
    }

    await model.changeDiscount(params).then((res) => {
      if (res.status) {
        this.showAlert(res.message, 'success');
        this.isEditDiscount = false;
      } else {
        this.showAlert(res.message);
      }
      this.refresh();
    });
  };
  // --------------
  handleActiveMember = async (status) => {
    let fields = this.fieldSelected;
    let model = new LoyaltyModel();

    let params = { memberCode: fields.memberCode };
    if (status) {
      await model.activeMember(params).then((res) => {
        this.showAlert('Active member successfully', 'success');
        this.fieldSelected.active = '1';
        this.refresh();
      });
    } else {
      await model.lockMember(params).then((res) => {
        this.showAlert('Block member successfully', 'success');
        this.fieldSelected.active = '0';
        this.refresh();
      });
    }
  };

  validateEmail = (inputText) => {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputText.value.match(mailformat)) {
      return true;
    } else {
      alert('You have entered an invalid email address!');
      $("[name='email']").focus();
      return false;
    }
  };

  handleAddMemberMerge = (membermerge) => {
    this.fieldSelected.membermerge = membermerge;
    this.refresh();
  };

  handleShowSearchItems = () => {
    $('.popup-form').hide();
    $('#' + this.idSearchItemsComponent).show();
    $('#' + this.idSearchItemsComponent)
      .find('[name=keywordbarcode]')
      .focus()
      .select();
  };

  handleAddPoint = () => {
    let model = new LoyaltyModel();
    let param = {
      memberCode: this.memberCode,
      point: this.fieldSelected.point,
    };

    if (this.fieldSelected.point === '') {
      this.showAlert('Please enter point');
      return false;
    }

    if (parseInt(this.fieldSelected.point) > 100000) {
      this.showAlert('Please enter a number less than 100000');
      return false;
    }

    model.addPoint(param).then((res) => {
      if (res.status) {
        this.showAlert(res.message, 'success');
        this.fieldSelected.point = '';
        this.handleGetPoint();
      } else {
        this.showAlert(res.message);
      }
      this.refresh();
    });
  };

  paymentResponseComp = (data) => {
    let dataCv = data !== '' && JSON.parse(data);
    if (dataCv === null || dataCv === '' || dataCv === false) {
      return '';
    } else {
      const contextValue = this.context;
      const { paymentmethods } = contextValue.state;
      return (
        <table className="table bgtb-darkcyan">
          <thead>
            <tr>
              <th>Payment code</th>
              <th>Payment name</th>
              <th className="rule-number">Value</th>
            </tr>
          </thead>
          <tbody>
            {dataCv &&
              dataCv.map((pay, payI) => (
                <tr key={payI}>
                  <td>{pay.PaymentCode}</td>
                  <td>{paymentmethods?.[pay.PaymentCode]?.methodName || '-'}</td>
                  <td className="rule-number">{StringHelper.formatPrice(pay.Value)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      );
    }
  };

  itemResponseComp = (data) => {
    let dataCv = data !== '' && JSON.parse(data);

    if (dataCv === null || dataCv === '' || dataCv === false) {
      return '';
    } else {
      return (
        <table className="table bgtb-green">
          <thead>
            <tr>
              {/* <th>Group code</th> */}
              <th>Item</th>
              <th className="rule-number">Sale price</th>
              <th className="rule-number">Total price</th>
              <th className="rule-number">Discount price</th>
            </tr>
          </thead>
          <tbody>
            {dataCv &&
              dataCv.map((pay, payI) => (
                <tr key={payI}>
                  {/* <td>{pay.GroupCode}</td> */}
                  <td>
                    {pay.ItemCode} <br />
                    {pay.ItemName}
                  </td>
                  <td className="rule-number">{StringHelper.formatPrice(pay.SalePrice)}</td>
                  <td className="rule-number">{StringHelper.formatPrice(pay.TotalPrice)}</td>
                  <td className="rule-number">{StringHelper.formatPrice(pay.DiscountPrice)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      );
    }
  };

  handleGetLogTrans = async () => {
    let fields = this.fieldSelected;

    if (fields.invoiceCodeLog !== '') {
      if (fields.invoiceCodeLog.length !== 18) {
        this.showAlert('invalid invoice code');
        return false;
      }
    }

    // if (fields.date === "") {
    //     this.showAlert("Please enter date");
    //     return false;
    // }

    let params = {
      invoiceCode: fields.invoiceCodeLog,
      startDate: fields.date?.[0] ? Moment(fields.date?.[0]).format('YYYY-MM-DD') : '',
      endDate: fields.date?.[1] ? Moment(fields.date?.[1]).format('YYYY-MM-DD') : '',
    };

    $('.alertLog').html('');
    $('.alertPayment').html('');

    let model = new LoyaltyModel();
    await model.getLogDetail(this.memberCode, params).then((res) => {
      if (res.status) {
        this.itemLogRecent = res.data.logs;

        if (res.data.logs && res.data.logs.length === 0) {
          $('.alertLog').html('* Recent logs not found');
        }
      }

      this.refresh();
    });

    await model.getPaymentTransDetail(this.memberCode, params).then((res) => {
      if (res.status) {
        this.itemPaymentTrans = res.data.paymentTransaction;

        if (res.data.paymentTransaction && res.data.paymentTransaction.length === 0) {
          $('.alertPayment').html('** Payment transaction not found');
        }
      }

      this.refresh();
    });
  };
  handleBlockUserForever = async () => {};
  handleGetTheLastSevenDays = async () => {
    let fields = this.fieldSelected;
    if (!fields.invoiceCodeLog || fields.invoiceCodeLog.length !== 18) {
      this.showAlert('invalid invoice code');
      return false;
    }
    let params = {
      invoiceCode: fields.invoiceCodeLog,
    };
    $('.alertLog').html('');
    $('.alertPayment').html('');

    let model = new LoyaltyModel();
    await model.getPaymentTransDetail(this.memberCode, params).then((res) => {
      if (res.status) {
        this.itemPaymentTrans = res.data.paymentTransaction;

        if (res.data.paymentTransaction && res.data.paymentTransaction.length === 0) {
          $('.alertPayment').html('** Payment transaction not found');
        }
      }

      this.refresh();
    });
  };
  labelMethod = (eventName) => {
    switch (eventName) {
      case 'BILL_PRINTED':
        return 'Tích lũy';
      case 'PAYMENT':
        return 'Thanh Toán';
      case 'RETURN_ITEM':
        return 'Trả hàng';
      case 'ADD_REWARD':
        return 'Điểm thưởng';
      case 'APP_REDEEM_POINT':
        return 'Redeem điểm';
      case 'APP_REDEEM':
        return 'Redeem';
      case 'APP_REDEEM_DEPOSIT':
        return 'Đổi điểm';
      case 'LOCK_GIFT':
        return 'Tặng quà';
      case 'GIFT_CARD':
        return 'Nhận quà';
      case 'BILL_CANCEL':
        return 'Huỷ hoá đơn';
      default:
        return eventName;
    }
  };

  handleGetVoucherMember = async () => {
    let params = {
      memberCode: this.memberCode,
      service: 'voucher',
    };

    let model = new LoyaltyModel();
    await model.getMemberService(params).then((res) => {
      if (res.status && res.data && res.data.voucher) {
        this.voucher = res.data.voucher?.sort((a, b) => moment(b.expiredDate).diff(moment(a.expiredDate)));
        this.voucherConst = res.data.voucher;
      }

      this.refresh();
    });
  };

  handleGetDepositMember = async () => {
    let params = {
      memberCode: this.memberCode,
      service: 'deposit',
    };

    let model = new LoyaltyModel();
    await model.getMemberService(params).then((res) => {
      if (res.status && res.data && res.data.deposit) {
        this.deposit = res.data.deposit?.sort((a, b) => moment(b.expiredDate).diff(moment(a.expiredDate)));
        this.depositConst = res.data.deposit;
      }
      this.refresh();
    });
  };

  openTab = (name, classname) => {
    var i;
    var x = document.getElementsByClassName(classname);

    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    document.getElementById(name).style.display = 'block';
  };

  hightLightTab = (index, classname) => {
    var i;
    var btn = document.getElementsByClassName(classname);
    for (i = 0; i < btn.length; i++) {
      btn[i].classList.remove('active');
    }

    btn[index]?.classList && btn[index].classList.add('active');
  };

  handleChangeCity = () => {
    let fields = this.fieldSelected;
    fields.district = '';
    fields.ward = '';
    // this.district = this.districtJson.filter(el=>el.province_code == fields.city);
    this.refresh();
  };

  handleChangeDistrict = () => {
    let fields = this.fieldSelected;
    fields.ward = '';
    // this.ward = this.wardJson.filter(el=>el.district_code == fields.district);
    this.refresh();
  };
  async updateExpiredDateTuQuaTangAPI() {
    if (Boolean(this.updateExpiredDateTuQuaTangValue)) {
      const model = new LoyaltyModel();
      const res = await model.updateExpiredDateVoucher({
        memberCode: this.props?.memberCode,
        VoucherCode: this.selectedTuQuaTangRow?.data?.codeEncrypt,
        expiredDate: moment(new Date(this.updateExpiredDateTuQuaTangValue)).format(CONSTANT.FORMAT_DATE_PAYLOAD),
      });
      if (res.status) {
        this.voucher[this.selectedTuQuaTangRow?.index] = {
          ...this.selectedTuQuaTangRow?.data,
          expiredDate: this.updateExpiredDateTuQuaTangValue,
        };
        message.success('Update expired date successfully');
      } else {
        message.error(res.message);
      }
    }
    this.selectedTuQuaTangRow = null;
    this.refresh();
  }
  async updateExpiredDateTuLanhAPI() {
    if (Boolean(this.updateExpiredDateTuLanhValue)) {
      const model = new LoyaltyModel();
      const res = await model.updateExpiredDateDeposit({
        memberCode: this.props?.memberCode,
        VoucherCode: this.selectedTuLanhRow?.data?.voucherCodeEncrypt,
        expiredDate: moment(new Date(this.updateExpiredDateTuLanhValue)).format(CONSTANT.FORMAT_DATE_PAYLOAD),
      });
      if (res.status) {
        this.deposit[this.selectedTuLanhRow?.index] = {
          ...this.selectedTuLanhRow?.data,
          expiredDate: this.updateExpiredDateTuLanhValue,
        };
        message.success('Update expired date successfully');
      } else {
        message.error(res.message);
      }
    }
    this.selectedTuLanhRow = null;
    this.refresh();
  }
  renderComp = () => {
    let fields = this.fieldSelected;
    let itemPaymentTrans = this.itemPaymentTrans;
    let cityOpt = this.cityJson.map((el) => ({ value: el.code, label: el.name })) || [];
    let district = this.districtJson.filter((el) => el.province_code == fields.city);
    let districtOpt = district.map((el) => ({ value: el.code, label: el.name })) || [];
    let ward = this.wardJson.filter((el) => el.district_code == fields.district);
    let wardOpt = ward.map((el) => ({ value: el.code, label: el.name })) || [];
    let lstVoucher = this.voucher;
    let lstDeposit = this.deposit || [];
    if (!Boolean(this.infoMember))
      return (
        <div className="flex items-center justify-center" style={{ height: 500 }}>
          <Empty style={{ scale: 4 }} />
        </div>
      );
    return (
      <section className="" id="loyalty_details">
        <div className="row header-detail flex items-center">
          <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 flex items-center">
            <button onClick={() => super.back('/loyalty')} type="button" className="btn btn-back" style={{ background: 'beige', height: 'fit-content' }}>
              Back
            </button>
            <h2
              style={{
                margin: 10,
                display: 'inline-block',
                verticalAlign: 'middle',
              }}
            >
              {!this.isUpdateForm ? 'New member' : '#' + this.memberCode}
            </h2>
            {this.fieldSelected.delete ? null : (
              <Switch checkedChildren="Active" unCheckedChildren="Active" onChange={(value) => this.handleActiveMember(value)} checked={this.fieldSelected?.active?.toString() === '1'} />
            )}
            {this.fieldSelected.delete ? null : (
              <Popover
                title="Note"
                content={
                  <p style={{ maxWidth: '300px' }}>
                    This account will be permanently deleted. When you delete account, you won't be able to change infomation, but the account is still availble to see
                  </p>
                }
              >
                <div
                  style={{
                    margin: 0,
                    marginLeft: '10px',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'red',
                    padding: '0 2px 0 9px',
                    borderRadius: '40px',
                    fontWeight: '500',
                    fontSize: '12px',
                    height: '22px',
                  }}
                  onClick={() => {
                    this.ismModalOpen = true;
                    this.refresh();
                  }}
                >
                  Delete
                  <Icons.Question
                    style={{
                      color: 'white',
                      boxShadow: '0 2px 4px 0 rgba(0, 35, 11, 0.2)',
                      borderRadius: '50%',
                      fontSize: '19px',
                    }}
                  />
                </div>
              </Popover>
            )}
          </div>

          <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 flex items-center justify-end">
            <div className=" mt-10 flex items-center gap-10" style={{ fontSize: 16, fontWeight: 600, borderRadius: '40px' }}>
              <div className="flex flex-col  col-md-6 w-full  bg-block" style={{ borderRadius: '40px' }}>
                <p className="m-0">{StringHelper.formatPrice(this.memberPoint.point)}</p>
                <p className=" m-0">Point</p>
              </div>

              <div className="flex flex-col  col-md-6 w-full  bg-block" style={{ borderRadius: '40px' }}>
                <p className="w-full m-0 text-center gap-10">
                  <span>{`${StringHelper.formatPrice(Number(this.memberPoint.point) * 15)}`}</span>
                </p>
                <p className=" m-0">Money</p>
              </div>
            </div>
          </div>
        </div>
        {this.fieldSelected.delete ? (
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-10 mb-10 section-block">
            <p className="m-0">
              <b className="cl-red">User is deleted because</b>: {this.fieldSelected.note}
            </p>
          </div>
        ) : null}
        <div className="form-filter">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="section-block mb-15">
                <div className="row flex items-center">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="firstName" className="w100pc">
                        First name:
                      </label>
                      <SecureInput
                        secure
                        secureValue={this.infoMember.firstName}
                        type="text"
                        autoComplete="off"
                        name="firstName"
                        placeholder="-- First name --"
                        value={fields.firstName}
                        onChange={(e) => this.handleChangeField(e)}
                        className="form-control"
                        // disabled={this.isCreate ? false : true}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="lastName" className="w100pc">
                        Last name:
                      </label>
                      <SecureInput
                        secure
                        secureValue={this.infoMember.lastName}
                        type="text"
                        autoComplete="off"
                        name="lastName"
                        placeholder="-- Last name --"
                        value={fields.lastName}
                        onChange={(e) => this.handleChangeField(e)}
                        className="form-control"
                        // disabled={this.isCreate ? false : true}
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="email" className="w100pc">
                        Email:
                      </label>
                      <SecureInput
                        secure
                        secureValue={StringHelper.hideEmail(this.infoMember.email)}
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
                      <label htmlFor="passport" className="w100pc">
                        Passport:
                      </label>
                      <SecureInput
                        secure
                        secureValue={StringHelper.hidePartOfString(this.infoMember.passport)}
                        type="text"
                        autoComplete="off"
                        name="passport"
                        placeholder="-- Passport --"
                        value={fields.passport}
                        onChange={(e) => this.handleChangeField(e)}
                        className="form-control"
                        // disabled={this.isCreate ? false : true}
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="birthDate" className="w100pc">
                      Date of birth:
                    </label>
                    <DatePickerReact
                      placeholderText={!this.isCreate ? StringHelper.hideDateOfBirth(this.infoMember.birthDate) : '-- Date of birth --'}
                      defaultValue={this.isCreate ? '' : fields.birthDate}
                      selected={fields.birthDate}
                      onChange={(value) => this.handleChangeFieldCustom('birthDate', value)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="gender" className="w100pc">
                        Gender:
                      </label>
                      <Select
                        className="w-full"
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- Gender --"
                        value={this.gender.filter((option) => option.value === fields.gender)}
                        options={this.gender}
                        onChange={(e) => this.handleChangeFieldCustom('gender', e ? e.value : '')}
                      />
                    </div>
                  </div>
                  {this.fieldSelected.delete ? null : (
                    <div className="col-md-3">
                      <div className="form-group ">
                        <label htmlFor="discount" className="w100pc">
                          Discount:
                        </label>
                        <div className="flex items-center gap-10">
                          <input
                            type="text"
                            autoComplete="off"
                            name="discount"
                            placeholder="-- Discount --"
                            value={fields.discount}
                            onChange={(e) => this.handleChangeField(e)}
                            className="form-control"
                            disabled={this.isCreate ? false : this.isEditDiscount}
                          />
                          {!this.isCreate ? (
                            this.isEditDiscount === true ? (
                              <button type="button" onClick={this.handleEditDiscount} style={{ height: 38 }} className="btn btn-success">
                                Edit
                              </button>
                            ) : (
                              <>
                                <button type="button" onClick={this.handleCancelDiscount} style={{ height: 38 }} className="btn btn-success">
                                  Cancel
                                </button>
                                <button type="button" onClick={this.handleChangeDiscount} style={{ height: 38 }} className="btn btn-success">
                                  Save
                                </button>
                              </>
                            )
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="city" className="w100pc">
                        City:
                      </label>
                      <Select
                        className="w-full"
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
                        District:
                      </label>
                      <Select
                        className="w-full"
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
                        Ward:
                      </label>
                      <Select
                        className="w-full"
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
                        Address:
                      </label>

                      <SecureInput
                        test={this.infoMember}
                        secure
                        secureValue={StringHelper.hidePartOfString(this.infoMember.address)}
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
                      <label htmlFor="phone" className="w100pc">
                        Phone:
                      </label>
                      <SecureInput
                        secure
                        secureValue={StringHelper.hidePhoneBumber(this.infoMember.phone)}
                        type="text"
                        autoComplete="off"
                        name="phone"
                        s
                        placeholder="-- Phone --"
                        value={fields.phone}
                        onChange={(e) => this.handleChangeField(e)}
                        className="form-control"
                        // disabled={this.isCreate ? false : this.isEditPhone}
                        disabled={this.isCreate ? false : true}
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="partnerSource" className="w100pc">
                        Partner:
                      </label>
                      <input type="text" autoComplete="off" name="partnerSource" value={fields.partnerSource} onChange={(e) => this.handleChangeField(e)} className="form-control" disabled={true} />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="idNo" className="w100pc">
                        Id code:
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        name="idNo"
                        placeholder="-- Id No --"
                        value={fields.idNo}
                        onChange={(e) => this.handleChangeField(e)}
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="registerDate" className="w100pc">
                        Register date:
                      </label>
                      <DatePickerReact
                        placeholderText="-- Register date --"
                        selected={fields.registerDate}
                        onChange={(value) => this.handleChangeFieldCustom('registerDate')}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        className="form-control"
                        autoComplete="off"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {!this.isCreate && (
                <div className="section-block">
                  <div className="row"></div>
                  <div
                    className=""
                    style={{
                      marginBottom: 15,
                      position: 'sticky',
                      top: 0,
                      zIndex: '99',
                    }}
                  >
                    <div className="col-md-12" style={{ background: 'white', padding: 0 }}>
                      <div className="tt-tbtab loytalty_tab">
                        {this.fieldSelected?.delete ? null : (
                          <button
                            className={`btnTitle active`}
                            onClick={() => {
                              this.openTab('add-member-point', 'detail-tab');
                              this.hightLightTab(0, 'btnTitle');
                            }}
                          >
                            Add member point
                          </button>
                        )}
                        <button
                          className={`btnTitle ${this.fieldSelected.delete ? 'active' : ''}`}
                          onClick={() => {
                            this.openTab('log-recent', 'detail-tab');
                            this.hightLightTab(this.fieldSelected?.delete ? 0 : 1, 'btnTitle');
                          }}
                        >
                          Log recent
                        </button>
                        {/* <button
                          className="btnTitle"
                          onClick={() => {
                            this.openTab('payment-transaction', 'detail-tab');
                            this.hightLightTab(2, 'btnTitle');
                          }}
                        >
                          Payment transaction
                        </button> */}
                        <div className="flex items-center">
                          <button
                            className="btnTitle"
                            onClick={() => {
                              this.openTab('voucherMember', 'detail-tab');
                              this.hightLightTab(this.fieldSelected?.delete ? 1 : 2, 'btnTitle');
                              this.handleGetVoucherMember();
                            }}
                          >
                            Tủ quà tặng
                          </button>
                          <Icons.RotateRight
                            style={{
                              color: 'var(--primary-color)',
                              marginLeft: '5px',
                              cursor: 'pointer',
                            }}
                            onClick={this.handleGetVoucherMember}
                          />
                        </div>
                        <div className="flex items-center">
                          <button
                            className="btnTitle"
                            onClick={() => {
                              this.openTab('depositMember', 'detail-tab');
                              this.hightLightTab(this.fieldSelected?.delete ? 2 : 3, 'btnTitle');
                              this.handleGetDepositMember();
                            }}
                          >
                            Tủ lạnh
                          </button>
                          <Icons.RotateRight
                            style={{
                              color: 'var(--primary-color)',
                              marginLeft: '5px',
                              cursor: 'pointer',
                            }}
                            onClick={this.handleGetDepositMember}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <section className="wrap-section">
                    <div id="add-member-point" className="detail-tab">
                      {/* <div>
                        <h3 style={{ display: 'inline-block' }}>Add member point: </h3>
                      </div> */}

                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            {this.fieldSelected.delete === 1 ? null : (
                              <div className="row">
                                <div className="col-md-9">
                                  <input
                                    type="number"
                                    autoComplete="off"
                                    name="point"
                                    placeholder="-- Add point --"
                                    value={fields.point}
                                    onChange={(e) => this.handleChangeField(e)}
                                    className="form-control"
                                  />
                                </div>
                                <div className="col-md-3">
                                  <button type="button" onClick={this.handleAddPoint} style={{ height: 38 }} className="btn btn-success">
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="wrap-table w-fit" style={{ marginBottom: 10 }}>
                        <table className="table table-hover w-fit">
                          <thead>
                            <tr>
                              <th className="rule-number">Total point</th>
                              <th className="rule-number">Reward point</th>
                              <th className="rule-number">Reward transaction point</th>
                              <th className="rule-number">Point</th>
                              <th className="rule-number">Total used point</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(this.memberPoint) !== null && (
                              <tr>
                                <td className="rule-number">{StringHelper.formatPrice(this.memberPoint.totalPoint)}</td>
                                <td className="rule-number">{StringHelper.formatPrice(this.memberPoint.rewardPoint)}</td>
                                <td className="rule-number">{StringHelper.formatPrice(this.memberPoint.rewardTransactionPoint)}</td>
                                <td className="rule-number">{StringHelper.formatPrice(this.memberPoint.point)}</td>
                                <td className="rule-number">{StringHelper.formatPrice(this.memberPoint.totalUsedPoint)}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div id="log-recent" className="detail-tab" style={{ display: 'none' }}>
                      <LogRecent memberCode={this.memberCode} model={new LoyaltyModel()} />
                      {/* */}
                    </div>

                    <div id="payment-transaction" className="detail-tab" style={{ display: 'none' }}>
                      <div>
                        <h3 style={{ display: 'inline-block' }}>Payment transaction (the last 7 days): </h3>
                      </div>

                      <div>
                        <div className="row" style={{ position: 'relative', zIndex: 6 }}>
                          <div className="col-md-12">
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    name="invoiceCodeLog"
                                    placeholder="-- Invoice code --"
                                    value={fields.invoiceCodeLog}
                                    onChange={(e) => this.handleChangeField(e)}
                                    className="form-control"
                                  />
                                </div>
                                <div className="col-md-2">
                                  <button type="button" onClick={this.handleGetTheLastSevenDays} style={{ height: 38 }} className="btn btn-success">
                                    Search
                                  </button>
                                </div>
                                <div className="col-md-4">
                                  <span
                                    className="alertLog"
                                    style={{
                                      color: 'red',
                                      fontStyle: 'italic',
                                    }}
                                  ></span>
                                  <br />
                                  <span
                                    className="alertPayment"
                                    style={{
                                      color: 'red',
                                      fontStyle: 'italic',
                                    }}
                                  ></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="wrap-table htable w-fit" style={{ marginBottom: 10 }}>
                        <table className="table table-hover w-fit">
                          <thead>
                            <tr>
                              <th>Invoice code</th>
                              <th>Transaction ID</th>
                              <th className="rule-number">Amount</th>
                              <th>Counter</th>
                              <th className="rule-number">Point</th>
                              <th className="rule-date">Request date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemPaymentTrans.map((elm, i) => (
                              <tr key={i}>
                                <td>{elm.invoiceCode}</td>
                                <td>{elm.transactionID}</td>
                                <td className="rule-number">{StringHelper.formatPrice(elm.amount)}</td>
                                <td>{elm.counter}</td>
                                <td className="rule-number">{StringHelper.formatQty(elm.point)}</td>
                                <td className="rule-date">{DateHelper.displayDateTime24HM(elm.requestDate)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {itemPaymentTrans.length === 0 ? <div className="table-message">Item not found</div> : ''}
                      </div>
                    </div>

                    <div id="voucherMember" className="detail-tab" style={{ display: 'none' }}>
                      <div className="row">
                        {/* Tur qua tang */}
                        <div className="col-md-3 mb-10">
                          <Select
                            allowClear
                            placeholder="--Filter--"
                            className="w-full"
                            options={[
                              { value: 0, label: 'Available' },
                              { value: 1, label: 'Expired' },
                              { value: 2, label: 'Near expiration. (3 days)' },
                            ]}
                            onChange={(value) => {
                              const clone = JSON.parse(JSON.stringify(this.voucherConst));
                              const res = clone.filter((el) => {
                                const isBefore = moment(new Date(el.expiredDate)).isBefore(moment().endOf('day'));
                                const isNearExpire =
                                  moment(new Date(el.expiredDate)).startOf('day').diff(moment().startOf('day'), 'days') < 3 &&
                                  moment(new Date(el.expiredDate)).startOf('day').diff(moment().startOf('day'), 'days') >= 0;
                                if (value === undefined) return true;
                                if (value === 1) {
                                  return isBefore;
                                } else if (value === 2) {
                                  return isNearExpire;
                                }
                                return !isBefore && !isNearExpire;
                              });
                              this.voucher = res;
                              this.refresh();
                            }}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div
                            className="wrap-table w-fit"
                            style={{
                              marginBottom: 10,
                              maxHeight: '500px',
                              overflowY: 'scroll',
                            }}
                          >
                            <table className="table table-hover w-fit">
                              <thead>
                                <tr>
                                  <th>Code</th>
                                  <th className="rule-number">Value</th>
                                  <th>Item code</th>
                                  <th className="rule-date">Used date</th>
                                  <th>Invoice</th>
                                  <th className="rule-date">Created date</th>
                                  <th className="rule-date">Expired date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.keys(lstVoucher) !== null &&
                                  lstVoucher.map((item, i) => {
                                    return (
                                      <tr
                                        key={i}
                                        style={{
                                          color: `${
                                            item.isUsed
                                              ? '#c8c8c8'
                                              : moment(new Date(item.expiredDate)).startOf('day').diff(moment().startOf('day'), 'days') < 3 &&
                                                moment(new Date(item.expiredDate)).startOf('day').diff(moment().startOf('day'), 'days') >= 0
                                              ? '#c5c700'
                                              : moment(new Date(item.expiredDate)).isBefore(moment().endOf('day'))
                                              ? '#ff000054'
                                              : 'black'
                                          }`,
                                        }}
                                      >
                                        <td>{item.code}</td>
                                        <td className="rule-number">{StringHelper.formatPrice(item.value)}</td>
                                        <td>{item.itemCode}</td>
                                        <td className="rule-date">{item.usedDate ? moment(item.usedDate).format('DD/MM/YYYY HH:mm') : '-'}</td>
                                        <td>{item.invoice}</td>
                                        <td className="rule-date">{DateHelper.displayDateTime(item.issueDate)}</td>
                                        <td className="rule-date">
                                          <div className="flex items-center justify-content-between gap-10">
                                            <span className={`${item.usedTime ? 'color-gray' : ''}`}>{moment(new Date(item.expiredDate)).format('DD/MM/YYYY')}</span>

                                            {item.isUsed || this.fieldSelected.delete ? null : (
                                              <BaseButton
                                                onClick={() => {
                                                  this.selectedTuQuaTangRow = {
                                                    data: item,
                                                    index: i,
                                                  };
                                                  this.refresh();
                                                }}
                                                iconName="edit"
                                              ></BaseButton>
                                            )}
                                          </div>
                                        </td>
                                        {/* <td className="rule-date">
                                          <DatePicker value={moment(new Date(item.expiredDate))} />
                                        </td> */}
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                            {lstVoucher.length == 0 ? <div className="table-message">Item not found</div> : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="depositMember" className="detail-tab" style={{ display: 'none' }}>
                      <div className="row">
                        {/* Tur lanh*/}
                        <div className="col-md-3 mb-10">
                          <Select
                            allowClear
                            placeholder="--Filter--"
                            className="w-full"
                            options={[
                              { value: 0, label: 'Available' },
                              { value: 1, label: 'Expired' },
                              { value: 2, label: 'Near expiration. (3 days)' },
                            ]}
                            onChange={(value) => {
                              const clone = JSON.parse(JSON.stringify(this.depositConst));
                              const res = clone.filter((el) => {
                                const isBefore = moment(new Date(el.expiredDate)).isBefore(moment().endOf('day'));
                                const isNearExpire =
                                  moment(new Date(el.expiredDate)).startOf('day').diff(moment().startOf('day'), 'days') < 3 &&
                                  moment(new Date(el.expiredDate)).startOf('day').diff(moment().startOf('day'), 'days') >= 0;
                                if (value === undefined) return true;
                                if (value === 1) {
                                  return isBefore;
                                } else if (value === 2) {
                                  return isNearExpire;
                                }
                                return !isBefore && !isNearExpire;
                              });
                              this.deposit = res;
                              this.refresh();
                            }}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div
                            className="wrap-table w-fit"
                            style={{
                              marginBottom: 10,
                              maxHeight: '500px',
                              overflowY: 'scroll',
                            }}
                          >
                            <table className="table table-hover w-fit">
                              <thead>
                                <tr>
                                  <th>Deposit code</th>
                                  <th>Item</th>
                                  <th className="rule-number">Qty</th>
                                  <th className="rule-number">Used date</th>
                                  <th className="rule-date">Created date</th>
                                  <th className="text-center">Expired date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.keys(lstDeposit) !== null &&
                                  lstDeposit.map((item, i) => {
                                    return (
                                      <tr
                                        key={i}
                                        style={{
                                          color: `${
                                            item.isUsed
                                              ? '#c8c8c8'
                                              : moment(new Date(item.expiredDate)).startOf('day').diff(moment().startOf('day'), 'days') < 3 &&
                                                moment(new Date(item.expiredDate)).startOf('day').diff(moment().startOf('day'), 'days') >= 0
                                              ? '#c5c700'
                                              : moment(new Date(item.expiredDate)).isBefore(moment().endOf('day'))
                                              ? '#ff000054'
                                              : 'black'
                                          }`,
                                        }}
                                      >
                                        <td>{item.voucherCode}</td>
                                        <td>
                                          {item.itemCode} - {item.itemName}
                                        </td>
                                        <td className="rule-number">{StringHelper.formatPrice(item.qty)}</td>
                                        <td className="rule-number">{item.usedDate ? moment(item.usedDate).utc().format('DD/MM/YYYY HH:mm') : '-'}</td>
                                        <td className="rule-date">{item.startDate ? moment(item.startDate).utc().format('DD/MM/YYYY HH:mm') : '-'}</td>
                                        <td className="rule-date">
                                          <div className="flex items-center justify-content-between gap-10">
                                            <span className={`${item.isUsed ? 'color-gray' : ''}`}>{moment(new Date(item.expiredDate)).utc().format('DD/MM/YYYY')}</span>
                                            {item.isUsed || this.fieldSelected.delete ? null : (
                                              <BaseButton
                                                onClick={() => {
                                                  this.selectedTuLanhRow = {
                                                    data: item,
                                                    index: i,
                                                  };
                                                  this.refresh();
                                                }}
                                                iconName="edit"
                                              ></BaseButton>
                                            )}
                                          </div>
                                        </td>
                                        {/* <td className="rule-date">
                                      <DatePicker
                                        showTime={{
                                          format: 'HH:mm',
                                        }}
                                        onChange={(e) => {
                                          this.deposit[i] = { ...this.deposit[i], expiredDate: e.format() };
                                          this.refresh();
                                        }}
                                        format="DD/MM/YYYY HH:mm"
                                        value={moment(new Date(item.expiredDate))}
                                      />
                                    </td> */}
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                            {lstDeposit.length == 0 ? <div className="table-message">Item not found</div> : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
        <Modal
          open={this.ismModalOpen}
          onCancel={() => {
            this.ismModalOpen = false;
            this.refresh();
          }}
          footer={null}
          title="Enter the reason"
        >
          <textarea
            onChange={() => {
              if (this.blockUserError) {
                this.blockUserError = null;
                this.refresh();
              }
            }}
            placeholder="This account will be permanently deleted. When you delete account, you won't be able to change infomation, but the account is still availble to see "
            rows={10}
            className={`w-full ${!this.blockUserError ? '' : 'error_field'}`}
            ref={this.reasonBlockRef}
          />
          {this.blockUserError ? <p className="m-0 mb-15 cl-red">{this.blockUserError?.message}</p> : null}
          <Popconfirm placement="bottom" title="Are you sure to block this user forever?" onConfirm={this.onBlockUser} okText="Yes" cancelText="No">
            <BaseButton iconName="cancel" color="error">
              Confirm
            </BaseButton>
          </Popconfirm>
        </Modal>
        <Modal
          title={
            <p>
              Update expired date <span className="font-bold color-primary">#{this.selectedTuQuaTangRow?.data?.code}</span>
            </p>
          }
          open={Boolean(this.selectedTuQuaTangRow)}
          onCancel={() => {
            this.selectedTuQuaTangRow = null;
            this.refresh();
          }}
          onOk={() => {
            this.updateExpiredDateTuQuaTangAPI();
          }}
          okText="Update"
        >
          <DatePicker
            className="w-full"
            disabledDate={(current) => current && current < moment().startOf('day')}
            onChange={(e) => {
              this.updateExpiredDateTuQuaTangValue = e ? e.format() : null;
              if (e) {
                this.selectedTuQuaTangRow = {
                  ...this.selectedTuQuaTangRow,
                  data: {
                    ...this.selectedTuQuaTangRow.data,
                    expiredDate: e.format(),
                  },
                };
                this.refresh();
              }
            }}
            format="DD/MM/YYYY"
            value={moment(new Date(this.selectedTuQuaTangRow?.data?.expiredDate))}
          />
        </Modal>

        {/* Tủ lạnh change */}
        <Modal
          title={
            <p>
              Update expired date <span className="font-bold color-primary">#{this.selectedTuLanhRow?.data?.depositCode}</span>
            </p>
          }
          open={Boolean(this.selectedTuLanhRow)}
          onCancel={() => {
            this.selectedTuLanhRow = null;
            this.refresh();
          }}
          onOk={() => {
            this.updateExpiredDateTuLanhAPI();
          }}
          okText="Update"
        >
          <DatePicker
            className="w-full"
            disabledDate={(current) => current && current < moment().startOf('day')}
            onChange={(e) => {
              this.updateExpiredDateTuLanhValue = e ? e.format() : null;
              if (e) {
                this.selectedTuLanhRow = {
                  ...this.selectedTuLanhRow,
                  data: {
                    ...this.selectedTuLanhRow.data,
                    expiredDate: e.format(),
                  },
                };
                this.refresh();
              }
            }}
            format="DD/MM/YYYY"
            value={moment(new Date(this.selectedTuLanhRow?.data?.expiredDate))}
          />
        </Modal>
      </section>
    );
  };
}
SearchDetail.contextType = AppContext;
