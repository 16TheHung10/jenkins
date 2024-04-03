import { ItemsMasterApi, StoreApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useMutation, useQueryClient } from 'react-query';

const useImportTargetKPIMutation = () => {
  const queryClient = useQueryClient();

  const handleImport = async ({ value }) => {
    if (!value || value?.length <= 0) {
      AppMessage.info('Please import data');
      return [];
    }
    const res = await StoreApi.importStoreTargetKPI(value);
    if (res.status) {
      return value;
    } else {
      throw new Error(res.message);
    }
  };

  const importStoreItemMutation = useMutation(handleImport, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([...CONSTANT.QUERY.STORE.KPI]);
      AppMessage.success('Update item successfully');
    },
    onError: (err) => {
      AppMessage.error(err.message);
    },
  });

  return importStoreItemMutation;
};

export default useImportTargetKPIMutation;
