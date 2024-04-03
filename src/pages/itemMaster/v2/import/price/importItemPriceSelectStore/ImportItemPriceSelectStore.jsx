import { Input, Tree } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

const ImportItemPriceSelectStore = ({ treeData: defaultData, onCheck, disabled }) => {
  const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef();
  const dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title, parentKey } = node;
      dataList.push({
        key,
        title,
        parentKey,
      });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(defaultData);

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const handleExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const handleCheck = (checkedKeysValue, info) => {
    onCheck(checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };
  const handleSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  const handleSearch = (e) => {
    const { value } = e.target;

    if (!value) {
      setExpandedKeys([]);
    } else {
      if (searchRef.current) clearTimeout(searchRef.current);
      searchRef.current = setTimeout(() => {
        const newExpandedKeys = dataList
          .map((item) => {
            if (item.title.toUpperCase().indexOf(value.toUpperCase()) > -1) {
              return item.parentKey;
            }
            return null;
          })
          .filter((item, i, self) => {
            return item && self.indexOf(item) === i;
          });
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
      }, 500);
    }
  };

  const treeDataWithSearch = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const strTitle = item.title?.toUpperCase();
        const index = strTitle.indexOf(searchValue?.toUpperCase());
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue?.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="highlight">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return {
            title,
            key: item.key,
            children: loop(item.children),
          };
        }
        return {
          title,
          key: 'Store-' + item.key,
        };
      });
    return loop(defaultData);
  }, [searchValue, defaultData]);

  return (
    <>
      <Input
        style={{
          marginBottom: 8,
        }}
        placeholder="Search"
        onChange={handleSearch}
        allowClear
      />
      <Tree
        disabled={disabled}
        checkable
        onExpand={handleExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={handleCheck}
        checkedKeys={checkedKeys}
        onSelect={handleSelect}
        selectedKeys={selectedKeys}
        treeData={[{ title: 'All', key: 'all', children: treeDataWithSearch || [] }]}
      />
    </>
  );
};

export default ImportItemPriceSelectStore;
