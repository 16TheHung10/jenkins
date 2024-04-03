import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { increaseDate } from 'helpers/FuncHelper';
import BaseComponent from 'components/BaseComponent';
export default class ControlIMDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.im = this.props.im || {};
    // this.isUpdateForm = (this.im.orderCode || "") !== "";
    this.isCreate = true;
    //Default data
    this.data.units = this.props.units || [];
    this.data.suppliers = this.props.suppliers || {};
    this.data.groups = this.props.groups || {};

    this.data.categorySubClasses = this.props.categorySubClasses || {};
    this.data.divisions = this.props.divisions || {};

    this.data.typeOpt = [
      { label: 'Normal', value: 0 },
      { label: 'Item Convert', value: 1 },
      { label: 'Item FF', value: 2 },
      //{ label: "Convert", value: 1 }, { label: "Combine", value: 2 }
    ];

    this.fieldSelected = this.assignFieldSelected({
      imageBinary: '',
      vatInput: '',
      vatOutput: '',
    });
    this.isRender = true;
  }
  getImageBinary = () => {
    return this.fieldSelected.imageBinary;
  };
  componentDidMount() {
    //    this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    let isIOChange = this.im !== newProps.im;
    if (isIOChange) {
      this.im = newProps.im;
      this.isCreate = (newProps.im.barCode || '') === '';
      this.fieldSelected.vatInput = newProps.im.vatInputType === 1 ? -1 : this.im.vatInput;
      this.fieldSelected.vatOutput = newProps.im.vatOutputType === 1 ? -1 : this.im.vatOutput;
    }
    if (this.data.suppliers !== newProps.suppliers) {
      this.data.suppliers = newProps.suppliers;
    }
    if (this.data.units !== newProps.units) {
      this.data.units = newProps.units;
    }
    if (this.data.divisions !== newProps.divisions) {
      this.data.divisions = newProps.divisions;
    }
    if (this.data.groups !== newProps.groups) {
      this.data.groups = newProps.groups;
    }
    if (this.data.categorySubClasses !== newProps.categorySubClasses) {
      this.data.categorySubClasses = newProps.categorySubClasses;
    }
    this.refresh();
  }

  convertSubClassToDic(subClasses) {
    let ret = {};
    for (var item in subClasses) {
      let itemType = subClasses[item].itemType;
      if (!ret[itemType]) {
        ret[itemType] = [];
      }
      ret[itemType].push(subClasses[item]);
    }
    return ret;
  }

  calValidQtyMOQ = (qty, moq) => {
    if (moq == 0) {
      return qty;
    }
    while (qty % moq != 0 && qty < 99999) {
      qty++;
    }

    if (qty == 99999) {
      qty = moq;
    }
    return qty;
  };

  findFilterItemOptions(name, keyOption) {
    switch (name) {
      case 'group':
        if (keyOption !== undefined && keyOption !== '') {
          let groupKeys = Object.keys(this.data.groups);

          if (groupKeys.length && this.data.groups !== undefined) {
            let groupsDic = {};
            for (var key in groupKeys) {
              let itemKey = groupKeys[key];

              if (groupsDic[this.data.groups[itemKey]['divisionCode']] === undefined) {
                groupsDic[this.data.groups[itemKey]['divisionCode']] = [];
              }
              groupsDic[this.data.groups[itemKey]['divisionCode']].push(this.data.groups[itemKey]);
            }
            this.data.groups = groupsDic;
          }
          return this.data.groups[keyOption] || [];
        } else {
          return Object.values(this.data.groups);
        }

      case 'subClass':
        if (keyOption !== undefined && keyOption !== '') {
          let groupKeys = Object.keys(this.data.categorySubClasses);

          if (groupKeys.length && this.data.categorySubClasses !== undefined) {
            let groupsSubClass = {};
            for (var keys in groupKeys) {
              let itemKey = groupKeys[keys];

              if (groupsSubClass[this.data.categorySubClasses[itemKey]['groupCode']] === undefined) {
                groupsSubClass[this.data.categorySubClasses[itemKey]['groupCode']] = [];
              }
              groupsSubClass[this.data.categorySubClasses[itemKey]['groupCode']].push(
                this.data.categorySubClasses[itemKey]
              );
            }
            this.data.categorySubClasses = groupsSubClass;
          }
          return this.data.categorySubClasses[keyOption] || [];
        } else {
          return Object.values(this.data.categorySubClasses);
        }

      default:
        break;
    }
  }

  // renderStatus(){
  //   if(this.isUpdateForm){

  //       if(this.im.orderCode === undefined){
  //         return (
  // 			<span className="label label-danger">Invalid</span>
  // 		)
  //       } else if(this.im.approved){
  //         return (
  // 			<span className="label label-success">Approved</span>
  // 		)
  //       } else if(this.im.canceled){
  //         return (
  // 			<span className="label label-danger">Deleted</span>
  // 		)
  //       } else if(!this.im.canceled && !this.im.approved){
  //         return (
  // 			<span className="label label-warning">Processing</span>
  // 		)
  // 	  }
  //   }

  //   return "";
  // }

  renderComp() {
    let subClassOptions = [];

    let unitOptions = this.data.units.map((key) => {
      return { value: key.unitName, label: key.unitName };
    });

    let suppliers = Object.values(this.data.suppliers);
    let supplierOptions = suppliers.map((item) => {
      return { value: item.supplierCode, label: item.supplierName };
    });

    let divisions = Object.values(this.data.divisions);
    let divisionOpt = divisions.map((item) => {
      return { value: item.divisionCode, label: item.divisionName };
    });

    let groups = this.findFilterItemOptions('group', this.props.division);
    let groupsOptions = groups.map((item) => {
      return { value: item.groupCode, label: item.groupName };
    });

    let subClasss = this.findFilterItemOptions('subClass', this.props.group);
    let subClassOpt = subClasss.map((item) => {
      return { value: item.subClassCode, label: item.subClassName };
    });
    let vatInputOpt = [
      { value: 0, label: '0%' },
      { value: 5, label: '5%' },
      { value: 8, label: '8%' },
      { value: 10, label: '10%' },
      { value: -1, label: '0% - No tax' },
    ];
    let vatOutputOpt = [
      { value: 0, label: '0%' },
      { value: 5, label: '5%' },
      { value: 8, label: '8%' },
      { value: 10, label: '10%' },
      { value: -1, label: '0% - No tax' },
    ];
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
      { value: 'Scotland', label: 'Scotland' },
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
    return (
      <section>
        <div className="form-filter">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="barCode" className="w100pc">
                      Barcode:
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="barCode"
                      placeholder="-- Barcode --"
                      value={this.props.barCode || ''}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'barCode',
                          e ? e.target.value : '',
                          this.props.changeField('barCode', e ? e.target.value : '')
                        )
                      }
                      className="form-control"
                      disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      Name:(Max length 60 character)
                    </label>
                    <input
                      maxLength={60}
                      type="text"
                      autoComplete="off"
                      name="itemName"
                      placeholder="-- Item name --"
                      value={this.props.itemName}
                      onChange={(e) =>
                        this.handleChangeFieldCustom('itemName', e ? e.target.value : '', () => {
                          if (e.target.value.length > 60) {
                            this.showAlert('Item name must be smaller than 60 character');
                          }
                          this.props.changeField('itemName', e ? e.target.value : '');
                        })
                      }
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="unit" className="w100pc">
                      Unit:
                    </label>
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={unitOptions.filter((option) => option.value === this.props.unit)}
                      options={unitOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'unit',
                          e ? e.value : '',
                          this.props.changeField('unit', e ? e.value : '')
                        )
                      }
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="supplier" className="w100pc">
                      Supplier:
                    </label>
                    <Select
                      // isDisabled={ supplierOptions.length === 1 }

                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={supplierOptions.filter((option) => option.value === this.props.supplier)}
                      options={supplierOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'supplier',
                          e ? e.value : '',
                          this.props.changeField('supplier', e ? e.value : '')
                        )
                      }
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="supplier" className="w100pc">
                      Origin of goods:
                    </label>
                    <Select
                      // isDisabled={ supplierOptions.length === 1 }

                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={originOfGoodOptions.filter((option) => option.value === this.props.originOfGoods)}
                      options={originOfGoodOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'originOfGoods',
                          e ? e.value : '',
                          this.props.changeField('originOfGoods', e ? e.value : '')
                        )
                      }
                    />
                    {/* <input
                                            maxLength={20}
                                            type="text"
                                            autoComplete="off"
                                            name="originOfGoods"
                                            placeholder="-- Origin --"
                                            value={this.props.originOfGoods}
                                            onChange={(e) => this.handleChangeFieldCustom('originOfGoods', e ? e.target.value : '', this.props.changeField('originOfGoods', e ? e.target.value : ''))}
                                            className="form-control"
                                        // disabled={this.isCreate ? false : true}
                                        /> */}
                  </div>
                </div>
                {/* <div className="col-md-1">
                                    <div className="form-group">
                                        <label htmlFor="PLU" className="">PLU: </label>
                                        <input type="checkbox"
                                            style={{ marginLeft: "5px" }}
                                            name="plu"
                                            checked={this.props.plu}
                                            value={this.props.plu}
                                            onChange={(e) => this.handleChangeFieldCustom("plu", e.target.value == 'false', this.props.changeField('plu', e.target.value == 'false'))}
                                        />
                                    </div>
                                </div> */}
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="division" className="w100pc">
                      Division:
                    </label>
                    <Select
                      // isDisabled={ divisionOptions.length === 1 }

                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={divisionOpt.filter((option) => option.value === this.props.division)}
                      options={divisionOpt}
                      onChange={(e) =>
                        this.handleChangeFieldCustom('division', e ? e.value : '', () => {
                          this.props.changeField('division', e ? e.value : '');
                          this.props.changeField('group', '');
                          this.props.changeField('subClass', '');
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="group" className="w100pc">
                      Category:
                    </label>
                    <Select
                      // isDisabled={ groupOptions.length === 1 }

                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={groupsOptions.filter((option) => option.value === this.props.group)}
                      options={groupsOptions}
                      onChange={(e) =>
                        this.handleChangeFieldCustom('group', e ? e.value : '', () => {
                          this.props.changeField('group', e ? e.value : '');
                          this.props.changeField('subClass', '');
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="subClass" className="w100pc">
                      Sub Category:
                    </label>
                    <Select
                      // isDisabled={ subClassOptions.length === 1 }

                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={subClassOpt.filter((option) => option.value === this.props.subClass)}
                      options={subClassOpt}
                      onChange={(e) =>
                        this.handleChangeFieldCustom('subClass', e ? e.value : '', () => {
                          this.props.changeField('subClass', e ? e.value : '');
                        })
                      }
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      VAT input (%):
                    </label>
                    <Select
                      // isDisabled={ subClassOptions.length === 1 }

                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={vatInputOpt.filter((option) => option.value === this.fieldSelected.vatInput)}
                      options={vatInputOpt}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'vatInput',
                          e ? e.value : '',
                          this.props.changeField('vatInput', e ? e.value : '')
                        )
                      }
                    />
                    {/* <input
											type="text"
											autoComplete="off"
											className="form-control"
											name="vatInput"
											value={this.props.vatInput || 0}
											onChange={(e) => {
												var pattern = new RegExp(/^\d*\.?\d*$/);

												if (e.target.value && !pattern.test(e.target.value)) {
													return;
												}

												this.handleChangeFieldCustom("vatInput", e.target.value, this.props.changeField('vatInput', e ? e.target.value : ''));
											}}

										/> */}
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="storeCode" className="w100pc">
                      VAT output (%):
                    </label>
                    <Select
                      // isDisabled={ subClassOptions.length === 1 }

                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={vatOutputOpt.filter((option) => option.value === this.fieldSelected.vatOutput)}
                      options={vatOutputOpt}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'vatOutput',
                          e ? e.value : '',
                          this.props.changeField('vatOutput', e ? e.value : '')
                        )
                      }
                    />
                    {/* <input
											type="text"
											autoComplete="off"
											className="form-control"
											name="vatOutput"
											value={this.props.vatOutput || 0}
											onChange={(e) => {
												var pattern = new RegExp(/^\d*\.?\d*$/);

												if (e.target.value && !pattern.test(e.target.value)) {
													return;
												}

												this.handleChangeFieldCustom("vatOutput", e.target.value, this.props.changeField('vatOutput', e ? e.target.value : ''));
											}}

										/> */}
                  </div>
                </div>
                {this.isCreate && (
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="w100pc">Cost price: (VND)</label>
                      <input
                        maxLength={7}
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        name="costPrice"
                        value={this.props.costPrice || ''}
                        onChange={(e) => {
                          // var pattern = new RegExp(/^[1-9]\d*$/);

                          // if (e.target.value && !pattern.test(e.target.value)) {
                          // 	return;
                          // }

                          this.handleChangeFieldCustom(
                            'costPrice',
                            e.target.value,
                            this.props.changeField('costPrice', e ? e.target.value : '')
                          );
                        }}
                      />
                    </div>
                  </div>
                )}
                {this.isCreate && (
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="w100pc">Selling price: (VND)</label>
                      <input
                        maxLength={7}
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        name="sellingPrice"
                        value={this.props.sellingPrice || ''}
                        onChange={(e) => {
                          // var pattern = new RegExp(/^[1-9]\d*$/);

                          // if (e.target.value && !pattern.test(e.target.value)) {
                          // 	return;
                          // }

                          this.handleChangeFieldCustom(
                            'sellingPrice',
                            e.target.value,
                            this.props.changeField('sellingPrice', e ? e.target.value : '')
                          );
                        }}
                      />
                    </div>
                  </div>
                )}
                {!this.isCreate && (
                  <div className="col-md-2">
                    <div className="form-group">
                      <label htmlFor="type" className="w100pc">
                        Item Type:
                      </label>
                      <Select
                        // isDisabled={ subClassOptions.length === 1 }

                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- All --"
                        value={this.data.typeOpt.filter((option) => option.value === this.props.type)}
                        options={this.data.typeOpt}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            'type',
                            e ? e.value : '',
                            this.props.changeField('type', e ? e.value : '')
                          )
                        }
                      />
                    </div>
                  </div>
                )}
                {/* <div className="col-md-6">
									<div className="form-group">
										<label htmlFor="note" className="w100pc">Note:</label>
										<textarea 
											className="form-control" 
											id="note" 
											name="note" 
											rows="1"
											value={this.props.note}
											onChange={(e) => this.handleChangeFieldCustom("note", e ? e.target.value : '', this.props.changeField('note', e? e.target.value: '')) }
										>
										</textarea>
									</div>
								</div> */}
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="firstOrderDate" className="w100pc">
                      First Order Date:
                    </label>
                    <DatePicker
                      minDate={increaseDate(1)}
                      maxDate={increaseDate(30)}
                      placeholderText="-- First Order --"
                      selected={this.props.firstOrderDate}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'firstOrderDate',
                          e ? e : '',
                          this.props.changeField('firstOrderDate', e ? e : '')
                        )
                      }
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      //isClearable={fields.endDate ? true : false}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="firstSalesDate" className="w100pc">
                      First Sales Date:
                    </label>
                    <DatePicker
                      minDate={increaseDate(1)}
                      maxDate={increaseDate(30)}
                      placeholderText="-- First Sales --"
                      selected={this.props.firstSalesDate}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'firstSalesDate',
                          e,
                          this.props.changeField('firstSalesDate', e ? e : '')
                        )
                      }
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      autoComplete="off"
                      //isClearable={fields.endDate ? true : false}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="w100pc">Image:(Mininum size:600x600px)</label>
                    <input
                      type="file"
                      name="imageUpload"
                      className="form-control form-control-file"
                      onChange={(e) => {
                        this.handleUploadImage(e.target.files, 'imageBinary', 'image');
                      }}
                      accept=".jpg,.png"
                    />
                  </div>
                </div>
                {!this.isCreate && (
                  <div className="col-md-2">
                    <div className="form-group">
                      <a href={this.im.imagePath || '#'} target="_blank">
                        <img
                          alt={this.im.imagePath === '' ? 'Image not found' : this.im.barCode}
                          name="image"
                          src={this.im.imagePath + '?w=35&h=35'}
                          style={{
                            width: '95px',
                            height: '60px',
                            border: '1px solid black',
                          }}
                        />
                      </a>
                    </div>
                  </div>
                )}
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="selfDeclaration" className="w100pc">
                      Self Declaration:
                    </label>
                    <input
                      maxLength={60}
                      type="text"
                      autoComplete="off"
                      name="selfDeclaration"
                      placeholder="-- Self Declaration --"
                      value={this.props.selfDeclaration}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'selfDeclaration',
                          e ? e.target.value : '',
                          this.props.changeField('selfDeclaration', e ? e.target.value : '')
                        )
                      }
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="storageTemp" className="w100pc">
                        Preserved:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <input
                          type="number"
                          autoComplete="off"
                          name="storageTemp1"
                          placeholder="-- Preserved --"
                          value={this.props.storageTemp1}
                          onChange={(e) =>
                            this.handleChangeFieldCustom(
                              'storageTemp1',
                              e ? e.target.value : '',
                              this.props.changeField('storageTemp1', e ? e.target.value : '')
                            )
                          }
                          className="form-control"
                          // disabled={this.isCreate ? false : true}
                        />
                      </div>
                    </div>
                    <div className="col-md-1">
                      <label htmlFor="to" className="w100pc" style={{ paddingTop: '8px' }}>
                        to
                      </label>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <input
                          type="number"
                          autoComplete="off"
                          name="storageTemp2"
                          placeholder="-- Preserved --"
                          value={this.props.storageTemp2}
                          onChange={(e) =>
                            this.handleChangeFieldCustom(
                              'storageTemp2',
                              e ? e.target.value : '',
                              this.props.changeField('storageTemp2', e ? e.target.value : '')
                            )
                          }
                          className="form-control"
                          // disabled={this.isCreate ? false : true}
                        />
                      </div>
                    </div>
                    <div className="col-md-1">
                      <label htmlFor="to" className="w100pc" style={{ paddingTop: '8px' }}>
                        <sup>o</sup>C
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="shelfLife" className="w100pc">
                      Expiry Date: (ngày)
                    </label>
                    <input
                      type="number"
                      autoComplete="off"
                      name="shelfLife"
                      placeholder="-- Expiry Date --"
                      value={this.props.shelfLife}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'shelfLife',
                          e ? e.target.value : '',
                          this.props.changeField('shelfLife', e ? e.target.value : '')
                        )
                      }
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="distributionAddress" className="w100pc">
                      Distribution address
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="distributionAddress"
                      placeholder="-- Distribution Address --"
                      value={this.props.distributionAddress}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          'distributionAddress',
                          e ? e.target.value : '',
                          this.props.changeField('distributionAddress', e ? e.target.value : '')
                        )
                      }
                      className="form-control"
                      // disabled={this.isCreate ? false : true}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="row">
								{ this.isUpdateForm ? 
								<div className="col-md-6">
									<div className='form-group'>	
										<label style={{marginRight: 10}}>
											Status : {this.renderStatus()}
										</label>
									</div>
								</div>
								: "" }
								
							</div> */}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
