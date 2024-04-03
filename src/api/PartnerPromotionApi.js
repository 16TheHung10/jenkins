import moment from "moment";
import { AuthApi } from "./AuthApi";

const PartnerPromotionApi = {
  postTraceLog: (body) => {
    const userInnfo = JSON.parse(localStorage.getItem("profile"));
    const payload = {
      Action: 1,
      Type: 8,
      App: 9,
      Level: 1,
      ObjectID: JSON.parse(body).Name?.toString()?.toLowerCase(),
      Title: "promotion partner",
      Msg: body,
      Date: moment().format("YYYY-MM-DD HH:mm:ss"),
      User: userInnfo.role,
    };
    return AuthApi.post(
      "/logging/internal",
      payload,
      null,
      "https://api.gs25.com.vn:8091/ext",
    );
  },
};

export default PartnerPromotionApi;
