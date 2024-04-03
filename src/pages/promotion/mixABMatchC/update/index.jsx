import NotFound from 'component/NotFound';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import Title from 'components/common/title/Title';
import { useGetiMixABMatchCDetailsQuery, useUpdatePromotionMixABMatchCMutation } from 'hooks';
import moment from 'moment';
import PromotionMixABMatchCDetails from 'pages/promotion/mixABMatchC/details';
import PromotionMixABMatchCNav from 'pages/promotion/mixABMatchC/nav';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const PromotionMixABMatchCUpdate = () => {
  const params = useParams();
  const updatePromotionMutation = useUpdatePromotionMixABMatchCMutation({ promotionCode: params.promotionCode });

  const promotionDetailsQuery = useGetiMixABMatchCDetailsQuery({ promotionCode: params.promotionCode });

  const initialData = useMemo(() => {
    const data = promotionDetailsQuery.data;
    if (data)
      return {
        ...data,
        stores: [...data.stores?.map((item) => item.storeCode)],
        itemGets: data.itemGets?.[0].itemCode,
        discount: data.itemGets?.[0].discount,
        date: data.startDate ? [moment(data.startDate), moment(data.endDate)] : null,
        itemsA: data.itemBuys?.filter((el) => el.group === 1),
        itemsB: data.itemBuys?.filter((el) => el.group === 2),
      };
    return {};
  }, [promotionDetailsQuery.data]);

  const isRunning = useMemo(() => {
    if (!initialData?.startDate) return false;
    return (
      (moment(initialData.startDate).isBefore(moment()) && moment(moment()).isBefore(initialData.endDate)) ||
      moment(initialData.endDate).isBefore(moment())
    );
  }, [initialData?.startDate, initialData?.endDate]);

  if (promotionDetailsQuery.isLoading) {
    return <SuspenLoading />;
  }

  if (!promotionDetailsQuery.data) {
    return (
      <PromotionMixABMatchCNav promotionCode={params.promotionCode}>
        <div className="w-full" style={{ height: ' calc(100vh - 84px)' }}>
          <NotFound />
        </div>
      </PromotionMixABMatchCNav>
    );
  }
  const handleUpdatePromotion = (payload, onResetFields) => {
    updatePromotionMutation.mutate({ payload });
  };

  return (
    <PromotionMixABMatchCNav promotionCode={params.promotionCode}>
      <PromotionMixABMatchCDetails
        initialData={initialData}
        onSubmit={handleUpdatePromotion}
        isRunning={isRunning}
        Title={() => <Title>{`Edit promotion ${initialData?.promotionCode}`}</Title>}
      />
      {/* <PromotionMixABMatchCDetails initialData={mock} onSubmit={handleUpdatePromotion} /> */}
    </PromotionMixABMatchCNav>
  );
};

export default PromotionMixABMatchCUpdate;
