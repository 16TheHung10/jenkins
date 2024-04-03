import { AutoComplete } from 'antd';
import { useHistory } from 'react-router-dom';
import { ArrayHelper } from 'helpers';
import React, { useState } from 'react';
import './style.scss';
import { useAppContext } from 'contexts';

const SearchInput = () => {
  const { state: AppState } = useAppContext();
  const history = useHistory();
  const [options, setOptions] = useState([]);

  const onSelect = (data) => {
    history.push(data);
  };

  return (
    <div id="input_search" className="flex items-center">
      {/* <Icons.Search /> */}
      <AutoComplete
        options={options}
        style={{
          width: '100%',
        }}
        dropdownStyle={{
          zIndex: 999999999,
        }}
        onSelect={onSelect}
        onSearch={(text) => {
          const res = ArrayHelper.findChildInNestedArray2(AppState.menus, text, 'name')
            ?.filter((el) => el.childrens.length === 0)
            ?.map((item) => {
              return {
                value: item.url,
                key: item.id,
                label: item.name,
              };
            });
          setOptions(res.filter((el) => el.value !== ''));
        }}
        placeholder="Search page"
      />
    </div>
  );
};

export default SearchInput;
