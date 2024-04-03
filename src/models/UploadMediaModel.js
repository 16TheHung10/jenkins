// import React from 'react';
import { APIHelper } from "helpers";
import BaseModel from "./BaseModel";

export default class UploadMediaModel extends BaseModel {
  uploadPromotionImage({ promotionCode, itemCode, image }) {
    return APIHelper.post(
      `/upload/promotion/${promotionCode}/${itemCode}?date=${Date.now()}`,
      { image },
      process.env.REACT_APP_API_EXT_MEDIA,
    );
  }
}
