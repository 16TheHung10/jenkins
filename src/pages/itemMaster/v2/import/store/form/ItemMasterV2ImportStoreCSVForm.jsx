import { Col, Form, Row } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SelectStoreFormField from 'components/common/selects/SelectStoreFormField';
import { useCommonOptions } from 'hooks';
import React, { useEffect } from 'react';

const ItemMasterV2ImportStoreCSVForm = ({ form, ImportButton, onImport, onSetSelectedStore, isLoading }) => {
  const storeWatcher = Form.useWatch('storeApply', form);

  useEffect(() => {
    onSetSelectedStore(storeWatcher);
  }, [storeWatcher]);

  const options = useCommonOptions();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(value) => {
        console.log({ value });
        onImport(value);
      }}
    >
      <Row gutter={[16, 0]}>
        <Col>
          <ImportButton
            color="green"
            linkDownload="https://api.gs25.com.vn:8091/storemanagement/share/template/itemMaster/ImportStoreItem.xls"
          />
        </Col>
        <Col span={8}>
          <Form.Item name="storeApply" rules={[{ type: 'string', required: true, message: 'Missing stores' }]}>
            <SelectStoreFormField label="" allowSelectStoreType={true} options={options.storeOptions()} mode="single" />
          </Form.Item>
        </Col>
        <Col style={{ alignSelf: 'center' }}>
          <BaseButton loading={isLoading} htmlType="submit" iconName="send">
            Submit
          </BaseButton>
        </Col>
      </Row>
    </Form>
  );
};

export default ItemMasterV2ImportStoreCSVForm;
