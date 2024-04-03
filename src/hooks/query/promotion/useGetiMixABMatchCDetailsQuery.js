import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import PromotionModel from 'models/PromotionModel';
import { useQuery } from 'react-query';

const useGetiMixABMatchCDetailsQuery = ({ promotionCode }) => {
  const handleGetPromotion = async () => {
    let model = new PromotionModel();
    const res = await model.getMixABMatchCDetails(promotionCode);
    if (res.status) {
      return res.data.promotion;
    } else {
      AppMessage.error(res.message);
      return null;
    }
  };
  const itemMasterDetailsQuery = useQuery({
    queryKey: [...CONSTANT.QUERY.PROMOTION.MIX_AB_MATCH_C_DETAILS, promotionCode],
    queryFn: () => handleGetPromotion(),
    enabled: Boolean(promotionCode),
  });
  return itemMasterDetailsQuery;
};

export default useGetiMixABMatchCDetailsQuery;
