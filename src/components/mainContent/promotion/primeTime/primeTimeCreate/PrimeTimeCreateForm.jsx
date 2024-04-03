import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Popover, Row } from 'antd';
import { useAppContext } from 'contexts';
import { DateOfWeekData } from 'data/oldVersion/mockData/DateOfWeek';
import moment from 'moment';

const PrimeTimeCreateForm = ({ formFields, Notice, disableEdit }) => {
  const { renderInputField, renderSelectField, renderDatePickerField, renderTimePickerField, fieldsState, checkError } = formFields;
  const { state, onGetStoreData } = useAppContext();
  useEffect(() => {
    onGetStoreData();
  }, []);
  const storeArray = useMemo(() => {
    if (state.stores) {
      return Object.keys(state?.stores)?.map((item) => {
        return state?.stores[item];
      });
    }
    return [];
  }, [state?.stores]);
  return (
    <div className="">
      <div className="box-shadow mb-0">
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Row gutter={[16, 16]} style={{ marginBottom: 10 }}>
              <Col span={6}>
                {renderInputField('promotionName', <p className="required">Promotion Name</p>, 'text', {
                  disabled: disableEdit,
                  placeholder: 'Enter promotion name',
                })}
              </Col>

              <Col span={6}>
                {disableEdit ? (
                  <Popover
                    content={
                      <div>
                        {fieldsState?.goldenDays?.map((item, index) => (
                          <p key={`selected-store-${index}`}>{DateOfWeekData?.find((el) => el.goldenDays === item)?.goldenDaysLabel}</p>
                        ))}
                      </div>
                    }
                    title="Selected day of week"
                  >
                    {disableEdit ? <p style={{ display: 'none' }}></p> : null}
                    {renderSelectField(DateOfWeekData, 'goldenDays', 'goldenDaysLabel', <p className="required">Prime days of week</p>, {
                      placeholder: '--Select prime day(s)--',
                      mode: 'multiple',
                      maxTagCount: 'responsive',
                      disabled: disableEdit,
                      // defaultValue: ['1', '2', '3', '4', '5', '6', '0']
                    })}
                  </Popover>
                ) : (
                  renderSelectField(DateOfWeekData, 'goldenDays', 'goldenDaysLabel', <p className="required">Prime days of week</p>, {
                    placeholder: '--Select prime day(s)--',
                    mode: 'multiple',
                    maxTagCount: 'responsive',
                    disabled: disableEdit,
                    // defaultValue: ['1', '2', '3', '4', '5', '6', '0']
                  })
                )}
              </Col>
              <Col span={6}>
                {renderDatePickerField({
                  label: <p className="required">Apply date</p>,
                  disabledDate: (current) => current && current < moment().endOf('day'),
                  disabled: disableEdit,
                })}
              </Col>
              <Col span={6}>
                {disableEdit ? (
                  <Popover
                    content={
                      <div>
                        {fieldsState?.storeCode?.map((item, index) => (
                          <p key={`selected-store-${index}`}>{state.stores?.[item]?.storeCode + ' - ' + state.stores?.[item]?.storeName}</p>
                        ))}
                      </div>
                    }
                    title="Selected stores"
                  >
                    {disableEdit ? <p style={{ display: 'none' }}></p> : null}
                    {renderSelectField(storeArray, 'storeCode', 'storeCode-storeName', 'Store', {
                      placeholder: '--ALL--',
                      mode: 'multiple',
                      maxTagCount: 'responsive',
                      disabled: disableEdit,
                    })}
                  </Popover>
                ) : (
                  renderSelectField(storeArray, 'storeCode', 'storeCode-storeName', 'Store', {
                    placeholder: '--ALL--',
                    mode: 'multiple',
                    maxTagCount: 'responsive',
                    disabled: disableEdit,
                  })
                )}
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: 10 }}>
              {/* {currentTimeFrame >= 1 ? ( */}

              <Col span={6}>
                {renderTimePickerField({
                  inputReadOnly: true,
                  index: 0,
                  showNow: true,
                  label: 'Prime time from 0:00 to 11:59',
                  hideDisabledOptions: true,
                  disabled: disableEdit,
                  disabledTime: () => ({
                    disabledHours: () => [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                    disabledMinutes: (selectedHour) => {
                      if (!selectedHour || selectedHour === -1) {
                        return Array.from({ length: 60 }, (_, i) => i);
                      }
                      if (selectedHour === 11) {
                        return Array.from({ length: 60 }, (_, i) => i).filter((minute) => {
                          if (minute === 59) {
                            return;
                          } else {
                            return minute % 15 !== 0;
                          }
                        });
                      } else {
                        return Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute % 15 !== 0);
                      }
                    },
                  }),
                })}
              </Col>
              {/* ) : null} */}

              {/* {currentTimeFrame >= 2 ? ( */}
              <Col span={6}>
                {renderTimePickerField({
                  inputReadOnly: true,
                  index: 1,
                  label: 'Prime time from 12:00 to 17:59',
                  showNow: true,
                  hideDisabledOptions: true,
                  disabled: disableEdit,
                  disabledTime: () => ({
                    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 21, 22, 23],
                    disabledMinutes: (selectedHour) => {
                      if (!selectedHour || selectedHour === -1) {
                        return Array.from({ length: 60 }, (_, i) => i);
                      }
                      if (selectedHour === 17) {
                        return Array.from({ length: 60 }, (_, i) => i).filter((minute) => {
                          if (minute === 59) {
                            return;
                          } else {
                            return minute % 15 !== 0;
                          }
                        });
                      } else {
                        return Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute % 15 !== 0);
                      }
                    },
                  }),
                })}
              </Col>
              {/* ) : null} */}

              {/* {currentTimeFrame >= 3 ? ( */}
              <Col span={6}>
                {renderTimePickerField({
                  inputReadOnly: true,
                  index: 2,
                  label: 'Prime time from 18:00 to 23:59',
                  showNow: true,
                  // minuteStep: 15,
                  hideDisabledOptions: true,
                  disabled: disableEdit,
                  disabledTime: () => ({
                    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                    disabledMinutes: (selectedHour) => {
                      if (!selectedHour || selectedHour === -1) {
                        return Array.from({ length: 60 }, (_, i) => i);
                      }
                      if (selectedHour === 23) {
                        return Array.from({ length: 60 }, (_, i) => i).filter((minute) => {
                          if (minute === 59) {
                            return;
                          } else {
                            return minute % 15 !== 0;
                          }
                        });
                      } else {
                        return Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute % 15 !== 0);
                      }
                    },
                  }),
                })}
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Notice />
          </Col>
        </Row>
      </div>
      <div className="box-shadow mt-15">
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <p className="mb-10">Dept. of I&T note</p>
          </Col>
          <Col span={6}>
            {renderInputField('docCode', <p className="required">Dept. of I&T code</p>, 'text', {
              disabled: disableEdit,
              placeholder: 'Enter doc code',
            })}
          </Col>
          <Col span={6}>
            {renderInputField('docLink', <p className="m-0">Dept. of I&T link</p>, 'text', {
              disabled: disableEdit,
              placeholder: 'Enter doc link',
            })}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PrimeTimeCreateForm;
