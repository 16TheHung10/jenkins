import { APIHelper } from "helpers";
import BaseModel from "models/BaseModel";

class UploadImageModel extends BaseModel {
  get(params) {
    return APIHelper.get(
      "/content/image/all",
      params,
      process.env.REACT_APP_API_EXT_MEDIA,
    );
  }

  post(params) {
    // const imageName = params.imgName?.toString()?.replaceAll(' ', '');
    return APIHelper.post(
      "/content/image/" + params.imgName,
      params.source,
      process.env.REACT_APP_API_EXT_MEDIA,
    );
  }

  postPromotion(params) {
    return APIHelper.post(
      "/upload/promotion/image/" + params.imgName,
      params.source,
      process.env.REACT_APP_API_EXT_MEDIA,
    );
  }

  delete(params = null) {
    return APIHelper.delete(
      "/content/image/" + params.imgName,
      null,
      process.env.REACT_APP_API_EXT_MEDIA,
    );
  }
}

export default UploadImageModel;
