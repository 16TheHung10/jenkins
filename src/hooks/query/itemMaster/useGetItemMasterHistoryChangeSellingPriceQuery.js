import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import { ObjectHelper } from 'helpers';
import AppMessage from 'message/reponse.message';
import { useQuery } from 'react-query';

const useGetItemMasterHistoryChangeSellingPriceQuery = ({ searchParams }) => {
  const checkValidParams = (params) => {
    if (Object.values(ObjectHelper.removeAllNullValue(searchParams) || {}).length < 3) {
      return false;
    }
    return true;
  };
  const handleGetItemHistoryChangeSellingPrice = async () => {
    if (!checkValidParams(searchParams)) {
      AppMessage.info('Please input at least 2 fields to search');
      return [];
    }
    const res = await ItemsMasterApi.getItemHistoryChangeSellingPrice(searchParams);
    if (res.status) {
      return res.data.historyPriceItemMaster;
    } else {
      AppMessage.error(res.message);
    }
    return [];
  };

  const itemMasterHistoryChangeSellingPriceQuery = useQuery({
    queryKey: [...CONSTANT.QUERY.ITEM_MASTER.HISTORY_CHANGE_SELLING_PRICE, searchParams],
    queryFn: handleGetItemHistoryChangeSellingPrice,
    enabled: Boolean(searchParams.fromDate),
  });
  return itemMasterHistoryChangeSellingPriceQuery;
};

export default useGetItemMasterHistoryChangeSellingPriceQuery;
