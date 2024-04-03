import NotFound from 'component/NotFound';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import Title from 'components/common/title/Title';
import { useGetiMixABMatchCDetailsQuery, useUpdatePromotionMixABMatchCMutation } from 'hooks';
import moment from 'moment';
import PromotionMixABMatchCDetails from 'pages/promotion/mixABMatchC/details';
import PromotionMixABMatchCNav from 'pages/promotion/mixABMatchC/nav';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const PromotionMixABMatchCCopy = () => {
  const params = useParams();
  const updatePromotionMutation = useUpdatePromotionMixABMatchCMutation({ promotionCode: params.promotionCode });

  const promotionDetailsQuery = useGetiMixABMatchCDetailsQuery({ promotionCode: params.promotionCode });

  const initialData = useMemo(() => {
    const data = promotionDetailsQuery.data;
    if (data)
      return {
        ...data,
        // stores: data.stores?.map((item) => item.storeCode),
        stores: [],
        itemGets: data.itemGets?.[0].itemCode,
        discount: data.itemGets?.[0].discount,
        date: data.startDate ? [moment(data.startDate), moment(data.endDate)] : null,
        itemsA: data.itemBuys?.filter((el) => el.group === 1),
        itemsB: data.itemBuys?.filter((el) => el.group === 2),
      };
    return {};
  }, [promotionDetailsQuery.data]);

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
        isRunning={false}
        Title={() => <Title>{`Copy promotion ${initialData?.promotionCode}`}</Title>}
      />
      {/* <PromotionMixABMatchCDetails initialData={mock} onSubmit={handleUpdatePromotion} /> */}
    </PromotionMixABMatchCNav>
  );
};

export default PromotionMixABMatchCCopy;
