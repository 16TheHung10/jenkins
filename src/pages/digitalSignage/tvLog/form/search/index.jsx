import { Col, DatePicker, Form, Row, Select } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import DisableRangeDate from 'components/common/datePicker/rangePicker/DisableRangeDate';
import SelectFormField from 'components/common/selects/SelectFormField';
import { UrlHelper } from 'helpers';
import moment from 'moment';
import useTVsQuery from 'pages/digitalSignage/tv/hooks/useTVsQuery';
import React, { useEffect, useMemo } from 'react';
const { RangePicker } = DatePicker;

const DigitalSignageDailyLogFormSearch = ({ form, onGetLinkExport, onSetValue }) => {
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
        tvsRes.push({ value: tv.tvCode, label: `${tv.tvCode} -  ${tv.tvName}` });
      }
    }
    return tvsRes;
  }, [tvsQuery.data]);

  const dateWatch = Form.useWatch('date', form);
  const handleSetDate = (value) => {
    form.setFieldValue('date', value);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={async (value) => {
        onSetValue(value);
      }}
    >
      <Row gutter={[16, 0]}>
        <Col span={6}>
          <Form.Item className="w-full" name="date" rules={[{ required: true, message: 'Please select date' }]}>
            <DisableRangeDate
              title="Report date"
              span={24}
              value={dateWatch}
              setValue={handleSetDate}
              format={'DD/MM/YYYY'}
              showError={false}
              className="w-full"
              disabledDate={(current) => current && current > moment().endOf('day')}
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
            <BaseButton color="green" iconName="export" htmlType="button" onClick={onGetLinkExport}>
              Export
            </BaseButton>{' '}
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default DigitalSignageDailyLogFormSearch;
