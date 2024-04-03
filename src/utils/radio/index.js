import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { Radio } from "antd";

const RadioComp = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  const [data, setData] = useState(
    props.data || [
      { value: 1, label: "A" },
      { value: 2, label: "B" },
    ],
  );
  const [value, setValue] = useState("");
  const [keyField, setKeyField] = useState(props.keyField || "");

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useImperativeHandle(ref, () => ({
    getSelected: () => {
      return value;
    },
  }));

  const handleFuncCallback = (value) => {
    if (props.funcCallback) {
      props.funcCallback(value);
    }
  };

  const onChange = (e) => {
    setValue(e.target.value);

    handleFuncCallback(e.target.value);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <Radio.Group
          {...props}
          onChange={onChange}
          value={value}
          ref={inputRef}
        >
          {data.length > 0 &&
            data.map((item, index) => (
              <Radio key={index} value={item.value}>
                {item.label}
              </Radio>
            ))}
        </Radio.Group>
      </>
    );
  }, [data, value, keyField]);

  return bodyContent;
});

export default React.memo(RadioComp);
