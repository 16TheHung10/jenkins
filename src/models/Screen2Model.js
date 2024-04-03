import { APIHelper } from "helpers";
import BaseModel from "models/BaseModel";

class Screen2Model extends BaseModel {
  getData(params) {
    return APIHelper.get("/content/posdata", params);
  }
}

export default Screen2Model;
