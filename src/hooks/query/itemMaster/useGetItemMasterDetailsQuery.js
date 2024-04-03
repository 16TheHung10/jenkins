import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useQuery } from 'react-query';

const useGetItemMasterDetailsQuery = ({ itemCode }) => {
  const handleGetItemMasterDetails = async () => {
    const res = await ItemsMasterApi.getItemsDetailsV2(itemCode);
    if (res.status) {
      return res.data.itemDetail;
    } else {
      AppMessage.error(res.message);
    }
    return {};
  };

  const itemMasterDetailsQuery = useQuery({
    queryKey: [...CONSTANT.QUERY.ITEM_MASTER.DETAILS, itemCode],
    queryFn: handleGetItemMasterDetails,
    enabled: Boolean(itemCode),
  });
  return itemMasterDetailsQuery;
};

export default useGetItemMasterDetailsQuery;
