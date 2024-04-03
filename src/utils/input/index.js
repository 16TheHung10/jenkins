import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "antd";
import "./style.css";

const { Search } = Input;

function InputComp(props) {
  const [widthBox, setWidthBox] = useState("100%");
  const [text, setText] = useState(props.text);
  const [isMode, setIsMode] = useState(props.isMode || "");
  const [isSize, setIsSize] = useState(props.isSize || "default");
  const [placeholder, setPlaceholder] = useState(
    props.placeholder || "Input...",
  );
  const [keyField, setKeyField] = useState(props.keyField || "");
  const [isDisable, setIsDisable] = useState(props.isDisable || false);
  const [typeText, setTypeText] = useState(props.typeText || "");

  useEffect(() => {
    if (props.text) {
      setText(props.text);
    }
  }, [props.text]);

  useEffect(() => {
    if (props.isMode) {
      setIsMode(props.isMode);
    }
  }, [props.isMode]);

  useEffect(() => {
    setKeyField(props.keyField);
  }, [props.keyField]);

  useEffect(() => {
    setTypeText(props.typeText);
  }, [props.typeText]);

  useEffect(() => {
    setIsDisable(props.isDisable);
  }, [props.isDisable]);

  useEffect(() => {
    if (props.isSize) {
      setIsSize(props.isSize);
    }
  }, [props.isSize]);

  const handleUpdateData = useCallback(
    (val, keyField) => {
      if (props.func) {
        props.func(val, keyField);
      }
    },
    [text, isSize, isMode, keyField],
  );

  const handleFuncCallback = useCallback(
    (val) => {
      if (props.funcCallback) {
        props.funcCallback(val);
      }
    },
    [text, isSize, isMode, keyField],
  );

  const onChange = (e) => {
    setText(e.target.value);
    handleUpdateData(e.target.value, keyField);
    handleFuncCallback(e.target.value);
  };

  const returnComp = (type) => {
    // console.log({ comp: props.isDisable });
    if (type === "search") {
      return (
        <Search
          className="lh-18 fontSize-12"
          style={{ width: widthBox }}
          size={isSize}
          placeholder={placeholder}
          loading={false}
          onChange={onChange}
          defaultValue={text}
          value={text}
          allowClear
          disabled={isDisable}
        />
      );
    } else {
      return (
        <Input
          className="lh-18 fontSize-12"
          style={{ width: widthBox }}
          size={isSize}
          placeholder={placeholder}
          onChange={onChange}
          defaultValue={text}
          value={text}
          allowClear
          disabled={isDisable}
          onInput={(e) => (e.target.value = e.target.value)}
        />
      );
    }
  };

  const contentBody = useMemo(() => {
    return <>{returnComp(isMode)}</>;
  }, [text, isSize, isMode, widthBox, keyField, isDisable]);

  return contentBody;
}

export default React.memo(InputComp);
