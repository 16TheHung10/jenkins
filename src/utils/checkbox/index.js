import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Button, Checkbox } from 'antd';
import './style.css';

function CheckboxComp(props) {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState('Default');

  useEffect(() => {
    setChecked(props.checked);
  });

  useEffect(() => {
    if (props.disabled) {
      setDisabled(props.disabled);
    }
  }, [props.disabled]);
  useEffect(() => {
    if (props.label) {
      setLabel(props.label);
    }
  }, [props.label]);

  const toggleChecked = () => {
    setChecked(!checked);
  };

  const toggleDisable = () => {
    setDisabled(!disabled);
  };

  const onChange = (e) => {
    // console.log('checked = ', e.target.checked);
    setChecked(e.target.checked);
  };

  // const contentBody = useMemo(() => {

  //     return (
  //         <>
  //             <p className="mr-0">
  //                 <Checkbox checked={checked} disabled={disabled} onChange={onChange}>
  //                     {label}
  //                 </Checkbox>
  //             </p>
  //         </>
  //     );
  // }, [checked, disabled, label]);

  return (
    <Checkbox checked={checked} disabled={disabled} onChange={onChange}>
      {label}
    </Checkbox>
  );
}

export default React.memo(CheckboxComp);
