import { Col, Row, Switch } from 'antd';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import FieldList from 'components/common/fieldList/FieldList';
import { FieldsEcommerceCategoryData } from 'data/render/form';
import { useFormFields } from 'hooks';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';

const EcommerceCategoryDetails = ({ initialValue, onSubmit }) => {
  const handleSubmit = (value) => {
    onSubmit({ value });
  };

  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
    setValue,
    control,
  } = useFormFields({
    fieldInputs: FieldsEcommerceCategoryData.fieldsInputsDetails({
      isUpdate: Boolean(initialValue),
    }),
    onSubmit: handleSubmit,
    watches: ['active'],
  });
  useEffect(() => {
    if (initialValue) {
      reset({
        ...initialValue,
      });
    }
  }, [initialValue, reset]);

  return (
    <div id="ecommerce" className=" mt-15 mini_app_container">
      {initialValue && (
        <div className="section-block mt-15 mb-15">
          <div className="flex gap-10">
            <div className="flex flex-col">
              <p className="m-0">
                Created by: <span className="color-primary">{initialValue.createdBy}</span>
              </p>
              <p className="hint m-0">At: {moment(initialValue.createdDate).format('DD/MM/YYYY HH:mm')}</p>
            </div>

            <div className="flex flex-col">
              <p className="m-0">
                Updated by: <span className="color-primary">{initialValue.updatedBy}</span>
              </p>
              <p className="hint">At: {moment(initialValue.updatedDate).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={onSubmitHandler}>
        <div className="section-block w-full mt-15">
          <Row gutter={[16, 16]}>
            {initialValue && (
              <Col span={24}>
                <Controller
                  control={control}
                  name="active"
                  render={({ field: { onChange, onBlur, value, ref } }) => <Switch checkedChildren="Active" unCheckedChildren="Active" onChange={onChange} ref={ref} checked={value} />}
                />
              </Col>
            )}
            <FieldList fields={fields} />
            <Col span={24}>
              <SubmitBottomButton title={initialValue ? 'Update' : 'Create'} />
            </Col>
          </Row>
        </div>
      </form>
    </div>
  );
};

export default EcommerceCategoryDetails;

