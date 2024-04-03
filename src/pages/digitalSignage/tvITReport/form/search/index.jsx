import { Col, DatePicker, Drawer, Form, Row, Select } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import DisableRangeDate from 'components/common/datePicker/rangePicker/DisableRangeDate';
import SelectFormField from 'components/common/selects/SelectFormField';
import { ArrayHelper } from 'helpers';
import moment from 'moment';
import useTVsQuery from 'pages/digitalSignage/tv/hooks/useTVsQuery';
import React, { useMemo, useState } from 'react';
const { RangePicker } = DatePicker;

const DigitalSignageDailyLogITFormSearch = ({ form, onFilterReportType, onSetValue, versionOptions }) => {
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const toggleDrawerFilter = () => {
    setIsOpenFilter((prev) => !prev);
  };
  const storeCode = Form.useWatch('storeCode', form);
  const tvsQuery = useTVsQuery({ searchFormValue: { storeCode } });

  const storeOptions = useMemo(() => {
    const storeMap = localStorage.getItem('cachedData')
      ? JSON.parse(localStorage.getItem('cachedData')).data.stores
      : [];
    return Object.keys(storeMap).map((storeCode) => {
      return { value: storeCode, label: storeCode + ' - ' + storeMap[storeCode].storeName };
    });
  }, []);

  const tvOptions = useMemo(() => {
    const tvsRes = [];
    for (let tvs of Object.values(tvsQuery.data || {})) {
      for (let tv of tvs) {
        tvsRes.push({ value: tv.tvCode, label: `${tv.tvCode} - ${tv.tvName}` });
      }
    }
    return tvsRes;
  }, [tvsQuery.data]);

  const dateWatch = Form.useWatch('date', form);
  const handleSetDate = (value) => {
    form.setFieldValue('date', value);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={async (value) => {
          onSetValue(value);
        }}
      >
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item
              className="w-full"
              name="startDate"
              rules={[{ required: true, message: 'Please select date' }]}
              label="Report date"
            >
              <DatePicker
                format={'DD/MM/YYYY'}
                className="w-full"
                disabledDate={(current) => current && current > moment().subtract(1, 'day').endOf('day')}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item className="w-full" name="storeCode" label="Store">
              <SelectFormField options={storeOptions} placeholder="All" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item className="w-full" name="tvCode" label="TV">
              <SelectFormField options={tvOptions} placeholder="All" loading={tvsQuery.isLoading} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="flex gap-10">
              <BaseButton htmlType="submit" iconName="search">
                Search
              </BaseButton>
              <BaseButton iconName="filter" htmlType="button" color="green" onClick={toggleDrawerFilter} />
            </div>
          </Col>
        </Row>
      </Form>
      <Drawer open={isOpenFilter} onClose={toggleDrawerFilter}>
        <Form
          onFieldsChange={(b, formValueArr) => {
            const value = {};
            for (let item of formValueArr) {
              value[item.name[0]] = item.value;
            }
            onFilterReportType(value);
          }}
          onFinish={onFilterReportType}
        >
          <Form.Item name="reportType" label="Report type">
            <Select allowClear options={[{ value: false, label: 'Miss report' }]} placeholder="--All--" />
          </Form.Item>
          <Form.Item name="appVersion" label="App version">
            <Select allowClear options={versionOptions} placeholder="--All--" />
          </Form.Item>
          {/* <Form.Item>
            <BaseButton iconName="filter" htmlType="submit">
              Filter
            </BaseButton>
          </Form.Item> */}
        </Form>
      </Drawer>
    </>
  );
};

export default DigitalSignageDailyLogITFormSearch;
