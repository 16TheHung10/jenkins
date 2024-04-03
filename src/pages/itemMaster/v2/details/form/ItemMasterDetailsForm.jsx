import { Col, DatePicker, Form, Input, InputNumber, Row, Select, Typography, Upload } from 'antd';
import Block from 'components/common/block/Block';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import SelectFormField from 'components/common/selects/SelectFormField';
import UploadFileComponent from 'components/common/upload/UploadFileComponent';
import CONSTANT from 'constant';
import { FileHelper, StringHelper } from 'helpers';
import { useCommonOptions } from 'hooks';
import Icons from 'images/icons';
import moment from 'moment';
import React, { useEffect } from 'react';
const vatInputOpt = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 8, label: '8%' },
  { value: 10, label: '10%' },
  { value: -1, label: '0% - No tax' },
];
const vatOutputOpt = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 8, label: '8%' },
  { value: 10, label: '10%' },
  { value: -1, label: '0% - No tax' },
];
const typeOpt = [
  { label: 'Normal', value: 0 },
  { label: 'Item Convert', value: 1 },
  { label: 'Item FF', value: 2 },
];
const originOfGoodOptions = [
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
  { value: 'Usa', label: 'Austria' },
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
  { value: 'Saint Pierre and Miquelon', label: 'Saint Pierre and Miquelon' },
  {
    value: 'Saint Vincent and the Grenadines',
    label: 'Saint Vincent and the Grenadines',
  },
  { value: 'Samoa', label: 'Samoa' },
  { value: 'Scotland', label: 'Scotland' },
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
  { value: 'Wales', label: 'Wales' },
  { value: 'Yemen', label: 'Yemen' },
  { value: 'Zambia', label: 'Zambia' },
  { value: 'Zimbabwe', label: 'Zimbabwe' },
];

const ItemMasterDetailsForm = ({ form, itemCode, itemName, onSubmit, detailsData, loading }) => {
  const options = useCommonOptions();

  const categoryWatcher = Form.useWatch('categoryCode', form);

  const handleSubmit = async (value) => {
    const imageBase64 = value.imagePath[0].url
      ? value.imagePath[0].url
      : await FileHelper.convertToBase64(value.imagePath[0].originFileObj);
    const payload = {
      ...value,
      vatInputType: value.vatInput === -1 ? 1 : 0,
      vatOutputType: value.vatInput === -1 ? 1 : 0,
      imageBinary: StringHelper.base64Smooth(imageBase64),
      imagePath: StringHelper.base64Smooth(imageBase64),
    };
    onSubmit(payload);
  };

  //   useEffect(() => {
  //     form.setFieldValue('subCategoryCode', null);
  //   }, [categoryWatcher]);
  return (
    <Block>
      <Typography.Title level={3}>
        Edit item: {itemCode} - {itemName}
        <div className="flex gap-10">
          <p className="hint">
            Latest update: {moment(detailsData.updatedDate).format(CONSTANT.FORMAT_DATE_IN_USE_FULL)} -{' '}
            {detailsData.staffNameUpdated}
          </p>
        </div>
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={(value) => {
          handleSubmit(value);
        }}
      >
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item
              label="Item Name"
              name="itemName"
              rules={[{ type: 'string', required: true, message: 'Item name is required' }]}
            >
              <Input placeholder="Item Name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Supplier Code"
              name="supplierCode"
              rules={[{ type: 'string', required: true, message: 'Supplier Code is required' }]}
            >
              <SelectFormField options={options.supplierOptions()} placeholder="Supplier Code" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Division Code"
              name="divisionCode"
              rules={[{ type: 'string', required: true, message: 'Division Code is required' }]}
            >
              <SelectFormField options={options.divistionOptions()} placeholder="Division Code" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Category"
              name="categoryCode"
              rules={[{ type: 'string', required: true, message: 'Category Code is required' }]}
            >
              <SelectFormField
                options={options.categoryOptions()}
                onSelect={(e) => {
                  form.setFieldValue('subCategoryCode', null);
                }}
                placeholder="Category Code"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Sub Category Code"
              name="subCategoryCode"
              rules={[{ type: 'string', required: true, message: 'Sub Category Code is required' }]}
            >
              <SelectFormField
                options={options.subCategoryOptions().filter((el) => el.groupCode === categoryWatcher)}
                placeholder="Category Code"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Vat Input"
              name="vatInput"
              rules={[{ type: 'number', required: true, message: 'Vat Input is required' }]}
            >
              <SelectFormField placeholder="Vat Input" options={vatInputOpt} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Vat Output"
              name="vatOutput"
              rules={[{ type: 'number', required: true, message: 'Vat Output is required' }]}
            >
              <SelectFormField placeholder="Vat Output" options={vatOutputOpt} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Unit"
              name="unit"
              rules={[{ type: 'string', required: true, message: 'Unit is required' }]}
            >
              <Input placeholder="Unit" />
            </Form.Item>
          </Col>
          {/* <Col span={6}>
            <Form.Item
              label="Vat Input Type"
              name="vatInputType"
              rules={[{ type: 'string', required: true, message: 'Vat Input Type is required' }]}
            >
              <Input placeholder="Vat Input Type" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Vat Out Type"
              name="vatOutputType"
              rules={[{ type: 'string', required: true, message: 'Vat Out Type is required' }]}
            >
              <Input placeholder="Vat Out Type" />
            </Form.Item>
          </Col> */}
          <Col span={6}>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ type: 'number', required: true, message: 'Type is required' }]}
            >
              <SelectFormField placeholder="Type" options={typeOpt} />
            </Form.Item>
          </Col>
          {/* <Col span={6}>
            <Form.Item
              label="Level"
              name="level"
              rules={[{ type: 'number', required: true, message: 'Level is required' }]}
            >
              <Input placeholder="Level" />
            </Form.Item>
          </Col> */}
          <Col span={6}>
            <Form.Item
              label="First Order Date"
              name="firstOrderDate"
              rules={[{ type: 'date', required: true, message: 'First Order Date is required' }]}
            >
              <DatePicker className="w-full" format={CONSTANT.FORMAT_DATE_IN_USE} placeholder="First Order Date" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="First Sales Date"
              name="firstSalesDate"
              rules={[{ type: 'date', required: true, message: 'First Sales Date is required' }]}
            >
              <DatePicker className="w-full" format={CONSTANT.FORMAT_DATE_IN_USE} placeholder="First Sales Date" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Origin Of Goods"
              name="originOfGoods"
              rules={[{ type: 'string', required: true, message: 'Origin Of Goods is required' }]}
            >
              <SelectFormField options={originOfGoodOptions} placeholder="Origin Of Goods" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Self Declaration"
              name="selfDeclaration"
              rules={[{ type: 'string', required: true, message: 'Self Declaration is required' }]}
            >
              <Input placeholder="Self Declaration" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Storage Temp"
              name="storageTemp"
              rules={[{ type: 'string', required: true, message: 'Storage Temp is required' }]}
            >
              <Input placeholder="Storage Temp" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Self Life"
              name="shelfLife"
              rules={[{ type: 'number', required: true, message: 'Self Life is required' }]}
            >
              <InputNumber placeholder="Self Life" min={1} max={999} className="w-full" />
            </Form.Item>
          </Col>
          {/* <Col span={6}>
            <Form.Item
              label="Distribution Address "
              name="distributionAddress "
              rules={[{ type: 'number', required: true, message: 'Distribution Address  is required' }]}
            >
              <Input placeholder="Distribution Address " className="w-full" />
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item
              label="Image Path"
              name="imagePath"
              rules={[{ type: 'array', required: true, message: 'Image Path is required' }]}
            >
              <UploadFileComponent
                uploadRoute={null}
                mediaSize={0.2 * 1024 * 1024}
                multiple={false}
                maxCount={1}
                ratio="1/1"
                type="image"
                accept=".jpg,.png"
                imageContainerHeightProps={150}
                Description={
                  <div className="upload_button">
                    <p className="ant-upload-drag-icon m-0 flex flex-col items-center">
                      <Icons.Camera style={{ color: 'var(--primary-color)', fontSize: '40px' }} />
                      <span style={{ fontSize: '14px' }}>Upload image</span>
                      <span className="hint">Limit 1 image, only upload image size less than 200KB</span>
                    </p>
                  </div>
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="w-full">
          <SubmitBottomButton title="Submit" loading={loading} />
        </div>
      </Form>
    </Block>
  );
};

export default ItemMasterDetailsForm;
