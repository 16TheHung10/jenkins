import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Action from 'components/mainContent/Action';
import { FileHelper } from 'helpers';
import ItemMasterModel from 'models/ItemMasterModel';
import Moment from 'moment';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import React from 'react';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import ItemMasterNav from '../../components/mainContent/itemMaster/nav/ItemMasterNav';
import { Col, Row } from 'antd';
import AppMessage from 'message/reponse.message';
export default class ItemMasterImport extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.importData = [];
    this.itemMasterImports = [];
    this.isValidateSuccess = true;
    this.disabledImport = true;
  }

  componentDidMount() {
    // let curTime = DateHelper.displayFormat(new Date());
    // let startBlockTime = DateHelper.displayDateFormat(new Date()) + ' ' + '9:28:00';
    // let endBlockTime = DateHelper.displayDateFormat(new Date()) + ' ' + '19:30:00';
    // if (new Date().getDay() === 2 || new Date().getDay() === 4) {
    //     document.getElementById('content-updating').style.display = 'none';
    // }
    // else {
    //     document.getElementById('content-updating').style.display = 'none';
    // }
    // if ((Date.parse(startBlockTime) - Date.parse(curTime) <= 0) && (Date.parse(curTime) - Date.parse(endBlockTime) <= 0)) {
    //     document.getElementById('content-updating').style.display = 'block';
    // }
    // else {
    //     document.getElementById('content-updating').style.display = 'none';
    // }
  }
  uploadXlsxFile = (event) => {
    let result = FileHelper.uploadXlsxFile(event, this.finishUploadFile);
    if (!result) {
      this.itemMasterImports = [];
      this.disabledImport = true;
    }
    this.refresh();
  };
  finishUploadFile = (textFile) => {
    this.importData = textFile;
    let itemMasterTemp = [];

    if (this.importData.length > 0) {
      let itemMaster = {};
      for (var i in this.importData) {
        if (Object.keys(this.importData[i]).length === 21) {
          itemMaster = {
            BarCode: this.importData[i].Barcode,
          };
          itemMasterTemp.push(itemMaster);
        } else {
          AppMessage.info('Line ' + (parseInt(i) + 1) + ' do not enough column');
          this.itemMasterImports = [];
          this.disabledImport = true;
          this.refresh();
          return;
        }
      }
    }

    let valueArr = itemMasterTemp
      .filter((item) => item.BarCode !== '')
      .map(function (item) {
        return item.BarCode;
      });
    let isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx;
    });
    this.disabledImport = isDuplicate;
    if (isDuplicate) {
      AppMessage.info('File import duplicate item');
    }
    this.itemMasterImports = [];
    this.refresh();
  };

  handleImportItemsMaster = () => {
    this.itemMasterImports = [];
    this.isValidateSuccess = true;
    if (this.importData.length > 0) {
      let itemMaster = {};
      for (var i in this.importData) {
        let item = this.importData[i];
        console.log({ item });
        itemMaster = {
          BarCode: String(item.Barcode).trim(),
          InternalCode: '',
          Name: item.Name,
          SupplierCode: item.SupplierCode,
          Unit: item.Unit.trim(),
          VATInput: item.VATInput,
          VATOutput: item.VATOutput,
          CostPrice: item.CostPrice,
          WholesalePrice: item.SellingPrice,
          SalePrice: item.SellingPrice,
          QuantityInventoryMax: 99999,
          QuantityInventoryMin: 1,
          SubClassCode: String(item.SubCateCode).trim(),
          IsTempCode: 'FALSE',
          IsAllowEntryOrder: 'TRUE',
          IsSold: 'TRUE',
          IsCalculateInventory: 'TRUE',
          QuantityOrderMax: 99999,
          QuantityOrderMin: item.MOQWH,
          ArithmeticProgression: item.MOQStore,
          IsAllowPayingBack: 'TRUE',
          PayingBackDay: item.ReturnGoodsTerm,
          IsReturnSupplier: item.AllowReturnSupplier === 'Y' ? 'TRUE' : 'FALSE',
          SupplierRegionCode: String(item.DeliveryBy).trim(),
          F1: Moment(item.FirstOrderDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          F2: Moment(item.FirstSalesDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          F3: item.SelfDeclaration,
          F4: String(item.Preserved).replace(/\s/g, ''),
          F5: String(item.ExpiryDate).replace(/\s/g, ''),
          F6: item.OriginOfGoods?.trim(),
          F7: item.DistributionAddress?.toString().trim(),
        };
        this.itemMasterImports.push(itemMaster);
      }
      this.refresh();
    }
  };

  handleSave = () => {
    if (this.itemMasterImports.length > 0) {
      if (this.itemMasterImports.filter((i) => i.IsValidateNameLength === false).length > 0) {
        AppMessage.info('Tên Item tối đa 60 ký tự');
        return;
      }
      if (this.itemMasterImports.filter((i) => i.IsValidateSelfDeclarationLength === false).length > 0) {
        AppMessage.info('Self Declaration tối đa 50 ký tự');
        return;
      }
      if (this.itemMasterImports.filter((i) => i.IsValidatePreservedLength === false).length > 0) {
        AppMessage.info('Preserved không đúng định dạng');
        return;
      }
      if (this.itemMasterImports.filter((i) => i.IsValidateExpiryDateLength === false).length > 0) {
        AppMessage.info('Expiry Date không đúng định dạng');
        return;
      }
      if (this.itemMasterImports.filter((i) => i.IsValidate === false).length > 0) {
        AppMessage.info('Import file invalid');
        return;
      }
      let model = new ItemMasterModel();
      model
        .importIM({
          ItemMasterImports: this.itemMasterImports,
        })
        .then((response) => {
          if (response.status && response.status == 1) {
            AppMessage.info('Import successfully!', 'success');
          } else {
            AppMessage.info(response.message);
          }
          this.refresh();
        });
    } else {
      AppMessage.info('Import file invalid');
    }
  };

  convertBoolToString = (value) => {
    switch (value) {
      case 'FALSE':
        return 'N';
      case 'TRUE':
        return 'Y';
      default:
        return value;
    }
  };
  validateName(value) {
    if (value.length > 60) {
      return false;
    }
    return true;
  }
  validateSelfDeclaration(value) {
    if (value.length > 50) {
      return false;
    }
    return true;
  }
  validatePreserved(value) {
    let reg = new RegExp('^-?\\d+,-?\\d+$');
    if (!reg.test(value)) {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  }
  validateExpiryDate(value) {
    let reg = new RegExp('^\\d+$');
    if (!reg.test(value) && value !== '') {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  }
  validateDate(value, format = '') {
    if (Moment(value, format).format(format) === 'Invalid date') {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  }
  validatePrice(value) {
    let reg = new RegExp('^([0-9]*[.])?[0-9]+$');
    if (!reg.test(value)) {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  }

  validateNumber(value) {
    let reg = new RegExp('^([0-9]*[.])?[0-9]+$');
    if (!reg.test(value) || value === '') {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  }

  validateBarcode(value) {
    let reg = new RegExp('^(\\s*|\\d+)+$');
    if (!reg.test(value)) {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  }

  validateBoolean = (value) => {
    let reg = new RegExp('[YES]|[NO]+$');
    if (!reg.test(value)) {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Save',
        actionType: 'info',
        action: this.handleSave,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    let originOfGoodOptions = [
      { value: 'Afghanistan', label: 'Afghanistan' },
      { value: 'land Islands', label: 'land Islands' },
      { value: 'Albania', label: 'Albania' },
      { value: 'Algeria', label: 'Algeria' },
      { value: 'American Samoa', label: 'American Samoa' },
      { value: 'AndorrA', label: 'AndorrA' },
      { value: 'Angola', label: 'Angola' },
      { value: 'Anguilla', label: 'Anguilla' },
      { value: 'Antarctica', label: 'Antarctica' },
      { value: 'Antigua and Barbuda', label: 'Antigua and Barbuda' },
      { value: 'Argentina', label: 'Argentina' },
      { value: 'Armenia', label: 'Armenia' },
      { value: 'Aruba', label: 'Aruba' },
      { value: 'Australia', label: 'Australia' },
      { value: 'Austria', label: 'Austria' },
      { value: 'Azerbaijan', label: 'Azerbaijan' },
      { value: 'Bahamas', label: 'Bahamas' },
      { value: 'Bahrain', label: 'Bahrain' },
      { value: 'Bangladesh', label: 'Bangladesh' },
      { value: 'Barbados', label: 'Barbados' },
      { value: 'Belarus', label: 'Belarus' },
      { value: 'Belgium', label: 'Belgium' },
      { value: 'Belize', label: 'Belize' },
      { value: 'Benin', label: 'Benin' },
      { value: 'Bermuda', label: 'Bermuda' },
      { value: 'Bhutan', label: 'Bhutan' },
      { value: 'Bolivia', label: 'Bolivia' },
      { value: 'Bosnia and Herzegovina', label: 'Bosnia and Herzegovina' },
      { value: 'Botswana', label: 'Botswana' },
      { value: 'Bouvet Island', label: 'Bouvet Island' },
      { value: 'Brazil', label: 'Brazil' },
      {
        value: 'British Indian Ocean Territory',
        label: 'British Indian Ocean Territory',
      },
      { value: 'Brunei Darussalam', label: 'Brunei Darussalam' },
      { value: 'Bulgaria', label: 'Bulgaria' },
      { value: 'Burkina Faso', label: 'Burkina Faso' },
      { value: 'Burundi', label: 'Burundi' },
      { value: 'Cambodia', label: 'Cambodia' },
      { value: 'Cameroon', label: 'Cameroon' },
      { value: 'Canada', label: 'Canada' },
      { value: 'Cape Verde', label: 'Cape Verde' },
      { value: 'Cayman Islands', label: 'Cayman Islands' },
      { value: 'Central African Republic', label: 'Central African Republic' },
      { value: 'Chad', label: 'Chad' },
      { value: 'Chile', label: 'Chile' },
      { value: 'China', label: 'China' },
      { value: 'Christmas Island', label: 'Christmas Island' },
      { value: 'Cocos (Keeling) Islands', label: 'Cocos (Keeling) Islands' },
      { value: 'Colombia', label: 'Colombia' },
      { value: 'Comoros', label: 'Comoros' },
      { value: 'Congo', label: 'Congo' },
      { value: 'Cook Islands', label: 'Cook Islands' },
      { value: 'Costa Rica', label: 'Costa Rica' },
      { value: 'Cote Ivoire', label: 'Cote Ivoire' },
      { value: 'Croatia', label: 'Croatia' },
      { value: 'Cuba', label: 'Cuba' },
      { value: 'Cyprus', label: 'Cyprus' },
      { value: 'Czech Republic', label: 'Czech Republic' },
      { value: 'Denmark', label: 'Denmark' },
      { value: 'Djibouti', label: 'Djibouti' },
      { value: 'Dominica', label: 'Dominica' },
      { value: 'Dominican Republic', label: 'Dominican Republic' },
      { value: 'Ecuador', label: 'Ecuador' },
      { value: 'Egypt', label: 'Egypt' },
      { value: 'El Salvador', label: 'El Salvador' },
      { value: 'Equatorial Guinea', label: 'Equatorial Guinea' },
      { value: 'Eritrea', label: 'Eritrea' },
      { value: 'Estonia', label: 'Estonia' },
      { value: 'Ethiopia', label: 'Ethiopia' },
      { value: 'Falkland Islands', label: 'Falkland Islands' },
      { value: 'Faroe Islands', label: 'Faroe Islands' },
      { value: 'Fiji', label: 'Fiji' },
      { value: 'Finland', label: 'Finland' },
      { value: 'France', label: 'France' },
      { value: 'French Guiana', label: 'French Guiana' },
      { value: 'French Polynesia', label: 'PF' },
      {
        value: 'French Southern Territories',
        label: 'French Southern Territories',
      },
      { value: 'Gabon', label: 'Gabon' },
      { value: 'Gambia', label: 'Gambia' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Germany', label: 'Germany' },
      { value: 'Ghana', label: 'Ghana' },
      { value: 'Gibraltar', label: 'Gibraltar' },
      { value: 'Greece', label: 'Greece' },
      { value: 'Greenland', label: 'Greenland' },
      { value: 'Grenada', label: 'Grenada' },
      { value: 'Guadeloupe', label: 'Guadeloupe' },
      { value: 'Guam', label: 'Guam' },
      { value: 'Guatemala', label: 'Guatemala' },
      { value: 'Guernsey', label: 'Guernsey' },
      { value: 'Guinea', label: 'Guinea' },
      { value: 'Guinea-Bissau', label: 'Guinea-Bissau' },
      { value: 'Guyana', label: 'Guyana' },
      { value: 'Haiti', label: 'Haiti' },
      {
        value: 'Heard Island and Mcdonald Islands',
        label: 'Heard Island and Mcdonald Islands',
      },
      { value: 'Holy See', label: 'Holy See' },
      { value: 'Honduras', label: 'Honduras' },
      { value: 'Hong Kong', label: 'Hong Kong' },
      { value: 'Hungary', label: 'Hungary' },
      { value: 'Iceland', label: 'Iceland' },
      { value: 'India', label: 'India' },
      { value: 'Indonesia', label: 'Indonesia' },
      { value: 'Iran', label: 'Iran' },
      { value: 'Iraq', label: 'Iraq' },
      { value: 'Ireland', label: 'Ireland' },
      { value: 'Isle of Man', label: 'Isle of Man' },
      { value: 'Israel', label: 'Israel' },
      { value: 'Italy', label: 'Italy' },
      { value: 'Jamaica', label: 'Jamaica' },
      { value: 'Japan', label: 'Japan' },
      { value: 'Jersey', label: 'Jersey' },
      { value: 'Jordan', label: 'Jordan' },
      { value: 'Kazakhstan', label: 'Kazakhstan' },
      { value: 'Kenya', label: 'Kenya' },
      { value: 'Kiribati', label: 'Kiribati' },
      { value: 'Korea', label: 'Korea' },
      { value: 'Kuwait', label: 'Kuwait' },
      { value: 'Kyrgyzstan', label: 'Kyrgyzstan' },
      { value: 'Laos', label: 'Laos' },
      { value: 'Latvia', label: 'Latvia' },
      { value: 'Lebanon', label: 'Lebanon' },
      { value: 'Lesotho', label: 'Lesotho' },
      { value: 'Liberia', label: 'Liberia' },
      { value: 'Libyan Arab Jamahiriya', label: 'Libyan Arab Jamahiriya' },
      { value: 'Liechtenstein', label: 'Liechtenstein' },
      { value: 'Lithuania', label: 'Lithuania' },
      { value: 'Luxembourg', label: 'Luxembourg' },
      { value: 'Macao', label: 'Macao' },
      { value: 'Macedonia', label: 'Macedonia' },
      { value: 'Madagascar', label: 'Madagascar' },
      { value: 'Malawi', label: 'Malawi' },
      { value: 'Malaysia', label: 'Malaysia' },
      { value: 'Maldives', label: 'Maldives' },
      { value: 'Mali', label: 'Mali' },
      { value: 'Malta', label: 'Malta' },
      { value: 'Marshall Islands', label: 'Marshall Islands' },
      { value: 'Martinique', label: 'Martinique' },
      { value: 'Mauritania', label: 'Mauritania' },
      { value: 'Mauritius', label: 'Mauritius' },
      { value: 'Mayotte', label: 'Mayotte' },
      { value: 'Mexico', label: 'Mexico' },
      { value: 'Micronesia', label: 'Micronesia' },
      { value: 'Moldova', label: 'Moldova' },
      { value: 'Monaco', label: 'Monaco' },
      { value: 'Mongolia', label: 'Mongolia' },
      { value: 'Montenegro', label: 'Montenegro' },
      { value: 'Montserrat', label: 'Montserrat' },
      { value: 'Morocco', label: 'Morocco' },
      { value: 'Mozambique', label: 'Mozambique' },
      { value: 'Myanmar', label: 'Myanmar' },
      { value: 'Namibia', label: 'Namibia' },
      { value: 'Nauru', label: 'Nauru' },
      { value: 'Nepal', label: 'Nepal' },
      { value: 'Netherlands', label: 'Netherlands' },
      { value: 'Netherlands Antilles', label: 'Netherlands Antilles' },
      { value: 'New Caledonia', label: 'New Caledonia' },
      { value: 'New Zealand', label: 'New Zealand' },
      { value: 'Nicaragua', label: 'Nicaragua' },
      { value: 'Niger', label: 'Niger' },
      { value: 'Nigeria', label: 'Nigeria' },
      { value: 'Niue', label: 'Niue' },
      { value: 'Norfolk Island', label: 'Norfolk Island' },
      { value: 'Northern Mariana Islands', label: 'Northern Mariana Islands' },
      { value: 'Norway', label: 'Norway' },
      { value: 'Oman', label: 'Oman' },
      { value: 'Pakistan', label: 'Pakistan' },
      { value: 'Palau', label: 'Palau' },
      { value: 'Palestinian', label: 'Palestinian' },
      { value: 'Panama', label: 'Panama' },
      { value: 'Papua New Guinea', label: 'Papua New Guinea' },
      { value: 'Paraguay', label: 'Paraguay' },
      { value: 'Peru', label: 'Peru' },
      { value: 'Philippines', label: 'Philippines' },
      { value: 'Pitcairn', label: 'Pitcairn' },
      { value: 'Poland', label: 'Poland' },
      { value: 'Portugal', label: 'Portugal' },
      { value: 'Puerto Rico', label: 'Puerto Rico' },
      { value: 'Qatar', label: 'Qatar' },
      { value: 'Reunion', label: 'Reunion' },
      { value: 'Romania', label: 'Romania' },
      { value: 'Russian Federation', label: 'Russian Federation' },
      { value: 'RWANDA', label: 'RWANDA' },
      { value: 'Saint Helena', label: 'Saint Helena' },
      { value: 'Saint Kitts and Nevis', label: 'Saint Kitts and Nevis' },
      { value: 'Saint Lucia', label: 'Saint Lucia' },
      {
        value: 'Saint Pierre and Miquelon',
        label: 'Saint Pierre and Miquelon',
      },
      {
        value: 'Saint Vincent and the Grenadines',
        label: 'Saint Vincent and the Grenadines',
      },
      { value: 'Samoa', label: 'Samoa' },
      { value: 'San Marino', label: 'San Marino' },
      { value: 'Sao Tome and Principe', label: 'Sao Tome and Principe' },
      { value: 'Saudi Arabia', label: 'Saudi Arabia' },
      { value: 'Senegal', label: 'Senegal' },
      { value: 'Serbia', label: 'Serbia' },
      { value: 'Seychelles', label: 'Seychelles' },
      { value: 'Sierra Leone', label: 'Sierra Leone' },
      { value: 'Singapore', label: 'Singapore' },
      { value: 'Slovakia', label: 'Slovakia' },
      { value: 'Slovenia', label: 'Slovenia' },
      { value: 'Solomon Islands', label: 'Solomon Islands' },
      { value: 'Somalia', label: 'Somalia' },
      { value: 'South Africa', label: 'South Africa' },
      {
        value: 'South Georgia and the South Sandwich Islands',
        label: 'South Georgia and the South Sandwich Islands',
      },
      { value: 'Spain', label: 'Spain' },
      { value: 'Sri Lanka', label: 'Sri Lanka' },
      { value: 'Sudan', label: 'Sudan' },
      { value: 'Suriname', label: 'Suriname' },
      { value: 'Svalbard and Jan Mayen', label: 'Svalbard and Jan Mayen' },
      { value: 'Swaziland', label: 'Swaziland' },
      { value: 'Sweden', label: 'Sweden' },
      { value: 'Switzerland', label: 'Switzerland' },
      { value: 'Syrian Arab Republic', label: 'Syrian Arab Republic' },
      { value: 'Taiwan', label: 'Taiwan' },
      { value: 'Tajikistan', label: 'Tajikistan' },
      { value: 'Tanzania', label: 'Tanzania' },
      { value: 'Thailand', label: 'Thailand' },
      { value: 'TimorLeste', label: 'TimorLeste' },
      { value: 'Togo', label: 'Togo' },
      { value: 'Tokelau', label: 'Tokelau' },
      { value: 'Tonga', label: 'Tonga' },
      { value: 'Trinidad and Tobago', label: 'Trinidad and Tobago' },
      { value: 'Tunisia', label: 'Tunisia' },
      { value: 'Turkey', label: 'Turkey' },
      { value: 'Turkmenistan', label: 'Turkmenistan' },
      { value: 'Turks and Caicos Islands', label: 'Turks and Caicos Islands' },
      { value: 'Tuvalu', label: 'Tuvalu' },
      { value: 'Uganda', label: 'Uganda' },
      { value: 'Ukraine', label: 'Ukraine' },
      { value: 'United Arab Emirates', label: 'United Arab Emirates' },
      { value: 'United Kingdom', label: 'United Kingdom' },
      { value: 'United States', label: 'United States' },
      {
        value: 'United States Minor Outlying Islands',
        label: 'United States Minor Outlying Islands',
      },
      { value: 'Uruguay', label: 'Uruguay' },
      { value: 'Uzbekistan', label: 'Uzbekistan' },
      { value: 'Vanuatu', label: 'Vanuatu' },
      { value: 'Venezuela', label: 'Venezuela' },
      { value: 'Viet Nam', label: 'Viet Nam' },
      { value: 'British', label: 'British' },
      { value: 'Wallis and Futuna', label: 'Wallis and Futuna' },
      { value: 'Western Sahara', label: 'Western Sahara' },
      { value: 'Yemen', label: 'Yemen' },
      { value: 'Zambia', label: 'Zambia' },
      { value: 'Zimbabwe', label: 'Zimbabwe' },
    ];
    let validateOrigin = (value) => {
      if (originOfGoodOptions.some((i) => i.value == value)) {
        return true;
      }
      return false;
    };
    for (let i in this.itemMasterImports) {
      this.itemMasterImports[i]['IsValidate'] =
        this.validateNumber(this.itemMasterImports[i].SupplierCode) &&
        this.validateBarcode(this.itemMasterImports[i].BarCode) &&
        this.validateNumber(this.itemMasterImports[i].VATInput) &&
        this.validateNumber(this.itemMasterImports[i].VATOutput) &&
        this.validateNumber(this.itemMasterImports[i].CostPrice) &&
        this.validateNumber(this.itemMasterImports[i].SalePrice) &&
        this.validateNumber(this.itemMasterImports[i].SubClassCode) &&
        this.validateNumber(this.itemMasterImports[i].QuantityOrderMin) &&
        this.validateNumber(this.itemMasterImports[i].ArithmeticProgression) &&
        this.validateNumber(this.itemMasterImports[i].PayingBackDay) &&
        this.validateBoolean(this.itemMasterImports[i].IsReturnSupplier) &&
        this.validateDate(this.itemMasterImports[i].F1, 'YYYY-MM-DD') &&
        this.validateDate(this.itemMasterImports[i].F2, 'YYYY-MM-DD') &&
        validateOrigin(this.itemMasterImports[i].F6);
      this.itemMasterImports[i]['IsValidateNameLength'] = this.validateName(this.itemMasterImports[i].Name);
      this.itemMasterImports[i]['IsValidateSelfDeclarationLength'] = this.validateSelfDeclaration(
        this.itemMasterImports[i].F3
      );
      this.itemMasterImports[i]['IsValidatePreservedLength'] = this.validatePreserved(this.itemMasterImports[i].F4);
      this.itemMasterImports[i]['IsValidateExpiryDateLength'] = this.validateExpiryDate(this.itemMasterImports[i].F5);
    }
    return (
      <ItemMasterNav>
        <div className="section-block mt-15">
          <div className="container-table">
            {this.renderAlert()}
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div className="form-group">
                  <label className="w100pc">
                    <span style={{ paddingRight: 10 }}>File xls:</span>
                    <a
                      title="Download file xls"
                      href="https://api.gs25.com.vn:8091/storemanagement/share/template/itemMaster/ItemMaster.xls"
                      target="_blank"
                    >
                      <FontAwesomeIcon icon={faQuestionCircle} />
                      Download File xls
                    </a>
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-file"
                    id={this.idImport}
                    onChange={(e) => this.uploadXlsxFile(e)}
                    accept=".xls"
                  />
                </div>
              </Col>
              <Col span={6} style={{ alignSelf: 'center' }}>
                <div className=" flex items-center gap-10">
                  <BaseButton
                    iconName="export"
                    color="green"
                    disabled={this.disabledImport}
                    onClick={this.handleImportItemsMaster}
                  >
                    Import
                  </BaseButton>
                  <BaseButton iconName="send" disabled={this.disabledImport} onClick={this.handleSave}>
                    Save
                  </BaseButton>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-note cl-red">
                  <p style={{ margin: 0 }}>Name: Tối đa 60 ký tự </p>
                  <p style={{ margin: 0 }}>New item của kho mặc định 14 ngày mới đc order </p>
                  <p style={{ margin: 0 }}>New item sau khi tạo qua ngày mới được apply </p>
                  <p style={{ margin: 0 }}>Màu đỏ: thông tin bị lỗi format </p>
                </div>
              </Col>
              <Col span={24}>
                <div className="wrap-table htable" style={{ maxHeight: 'calc(100vh - 205px)' }}>
                  <table className="table table-hover detail-search-rcv" style={{ fontSize: 11 }}>
                    <thead>
                      <tr>
                        <th className="w10">No.</th>
                        <th className="text-center">
                          Suppler <br /> Code
                        </th>
                        <th>BarCode</th>
                        {/* <th className='text-center'>Internal <br /> Code</th> */}
                        <th>Name</th>
                        <th>Unit</th>
                        <th className="text-center">VAT Input</th>
                        <th className="text-center">VAT Output</th>
                        <th className="text-center">
                          Cost <br /> Price
                        </th>
                        <th className="text-center">
                          Selling
                          <br /> Price
                        </th>
                        <th className="text-center">
                          Sub <br /> Category <br /> Code
                        </th>
                        <th className="text-center">MOQ WH</th>
                        <th className="text-center">MOQ Store</th>
                        {/* <th className='text-center'>Allow <br /> Return</th> */}
                        <th className="text-center">
                          Return <br />
                          Goods <br />
                          Term
                        </th>
                        <th className="text-center">
                          Return <br /> Supplier
                        </th>
                        <th className="text-center">
                          Delivery <br /> By
                        </th>
                        <th className="text-center">First Order Date</th>
                        <th className="text-center">FirstSalesDate</th>
                        <th className="text-center">Self Declaration</th>
                        <th className="text-center">Preserved</th>
                        <th className="text-center">
                          Expiry Date
                          <br />
                          (ngày)
                        </th>
                        <th className="text-center">
                          Origin <br />
                          Of <br />
                          Goods
                        </th>
                        <th>Distribution address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.itemMasterImports.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td
                            style={{
                              color: this.validateNumber(item.SupplierCode) ? '' : 'red',
                            }}
                          >
                            {item.SupplierCode}
                          </td>
                          <td
                            style={{
                              color: this.validateBarcode(item.BarCode) ? '' : 'red',
                            }}
                          >
                            {item.BarCode}
                          </td>
                          {/* <td>{item.InternalCode}</td> */}
                          <td>
                            <p
                              style={{
                                margin: 0,
                                width: 150,
                                color: this.validateName(item.Name) ? '' : 'red',
                              }}
                            >
                              {item.Name}
                            </p>
                          </td>
                          <td>{item.Unit}</td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateNumber(item.VATInput) ? '' : 'red',
                            }}
                          >
                            {item.VATInput}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateNumber(item.VATOutput) ? '' : 'red',
                            }}
                          >
                            {item.VATOutput}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateNumber(item.CostPrice) ? '' : 'red',
                            }}
                          >
                            {item.CostPrice}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateNumber(item.SalePrice) ? '' : 'red',
                            }}
                          >
                            {item.SalePrice}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateNumber(item.SubClassCode) ? '' : 'red',
                            }}
                          >
                            {item.SubClassCode}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateNumber(item.QuantityOrderMin) ? '' : 'red',
                            }}
                          >
                            {item.QuantityOrderMin}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateNumber(item.ArithmeticProgression) ? '' : 'red',
                            }}
                          >
                            {item.ArithmeticProgression}
                          </td>
                          {/* <td className='text-center' style={{ color: this.validateBoolean(item.IsAllowPayingBack) ? "" : "red" }}>{this.convertBoolToString(item.IsAllowPayingBack)}</td> */}
                          <td
                            className="text-center"
                            style={{
                              color: this.validateNumber(item.PayingBackDay) ? '' : 'red',
                            }}
                          >
                            {item.PayingBackDay == 0 ? 'No return' : item.PayingBackDay}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateBoolean(item.IsReturnSupplier) ? '' : 'red',
                            }}
                          >
                            {this.convertBoolToString(item.IsReturnSupplier)}
                          </td>
                          <td className="text-center">{item.SupplierRegionCode}</td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateDate(item.F1, 'YYYY-MM-DD') ? '' : 'red',
                            }}
                          >
                            {Moment(item.F1).format('DD/MM/YYYY')}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateDate(item.F2, 'YYYY-MM-DD') ? '' : 'red',
                            }}
                          >
                            {Moment(item.F2).format('DD/MM/YYYY')}
                          </td>
                          <td
                            style={{
                              color: this.validateSelfDeclaration(item.F3) ? '' : 'red',
                            }}
                          >
                            {item.F3}
                          </td>
                          <td
                            style={{
                              color: this.validatePreserved(item.F4) ? '' : 'red',
                            }}
                          >
                            {item.F4}
                          </td>
                          <td
                            style={{
                              color: this.validateExpiryDate(item.F5) ? '' : 'red',
                            }}
                          >
                            {item.F5}
                          </td>
                          <td
                            style={{
                              color: validateOrigin(item.F6) ? '' : 'red',
                            }}
                          >
                            {item.F6}
                          </td>
                          <td
                            style={{
                              color: item.F7?.length > 0 ? '' : 'red',
                            }}
                          >
                            {item.F7}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* {this.importData.length !== 0 ? (
                                            <div style={{ textAlign: "center", height: 'calc(100vh - 540px)' }}>
                                                <Paging
                                                    page={this.fieldSelected.pageNumber}
                                                    onClickPaging={this.handleClickPaging}
                                                    onClickSearch={this.handleGetStores}
                                                    itemCount={this.itemCount}
                                                    listItemLength={stores.length}
                                                />
                                            </div>
                                        ) : ""} */}
              </Col>
            </Row>
          </div>
        </div>
      </ItemMasterNav>
    );
  }
}
