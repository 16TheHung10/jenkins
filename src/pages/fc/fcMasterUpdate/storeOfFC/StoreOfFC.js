import { Form, Popconfirm, Select, Skeleton, Spin } from "antd";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import SectionWithTitle from "components/common/section/SectionWithTitle";
import { useAppContext } from "contexts";
import { OptionsHelper, ArrayHelper, StringHelper } from "helpers";
import React, { useEffect, useMemo } from "react";
import Icons from "images/icons";
import "./style.scss";

const StoreOfFC = ({ query, addMutaion, deleteMutaion }) => {
  const { state: AppState, onGetStoreData } = useAppContext();
  const [form] = Form.useForm();
  const { data, isLoading } = query;
  useEffect(() => {
    onGetStoreData();
  }, []);

  const storeOptions = useMemo(() => {
    let validStoreObject = {};
    const selectedStoreObject = ArrayHelper.convertArrayToObject(
      query.data?.stores || [],
      "storeCode",
    );
    for (const storeCode of Object.keys(AppState.stores || {})) {
      if (!selectedStoreObject?.[storeCode]) {
        validStoreObject = {
          ...validStoreObject,
          [storeCode]: AppState.stores?.[storeCode],
        };
      }
    }
    const array = Object.values(validStoreObject || {});
    if (array) {
      const options = OptionsHelper.convertDataToOptions(
        array,
        "storeCode",
        "storeCode-storeName",
      );
      return options;
    }
    form.setFieldValue("storeCode", null);
    return [];
  }, [AppState?.stores, query.data?.stores]);
  return (
    <div className="section-block mt-15">
      <SectionWithTitle title="Store Of FC">
        {storeOptions?.length > 0 && data?.stores?.length < 5 ? (
          <Form
            form={form}
            onFinish={(formValue) => {
              form.resetFields();
              addMutaion.mutate(formValue);
            }}
            className="flex gap-10"
          >
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="storeCode"
              rules={[
                {
                  required: true,
                  message: "Please select stores",
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Select store to add"
                options={storeOptions}
                filterOption={(input, option) => {
                  const normalizeOptionValue = StringHelper.normalize(
                    option.label,
                  );
                  const normalizeInputValue = StringHelper.normalize(input);
                  if (
                    !normalizeOptionValue
                      ?.toLowerCase()
                      .includes(normalizeInputValue)
                  ) {
                    return (
                      option?.label?.toString().toLowerCase() ?? ""
                    ).includes(input.toString().trim().toLowerCase());
                  }
                  return true;
                }}
              />
            </Form.Item>
            <BaseButton
              loading={addMutaion.isLoading}
              htmlType="submit"
              iconName="plus"
              style={{ marginBottom: "10px" }}
            >
              Add
            </BaseButton>
          </Form>
        ) : null}
        <div id="store_of_fc_wrapper" className="mt-10 ">
          {isLoading ? (
            <Skeleton.Button active className="skeleton" />
          ) : (
            <div className="flex gap-10 relative" style={{ flexWrap: "wrap" }}>
              {[...data?.stores]?.map((item, index) => {
                return (
                  <div
                    span={2}
                    className="store_card absolute"
                    key={index}
                    data-index={index}
                    style={{}}
                  >
                    {deleteMutaion.isLoading &&
                    deleteMutaion.variables.index === index ? (
                      <Spin />
                    ) : (
                      <>
                        <p>{item.storeName}</p>
                        <span className="hint">{item.storeCode}</span>
                        <Popconfirm
                          placement="top"
                          title="Are you sure to remove this store"
                          onConfirm={() =>
                            deleteMutaion.mutate({ item, index })
                          }
                          okButtonProps={{
                            loading: deleteMutaion.isLoading,
                          }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Icons.Cancel className="icon_delete" />
                        </Popconfirm>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SectionWithTitle>
    </div>
  );
};

export default StoreOfFC;
