import { Button, Col, Row } from "antd";
import CustomDatePicker from "components/common/Table/Field/CustomDatePicker";
import CustomField from "components/common/Table/Field/CustomField";
import CustomInputTestHook from "components/common/Table/Field/CustomInputTestHooks";
import CustomSelectTestHook from "components/common/Table/Field/CustomSelectHookTest";
import { useAppContext } from "contexts";
import { useMemo } from "react";
import React from "react";

const PromotionGoldenTimeSearch = ({ inputFields, onSearch }) => {
  const { selectFieldRender, inputFieldRender, datePickerRender, fieldsState } =
    inputFields;
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

  const statusOptions = [
    {
      status: "1",
      label: "Active",
    },
    {
      status: "0",
      label: "InActive",
    },
  ];

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 15 }}>
      <Col span={6}>
        <CustomField
          label="Store"
          fieldComponent={
            <CustomSelectTestHook
              {...selectFieldRender(storeArray, "storeCode", "storeName")}
              placeholder="--All--"
            />
          }
        />
      </Col>

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
          label="Status"
          fieldComponent={
            <CustomSelectTestHook
              {...selectFieldRender(statusOptions, "status", "label")}
              placeholder="--All--"
            />
          }
        />
      </Col>
      <Col span={6}>
        <Button className="btn-danger" onClick={onSearch}>
          Search
        </Button>
      </Col>
    </Row>
  );
};

export default PromotionGoldenTimeSearch;
