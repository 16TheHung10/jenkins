import { Col, Row } from 'antd';
import FieldList from 'components/common/fieldList/FieldList';
import { useFormFields } from 'hooks';
import React, { useRef } from 'react';
import * as yup from 'yup';

const useDocumentFieldsPromotion = (disabled = false) => {
  const valueRef = useRef();
  const handleSubmit = (value) => {
    return (valueRef.current = value);
  };
  const {
    formInputsWithSpan: formInputs,
    onSubmitHandler,
    reset,
    getValues,
    setValue,
  } = useFormFields({
    fieldInputs: [
      {
        name: 'docCode',
        label: 'Dept. of I&T code',
        type: 'text',
        placeholder: 'Enter doc code',
        rules: yup.string().required('Please enter doc code'),
        disabled,
      },
      {
        name: 'docLink',
        label: 'Doc link',
        type: 'text',
        placeholder: 'Enter doc link',
        rules: yup.string().required('Please enter doc link'),
        disabled,
      },
    ],
    onSubmit: handleSubmit,
  });
  const Component = () => {
    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <p className="m-0">Document node</p>
        </Col>
        <FieldList fields={formInputs} />
      </Row>
    );
  };
  // console.log({ onSubmitHandler: onSubmitHandler() });
  return {
    Component,
    value: valueRef.current,
    onSubmit: onSubmitHandler,
    reset,
  };
};

export default useDocumentFieldsPromotion;
