import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import { useQuery } from 'react-query';

const useGetStoreItemQuery = ({ storeCode }) => {
  const handleGetStoreItem = async () => {
    const res = await ItemsMasterApi.checkStoreItem(storeCode);
    if (res.status) {
      const items = res.data.items;
      const map = new Map();
      for (let item of items) {
        if (!map.get(item.itemCode)) {
          map.set(item.itemCode, item);
        }
      }
      return map;
    }
    return new Map();
  };

  const tvsQuery = useQuery({
    queryKey: [...CONSTANT.QUERY.STORE.ITEMS, storeCode],
    queryFn: handleGetStoreItem,
    enabled: Boolean(storeCode),
  });
  return tvsQuery;
};

export default useGetStoreItemQuery;
