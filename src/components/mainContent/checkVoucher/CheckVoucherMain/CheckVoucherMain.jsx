import { message } from "antd";
import { useFormFields } from "hooks";
import PosDataModel from "models/PosDataModel";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { CommonApi } from "api";
import CheckVoucherMainSearch from "./Fields/CheckVoucherMainSearch";
import CheckVoucherMainTable from "./Table/CheckVoucherMainTable";

const CheckVoucherMain = () => {
  const [partnerOptions, setPartnerOptions] = useState(null);
  const [voucherData, setVoucherData] = useState([
    {
      voucherCode: "12345",
      scanDate: new Date(),
      billCode: 12314123,
    },
  ]);

  const handleSearch = async (value) => {
    const model = new PosDataModel();
    const res = await model.checkVoucherData({ code: value.code });
    if (res.status) {
      setVoucherData(res.data.voucher);
    } else {
      message.error(res.message);
    }
  };

  const handleGetPartners = () => {
    const res = CommonApi.getCommonData("terminalpartners");
    if (res.status) {
      const options = Object.values(res.data.terminalpartners || {}).map(
        (item, index) => {
          return {
            value: item.key,
            label: item.value,
            key: item.key,
          };
        },
      );
      console.log({ options });
      setPartnerOptions(options);
    } else {
      message.error(res.message);
    }
  };
  const { formInputsWithSpan: formInputs, onSubmitHandler } = useFormFields({
    fieldInputs: [
      {
        name: "partner",
        label: "Partner",
        type: "select",
        span: 6,
        options: partnerOptions || [],
        labelClass: "required",
        rules: yup.string().required("Please enter voucher code"),
      },
      {
        name: "code",
        label: "Voucher Code",
        type: "text",
        span: 6,
        labelClass: "required",
        rules: yup.string().required("Please enter voucher code"),
      },
    ],
    onSubmit: handleSearch,
  });

  const handleUnlockVoucher = async (voucherCode) => {
    const model = new PosDataModel();
    const res = await model.unlockVoucher({ code: voucherCode });
    if (res && res.status) {
      const indexOfElm = voucherData.findIndex(
        (el) => +el.voucherCode === +voucherCode,
      );
      if (indexOfElm !== -1) {
        const clone = JSON.parse(JSON.stringify([...voucherData]));
        clone.splice(indexOfElm, 1);
        setVoucherData([...clone]);
      }
      message.success("Unlock voucher successfully");
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    handleGetPartners();
  }, []);

  return (
    <div>
      <CheckVoucherMainSearch fields={formInputs} onSubmit={onSubmitHandler} />
      <CheckVoucherMainTable
        onUnlock={handleUnlockVoucher}
        data={voucherData}
      />
    </div>
  );
};

export default CheckVoucherMain;
