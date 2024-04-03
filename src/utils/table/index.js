import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button, Input, Radio, Space, Table, Tag } from 'antd';
import UserImg from 'components/layouts/header/profile/images/user.png';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import './style.css';

const { Column, ColumnGroup } = Table;

const topOptions = [
  {
    label: 'topLeft',
    value: 'topLeft',
  },
  {
    label: 'topCenter',
    value: 'topCenter',
  },
  {
    label: 'topRight',
    value: 'topRight',
  },
  {
    label: 'none',
    value: 'none',
  },
];

const bottomOptions = [
  {
    label: 'bottomLeft',
    value: 'bottomLeft',
  },
  {
    label: 'bottomCenter',
    value: 'bottomCenter',
  },
  {
    label: 'bottomRight',
    value: 'bottomRight',
  },
  {
    label: 'none',
    value: 'none',
  },
];

// const dataFake = [{ key: '1', name: 'John Brown', age: 32, tags: ['status 1'], }];

// const columnsFake = [{ title: 'Name', dataIndex: 'name', key: 'name', }, { title: 'Age', dataIndex: 'age', key: 'age', }, { title: 'Status', key: 'tags', dataIndex: 'tags', },];

// function TableComp({ data, column, title, isLoad }) {
const TableComp = (props) => {
  // const searchInput = useRef(null);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState('small');

  const [top, setTop] = useState('none');
  const [bottom, setBottom] = useState('bottomRight');

  const [data, setData] = useState(props.dataSource);
  const [columns, setColumns] = useState(props.columns);
  const [page, setPage] = useState(true);
  const [scroll, setScroll] = useState(props.scroll || '');

  const handleLoadingChange = (enable) => {
    setLoading(enable);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  useEffect(() => {
    setScroll(props.scroll);
  }, [props.scroll]);

  useEffect(() => {
    const nRow = props.newRow;

    setData((pre) => {
      if (nRow) {
        if (Array.isArray(nRow)) {
          handleFuncCallback([...pre, ...nRow]);
          return [...pre, ...nRow];
        } else {
          if (Object.keys(nRow).length > 0) {
            if (nRow.isDelete === true) {
              let newAr = [...pre].filter((el) => el.key !== nRow.key);

              handleFuncCallback(newAr);
              return newAr;
            } else {
              if (nRow.isUpdate && nRow.isUpdate === true) {
                handleFuncCallback(
                  [...pre].map((el) => {
                    if (el.key === nRow.key) {
                      return nRow;
                    } else {
                      return el;
                    }
                  })
                );
                return [...pre].map((el) => {
                  if (el.key === nRow.key) {
                    return nRow;
                  } else {
                    return el;
                  }
                });
              } else {
                handleFuncCallback([...pre, nRow]);
                return [...pre, nRow];
              }
            }
          } else {
            handleFuncCallback([]);
            return [];
          }
        }
      } else {
        handleFuncCallback(props.dataSource);
        return props.dataSource;
      }
    });
  }, [props.dataSource, props.newRow]);

  const handleFuncCallback = (arr) => {
    if (props.funcCallback) {
      props.funcCallback(arr);
    }
  };

  useEffect(() => {
    props.columns && setColumns(props.columns);
  }, [props.columns]);

  useEffect(() => {
    props.isLoad && setLoading(props.isLoad);
  }, [props.isLoad]);

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
  };

  const contentBody = useMemo(() => {
    return (
      <Table
        loading={loading}
        columns={columns}
        // pagination={{
        //     position: [top, bottom],
        // }}
        pagination={props.page === false ? false : { pageSize: 5, position: ['topRight'] }}
        dataSource={[...data]}
        onChange={onChange}
        size={size}
        scroll={{ y: scroll }}
        // bordered
      />
    );
  }, [loading, columns, page, data, size, scroll]);

  return contentBody;

  // return (
  //     <Table
  //         loading={loading}
  //         columns={columns}
  //         // pagination={{
  //         //     position: [top, bottom],
  //         // }}
  //         pagination={props.page === false ? false : true}
  //         dataSource={[...data]}
  //         onChange={onChange}
  //         size={size}
  //         scroll={{ y: scroll }}
  //     // bordered
  //     />
  // );
};

export default React.memo(TableComp);
