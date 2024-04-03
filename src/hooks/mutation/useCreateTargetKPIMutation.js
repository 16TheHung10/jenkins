import { ItemsMasterApi, StoreApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useMutation, useQueryClient } from 'react-query';

const useCreateTargetKPIMutation = () => {
  const queryClient = useQueryClient();

  const handleCreateNewTarget = async ({ value }) => {
    const res = await StoreApi.createStoreTargetKPI(value);
    if (res.status) {
      return value;
    } else {
      throw new Error(res.message);
    }
  };

  const importStoreItemMutation = useMutation(handleCreateNewTarget, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([...CONSTANT.QUERY.STORE.KPI]);
      AppMessage.success('Create item successfully');
    },
    onError: (err) => {
      AppMessage.error(err.message);
    },
  });

  return importStoreItemMutation;
};

export default useCreateTargetKPIMutation;
