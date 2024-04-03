import React, { useEffect } from "react";

const useTestHook = ({ count }) => {
  useEffect(() => {
    return () => {};
  }, [count]);
  return { Component: 1 };
};

export default useTestHook;
