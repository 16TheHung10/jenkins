import Title from 'components/common/title/Title';
import { useCreatePromotionMixABMatchCMutation } from 'hooks';
import PromotionMixABMatchCDetails from 'pages/promotion/mixABMatchC/details';
import PromotionMixABMatchCNav from 'pages/promotion/mixABMatchC/nav';
import React from 'react';

const PromotionMixABMatchCCreate = () => {
  const updatePromotionMutation = useCreatePromotionMixABMatchCMutation();
  const handleCreatePromotion = async (payload, onResetFields) => {
    try {
      await updatePromotionMutation.mutateAsync({ payload });
      onResetFields();
    } catch (err) {}
  };
  return (
    <PromotionMixABMatchCNav>
      <PromotionMixABMatchCDetails onSubmit={handleCreatePromotion} Title={() => <Title>{`New promotion `}</Title>} />
    </PromotionMixABMatchCNav>
  );
};

export default PromotionMixABMatchCCreate;
