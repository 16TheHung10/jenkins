import { Col, Row, Select } from "antd";
import BackAction from "components/common/backAction/BackAction";
import { useTotalBillContext } from "contexts";
import moment from "moment";
import React, { useMemo } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

const PromotionTotalBillDetailHeader = ({
  selectedPromotionType,
  onChange,
  initialData,
}) => {
  const { state: TotalBillStateContext, dispatch: TotalBillDispatchContext } =
    useTotalBillContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const currentParams = useMemo(
    () => TotalBillStateContext.currentSearchParams,
    [TotalBillStateContext.currentSearchParams],
  );
  // console.log({ selectedPromotionType });

  const disableEdit = initialData
    ? moment(initialData?.fromDate)?.isBefore(moment())
    : false;
  return (
    <div className="box-shadow">
      <Row gutter={16}>
        <Col span={8} className="flex flex-col justify-content-between">
          <div className="flex items-center">
            <BackAction
              title={
                params?.id ? "Edit promotion : " + params.id : "New promotion"
              }
            />
          </div>
          <SelectPromotionType
            selectedPromotionType={selectedPromotionType}
            onChange={onChange}
          />
        </Col>
        <Col span={12} offset={4}>
          <Notice />
        </Col>
      </Row>
    </div>
  );
};

export default PromotionTotalBillDetailHeader;

const Notice = () => {
  return (
    <div className="bg-note cl-red">
      <p style={{ fontSize: "12px", fontWeight: 700, margin: 0 }}>Chú ý*</p>
      <p className="m-0">
        Tên của khuyến mãi phải rõ ràng, chi tiết, thể hiện được mục đích của
        khuyến mãi.
      </p>
      <p className="m-0">
        Vui lòng kiểm tra lại xem đúng loại khuyến mãi chưa trước khi tạo
      </p>
      <p className="cl-red m-0">
        Không thể edit khuyến mãi đang chạy hoặc đã hết hạn
      </p>
      <p className="cl-red m-0">
        Chỉ có thể thêm <span className="cl-red font-bold">1 item</span> duy
        nhất
      </p>

      <p className="cl-red m-0">
        Khuyến mãi chỉ áp dụng cho bill lớn hơn hoặc bằng{" "}
        <span className="font-bold">50,000 VNĐ</span>
      </p>
      <p className="cl-red m-0">
        Giá trị của bill phải là bội của
        <span className="font-bold"> 5000</span>
      </p>
    </div>
  );
};
const SelectPromotionType = ({ selectedPromotionType, onChange }) => {
  const params = useParams();
  return (
    <div className="flex items-center">
      <Select
        disabled={params.id ? true : false}
        allowClear
        options={[
          {
            value: "1",
            label: "Discount item",
          },
          {
            value: "2",
            label: "Free item",
          },
        ]}
        placeholder="Select promotion type"
        value={selectedPromotionType}
        onChange={onChange}
        style={{ transition: "all 0.4s" }}
        className={`${
          !selectedPromotionType ? "center_position" : "reset_position"
        } w-full`}
      ></Select>
    </div>
  );
};
