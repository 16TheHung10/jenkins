import { Col, Collapse, Row, Switch, Tabs } from 'antd';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import FieldList from 'components/common/fieldList/FieldList';
import React from 'react';
import { Controller } from 'react-hook-form';
import EcommerceImageUpload from '../../create/EcommerceImageUpload/EcommerceImageUpload';
import { useState } from 'react';
import { useEffect } from 'react';
const { Panel } = Collapse;
const EcommerceItemFormDetails = ({ initialValue, formState, onSubmitHandler, loading, fields, control, setValue }) => {
  const [activeKeys, setActiveKeys] = useState([]);
  useEffect(() => {
    if (formState.errors.attribute) {
      setActiveKeys((prev) => [...new Set([...prev, '1'])]);
    }
    if (formState.errors.description) {
      setActiveKeys((prev) => [...new Set([...prev, '2'])]);
    }
  }, [formState.errors]);
  return (
    <form onSubmit={onSubmitHandler}>
      {initialValue && (
        <Row gutter={[16, 0]}>
          <Col span={24} className="mb-15">
            <Controller
              control={control}
              name="active"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Active"
                  onChange={onChange}
                  ref={ref}
                  checked={value}
                />
              )}
            />
          </Col>
        </Row>
      )}
      <EcommerceImageUpload
        formState={{ control, handleSubmit: onSubmitHandler, setValue, errors: formState.errors }}
        initialValue={initialValue?.images}
      />
      <div className="section-block mt-15 w-full">
        <Row gutter={[16, 0]}>
          <FieldList fields={fields.filter((el) => el.group !== 2 && el.group !== 3)} />
        </Row>
        <Collapse
          activeKey={activeKeys}
          ghost
          onChange={(key) => {
            setActiveKeys(key);
          }}
        >
          <Panel header={<label className="required">Attributes</label>} key="1">
            <Row gutter={[16, 0]}>
              <FieldList fields={fields.filter((el) => el.group === 2)} />
            </Row>
          </Panel>
          <Panel header={<label className="required">Description</label>} key="2">
            <Row gutter={[16, 0]}>
              <FieldList fields={fields.filter((el) => el.group === 3)} />
            </Row>
          </Panel>
        </Collapse>
        <SubmitBottomButton loading={loading} title={initialValue ? 'Update' : 'Create'} />
      </div>
    </form>
  );
};

export default EcommerceItemFormDetails;
