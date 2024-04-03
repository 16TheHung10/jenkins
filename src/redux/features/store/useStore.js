import React from "react";
import { useSelector, useDispatch } from "react-redux";
const useStore = () => {
  const dispatch = useDispatch();
  const { name } = useSelector((state) => state.store);
  return { name };
};

export default useStore;
