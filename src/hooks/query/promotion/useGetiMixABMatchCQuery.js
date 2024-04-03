import CONSTANT from 'constant';
import { ObjectHelper } from 'helpers';
import AppMessage from 'message/reponse.message';
import PromotionModel from 'models/PromotionModel';
import moment from 'moment';
import { useQuery } from 'react-query';

const useGetiMixABMatchCQuery = ({ searchParams, onSetTotalData }) => {
  const handleGetPromotions = async (value) => {
    const { date, ...restParams } = value;
    console.log({ value });
    let params = {
      ...restParams,
      startDate: value.date[0] ? moment(value.date[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD) : null,
      endDate: value.date[1] ? moment(value.date[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD) : null,
      pageNumber: value.page || 1,
      pageSize: value.pageSize || 10,
    };
    let model = new PromotionModel();
    const res = await model.getMixABMatchC(params);
    if (res.status) {
      onSetTotalData(res.data?.total || 0);
      return res.data;
    } else {
      AppMessage.error(res.message);
      return null;
    }
  };
  const itemMasterDetailsQuery = useQuery({
    queryKey: [
      ...CONSTANT.QUERY.PROMOTION.MIX_AB_MATCH_C,
      {
        ...(ObjectHelper.removeAllNullValue(searchParams) || {}),
      },
    ],
    queryFn: () => handleGetPromotions(searchParams),
    enabled: Boolean(searchParams.date),
  });
  return itemMasterDetailsQuery;
};

export default useGetiMixABMatchCQuery;
