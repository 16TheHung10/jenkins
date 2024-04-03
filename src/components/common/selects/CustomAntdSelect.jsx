import SelectFormField from 'components/common/selects/SelectFormField';
import { StringHelper } from 'helpers';
import React, { forwardRef } from 'react';

const CustomAntdSelect = ({ ...props }, ref) => {
  return (
    <SelectFormField
      ref={ref}
      showSearch
      allowClear
      filterOption={(input, option) => {
        const normalizeOptionValue = StringHelper.normalize(option.label);
        const normalizeInputValue = StringHelper.normalize(input);
        if (!normalizeOptionValue?.toLowerCase().includes(normalizeInputValue)) {
          return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
        }
        return true;
      }}
      {...props}
      style={{ width: '100%' }}
    />
  );
};

export default forwardRef(CustomAntdSelect);
