import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useQuery } from 'react-query';

const useGetItemMasterQuery = ({ searchParams }) => {
  const handleGetItems = async () => {
    const res = await ItemsMasterApi.getItemsAll(searchParams);
    if (res.status) {
      return res.data.items;
    } else {
      AppMessage.error(res.message);
    }
    return [];
  };

  const itemMasterDetailsQuery = useQuery({
    queryKey: [...CONSTANT.QUERY.ITEM_MASTER.ALL, searchParams],
    queryFn: handleGetItems,
  });
  return itemMasterDetailsQuery;
};

export default useGetItemMasterQuery;
