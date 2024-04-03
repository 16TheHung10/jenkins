import React, { useState } from "react";

const usePaginationTable = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onChangePageNumber = (pageNumber) => {
    setPageNumber(pageNumber);
  };
  const onShowSizeChange = (e, pageSize) => {
    setPageSize(pageSize);
  };
  return {
    current: pageNumber,
    pageSize,
    onChange: onChangePageNumber,
    onShowSizeChange,
    showSizeChange: true,
  };
};

export default usePaginationTable;
