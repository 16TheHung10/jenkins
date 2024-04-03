import { useQuery } from 'react-query';

const useCheckStoreItemQuery = ({ storeCode, type }) => {
  const handleCheckStoreItem = async () => {
    if (!type) {
      throw new Error('Missing type');
    }
    const res = await ItemsMasterApi.checkStoreItem(storeCode);
    if (res.status) {
      if (res.data.items?.length > 0) {
        if (type === 'gt') return true;
        if (type === 'lt') return false;
      }
    }
    if (type === 'gt') return false;
    if (type === 'lt') return true;
  };

  const tvsQuery = useQuery({
    queryKey: ['items-master', 'store', storeCode],
    queryFn: handleCheckStoreItem,
    enabled: Boolean(storeCode),
  });
  return tvsQuery;
};

export default useCheckStoreItemQuery;
