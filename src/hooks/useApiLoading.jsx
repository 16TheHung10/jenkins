import { useState } from "react";

const useApiLoading = ({ fn }) => {
  const [loading, setLoading] = useState(false);

  const trigger = async (params) => {
    setLoading(true);
    const res = await fn(params);
    setLoading(false);
    return res;
  };
  return { trigger, loading };
};

export default useApiLoading;
