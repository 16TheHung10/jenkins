import { Col, DatePicker, Drawer, Form, Input, Row, Select } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import CustomAntdSelect from 'components/common/selects/CustomAntdSelect';
import useTVTypesQuery from 'pages/digitalSignage/tv/hooks/useTVTypesQuery';
import React, { useMemo, useState } from 'react';

const DigitalSignageTVFormSearch = ({ form, onFilterReportType, onSetValue, role }) => {
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const toggleDrawerFilter = () => {
    setIsOpenFilter((prev) => !prev);
  };
  const options = useMemo(() => {
    const storeMap = localStorage.getItem('cachedData')
      ? JSON.parse(localStorage.getItem('cachedData')).data.stores
      : [];
    return Object.keys(storeMap).map((storeCode) => {
      return { value: storeCode, label: storeCode + ' - ' + storeMap[storeCode].storeName };
    });
  }, []);
  const tvTypesQuery = useTVTypesQuery();
  const typeOptions = useMemo(() => {
    return (
      tvTypesQuery.data?.map((item) => {
        return { value: item.typeCode, label: item.typeName };
      }) || []
    );
  }, [tvTypesQuery.data]);

  return (
    <>
      {' '}
      <Form
        form={form}
        layout="vertical"
        onFinish={async (value) => {
          onSetValue(value);
        }}
      >
        <Row gutter={[16, 0]}>
          {/* <Col span={8}>
            <Form.Item className="w-full" name="keyword" label="Keyword">
              <Input placeholder="Enter keyword" />
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item className="w-full" name="storeCode" label="Store">
              <CustomAntdSelect options={options} placeholder="-- ALL --" />
            </Form.Item>
          </Col>
          {role !== 'admin' && (
            <Col span={8}>
              <Form.Item className="w-full" name="type" label="Type">
                <CustomAntdSelect options={typeOptions} placeholder="TV type" />
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <div className="flex gap-10">
              <BaseButton iconName="search" htmlType="submit">
                Search
              </BaseButton>
              <BaseButton iconName="filter" htmlType="button" color="green" onClick={toggleDrawerFilter} />

              {/* {role === 'admin' && (
         <BaseButton iconName="upload" color="green" htmlType="button" onClick={onOpenFormUpdateApp}>
           Update APK
         </BaseButton>
       )} */}
            </div>
          </Col>
        </Row>
      </Form>
      <Drawer open={isOpenFilter} onClose={toggleDrawerFilter}>
        <Form onFinish={onFilterReportType}>
          <Form.Item name="reportType" label="Report type">
            <Select allowClear options={[{ value: false, label: 'Miss report' }]} placeholder="--All--" />
          </Form.Item>
          <Form.Item>
            <BaseButton iconName="filter" htmlType="submit">
              Filter
            </BaseButton>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default DigitalSignageTVFormSearch;
