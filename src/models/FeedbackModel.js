import BaseModel from "models/BaseModel";
import { APIHelper } from "helpers";

class FeedbackModel extends BaseModel {
  createNewFeedback(body) {
    return APIHelper.post("/common/feedback", body);
  }
  getAllFeedback(body) {
    return APIHelper.get("/feedback", body);
  }
}

export default FeedbackModel;
