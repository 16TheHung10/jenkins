import { Button, Col, Row } from 'antd';
import FieldList from 'components/common/fieldList/FieldList';
import React from 'react';
import ExportPromotionData from '../../exportExcel/ExportPromotionData';

const PromotionTotalBillMainFields = ({ fields, onSubmit, fieldsValue, data }) => {
  return (
    <form className=" mb-15 " onSubmit={onSubmit}>
      <div className="app-container">
        <Row gutter={16} className="items-center">
          <FieldList fields={fields} />
          <Col span={24}>
            <div className="flex gap-10 items-center">
              <Button htmlType="submit" className="btn-danger m-0 mr-10">
                Search
              </Button>
              {data && data.length > 0 ? <ExportPromotionData promotionType="billtotal" params={fieldsValue} /> : null}
            </div>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default PromotionTotalBillMainFields;
