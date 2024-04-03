import { Button, Col, Row } from "antd";
import CustomDatePicker from "components/common/Table/Field/CustomDatePicker";
import CustomField from "components/common/Table/Field/CustomField";
import CustomInputTestHook from "components/common/Table/Field/CustomInputTestHooks";
import CustomSelectTestHook from "components/common/Table/Field/CustomSelectHookTest";
import { useAppContext } from "contexts";
import { DateOfWeekData } from "data/oldVersion/mockData/DateOfWeek";
import { useMemo, useState } from "react";
import React from "react";
const GoldenTimeCreate = ({
  inputFields,
  onSearch,
  currentTimeFrame,
  setCurrentTimeFrame,
}) => {
  const {
    selectFieldRender,
    inputFieldRender,
    datePickerRender,
    renderTimePickerField,
    renderSelectField,
    fieldsState,
  } = inputFields;

  const { state, dispatch, onGetStoreData } = useAppContext();
  useEffect(() => {
    onGetStoreData();
  }, []);
  const storeArray = useMemo(() => {
    if (state.stores) {
      return Object.keys(state.stores)?.map((item) => {
        return state.stores[item];
      });
    }
    return [];
  }, [state.stores]);

  const handleAddTimeFrame = () => {
    setCurrentTimeFrame((prev) => {
      if (prev >= 3) {
        return 3;
      }
      return prev + 1;
    });
  };
  return (
    <div className="section-block">
      <Row gutter={[16, 16]} style={{ marginBottom: 15 }}>
        <Col span={6}>
          <CustomField
            label="Promotion name:"
            fieldComponent={
              <CustomInputTestHook
                {...inputFieldRender("promotionName")}
                placeholder="--Enter promotion name--"
              />
            }
          />
        </Col>
        <Col span={6}>
          <CustomField
            label="Date:"
            fieldComponent={<CustomDatePicker {...datePickerRender()} />}
          />
        </Col>
        <Col span={6}>
          <CustomField
            label="Store"
            fieldComponent={
              <CustomSelectTestHook
                mode="multiple"
                maxTagCount="responsive"
                {...selectFieldRender(storeArray, "storeCode", "storeName")}
                placeholder="--All--"
              />
            }
          />
        </Col>
        <Col span={6}>
          {renderSelectField(
            DateOfWeekData,
            "GoldenDays",
            "GoldenDaysLabel",
            "Select day of week",
            {
              placeholder: "Enter the Barcode",
              mode: "multiple",
              maxTagCount: "responsive",
            },
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {currentTimeFrame >= 1 ? (
          <Col span={6}>
            {renderTimePickerField({
              index: 0,
              showNow: true,
              label: "0AM to 12AM",
              disabledTime: () => ({
                disabledHours: () => [
                  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                ],
                disabledMinutes: (selectedHours) => {
                  if (selectedHours === 12)
                    return [...Array.from({ length: 59 }, (_, i) => i + 1)];
                },
              }),
            })}
          </Col>
        ) : null}

        {currentTimeFrame >= 2 ? (
          <Col span={6}>
            {renderTimePickerField({
              index: 2,
              label: "12AM to 18PM",
              showNow: true,
              disabledTime: () => ({
                disabledHours: () => [
                  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 19, 20, 21, 22, 23,
                ],
                disabledMinutes: (selectedHours) => {
                  if (selectedHours === 18)
                    return [...Array.from({ length: 59 }, (_, i) => i + 1)];
                },
              }),
            })}
          </Col>
        ) : null}

        {currentTimeFrame >= 3 ? (
          <Col span={6}>
            {renderTimePickerField({
              index: 3,
              label: "18PM to 23PM",
              showNow: true,
              disabledTime: () => ({
                disabledHours: () => [
                  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                ],
              }),
            })}
          </Col>
        ) : null}

        <Col span={6} style={{ display: "flex", alignItems: "end" }}>
          <Button
            onClick={handleAddTimeFrame}
            className="w-full"
            type="primary"
          >
            Add time frame
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default GoldenTimeCreate;
