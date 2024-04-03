import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useQuery } from 'react-query';

const useGetItemMasterDetailsByStoreQuery = ({ itemCode, storeCode }) => {
  const handleGetItemMasterDetails = async () => {
    const res = await ItemsMasterApi.getItemOfStore(itemCode, storeCode);
    if (res.status) {
      return res.data.itemStore[0];
    } else {
      AppMessage.error(res.message);
    }
    return {};
  };

  const itemMasterDetailsQuery = useQuery({
    queryKey: [...CONSTANT.QUERY.ITEM_MASTER.BY_STORE_DETAILS, itemCode, storeCode],
    queryFn: handleGetItemMasterDetails,
    enabled: Boolean(itemCode) && Boolean(storeCode),
  });
  return itemMasterDetailsQuery;
};

export default useGetItemMasterDetailsByStoreQuery;
