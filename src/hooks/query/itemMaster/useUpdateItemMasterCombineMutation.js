import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useMutation, useQueryClient } from 'react-query';

const useUpdateItemMasterCombineMutation = ({ itemCode }) => {
  const queryClient = useQueryClient();

  const handleUpdateItem = async (payload) => {
    if (!itemCode) {
      throw new Error('Missing item or store');
    }
    const res = await ItemsMasterApi.updateItemCobine(itemCode, payload);
    if (res.status) {
      return payload;
    } else {
      throw new Error(res.message);
    }
  };

  const itemMasterMutation = useMutation(handleUpdateItem, {
    onSuccess: (data) => {
      queryClient.setQueryData([...CONSTANT.QUERY.ITEM_MASTER.COMBINE, itemCode], (currentData) => {
        return [...data];
      });
      AppMessage.success('Update item successfully');
    },
    onError: (err) => {
      AppMessage.error(err.message);
    },
  });

  return itemMasterMutation;
};

export default useUpdateItemMasterCombineMutation;
