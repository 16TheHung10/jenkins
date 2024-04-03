import { AuthApi } from "./AuthApi";

const FeedbackApi = {
  createNewFeedback: (body) => {
    return AuthApi.post("/common/feedback", body);
  },
  getAllFeedback: (body) => {
    return AuthApi.get("/feedback", body);
  },
};

export default FeedbackApi;
