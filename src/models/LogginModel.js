import { APIHelper } from 'helpers';
import { CacheHelper } from 'helpers';

class LogginModel {
  getAllLoggings(params) {
    return APIHelper.get('/logging/filter', params);
  }
}

export default LogginModel;
