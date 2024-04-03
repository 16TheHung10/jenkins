import { Checkbox, Popover, Radio, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import ArrayHelper from '../../../helpers/ArrayHelper';
import { StringHelper } from 'helpers';

const SelectStoreFormField = ({ allowSelectStoreType = false, label = 'Apply store', ...props }, ref) => {
  const { value, options, popoverTitle, popoverContent } = props;
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [storeType, setStoreType] = useState('Direct');
  const [disabled, setDisabled] = useState(props.disabled);
  const [disabledSelect, setDisabledSelect] = useState(false);
  useEffect(() => {
    setDisabled(props.disabled);
  }, [props.disabled]);
  const optionsComp = useMemo(() => {
    const filteredOptions = options.filter(
      (el) =>
        (storeType === 'Direct' && !el.isFranchise) ||
        (storeType === 'Franchise' && el.isFranchise) ||
        storeType === 'AllStore'
    );
    if (props.mode === 'multiple') {
      return [
        {
          value: -1,
          label: (
            <div className="select-store">
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    props.onChange(filteredOptions?.map((item) => item.value));
                  } else {
                    props.onChange([]);
                  }
                }}
                checked={isSelectAll}
              >
                All
              </Checkbox>
            </div>
          ),
          disabled: true,
        },
        ...filteredOptions,
      ];
    }
    return filteredOptions;
  }, [options, isSelectAll, storeType]);

  const optionsMap = useMemo(() => {
    if (!options) return null;
    const map = ArrayHelper.convertArrayToObject(options, 'value');
    return map;
  }, [options]);

  useEffect(() => {
    if (value?.length < optionsComp?.length - 1) {
      setIsSelectAll(false);
    }
    if (value?.length === optionsComp?.length - 1) {
      setIsSelectAll(true);
    }
  }, [value, optionsComp]);

  return (
    <>
      {props.mode === 'multiple' ? (
        <>
          <div className="flex gap-10 items-center" style={{ height: 22 }}>
            <span>{label}</span>
            <div className="flex">
              <Radio.Group
                disabled={disabled}
                className="flex"
                onChange={(e) => {
                  setStoreType(e.target.value);
                  if (e.target.value === 'AllStore') {
                    setDisabledSelect(true);
                    props.onChange(options?.map((item) => item.value));
                  } else {
                    if (props.onChange) {
                      props.onChange([]);
                    }
                    setDisabledSelect(false);
                  }
                }}
                value={storeType}
              >
                <Radio disabled={disabledSelect} value={'AllStore'}>
                  All
                </Radio>
                {allowSelectStoreType ? (
                  <>
                    <Radio value={'Direct'}>Direct</Radio>
                    <Radio value={'Franchise'}>Franchise</Radio>
                  </>
                ) : null}
              </Radio.Group>
            </div>
          </div>
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
                  return (option?.label?.toString().toLowerCase() ?? '').includes(
                    input.toString().trim().toLowerCase()
                  );
                }
                return true;
              }}
              size="middle"
              ref={ref}
              maxTagCount="responsive"
              {...props}
              disabled={disabledSelect}
              options={optionsComp}
            />
          </Popover>
        </>
      ) : (
        <div className="">
          <div className="flex gap-10 items-center" style={{ height: 22 }}>
            <span>{label}</span>{' '}
            <div className="flex">
              {allowSelectStoreType ? (
                <Radio.Group
                  disabled={disabled}
                  className="flex"
                  onChange={(e) => {
                    setStoreType(e.target.value);
                    if (props.onChange) {
                      props.onChange(null);
                    }
                  }}
                  value={storeType}
                >
                  <Radio value={'Direct'}>Direct</Radio>
                  <Radio value={'Franchise'}>Franchise</Radio>
                </Radio.Group>
              ) : null}
            </div>
          </div>
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
            disabled={disabledSelect}
            options={optionsComp}
          />
        </div>
      )}
    </>
  );
};

export default React.forwardRef(SelectStoreFormField);
