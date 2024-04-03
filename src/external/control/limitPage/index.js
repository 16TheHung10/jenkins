//Plugin
import { APIHelper } from "helpers";

class LimitPage {
  getLimitPage(params = null) {
    return APIHelper.get("/common/config", params);
  }
}

export default LimitPage;
