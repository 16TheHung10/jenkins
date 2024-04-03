import { ItemsMasterApi, StoreApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import PromotionModel from 'models/PromotionModel';
import { useMutation, useQueryClient } from 'react-query';

const useCreatePromotionMixABMatchCMutation = () => {
  const queryClient = useQueryClient();

  const handleCreateNewPromotion = async ({ payload }) => {
    const model = new PromotionModel();
    const res = await model.createMixABMatchC(payload);
    if (res.status) {
      return payload;
    } else {
      throw new Error(res.message);
    }
  };

  const importStoreItemMutation = useMutation(handleCreateNewPromotion, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([...CONSTANT.QUERY.PROMOTION.MIX_AB_MATCH_C]);
      AppMessage.success('Create item successfully');
    },
    onError: (err) => {
      console.log({ err });
      AppMessage.error(err.message);
    },
  });

  return importStoreItemMutation;
};

export default useCreatePromotionMixABMatchCMutation;
