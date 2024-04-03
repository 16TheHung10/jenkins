import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useQuery } from 'react-query';

const useGetItemMasterCombineQuery = ({ itemCode }) => {
  const handleGetItemMasterCombine = async () => {
    const res = await ItemsMasterApi.getItemCombineV2(itemCode);
    if (res.status) {
      return res.data.itemCombine;
    } else {
      AppMessage.error(res.message);
    }
    return [];
  };

  const itemMasterDetailsQuery = useQuery({
    queryKey: [...CONSTANT.QUERY.ITEM_MASTER.COMBINE, itemCode],
    queryFn: handleGetItemMasterCombine,
    enabled: Boolean(itemCode),
  });
  return itemMasterDetailsQuery;
};

export default useGetItemMasterCombineQuery;
