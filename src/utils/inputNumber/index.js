import React, {
  useState,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { InputNumber } from "antd";

// const InputNumberComp = React.forwardRef((props, ref) => {
//     const inputRef = useRef();
//     const [value, setValue] = useState(props.value);
//     const [minValue, setMinValue] = useState(props.minValue || 0);
//     const [maxValue, setMaxValue] = useState(props.maxValue || 9999);

//     useImperativeHandle(ref, () => ({
//         getSelected: () => { return value },
//     }));

//     const onChange = (value) => {
//         setValue(value)
//     };
// console.log(value)
//     return (
//         <InputNumber
//             ref={inputRef}
//             value={value}
//             formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//             parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
//             onChange={onChange}
//             min={minValue}
//             max={maxValue}
//             style={{ width: '100%' }}
//         />
//     );
// });
const InputNumberComp = (props) => {
  const [value, setValue] = useState(props.value);
  const [minValue, setMinValue] = useState(props.minValue || 0);
  const [maxValue, setMaxValue] = useState(props.maxValue || 999999);
  const [isDisable, setIsDisable] = useState(props.isDisable || false);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  useEffect(() => {
    setIsDisable(props.isDisable);
  }, [props.isDisable]);

  const onChange = (value) => {
    setValue(value);
    handleFuncCallback(value);
  };

  const handleFuncCallback = (value) => {
    if (props.funcCallback) {
      props.funcCallback(value);
    }
  };

  const contentBody = useMemo(() => {
    return (
      <InputNumber
        value={value}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        onChange={onChange}
        min={minValue}
        max={maxValue}
        style={{ width: "100%" }}
        disabled={isDisable}
      />
    );
  }, [value, minValue, maxValue, isDisable]);

  return contentBody;

  // return (
  //     <InputNumber
  //         value={value}
  //         formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
  //         parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
  //         onChange={onChange}
  //         min={minValue}
  //         max={maxValue}
  //         style={{ width: '100%' }}
  //         disabled={isDisable}
  //     />
  // );
};
export default React.memo(InputNumberComp);
