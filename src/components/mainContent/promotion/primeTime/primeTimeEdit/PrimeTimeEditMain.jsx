import { message } from "antd";
import { useGoldenTimeContext } from "contexts";
import { ImageHelper } from "helpers";
import PromotionModel from "models/PromotionModel";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import PrimeTimeCreateMain from "../primeTimeCreate/PrimeTimeCreateMain";

const PrimeTimeEditMain = () => {
  const params = useParams();
  const history = useHistory();
  const [detailData, setDetailData] = useState(null);

  const [state, dispatch] = useGoldenTimeContext();

  const handleGetDetails = async () => {
    const model = new PromotionModel();
    if (params.id?.startsWith("BG")) {
      const res = await model.getAllGoldenTimePromotionDetails(params.id);
      if (res.status) {
        setDetailData(
          {
            ...res.data.promotion,
            promotionDetails: res.data.promotion?.promotionDetails?.map(
              (item) => ({
                ...item,
                image: {
                  isFromServer: true,
                  url: ImageHelper.getImageUrlByPromotion(
                    params.id,
                    item.itemCode,
                  ),
                  name: `Image of ${item.itemCode}`,
                },
              }),
            ),
          } || {},
        );
      } else {
        message.error(res.message);
      }
    } else if (params.id?.startsWith("DI")) {
      const res = await model.getAllGoldenTimePromotionDetailsDiscount(
        params.id,
      );
      if (res.status) {
        setDetailData(
          {
            ...res.data.promotion,
            promotionDetails: res.data.promotion?.promotionDetails?.map(
              (item) => ({
                ...item,
                image: {
                  isFromServer: true,
                  url: ImageHelper.getImageUrlByPromotion(
                    params.id,
                    item.itemCode,
                  ),
                  name: `Image of ${item.itemCode}`,
                },
              }),
            ),
          } || {},
        );
      } else {
        message.error(res.message);
        history.goBack();
      }
    }
  };

  const handleSetDetailData = useCallback((data) => {
    setDetailData(data);
  }, []);

  useEffect(() => {
    handleGetDetails();
  }, []);
  return (
    <Fragment>
      {detailData ? (
        <PrimeTimeCreateMain
          detailData={detailData}
          setDetailData={handleSetDetailData}
        />
      ) : null}
    </Fragment>
  );
};

export default PrimeTimeEditMain;
