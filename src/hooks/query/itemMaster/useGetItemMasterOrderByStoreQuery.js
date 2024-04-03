import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useQuery } from 'react-query';

const useGetItemMasterOrderByStoreQuery = ({ itemCode, storeCode }) => {
  const handleGetItemMasterOrderDetails = async () => {
    const res = await ItemsMasterApi.getItemOrderOfStore(itemCode, storeCode);
    if (res.status) {
      return res.data.itemOrder[0];
    } else {
      AppMessage.error(res.message);
    }
    return {};
  };

  const itemMasterDetailsQuery = useQuery({
    queryKey: [...CONSTANT.QUERY.ITEM_MASTER.ORDER_BY_STORE_DETAILS, itemCode, storeCode],
    queryFn: handleGetItemMasterOrderDetails,
    enabled: Boolean(itemCode) && Boolean(storeCode),
  });
  return itemMasterDetailsQuery;
};

export default useGetItemMasterOrderByStoreQuery;
