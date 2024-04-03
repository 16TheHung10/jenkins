import { Checkbox, Popover, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import ArrayHelper from '../../../helpers/ArrayHelper';
import { StringHelper } from 'helpers';

const SelectFormField = (props, ref) => {
  const { value, options, popoverTitle, popoverContent } = props;
  const [isSelectAll, setIsSelectAll] = useState(false);
  useEffect(() => {
    if (value?.length < options?.length) {
      setIsSelectAll(false);
    }
    if (value?.length === options?.length) {
      setIsSelectAll(true);
    }
  }, [value, options]);

  const optionsComp = useMemo(() => {
    if (props.mode === 'multiple') {
      return [
        {
          value: -1,
          label: (
            <Checkbox
              className="w-full"
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
              Select all
            </Checkbox>
          ),
          disabled: true,
        },
        ...options,
      ];
    }
    return options;
  }, [options, isSelectAll]);
  const optionsMap = useMemo(() => {
    if (!options) return null;
    const map = ArrayHelper.convertArrayToObject(options, 'value');
    return map;
  }, [options]);

  return (
    <>
      {props.mode === 'multiple' ? (
        <Popover
          placement="rightBottom"
          title={popoverTitle || `Selected values`}
          content={
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
              {value?.map((el) => {
                const selectedOption = optionsMap?.[el];
                return <p key={el}>{selectedOption?.label}</p>;
              })}
            </div>
          }
        >
          <Select
            showSearch
            allowClear
            filterOption={(input, option) => {
              if (props.filterOption) {
                return props.filterOption(input, option);
              }
              const normalizeOptionValue = StringHelper.normalize(option.label);
              const normalizeInputValue = StringHelper.normalize(input);
              if (!normalizeOptionValue?.toLowerCase().includes(normalizeInputValue)) {
                return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
              }
              return true;
            }}
            size="middle"
            ref={ref}
            maxTagCount="responsive"
            {...props}
            options={optionsComp}
          />
        </Popover>
      ) : (
        <Select
          showSearch
          allowClear
          filterOption={(input, option) => {
            if (props.filterOption) {
              return props.filterOption(input, option);
            }
            const normalizeOptionValue = StringHelper.normalize(option.label);
            const normalizeInputValue = StringHelper.normalize(input);
            if (!normalizeOptionValue?.toLowerCase().includes(normalizeInputValue)) {
              return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
            }
            return true;
          }}
          size="middle"
          ref={ref}
          maxTagCount="responsive"
          {...props}
          options={optionsComp}
        />
      )}
    </>
  );
};

export default React.forwardRef(SelectFormField);
