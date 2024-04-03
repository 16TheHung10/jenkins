import { Empty, Select, Spin, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Paging from '../paging';
import { Fragment } from 'react';
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faSortAlphaDown, faSortAlphaUp } from '@fortawesome/free-solid-svg-icons';

const pageSizeOpt = [
  { value: 30, label: '30 / page' },
  { value: 50, label: '50 / page' },
  { value: 100, label: '100 / page' },
];

function TableCustom({
  children,
  data,
  dataCheckboxAll,
  dataCheck,
  columns,
  isLoading,
  fullWidth,
  sumFooter,
  isPaging,
  totalNumItems,
  currentPageComp,
  onSearch,
  onDoubleClick,
  updateListCheckbox,
  updatePage,
  classNameTr,
  attrData,
  attrGroup,
  attrItemCode,
  pageSize,
  isPageSize,
  updatePageSize,
  // checkboxDefault,
  // updateListcheckboxDefault
}) {
  const styleLoading = {
    padding: '32px 0',
  };

  const [countKeyD, setCountKeyD] = useState({});

  const [isPagingTable, setIsPagingTable] = useState(true);
  const [height, setHeight] = useState(window.innerHeight - 250);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [items, setItems] = useState([]);
  const [thead, setThead] = useState([]);
  const [hThead, setHThead] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [dataTb, setData] = useState([...data] || []);

  const [sumFooterTable, setSumFooterTable] = useState(null);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize || 50);
  // const itemsPerPage = 30;
  const totalPages = totalNumItems ? Math.ceil(totalNumItems / itemsPerPage) : Math.ceil(data.length / itemsPerPage);

  const startIndex = currentPageComp ? (onSearch ? 0 : (currentPageComp - 1) * itemsPerPage) : (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = isPagingTable ? dataTb.slice(startIndex, endIndex) : dataTb;

  useEffect(() => {
    function handleResize() {
      if (window.innerHeight < 500) {
        setHeight(500);
      } else {
        setHeight(window.innerHeight - 250);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    currentPageComp && setCurrentPage(currentPageComp);
  }, [currentPageComp]);
  useEffect(() => {
    !currentPageComp && setCurrentPage(1);
    // (dataCheckboxAll && setSelectedRows([]));
  }, [data]);
  useEffect(() => {
    setThead(columns);
  }, [columns]);

  useEffect(() => {
    setData(data);
  }, [data]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);
  useEffect(() => {
    setIsFullWidth(fullWidth);
  }, [fullWidth]);
  useEffect(() => {
    setSumFooterTable(sumFooter);
  }, [sumFooter]);
  useEffect(() => {
    isPaging === undefined ? setIsPagingTable(true) : setIsPagingTable(isPaging);
  }, [isPaging]);
  useEffect(() => {
    const h = document.getElementsByTagName('thead')[0].offsetHeight;
    setHThead(h);
  }, []);

  useEffect(() => {
    dataCheck && setSelectedRows(dataCheck);
  }, [dataCheck]);

  // useEffect(() => { checkboxDefault && setSelectedRows(checkboxDefault) }, [checkboxDefault]);

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
        key = null;
      }
    }

    const sortedData = [...data].sort((a, b) => {
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      } else if (a[key] instanceof Date && b[key] instanceof Date) {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      } else if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      } else {
        return 0; // Trường hợp không xác định, giữ nguyên thứ tự
      }
    });

    setData(sortedData);
    setSortConfig({ key, direction });

    // return sortedData;
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === 'asc') {
        return <FontAwesomeIcon icon={faSortUp} style={{ marginLeft: 5 }} />;
      } else if (sortConfig.direction === 'desc') {
        return <FontAwesomeIcon icon={faSortDown} style={{ marginLeft: 5 }} />;
      }
    }

    return <FontAwesomeIcon icon={faSort} style={{ marginLeft: 5 }} />;
  };

  const handleRowClick = (id) => {
    const index = selectedRows.indexOf(id);

    if (index === -1) {
      setSelectedRows([...selectedRows, id]);
      if (updateListCheckbox) {
        updateListCheckbox([...selectedRows, id]);
      }
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      if (updateListCheckbox) {
        updateListCheckbox(selectedRows.filter((rowId) => rowId !== id));
      }
    }
  };

  const handleAllClick = () => {
    if (dataCheckboxAll) {
      if (selectedRows.length === dataCheckboxAll.length) {
        setSelectedRows([]);
        if (updateListCheckbox) {
          updateListCheckbox([]);
        }
      } else {
        setSelectedRows(dataCheckboxAll.map((row) => row.privateKey));
        if (updateListCheckbox) {
          updateListCheckbox(dataCheckboxAll.map((row) => row.privateKey));
        }
      }
    } else {
      if (selectedRows.length === data.length) {
        setSelectedRows([]);
        if (updateListCheckbox) {
          updateListCheckbox([]);
        }
      } else {
        setSelectedRows(data.map((row) => row.privateKey));
        if (updateListCheckbox) {
          updateListCheckbox(data.map((row) => row.privateKey));
        }
      }
    }
  };

  const handleRemoveItem = (id, key) => {
    // setItems(items => items[key] !== id)
  };

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
    handleOnSearch(newPage);
    handleUpdatePage(newPage);
    onSearch !== null && setSelectedRows([]);
  };

  const handleUpdatePage = (currentPage) => {
    updatePage && updatePage(currentPage);
  };

  const handleOnSearch = (currentPage, pageSizeChange) => {
    onSearch && onSearch(currentPage, pageSizeChange);
  };

  const handleCountColumn = (columns) => {
    let count = 0;

    const columnsData = [...columns];
    if (columnsData.length > 0) {
      for (let index in columnsData) {
        const item = columnsData[index];

        for (let key in item) {
          if (item[key]?.children && item[key]?.children?.length > 0) {
            for (let indexChild in item[key].children) {
              let elChild = item[key].children[indexChild];
              if (elChild.colSpanHead) {
                count = count + parseInt(elChild?.colSpanHead);
              } else {
                count++;
              }
            }
          } else {
            if (item[key]?.colSpanHead) {
              count = count + parseInt(item[key]?.colSpanHead);
            } else {
              count++;
            }
          }
        }
      }
    } else {
      count = 1;
    }

    return count;
  };

  const handleFormatValue = (val) => {
    let newVal = val
      ? (parseFloat(val) || 0).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
      : ' - ';
    return newVal;
  };

  const handleSumFooter = (key) => {
    let val = 0;

    if (typeof sumFooterTable[key] === 'string') {
      for (let index in data) {
        val++;
      }
    } else if (typeof sumFooterTable[key] === 'number' && !isNaN(sumFooterTable[key])) {
      sumFooterTable[key] = 0;

      for (let index in data) {
        sumFooterTable[key] += parseFloat(data[index][key] || 0);
      }

      val = sumFooterTable[key];
    } else if (typeof sumFooterTable[key] === 'function') {
      // sumFooterTable[key] = 0;
      let valSum = 0;

      for (let index in data) {
        valSum += parseFloat(sumFooterTable[key](data[index])) || 0;
      }

      val = valSum;
    } else {
      val = 0;
    }

    return val;
  };

  const handleChangePageSize = (val) => {
    setItemsPerPage(val);
    setCurrentPage(1);
    handleUpdatePage(1);
    updatePageSize && updatePageSize(val);
    handleOnSearch(1, val);
  };

  const countRowSpan = (arr, field, val) => {
    const count = arr.reduce((total, item) => {
      if (item[field] === val) {
        return total + 1;
      }
      return total;
    }, 0);
    return count;
  };

  const bodyContent = useMemo(() => {
    return (
      <div className={!isFullWidth ? 'd-inline-block' : null} style={{ maxWidth: '100%', width: '100%' }}>
        {data?.length > 0 ? (
          <>
            {children}
            {isPagingTable !== undefined && isPagingTable ? (
              <div className="text-right">
                <Paging currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                {/* {
                                            (isPageSize !== undefined && isPageSize === true) &&
                                            <div className='d-inline-block' style={{ paddingLeft: 5 }}>
                                                <Select options={pageSizeOpt} defaultValue={itemsPerPage} onChange={handleChangePageSize} style={{ width: 101 }} />
                                            </div>
                                        } */}
                <div className="d-inline-block" style={{ paddingLeft: 5 }}>
                  <Select options={pageSizeOpt} defaultValue={itemsPerPage} onChange={handleChangePageSize} style={{ width: 101 }} />
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        <div
          style={{
            maxHeight: height,
            overflow: 'auto',
            maxWidth: '100%',
            width: '100%',
            clear: 'both',
          }}
          className={!isFullWidth ? 'pos-relative d-inline-block' : 'pos-relative'}
        >
          <table className="table" style={{ minWidth: 200 }}>
            <thead style={{ zIndex: 4 }}>
              <tr>
                {thead?.map((column, indexColumn) => (
                  <Fragment key={indexColumn}>
                    {column.typeComp && column.typeComp === 'checkbox' ? (
                      <th colSpan={column.colSpanHead || 1} rowSpan={column.rowSpanHead || 1}>
                        <input type="checkbox" checked={dataCheckboxAll ? selectedRows.length === dataCheckboxAll.length : selectedRows.length === data.length} onChange={handleAllClick} />
                      </th>
                    ) : null}
                    {column.colSpanHead == 0 ? null : (
                      <>
                        {column.field !== 'privateKey' ? (
                          <>
                            {column.notShow !== undefined && column.notShow === true ? null : (
                              <th
                                key={indexColumn}
                                className={column.classHead}
                                style={column.styleHead}
                                colSpan={column.colSpanHead || 1}
                                rowSpan={column.rowSpanHead || 1}
                                onClick={() => sortData(column.keySort)}
                              >
                                {column.labelHead && column.labelHead()}
                                {column.label}
                                {column.isSort !== undefined && column.isSort === true && getSortIcon(column.keySort)}
                              </th>
                            )}
                          </>
                        ) : null}
                      </>
                    )}
                  </Fragment>
                ))}
              </tr>
              {thead?.some((column) => column.children) && (
                <tr>
                  {thead?.map((column, indexColumn) => (
                    <Fragment key={indexColumn}>
                      {column.children?.map((child, indexChild) => (
                        <Fragment key={indexChild}>
                          {child.field !== 'privateKey' ? (
                            <>
                              {child.notShow !== undefined && child.notShow === true ? null : (
                                <th key={indexChild} className={child.classHead} style={child.styleHead} colSpan={child.colSpanHead || 1} rowSpan={child.rowSpanHead || 1}>
                                  {child.label}
                                </th>
                              )}
                            </>
                          ) : null}
                        </Fragment>
                      ))}
                    </Fragment>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData?.map((row, indexRow) => (
                  <tr
                    key={indexRow}
                    onDoubleClick={() => onDoubleClick && onDoubleClick(row)}
                    className={classNameTr && classNameTr(row)}
                    data-id={attrData && attrData(row)}
                    data-group={attrGroup && attrGroup(row)}
                    data-item-code={attrItemCode && attrItemCode(row)}
                  >
                    {thead?.map((column, indexColumn) => (
                      <Fragment key={indexColumn}>
                        {column.typeComp && column.typeComp === 'checkbox' ? (
                          <td>
                            <input
                              type="checkbox"
                              className={column.checkDisable && column.checkDisable(row) === true ? 'hide' : ''}
                              disabled={column.checkDisable ? column.checkDisable(row) : false}
                              checked={selectedRows.includes(row[column.mainKey])}
                              onChange={() => handleRowClick(row[column.mainKey])}
                            />
                          </td>
                        ) : null}

                        {column.field !== '' ? (
                          <>
                            {column.field !== 'privateKey' ? (
                              <>
                                {column.notShow !== undefined && column.notShow === true ? null : (
                                  <td
                                    className={
                                      (column.funcClassBody !== undefined ? column.funcClassBody(row) : ' ') +
                                      column.classBody +
                                      ' table-cell ' +
                                      (column.isCompare?.length > 0
                                        ? row[column.isCompare[0]] > row[column.isCompare[1]] || row[column.isCompare[0]] !== row[column.isCompare[1]]
                                          ? column.styleCompare
                                          : ''
                                        : '')
                                    }
                                    style={column.isRemoveDuplicate ? { ...column.styleBody, top: hThead } : { ...column.styleBody }}
                                    colSpan={column.colSpanBody || 1}
                                    rowSpan={column.rowSpanBody || 1}
                                    data-firstorder={(column.firstorder && column.firstorder(row)) || ''}
                                  >
                                    {column.isTooltip === true ? (
                                      <Tooltip
                                        overlayInnerStyle={{ fontSize: 10 }}
                                        arrow={{ pointAtCenter: true }}
                                        title={column.formatBody ? column.formatBody(row[column.field], column, row) : row[column.field]}
                                        color={'black'}
                                      >
                                        {column.formatBody ? column.formatBody(row[column.field], column, row) : row[column.field]}
                                      </Tooltip>
                                    ) : (
                                      <>{column.formatBody ? column.formatBody(row[column.field], column, row) : row[column.field]}</>
                                    )}
                                  </td>
                                )}
                              </>
                            ) : null}
                          </>
                        ) : (
                          column?.children.map((child, indexChild) => (
                            <Fragment key={indexChild}>
                              {child.field !== 'privateKey' ? (
                                <>
                                  {child.notShow !== undefined && child.notShow === true ? null : (
                                    <td
                                      className={
                                        child.classBody +
                                        ' table-cell ' +
                                        (currentData[indexRow - 1] &&
                                        currentData[indexRow][child.field] === currentData[indexRow - 1][child.field] &&
                                        child.isRemoveDuplicate === true &&
                                        currentData[indexRow][child.isKeyCheck] === currentData[indexRow - 1][child.isKeyCheck]
                                          ? ' op-0 '
                                          : child.isRemoveDuplicate === true
                                          ? ' td-sticky '
                                          : '') +
                                        (child.isRemoveDuplicate && child.isRemoveDuplicate == true ? ' border-none ' : '') +
                                        (child.isCompare?.length > 0 ? (row[child.isCompare[0]] > row[child.isCompare[1]] ? child.styleCompare : '') : '')
                                      }
                                      style={
                                        child.isRemoveDuplicate
                                          ? {
                                              ...child.styleBody,
                                              top: hThead,
                                              verticalAlign: 'top',
                                            }
                                          : { ...child.styleBody }
                                      }
                                      colSpan={child.colSpanBody || 1}
                                      rowSpan={column.rowSpanBody || 1}
                                    >
                                      {child.isTooltip === true ? (
                                        <Tooltip
                                          overlayInnerStyle={{ fontSize: 10 }}
                                          arrow={{ pointAtCenter: true }}
                                          title={child.formatBody ? child.formatBody(row[child.field], child, row) : row[child.field]}
                                          color={'black'}
                                        >
                                          {child.formatBody ? child.formatBody(row[child.field], child, row) : row[child.field]}
                                        </Tooltip>
                                      ) : (
                                        <>{child.formatBody ? child.formatBody(row[child.field], child, row) : row[child.field]}</>
                                      )}
                                    </td>
                                  )}
                                </>
                              ) : null}
                            </Fragment>
                          ))
                        )}
                      </Fragment>
                    ))}
                  </tr>
                ))
              ) : loading ? (
                <tr>
                  <td colSpan={handleCountColumn(columns) || 1}>
                    <div style={styleLoading}>
                      <Spin tip="Loading" size="small">
                        <div className="content" />
                      </Spin>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={handleCountColumn(columns) || 1}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </td>
                </tr>
              )}
            </tbody>

            {sumFooterTable && Object.keys(sumFooterTable).length > 0 ? (
              <tfoot style={{ zIndex: 3 }}>
                <tr>
                  {thead?.map((column, indexColumn) => (
                    <Fragment key={indexColumn}>
                      {column.typeComp && column.typeComp === 'checkbox' ? (
                        <td colSpan={column.colSpanBody || 1} rowSpan={column.rowSpanBody || 1}>
                          {/* <input type="checkbox" checked={selectedRows.length === data.length} onChange={handleAllClick} /> */}
                        </td>
                      ) : null}
                      {column.field !== '' ? (
                        <>
                          {column.field !== 'privateKey' ? (
                            <>
                              {column.notShow !== undefined && column.notShow === true ? null : (
                                <td className={column.classBody + ' ' + 'table-cell'} colSpan={column.colSpanBody || 1} rowSpan={column.rowSpanBody || 1}>
                                  {column.isTooltip ? (
                                    <Tooltip overlayInnerStyle={{ fontSize: 10 }} arrow={{ pointAtCenter: true }} title={handleFormatValue(handleSumFooter(column.field))} color={'black'}>
                                      {handleFormatValue(handleSumFooter(column.field))}
                                    </Tooltip>
                                  ) : (
                                    <>{handleFormatValue(handleSumFooter(column.field))}</>
                                  )}
                                </td>
                              )}
                            </>
                          ) : null}
                        </>
                      ) : (
                        column?.children.map((child, indexChild) => (
                          <Fragment key={indexChild}>
                            {child.field !== 'privateKey' ? (
                              <>
                                {child.notShow !== undefined && child.notShow === true ? null : (
                                  <td className={child.classBody + ' ' + 'table-cell'} colSpan={child.colSpanBody || 1} rowSpan={child.rowSpanBody || 1}>
                                    {child.isTooltip ? (
                                      <Tooltip overlayInnerStyle={{ fontSize: 10 }} arrow={{ pointAtCenter: true }} title={handleFormatValue(handleSumFooter(child.field))} color={'black'}>
                                        {handleFormatValue(handleSumFooter(child.field))}
                                      </Tooltip>
                                    ) : (
                                      <>{handleFormatValue(handleSumFooter(child.field))}</>
                                    )}
                                  </td>
                                )}
                              </>
                            ) : null}
                          </Fragment>
                        ))
                      )}
                    </Fragment>
                  ))}
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </div>
    );
  }, [
    data,
    columns,
    isLoading,
    fullWidth,
    sumFooter,
    isPaging,
    totalNumItems,
    currentPageComp,
    onSearch,
    currentData,
    currentPage,
    dataCheckboxAll,
    sumFooterTable,
    dataCheck,
    sortConfig,
    dataTb,
    itemsPerPage,
    pageSize,
    // selectedRows
  ]);

  return bodyContent;
}

export default TableCustom;

// (

//     {
//         // thead?.map((column, indexColumn) => (
//             <Fragment key={indexColumn}>
//                 {
//                     column.children?.map((child, indexChild) => (
//                         <td key={indexChild} colSpan={child.colSpanHead || 1} rowSpan={child.rowSpanHead || 1}>{sumFooterTable[child.field]}</td>
//                     ))
//                 }
//             </Fragment>
//         // ))
//     }

// )
// :
// (
//     <td key={indexColumn} colSpan={column.colSpanHead || 1} rowSpan={column.rowSpanHead || 1}>{sumFooterTable[column.field]}</td>
// )

// let columns = [
//     { field: 'privateKey', label: '', classHead: 'fs-10', styleHead: {}, classBody: 'fs-10', styleBody: {}, mainKey: 'orderID', typeComp: 'checkbox', checkDisable: this.returnStatusCheckBox },
//     { field: 'class', label: 'Class', classHead: 'fs-10 text-center', styleHead: {}, classBody: 'fs-10 text-center', funcClassBody: highLightText, styleBody: {}, },
//     { field: 'orderID', label: '', classHead: 'fs-10', styleHead: {}, classBody: 'fs-10', styleBody: {}, colSpanHead: 0, colSpanBody: 0, notShow: true },
//     { field: 'dateKey', label: 'Date', classHead: 'fs-10', styleHead: {}, classBody: 'fs-10', styleBody: {}, formatBody: this.handleFormatBody },
//     { field: 'invoiceCode', label: 'Invoice', classHead: 'fs-10', styleHead: {}, classBody: 'fs-10', styleBody: {}, },
//     { field: 'counterCode', label: 'Counter', classHead: 'fs-10', styleHead: {}, classBody: 'fs-10', styleBody: {}, },
//     { field: 'invoiceType', label: 'Status', classHead: 'fs-10', styleHead: {}, classBody: 'fs-10', styleBody: {}, formatBody: this.handleFormatStatus },
//     { field: 'log', label: '', formatBody: this.handleFormatLog },
// {
//     field: '', label: 'Qty', classHead: 'fs-10 border-none text-center', styleHead: {}, colSpanHead: '2', classBody: 'fs-10', styleBody: {}, children: [
//         { field: 'billCount', label: 'Invoice', classHead: 'fs-10 text-right', styleHead: { border: 'none', borderTop: '1px solid orange' }, classBody: 'fs-10 text-right', styleBody: { background: 'antiquewhite' }, formatBody: this.handleFormatValue },
//         { field: 'customerCount', label: 'Customer', classHead: 'fs-10 text-right', styleHead: { border: 'none', borderTop: '1px solid orange' }, classBody: 'fs-10 text-right', styleBody: { background: 'antiquewhite' }, formatBody: this.handleFormatValue },
//     ]
// },
// ];

// let data = createDataTable(results, columns);

// onClick={() => handleRemoveItem(row[column.field], column.field)}
