import { APIHelper, CacheHelper } from "helpers";

class BaseModel {
  cache(url, params = null) {
    let value = CacheHelper.getInstance().addFetch(url);
    if (value) {
      return value;
    }
    value = APIHelper.get(url, params);
    CacheHelper.getInstance().addFetch(url, value);
    return value;
  }
}

export default BaseModel;
