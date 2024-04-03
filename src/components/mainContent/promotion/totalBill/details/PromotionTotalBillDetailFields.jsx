import React, { useEffect } from 'react';
import { Col, Popover, Row } from 'antd';
import { useAppContext } from 'contexts';

const PromotionTotalBillDetailFields = ({ formFields, disableEdit }) => {
  const { formInputs, formValues, onSubmitHandler, reset, getValues } = formFields;
  const { state, onGetStoreData } = useAppContext();
  useEffect(() => {
    onGetStoreData();
  }, []);
  return (
    <Row gutter={16}>
      <Col span={24}>
        <form className="p-10 pt-0 pb-0" onSubmit={onSubmitHandler}>
          <Row gutter={16} className="box-shadow m-0">
            {formInputs?.slice(0, 4).map((item, index) => {
              if (index === 3) {
                return (
                  <Col key={`field-${index}`} span={6}>
                    {disableEdit ? (
                      <Popover
                        style={{ maxHeight: '200px' }}
                        content={
                          <div>
                            {getValues()?.storeCode?.map((item, index) => (
                              <p key={`selected-store-${index}`}>{state.stores?.[item]?.storeCode + ' - ' + state.stores?.[item]?.storeName}</p>
                            ))}
                          </div>
                        }
                        title="Selected stores"
                      >
                        <p style={{ display: 'none' }}></p>
                        {item}
                      </Popover>
                    ) : (
                      item
                    )}
                  </Col>
                );
              }
              return (
                <Col key={`field-${index}`} span={6}>
                  {item}
                </Col>
              );
            })}
          </Row>

          <Row gutter={16} className="box-shadow mt-15 mb-0">
            <Col span={24}>
              <p className="mb-10">Dept. of I&T note</p>
            </Col>
            {formInputs?.slice(4).map((item, index) => {
              if (index === 3) {
                return (
                  <Col key={`field-${index}`} span={6}>
                    {disableEdit ? (
                      <Popover
                        style={{ maxHeight: '200px' }}
                        content={
                          <div>
                            {getValues()?.storeCode?.map((item, index) => (
                              <p key={`selected-store-${index}`}>{state.stores?.[item]?.storeCode + ' - ' + state.stores?.[item]?.storeName}</p>
                            ))}
                          </div>
                        }
                        title="Selected stores"
                      >
                        <p style={{ display: 'none' }}></p>
                        {item}
                      </Popover>
                    ) : (
                      item
                    )}
                  </Col>
                );
              }
              return (
                <Col key={`field-${index}`} span={6}>
                  {item}
                </Col>
              );
            })}
          </Row>
        </form>
      </Col>
    </Row>
  );
};

export default PromotionTotalBillDetailFields;
