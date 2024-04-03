import { Col, Collapse, Row, message } from 'antd';
import { StoreApi } from 'api';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import { useFormFields } from 'hooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { mainContentRef } from '../../../MainContent';

const MoreStoreInfomation = ({ data, storeCode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetValue, setResetValue] = useState(null);
  const collapseRef = useRef();
  const fieldInputsHook = useMemo(() => {
    let resetData = {};
    const html = data?.map((item) => {
      resetData = { ...resetData, [item.keyMapping]: item.attributeValue };
      return {
        name: item.keyMapping,
        label: item.attributeName,
        type: item.dataType === 'textfield' ? 'text' : 'select',
        options: item.dataType === 'select' ? item.options : null,
        placeholder: item.DataType === 'textfield' ? `Enter value of ${item.attributeName}` : `Select value of ${item.attributeName}`,
        span: 6,
      };
    });
    setResetValue(resetData);
    return html;
  }, [data]);

  const storeInforsMap = useMemo(() => {
    const map = new Map();

    for (let item of data) {
      if (!map.get(item.keyMapping)) {
        map.set(item.keyMapping, item);
      }
    }
    return map;
  }, [data]);

  const handleUpdateInfo = async (value) => {
    const formatPayload = Object.keys(value || {}).map((key) => {
      return {
        attributeID: storeInforsMap.get(key)?.attributeID || undefined,
        storeCode,
        attributeValue: value[key],
      };
    });
    const res = await StoreApi.updateMoreStoreInfo(storeCode, formatPayload);
    if (res.status) {
      message.success('Update info successfully');
    } else {
      message.error(res.message);
    }
  };

  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
    setValue,
  } = useFormFields({
    fieldInputs: fieldInputsHook,
    onSubmit: handleUpdateInfo,
    watches: ['cityID', 'districtID', 'sex'],
  });

  useEffect(() => {
    reset(resetValue);
  }, [reset, resetValue]);
  return (
    <div ref={collapseRef} style={{ maxHeight: '1000px' }}>
      <Collapse
        style={{
          marginTop: '15px',
          border: 'none',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        }}
        onChange={(key) => {
          if (key.includes('1') && mainContentRef.current && collapseRef.current) {
            setTimeout(() => {
              mainContentRef.current.scrollTo({
                top: collapseRef.current.offsetTop - 53,
                behavior: 'smooth',
              });
            }, 300);
          } else {
            mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        <Collapse.Panel header="View more info" key="1">
          <form onSubmit={onSubmitHandler}>
            <Row gutter={[16, 0]} className="items-center">
              <FieldList fields={fields} />
              {data && data.length > 0 ? (
                <Col span={24}>
                  <div className="flex items-center gap-10">
                    <BaseButton loading={isLoading} iconName="send" htmlType="submit">
                      Save
                    </BaseButton>
                  </div>
                </Col>
              ) : null}
            </Row>
          </form>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default MoreStoreInfomation;
