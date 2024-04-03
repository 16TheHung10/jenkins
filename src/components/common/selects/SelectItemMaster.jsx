import { message } from 'antd';
import { ItemsMasterApi } from 'api';
import SelectFormField from 'components/common/selects/SelectFormField';
import { useAppContext } from 'contexts';
import React, { useEffect, useRef, useState } from 'react';

const SelectItemMaster = ({ initialOptions, onChange, onGetSelectedItemDetail, ...props }) => {
  const [renderFlag, setRenderFlag] = useState(0);
  const [itemOptions, setItemOptions] = useState(initialOptions || []);

  const handleGetItemOptions = async (keyword) => {
    if (!keyword || keyword.length <= 2) return;
    const res = await ItemsMasterApi.getItemOptions(keyword);
    if (res.status) {
      const payload = res.data?.items?.map((item) => {
        return {
          value: item.barcode,
          label: item.barcode + ' - ' + item.itemName,
          key: item.barcode,
        };
      });
      setItemOptions(payload);
    } else {
      message.error(res.message);
    }
  };

  const serachItemRef = useRef();

  const handleSearchItem = (searchValue) => {
    if (serachItemRef.current) {
      clearTimeout(serachItemRef.current);
    }
    serachItemRef.current = setTimeout(() => {
      handleGetItemOptions(searchValue);
    }, 300);
  };

  useEffect(() => {
    setRenderFlag(1);
  }, []);
  useEffect(() => {
    if (initialOptions?.length === 0) handleSearchItem(props.value);
    else {
      setItemOptions(initialOptions);
    }
  }, [props.value, initialOptions]);

  return (
    <SelectFormField
      onSearch={(value) => {
        handleSearchItem(value);
      }}
      placeholder="Enter value to search..."
      options={itemOptions}
      onChange={(value) => {
        const selectedOption = itemOptions.find((el) => el.value === value);
        onChange(value, selectedOption);
        onGetSelectedItemDetail && onGetSelectedItemDetail(selectedOption);
      }}
      {...props}
    />
  );
};

export default SelectItemMaster;
