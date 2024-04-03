import { ItemsMasterApi, StoreApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import PromotionModel from 'models/PromotionModel';
import { useMutation, useQueryClient } from 'react-query';

const useUpdatePromotionMixABMatchCMutation = ({ promotionCode }) => {
  const queryClient = useQueryClient();

  const handleUpdateNewPromotion = async ({ payload }) => {
    const model = new PromotionModel();
    const res = await model.updateMixABMatchC(promotionCode, payload);
    if (res.status) {
      return payload;
    } else {
      throw new Error(res.message || 'Error');
    }
  };

  const importStoreItemMutation = useMutation(handleUpdateNewPromotion, {
    onSuccess: (data) => {
      queryClient.setQueryData([...CONSTANT.QUERY.PROMOTION.MIX_AB_MATCH_C_DETAILS, promotionCode], (currentData) => {
        return data;
      });
      AppMessage.success('Update item successfully');
    },
    onError: (err) => {
      console.log({ err });
      AppMessage.error(err.message);
    },
  });

  return importStoreItemMutation;
};

export default useUpdatePromotionMixABMatchCMutation;
