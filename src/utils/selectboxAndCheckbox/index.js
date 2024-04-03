import { Checkbox, Divider, Select } from 'antd';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import './style.scss';
import { useRef } from 'react';

const { Option, OptGroup } = Select;

// const data = [
//     { label: "Option A", value: "a" },
//     { label: "Option B", value: "b" },
//     { label: "Option C", value: "c" }
// ];

function SelectboxAndCheckbox(props) {
  const selectRef = useRef(null);

  const [widthBox, setWidthBox] = useState(props.widthBox || '100%');
  const [placeholder, setPlaceholder] = useState(props.setPlaceholder || 'Select...');
  const [value, setValue] = useState(props.value || []);
  const [isMode, setIsMode] = useState('');
  const [data, setData] = useState([{ value: 'loading', label: 'loading' }]);

  const [status, setStatus] = useState('');
  const [isDisable, setIsDisable] = useState(false);
  const [keyField, setKeyField] = useState('');

  useEffect(() => {
    props.data && setData(props.data);
  }, [props.data]);

  useEffect(() => {
    setIsMode(props.isMode);
  }, [props.isMode]);

  useEffect(() => {
    setIsDisable(props.isDisable);
  }, [props.isDisable]);

  useEffect(() => {
    setKeyField(props.keyField);
  }, [props.keyField]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onClear = () => {
    setValue([]);
    handleUpdateData([], keyField);
    handleFuncCallback([]);
  };

  const handleUpdateData = useCallback(
    (item, keyField) => {
      if (props.func) {
        props.func(item, keyField);
      }
    },
    [data, value, isMode, keyField]
  );

  const handleFuncCallback = useCallback(
    (val) => {
      if (props.funcCallback) {
        props.funcCallback(val);
      }
    },
    [data, value, isMode, keyField]
  );

  const handleSelectChange = (value) => {
    if (value) {
      setValue(value);
      handleUpdateData(value, keyField);
      handleFuncCallback(value);
      props.onChange && props.onChange(value);
    } else {
      setValue([]);
      handleUpdateData('', keyField);
      handleFuncCallback('');
      props.onChange && props.onChange('');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      if (data?.some((group) => group.children)) {
        setValue(data.flatMap((group) => group.children.map((option) => option.value)));
        handleUpdateData(
          data.flatMap((group) => group.children.map((option) => option.value)),
          keyField
        );
        handleFuncCallback(data.flatMap((group) => group.children.map((option) => option.value)));
      } else {
        setValue(data.map((option) => option.value));
        handleUpdateData(
          data.map((option) => option.value),
          keyField
        );
        handleFuncCallback(data.map((option) => option.value));
      }
    } else {
      if (data?.some((group) => group.children)) {
        setValue([]);
        handleUpdateData([], keyField);
        handleFuncCallback([]);
      } else {
        setValue([]);
        handleUpdateData('', keyField);
        handleFuncCallback('');
      }
    }
  };

  const filterOption = (inputValue, option) => {
    // console.log({ data, option, inputValue })
    // return data?.some((group) => group.hasOwnProperty('children')) ?
    //     (
    //         option?.value?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
    //         option?.children?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    //     )
    //     :
    //     (
    //         option?.value?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
    //         option?.children?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    //     );

    return option?.value?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 || option?.children?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  const dropdownRender = (menu) => (
    <div style={{ padding: '0 5px' }} className="fs-10">
      {isMode === 'multiple' && (
        <>
          <Checkbox
            checked={value?.length === (data?.some((group) => group.children) ? data?.flatMap((group) => group.children.map((option) => option.value)).length : data?.length)}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            All
          </Checkbox>

          <>
            {data?.map((group, index) => {
              const allSelected = group?.children?.every((option) => value?.includes(option.value));

              return data?.some((group) => group.children) ? (
                <Checkbox
                  key={index}
                  indeterminate={value && Array.isArray(value) && value.some((id) => group?.children?.some((option) => option.value === id)) && !allSelected}
                  onChange={(e) => handleSelectGroupBox(e, group?.children)}
                  checked={allSelected}
                >
                  {group.name}
                </Checkbox>
              ) : null;
            })}
          </>

          <Divider style={{ margin: '4px 0' }} />
        </>
      )}
      {menu}
    </div>
  );

  const handleSelectGroupBox = (e, group) => {
    const selectedOptionIds = group?.map((option) => option.value);

    if (e.target.checked) {
      if (value?.length > 0) {
        const mergedArray = [...new Set([...value, ...selectedOptionIds])];
        setValue(mergedArray);
        handleUpdateData(mergedArray, keyField);
        handleFuncCallback(mergedArray);
      } else {
        setValue([...selectedOptionIds]);
        handleUpdateData([...selectedOptionIds], keyField);
        handleFuncCallback([...selectedOptionIds]);
      }
    } else {
      setValue(value?.filter((id) => !selectedOptionIds.includes(id)));
      handleUpdateData(
        value?.filter((id) => !selectedOptionIds.includes(id)),
        keyField
      );
      handleFuncCallback(value?.filter((id) => !selectedOptionIds.includes(id)));
    }
  };

  // const handleDropdownVisibleChange = (open) => {
  //     if (open) {
  //         const selectedOption = selectRef.current.rcSelect.state.value;
  //         const selectedGroup = selectRef.current.rcSelect.props.children.find((group) => {
  //             return group.props.children.some((option) => option.props.value === selectedOption);
  //         });
  //         if (selectedGroup) {
  //             const groupElement = selectRef.current.rcSelect.getPopupDOMNode().querySelector(`.ant-select-item-group[label="${selectedGroup.props.label}"]`);
  //             if (groupElement) {
  //                 groupElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //             }
  //         }
  //     }
  // }

  const renderOptions = (data) =>
    data?.map((group, index) => {
      const allSelected = group?.children?.every((option) => value?.includes(option.value));

      return data?.some((group) => group.children) ? (
        <OptGroup
          key={index + group.name}
          label={
            // <Checkbox
            //     indeterminate={value && Array.isArray(value) && value.some((id) => group?.children?.some((option) => option.value === id)) && !allSelected}
            //     onChange={(e) => handleSelectGroupBox(e, group?.children)}
            //     checked={allSelected}
            // >
            //     {group.name}
            // </Checkbox>
            group.name
          }
        >
          {group?.children?.map((option, indexOpt) => (
            <Option key={indexOpt + option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </OptGroup>
      ) : (
        <Option key={index + group.value} value={group.value}>
          {group.label}
        </Option>
      );
    });

  return (
    <Select
      mode={isMode === '' ? '' : isMode} // multiple
      maxTagCount="responsive"
      value={value}
      onChange={handleSelectChange}
      dropdownRender={data?.length > 0 ? dropdownRender : null}
      showSearch
      filterOption={filterOption}
      // onDropdownVisibleChange={handleDropdownVisibleChange}

      allowClear={value && value.length !== 0}
      onClear={onClear}
      placeholder={placeholder}
      status={status === '' ? '' : status}
      disabled={isDisable}
      style={{ width: widthBox }}
    >
      {renderOptions(data)}
    </Select>
  );
}

export default React.memo(SelectboxAndCheckbox);

// [
//     {
//         "name": "Direct",
//         "children": [

//             {
//                 "value": "VN0001",
//                 "label": "VN0001 - GS25 Empress",
//                 "openedDate": "2018-01-19T00:00:00"
//             },
//             {
//                 "value": "VN0002",
//                 "label": "VN0002 - GS25 Mplaza",
//                 "openedDate": "2018-01-25T00:00:00"
//             },

//         ]
//     },
//     {
//         "name": "FC",
//         "children": [
//             {
//                 "value": "VN0033",
//                 "label": "VN0033 - GS25 ASCENT",
//                 "openedDate": "2019-04-24T00:00:00"
//             },
//             {
//                 "value": "VN0034",
//                 "label": "VN0034 - GS25 SADORA",
//                 "openedDate": "2019-05-17T00:00:00"
//             },

//         ]
//     }
// ]
