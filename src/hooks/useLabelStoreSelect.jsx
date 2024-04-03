import { Radio } from 'antd';
import React from 'react';

const useLabelStoreSelect = ({ onSetValue }) => {
  return (
    <div>
      <Radio
        onChange={(e) => {
          setIsSelectAll(e.target.checked);
          if (e.target.checked) {
            props.onChange(options?.map((item) => item.value));
          } else {
            props.onChange([]);
          }
        }}
        checked={isSelectAll}
      >
        Franchise
      </Radio>
    </div>
  );
};

export default useLabelStoreSelect;
