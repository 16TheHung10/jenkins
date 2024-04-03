import { message } from 'antd';
import { DigitalSignageTVApi } from 'api';
import React from 'react';
import { useQuery } from 'react-query';

const useTVsQuery = ({ searchFormValue, setTotalValue }) => {
  const handleGetTVs = async () => {
    const res = await DigitalSignageTVApi.getTVs(searchFormValue);
    if (res.status) {
      const data = res.data.tvs;
      const map = new Map();
      for (let tvCode of Object.keys(data || {})) {
        const tv = data[tvCode];
        if (map.has(tv.storeCode || '')) {
          const currentTVs = map.get(tv.storeCode || '');
          map.set(tv.storeCode || '', [...currentTVs, tv]);
        } else {
          map.set(tv.storeCode || '', [tv]);
        }
      }
      const groupByStoreCode = Object.fromEntries(map);
      console.log({ res: res.data });
      setTotalValue && setTotalValue({ totalTV: res.data?.totalTV, totalStore: res.data?.totalStore });
      return groupByStoreCode;
    } else {
      message.error(res.message);
    }
  };

  const tvsQuery = useQuery({
    queryKey: ['tv', searchFormValue || {}],
    queryFn: handleGetTVs,
    enabled: Boolean(setTotalValue),
  });
  return tvsQuery;
};

export default useTVsQuery;
