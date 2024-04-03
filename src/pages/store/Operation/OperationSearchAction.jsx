import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Row } from "antd";
import { actionCreator, useStoreOperationContext } from "contexts";
import { useFormFields } from "hooks";

const fieldInputs = (stores) => [
  {
    name: "storeType",
    label: "Store Type",
    type: "select",
    options: [
      {
        value: true,
        label: "Franchise",
      },
      {
        value: false,
        label: "Direct",
      },
    ],
    placeholder: "--All--",
  },
];

const OperationSearchAction = ({ fields, onSubmit }) => {
  const { state, dispatch } = useStoreOperationContext();
  const { stores } = state;

  const storeRef = useRef([]);

  const handleFilter = (value) => {
    let filteredStore = [];
    if (value.storeType) {
      filteredStore = Object.values(storeRef.current || {})?.filter(
        (el) => el.fcModel !== "",
      );
    } else {
      filteredStore = Object.values(storeRef.current || {})?.filter(
        (el) => el.fcModel === "",
      );
    }
    dispatch(actionCreator("SET_STORES", filteredStore));
  };

  const { formInputs, onSubmitHandler, reset, getValues, setValue } =
    useFormFields({
      fieldInputs: fieldInputs(),
      onSubmit: handleFilter,
    });

  return (
    <div className="box-shadow">
      <form onSubmit={onSubmit}>
        <Row gutter={[16, 16]}>
          <Col span={15}>
            <Row gutter={[16, 0]} className="items-center">
              {fields?.map((item, index) => {
                return (
                  <Col key={`search-${index}`} span={8}>
                    {item}
                  </Col>
                );
              })}

              <Col span={4}>
                <Button type="primary" htmlType="submit" className="btn-danger">
                  Search
                </Button>
              </Col>
            </Row>
          </Col>
          <Col offset={1} span={6} className="cl-red bg-note">
            <strong className="required">Chú ý</strong>
            <br />
            - Chỉ được cài đặt đổi trạng thái trước ít nhất 3 ngày tính từ hiện
            tại
            <br />
            - Ngày Bắt đầu order phải trước ngày đổi trạng thái
            <br />
            - Ngày Kết thúc Order phải trước ngày đỗi trạng thái
            <br />
          </Col>
        </Row>
      </form>
      {/* <hr />
      <form onSubmit={onSubmitHandler} className="w-full">
        <Row gutter={[16, 16]} className="items-end">
          {formInputs?.map((item, index) => {
            return (
              <Col key={`filter-${index}`} span={6}>
                {item}
              </Col>
            );
          })}

          <Col span={4}>
            <Button type="primary" htmlType="submit" className="btn-danger" onClick={handleFilter}>
              Filter
            </Button>
          </Col>
        </Row>
      </form> */}
    </div>
  );
};

export default OperationSearchAction;
