import { APIHelper } from "helpers";
import BaseModel from "models/BaseModel";

export default class CustomerServiceModel extends BaseModel {
  getInfo(params) {
    return APIHelper.get("/customerservice/mobileapp/info/" + params.phone);
  }

  getBill(params) {
    return APIHelper.get(
      "/customerservice/mobileapp/bill/" +
        params.memberNo +
        "?startDate=" +
        params.startdate +
        "&enddate=" +
        params.enddate,
    );
  }
  getLogDetail(memberCode, params = null) {
    return APIHelper.get(
      "/customerservice/loyalty/" + memberCode + "/log/recent",
      params,
    );
  }
  getSMSLogDetail(params = null) {
    return APIHelper.get(`/customerservice/sms/log/${params.phone}`);
  }
  getInoApp(params = null) {
    return APIHelper.get(`/checkappinfo/${params.memberCode}`);
  }

  getNewPass(params) {
    return APIHelper.get(
      `/customerservice/mobileapp/resetpassword/${params.phone}`,
    );
  }

  updateInfo(params) {
    return APIHelper.put("/customerservice/mobileapp/updateinfo", params);
  }

  updateCSStatus(phone) {
    return APIHelper.put(`/customerservice/mobileapp/unlock/${phone}`, phone);
  }
}
