import React, { useEffect } from "react";
import FieldsStoreFcDetailsData from "./FieldsStoreFcDetailsData";
import { useFormFields } from "hooks";
import { Col, Row, Spin, message } from "antd";
import FieldList from "components/common/fieldList/FieldList";
import { useQuery } from "react-query";
import { FcApi } from "api";
import moment from "moment";

const StoreFCDetails = ({ taxCode, storeCode }) => {
  const handleGetStoreFCDetails = async () => {
    const res = await FcApi.getStoreFCDetails(taxCode, storeCode);
    if (res.status) {
      return res.data.store;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const storeFcQuery = useQuery({
    queryKey: ["storeFC", taxCode, storeCode],
    queryFn: handleGetStoreFCDetails,
    enabled: Boolean(taxCode && storeCode),
  });

  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
  } = useFormFields({
    fieldInputs: FieldsStoreFcDetailsData.fieldsInputsDetails(),
    onSubmit: () => {},
  });
  useEffect(() => {
    reset({
      ...(storeFcQuery.data || {}),
      fcStartDate: storeFcQuery.data?.fcStartDate
        ? moment(storeFcQuery.data.fcStartDate).format("DD/MM/YYYY")
        : "",
      fcEndDate: storeFcQuery.data?.fcEndDate
        ? moment(storeFcQuery.data.fcEndDate).format("DD/MM/YYYY")
        : "",
    });
  }, [storeFcQuery.data]);
  return (
    <div>
      {storeFcQuery.isLoading ? (
        <div className="w-full flex items-center">
          <Spin />
        </div>
      ) : (
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Row gutter={[16, 0]}>
              <FieldList fields={fields.slice(0, fields.length - 3)} />
            </Row>
            <Row gutter={[16, 0]}>
              <FieldList fields={fields.slice(-3)} />
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default StoreFCDetails;
