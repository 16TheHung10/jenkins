import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useMutation, useQueryClient } from 'react-query';

const useUpdateItemMasterMutation = ({ itemCode }) => {
  const queryClient = useQueryClient();

  const handleUpdateItem = async (payload) => {
    const res = await ItemsMasterApi.updateItemV2(itemCode, payload);
    if (res.status) {
      return payload;
    } else {
      throw new Error(res.message);
    }
  };

  const itemMasterMutation = useMutation(handleUpdateItem, {
    onSuccess: (data) => {
      queryClient.setQueryData([...CONSTANT.QUERY.ITEM_MASTER.DETAILS, itemCode], (currentData) => {
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

export default useUpdateItemMasterMutation;
