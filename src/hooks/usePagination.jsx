import { Pagination } from "antd";
import { actionCreator } from "contexts";
import React, { useEffect, useState } from "react";

const usePagination = ({
  total,
  initialPageSize = 30,
  initialPageNumber = 1,
  context,
  fn,
}) => {
  const [pageNumber, setPageNumber] = useState(initialPageNumber);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const onChange = (pageNumber, pageSize) => {
    setPageNumber(pageNumber);
  };

  const onShowSizeChange = (current, size) => {
    setPageSize(size);
  };

  const handleSetPageSize = (value) => {
    setPageSize(value);
  };

  const handleSetPageNumber = (value) => {
    setPageNumber(value);
  };

  const reset = () => {
    setPageNumber(1);
    setPageSize(initialPageSize);
  };
  const setPagingProps = ({ pageSize, pageNumber }) => {
    setPageNumber(pageNumber);
    setPageSize(pageSize);
  };

  useEffect(() => {
    if (context) {
      const payload = { pageSize, pageNumber };
      context.dispatch(actionCreator("SET_PAGINATION", payload));
    }
    if (fn) fn();
  }, [pageSize, pageNumber]);
  const Component = (props) => {
    return (
      <Pagination
        total={total}
        onShowSizeChange={onShowSizeChange}
        onChange={onChange}
        pageSizeOptions={[30, 50, 100]}
        {...props}
        pageSize={+pageSize}
        current={+pageNumber}
        style={{ marginTop: "15px" }}
      />
    );
  };
  return {
    Pagination: Component,
    pageSize,
    pageNumber,
    handleSetPageSize,
    handleSetPageNumber,
    reset,
    setValues: setPagingProps,
  };
};

export default usePagination;
