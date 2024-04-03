import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Capcha = ({ isVisible, setIsVisible }) => {
  const captchaRef = useRef();
  const onChange = (value) => {
    try {
      setIsVisible(false);
    } catch (err) {}
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const inputVal = await e.target[0].value;
    const token = captchaRef.current?.getValue();
    captchaRef.current.reset();
  };
  return (
    <>
      {isVisible ? (
        <ReCAPTCHA
          className="w-full"
          onChange={onChange}
          ref={captchaRef}
          sitekey="6LeLdpsmAAAAAE7bxjAZlORtrDBoJhxFNKKX7J1n"
        />
      ) : null}
    </>
  );
};

export default Capcha;
