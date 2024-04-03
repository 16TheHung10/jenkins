import React, { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './styleModelTable.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Paging from 'utils/paging';
import { Empty, Select, Spin, Tooltip } from 'antd';
import StringHelper from 'helpers/StringHelper';

const dflex = { display: 'flex' };
const jcontent = { justifyContent: 'space-between' };
const alItem = { alignItems: 'center' };
const flex1 = { flex: '1' };
const mrl = { marginLeft: 4 };
const ovfWrap = { overflowWrap: 'break-word' };
const noWrap = { whiteSpace: 'nowrap' };
const styleLoading = {
    padding: '32px 0'
}

const ModelTable = ({ columns, data, footer, initialPage = 1, updateInitialPage, initialItemsPerPage = 100, totalItems, classNameTr, buttonFilter, isCrollTop, isLoading }) => {

    const [loading, setLoading] = useState(false);
    useEffect(() => { setLoading(isLoading) }, [isLoading]);

    const [height, setHeight] = useState(window.innerHeight - 205);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const [currentPage, setCurrentPage] = useState(initialPage);
    useEffect(() => {
        setCurrentPage(initialPage)
    }, [initialPage])
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    const [totalPages, setTotalPages] = useState(1);
    const [displayedData, setDisplayedData] = useState([]);

    const tableRef = useRef(null);
    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollTo(0, 0);
        }
    }, [currentPage, isCrollTop]);

    useEffect(() => {
        const calculatedTotalPages = totalItems
            ? Math.ceil(totalItems / itemsPerPage)
            : Math.ceil(data.length / itemsPerPage);

        setTotalPages(calculatedTotalPages);

    }, [data, itemsPerPage, totalItems]);

    const requestSort = useCallback((key) => {
        let direction = 'asc';
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                direction = null;
                key = null;
            }
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    const sortedData = useMemo(
        () => {
            if (!sortConfig.key) {
                return [...data];
            }

            const compareStringValues = (a, b) => {
                if (a < b) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                if (a > b) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                return 0;
            };

            const sortableData = [...data];
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    const dateA = new Date(aValue);
                    const dateB = new Date(bValue);

                    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
                    }
                }

                return compareStringValues(aValue, bValue);
            });

            return sortableData;
        }
        , [data, sortConfig]
    );

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayedData(sortedData.slice(startIndex, endIndex));

    }, [currentPage, itemsPerPage, sortedData, data]);

    const getSortIcon = (keySort) => {
        if (sortConfig.key === keySort) {
            if (sortConfig.direction === 'asc') {
                return <FontAwesomeIcon icon={faSortUp} style={{ marginLeft: 5 }} />;
            } else if (sortConfig.direction === 'desc') {
                return <FontAwesomeIcon icon={faSortDown} style={{ marginLeft: 5 }} />;
            }
        }

        return <FontAwesomeIcon icon={faSort} style={{ marginLeft: 5 }} />;
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber === currentPage) return;
        setCurrentPage(pageNumber);
        updateInitialPage && updateInitialPage(pageNumber);
    };

    const handleChangePageSize = (pageSize) => {
        setItemsPerPage(pageSize);
    };

    const pageSizeOpt = [
        { value: 5, label: '5 / page' },
        { value: 30, label: '30 / page' },
        { value: 50, label: '50 / page' },
        { value: 100, label: '100 / page' },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerHeight < 500) {
                setHeight(500);
            } else {
                setHeight(window.innerHeight - 250);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const renderHeader = useMemo(
        () => {
            const headerRows = [];
            const colSpans = [];
            const rowSpans = [];

            columns.forEach((column, colIndex) => {
                // if (!column.notShow) {
                const colSpan = column.child ? column.child.length : 1;
                const rowSpan = column.child ? 1 : 2;

                colSpans.push(colSpan);
                rowSpans.push(rowSpan);

                headerRows.push(
                    <th key={colIndex} rowSpan={rowSpan} colSpan={colSpan} className={column.notShow == true ? 'd-none' : 'd-table-cell'} style={{ ...column.styleHead }}>
                        <div style={{ ...dflex, ...jcontent, ...ovfWrap }}>
                            <span style={{ ...flex1, position: 'relative', cursor: 'pointer' }} onClick={() => column.isSort && requestSort(column.keySort)}>
                                <div style={{ ...dflex, ...jcontent, ...alItem }}>
                                    <span style={{ ...flex1, ...columns.styleHead }}>
                                        {(typeof column.label == 'function') ? column.label() : column.label}
                                        {column.labelHeadAfter && column.labelHeadAfter()}
                                    </span>
                                    <span style={{ ...dflex, ...mrl }}>
                                        {column.isSort && (
                                            <>{getSortIcon(column.keySort)}</>
                                        )}
                                    </span>
                                </div>
                            </span>
                        </div>
                    </th>
                );
                // }
            });

            return (
                <thead>
                    <tr>{headerRows}</tr>
                    {columns.some((column) => column.child) && (
                        <MemoizedRowTheadChild columns={columns} />
                    )}
                </thead>
            );
        }, [columns, sortConfig]
    )

    const handleCountColumn = (columns) => {
        let count = 0;

        const columnsData = columns?.length > 0 ? columns : [];
        if (columnsData.length > 0) {
            count = columns?.length;
        }
        else {
            count = 1;
        }

        return count;
    }

    const renderBody = useMemo(
        () => {
            return (
                <tbody>
                    {
                        isLoading && loading == true ?
                            <tr>
                                <td colSpan={handleCountColumn(columns) || 1}>
                                    <div style={styleLoading}>
                                        <Spin tip="Loading" size="small">
                                            <div className="content" />
                                        </Spin>
                                    </div>
                                </td>
                            </tr>
                            :
                            <>
                                {
                                    displayedData?.length > 0 ?
                                        displayedData?.map((row, rowIndex) => (
                                            <MemoizedRow key={rowIndex} row={row} columns={columns} rowIndex={rowIndex} classNameTr={classNameTr} />
                                        ))
                                        :
                                        <tr>
                                            <td colSpan={handleCountColumn(columns) || 1}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></td>
                                        </tr>
                                }
                            </>
                    }

                </tbody >
            );
        }, [displayedData]
    )

    const calculateTotal = (data, field) => {
        return StringHelper.formatValue(data.reduce((sum, row) => sum + row[field], 0));
    };

    const calculateStringCount = (data, field) => {
        return data.reduce((count, row) => (row[field] === footer[field] ? count + 1 : count), 0);
    };

    const renderFooter = () => {
        if (!footer) {
            return null;
        }

        return (
            <tfoot>
                <tr>
                    {columns?.map((column, colIndex) => (
                        // !column.notShow && (
                        <Fragment key={colIndex}>
                            {column.child ? (
                                column.child?.map((child, childIndex) => (
                                    <td key={`${colIndex}-${childIndex}`}>
                                        {child.field in footer ? (
                                            typeof footer[child.field] === 'number'
                                                ? calculateTotal(data, child.field)
                                                : calculateStringCount(data, child.field)
                                        ) : null}
                                    </td>
                                ))
                            ) : (
                                <td>
                                    {column.field in footer ? (
                                        typeof footer[column.field] === 'number'
                                            ? calculateTotal(data, column.field)
                                            : calculateStringCount(data, column.field)
                                    ) : null}
                                </td>
                            )}
                        </Fragment>
                        // )
                    ))}
                </tr>
            </tfoot>
        );
    };

    const renderPageSizeAndPaging = () => {
        return (
            <div className='text-right'>
                <Paging currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

                <div className='d-inline-block' style={{ paddingLeft: 5 }}>
                    <Select options={pageSizeOpt} defaultValue={itemsPerPage} onChange={handleChangePageSize} style={{ width: 101 }} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <>
                {buttonFilter && buttonFilter()}

            </>

            {/* {data?.length > 0 && renderPageSizeAndPaging()} */}

            <div ref={tableRef} style={{ maxHeight: height, overflow: 'auto', maxWidth: '100%', clear: 'both' }} className='pos-relative'>
                <table className='modelTable'>
                    {renderHeader}
                    {renderBody}
                    {renderFooter()}
                </table>
            </div>
            {data?.length > 0 ? <>
                {renderPageSizeAndPaging()}
            </> : null
            }
        </div>
    );
};

export default React.memo(ModelTable);

const MemoizedRowTheadChild = memo(({ columns }) => {
    return (
        <tr>
            {columns?.map((column, colIndex) => (
                // !column.notShow && 
                column.child ? (
                    column.child?.map((child, childIndex) => (
                        <MemoizedThTheadChild key={`${colIndex}-${childIndex}`} child={child} />
                    ))
                ) : null
            ))}
        </tr>
    )
})

const MemoizedThTheadChild = memo(({ child }) => {
    return (
        <th className={child.notShow == true ? 'd-none' : 'd-table-cell'}>
            {child.label || child.field}
        </th>
    )
})


const MemoizedRow = memo(({ row, columns, rowIndex, classNameTr }) => {
    return (
        <tr className={classNameTr && classNameTr(row)}>
            {columns?.map((column, colIndex) => (
                // !column.notShow && (
                <Fragment key={colIndex}>
                    {column.child ? (
                        column.child?.map((child, childIndex) => (
                            <MemoizedTd row={row} rowIndex={rowIndex} column={child} />
                        ))
                    ) : (
                        <MemoizedTd row={row} rowIndex={rowIndex} column={column} />
                    )}
                </Fragment>
                // )
            ))}
        </tr>
    )
})

const MemoizedTd = memo(({ row, rowIndex, column }) => {
    return (
        <td style={{ ...noWrap, ...column.styleBody, borderBottom: '1px solid rgba(0,0,0,.06)' }} className={column.notShow == true ? 'd-none' : (((column.funcClassBody !== undefined ? column.funcClassBody(row) : ' ') + 'd-table-cell'))}>
            {column.formatBody ? column.formatBody(row[column.field], row, rowIndex) : row[column.field]}
        </td>
    )
})

// const columns = [
//     { field: 'itemCode', label: 'Item', formatBody: (val, item) => <span>{val}</span> },
//     { field: 'unit', label: 'Unit', formatBody: (val, item) => <span>{val}</span> },
//     { field: 'itemName', label: '', notShow: true, },
//     { field: 'qty', label: 'Qty', formatBody: (val, item) => <span>{val}</span> },
//     { field: 'soh', label: 'SOH', formatBody: (val, item) => <span>{val}</span> },
//     { field: 'approved', label: '', notShow: true, },
//     { field: 'costPrice', label: 'Cost', formatBody: (val, item) => <span>{val}</span> },
//     { field: 'totalPrice', label: 'Value', formatBody: (val, item) => <span>{val}</span> },
//     {
//         field: 'key khong ton tai',
//         label: 'cột cha',
//         child: [
//             { field: 'child1', label: 'Child1', },
//             { field: 'child2', label: 'Child2', }
//         ]
//     }
// ];

// const data = [
//     { itemCode: '001', itemName: 'Item 1', unit: 'pcs1', qty: 10, soh: 50, approved: true, costPrice: 5, totalPrice: 50 },
//     { itemCode: '002', itemName: 'Item 2', unit: 'pcs2', qty: 20, soh: 30, approved: false, costPrice: 3, totalPrice: 60 },
//     { itemCode: '003', child1: 'giatrichild1', child2: 'giatrichild2', itemName: 'Child 1', unit: 'pcs3', qty: 20, soh: 30, approved: false, costPrice: 3, totalPrice: 60 },
// ];

// const footerData = { itemCode: '', qty: 0 };