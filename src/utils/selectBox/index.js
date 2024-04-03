import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Select, Input, Button, Divider, Space, message, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

function SelectBoxComp(props) {
  const inputRef = useRef(null);

  const [widthBox, setWidthBox] = useState('100%');
  const [placeholder, setPlaceholder] = useState('Select...');
  const [data, setData] = useState([{ label: 'label', value: 'value' }]);
  const [value, setValue] = useState(props.value || []);
  // const [defaultValue, setDefaultValue] = useState([]);
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [isMode, setIsMode] = useState('');
  const [isAdd, setIsAdd] = useState(props.isAdd || false);
  const [isDisable, setIsDisable] = useState(props.isDisable || false);

  const [keyField, setKeyField] = useState('');
  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    setIsAdd(props.isAdd);
  }, [props.isAdd]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setKeyField(props.keyField);
  }, [props.keyField]);

  useEffect(() => {
    setIsMode(props.isMode);
  }, [props.isMode]);

  useEffect(() => {
    setIsDisable(props.isDisable);
  }, [props.isDisable]);

  // useEffect(() => {
  //     setDefaultValue(props.defaultValue);
  // }, [props.defaultValue]);

  useEffect(() => {
    props.placeholder && setPlaceholder(props.placeholder);
  }, [props.placeholder]);

  const handleUpdateData = useCallback(
    (item, keyField) => {
      if (props.func) {
        props.func(item, keyField);
      }
    },
    [data, value, name, isMode, isAdd, keyField]
  );

  const handleFuncCallback = useCallback(
    (val) => {
      if (props.funcCallback) {
        props.funcCallback(val);
      }
    },
    [data, value, name, isMode, isAdd, keyField]
  );

  const onChange = (val) => {
    setValue(val);
    handleUpdateData(val, keyField);
    handleFuncCallback(val);
  };

  const onSearch = (value) => {
    // console.log('search:', value);
  };

  const onClear = () => {
    setValue([]);
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (event) => {
    event.preventDefault();

    if (name == '') {
      message.error('Please input new option', 3);
      return false;
    }

    let newObj = { value: name, label: name };
    setData([...data, newObj]);
    setName('');
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 0);
  };
  const contentBody = useMemo(() => {
    return (
      <>
        <Select
          {...props}
          mode={isMode === '' ? '' : isMode} // multiple
          maxTagCount="responsive"
          style={{ width: widthBox, fontSize: 12 }}
          placeholder={placeholder}
          allowClear={value && value.length !== 0}
          onClear={onClear}
          status={status === '' ? '' : status} //error,warning
          defaultValue={value}
          optionFilterProp="children"
          disabled={isDisable}
          showSearch
          onChange={onChange}
          onSearch={onSearch}
          filterOption={(input, option) => option.children.toString().includes(input)}
          filterSort={(optionA, optionB) =>
            optionA.children.toString().toLowerCase().localeCompare(optionB.children.toString().toLowerCase())
          }
          dropdownRender={(menu) => (
            <>
              {menu}
              {isAdd && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input value={name} onChange={onNameChange} />

                    <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                      Add item
                    </Button>
                  </Space>
                </>
              )}
            </>
          )}
        >
          {data
            // .sort((a, b) => a.index > b.index)
            .map((item, index) => (
              <Option key={index} style={{ fontSize: 12 }} value={item.value}>
                {item.label}
              </Option>
            ))}
        </Select>
      </>
    );
  }, [data, value, status, isMode, widthBox, placeholder, keyField, isAdd, isDisable]);

  return contentBody;
}

export default React.memo(SelectBoxComp);
// export default SelectBoxComp;
