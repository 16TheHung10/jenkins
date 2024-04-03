import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useMutation, useQueryClient } from 'react-query';

const useUpdateItemMasterByStoreMutation = ({ itemCode, storeCode }) => {
  const queryClient = useQueryClient();

  const handleUpdateItem = async (payload) => {
    if (!itemCode || !storeCode) {
      throw new Error('Missing item or store');
    }
    const res = await ItemsMasterApi.updateItemByStoreV2(itemCode, payload);
    if (res.status) {
      return payload;
    } else {
      throw new Error(res.message);
    }
  };

  const itemMasterMutation = useMutation(handleUpdateItem, {
    onSuccess: (data) => {
      queryClient.setQueryData([...CONSTANT.QUERY.ITEM_MASTER.BY_STORE_DETAILS, itemCode, storeCode], (currentData) => {
        return { ...currentData, ...data };
      });
      AppMessage.success('Update item successfully');
    },
    onError: (err) => {
      AppMessage.error(err.message);
    },
  });

  return itemMasterMutation;
};

export default useUpdateItemMasterByStoreMutation;
