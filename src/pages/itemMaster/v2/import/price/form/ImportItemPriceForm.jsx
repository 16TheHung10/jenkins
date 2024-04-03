import { Col, Form, Row } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { useCommonOptions } from 'hooks';
import React from 'react';

const ImportItemPriceForm = ({ form, ImportButton, onImport }) => {
  const options = useCommonOptions();
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(value) => {
        onImport(value);
      }}
    >
      <Row gutter={[16, 0]} className="mb-15">
        <Col>
          <ImportButton
            color="green"
            linkDownload="https://api.gs25.com.vn:8091/storemanagement/share/template/itemMaster/ImportStoreItemPrice.xls"
          />
        </Col>
        <Col style={{ alignSelf: 'end' }}>
          <BaseButton htmlType="submit" iconName="send">
            Submit
          </BaseButton>
        </Col>
      </Row>
    </Form>
  );
};

export default ImportItemPriceForm;
