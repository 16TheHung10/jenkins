import React, { useRef, useState } from "react";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import LoyaltyApi from "api/LoyaltyApi";
import { Input, message } from "antd";

const SearchMember = ({ setValue, index }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneNumber = inputRef.current.input.value;
    if (!phoneNumber) {
      setErrorMessage("Phone number is required");
      return;
    }

    if (phoneNumber.length < 10 || phoneNumber.length > 10) {
      setErrorMessage("Invlaid phone number");
      return;
    }
    setErrorMessage("");
    const res = await LoyaltyApi.getItemDetailByPhoneNumber(phoneNumber);
    if (res) {
      if (res.status) {
        const resPoint = await LoyaltyApi.getPoint(
          res.data?.member?.memberCode,
        );
        if (resPoint.status) {
          setValue(index, {
            ...res.data.member,
            totalPoint: resPoint.data?.point?.point,
          });
        } else setValue(index, res.data.member);
      } else message.error(res.message);
    }
  };
  return (
    <div style={{ padding: "10px 10px 0 0" }}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="w-fit mr-10 ml-0 flex flex-col items-start ">
          <label htmlFor="phoneNumber" className="cursor-pointer required">
            Phone number
          </label>
          <Input
            type="text"
            id="phoneNumber"
            ref={inputRef}
            placeeholder="Enter phone number"
          />
          <p className="error-text-12 m-0">{errorMessage}</p>
        </div>
        <BaseButton htmlType="submit" iconName="search">
          Search
        </BaseButton>
      </form>
    </div>
  );
};

export default SearchMember;
