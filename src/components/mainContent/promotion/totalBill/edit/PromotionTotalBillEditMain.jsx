import { message } from "antd";
import { actionCreator, useTotalBillContext } from "contexts";
import { ImageHelper } from "helpers";
import PromotionModel from "models/PromotionModel";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import PromotionTotalBillDetailMain from "../details/PromotionTotalBillDetailMain";
import { TotalBillActions } from "contexts/actions";

const PromotionTotalBillEditMain = () => {
  const { state, dispatch } = useTotalBillContext();
  const [isMessageShown, setIsMessageShown] = useState(false);
  const params = useParams();
  const history = useHistory();

  const fetchDetailData = async () => {
    const model = new PromotionModel();
    const res = await model.getTotalBillDetailPromotion(params.id);
    if (res.status) {
      const data = res.data.promotion;
      return data;
    } else {
      message.error(res.message);
    }
  };

  const totalBillDetailQuery = useQuery({
    queryKey: ["promotionDetails", params.id],
    queryFn: fetchDetailData,
    staleTime: 1000 * 60 * 5,
  });

  const hanleInitData = async () => {
    if (!totalBillDetailQuery.isLoading) {
      if (totalBillDetailQuery.data) {
        const data = totalBillDetailQuery.data;
        const promotionDetails = data.promotionDetails?.map((item, index) => {
          return {
            ...item,
            image: {
              url: ImageHelper.getImageUrlByPromotion(
                data.promotionCode,
                item.itemCode,
              ),
              uid: ImageHelper.getImageUrlByPromotion(
                data.promotionCode,
                item.itemCode,
              ),
              name: "Image of item #" + item.itemCode,
              isFromServer: true,
            },
          };
        });
        if (data.billPromotionType === 1) {
          dispatch(
            actionCreator(
              TotalBillActions.SET_DISCOUNT_TABLE_DATA,
              promotionDetails,
            ),
          );
        } else {
          dispatch(
            actionCreator(
              TotalBillActions.SET_FREE_TABLE_DATA,
              promotionDetails,
            ),
          );
        }
        return;
      } else {
        if (!isMessageShown) {
          message.error("Invalid promotion code");
          setIsMessageShown(true);
        }
        setTimeout(() => {
          history.goBack();
        }, [500]);
      }
    }
  };

  useEffect(() => {
    hanleInitData();
  }, [totalBillDetailQuery.data]);

  if (totalBillDetailQuery.isLoading) {
    return <h1 style={{ textAlign: "center" }}>...LOADING...</h1>;
  }
  return (
    <PromotionTotalBillDetailMain
      initialData={{
        ...totalBillDetailQuery.data,
        date: [
          moment(totalBillDetailQuery.data?.fromDate),
          moment(totalBillDetailQuery.data?.toDate),
        ],
      }}
    />
  );
};
export default PromotionTotalBillEditMain;
