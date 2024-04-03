import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber, message } from 'antd';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import './styleModelInputNumberControl.scss'

const ModelInputNumberControl = forwardRef(({ ...props }, ref) => {
  const [value, setValue] = useState(props.value || 0);
  useEffect(() => { setValue(props.value) }, [props.value]);

  const handleIncrease = useCallback((itemCode) => {
    let val = props?.step ? parseFloat(value + parseFloat(props?.step)) : parseFloat(value + 1);

    if (val > (props?.max ?? 999)) {
      message.warning({ key: 'qtyLessThan', content: `Number is less than ${props?.max ?? 999}` });
      val = props.max ?? 999;
    }

    if (props?.increase) {
      props.increase(val, itemCode, props?.step ?? 1);
    }

    setValue(val);
  }, [props?.step, props.max, props.increase, value]);


  const handleDecrease = useCallback((itemCode) => {
    let val = props?.step ? parseFloat(value - parseFloat(props?.step)) : parseFloat(value - 1);
    if (val <= (props?.min ?? 0)) {
      val = props?.min ?? 0;
    }

    if (props?.decrease) {
      props.decrease(val, itemCode, props?.step ?? 1);
    }
    setValue(val);
  }, [props?.step, props.max, props.decrease, value]);

  const handleChange = useCallback((newValue, itemCode) => {
    // console.log({ max: props.max, step: props.step })
    let val = props?.step ? (parseFloat(newValue) % props.step == 0 ? parseFloat(newValue) : value) : parseFloat(newValue);
    if (val > (props?.max ?? 999)) {
      message.warning({ key: 'qtyLessThan', content: `Number is less than ${props?.max ?? 999}` });
      val = props.max ?? 999;
      // return false;
    }

    setValue(val ?? 0);

    if (props?.onChange) {
      props.onChange(val ?? 0, itemCode, props?.step ?? 1);
    }

  }, [props.onChange, props.max, props?.step, value]);

  const renderButtonDecrease = useMemo(() => {
    return <Button
      onClick={() => handleDecrease(props?.code, props?.step ?? 1)}
      style={{ height: 31, width: 31, ...props.styleButton }}
      icon={<MinusOutlined />}
    />
  }, [value, props.decrease, props?.code, props?.step]);

  const renderButtonIncrease = useMemo(() => {
    return <Button
      onClick={() => handleIncrease(props?.code, props?.step ?? 1)}
      style={{ height: 31, width: 31, ...props.styleButton }}
      icon={<PlusOutlined />}
    />
  }, [value, props.increase, props?.code, props?.step]);

  const renderInput = useMemo(() => {
    return <InputNumber
      ref={ref}
      className={`custom-input-number ${props.className ?? ''}`}
      step={props?.step ?? 1}
      style={{ ...props.styleInput }}
      min={props?.min ?? 0}
      max={props?.max ?? 999}
      maxLength={3}
      value={value}
      onChange={(val) => handleChange(val, props?.code, props?.step ?? 1)}
      onFocus={(e) => e.target.select()}
      onPressEnter={() => {
        if (props.onPressEnter) {
          props.onPressEnter();
        }
      }}
    />
  }, [value, props.code, props.onChange, props.step, props.onPressEnter])

  const renderComp = () => {
    return <div style={props?.style}>
      {renderButtonDecrease}
      {renderInput}
      {renderButtonIncrease}
    </div>
  };

  return <>{renderComp()}</>;
});

export default React.memo(ModelInputNumberControl);