import { APIHelper } from 'helpers';
import BaseModel from 'models/BaseModel';

class SmsModel extends BaseModel {
  import(params) {
    return APIHelper.post('/content/sms', params);
  }
  importv2(params) {
    return APIHelper.post('/sms', params);
  }
}

export default SmsModel;
