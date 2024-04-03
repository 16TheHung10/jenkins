import React from "react";
import BaseButton from "../baseButton/BaseButton";
const BackButton = ({ ...props }) => {
  return (
    <BaseButton iconName={"arrowLeft"} {...props}>
      Back
    </BaseButton>
  );
};

export default BackButton;
