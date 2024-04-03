import { APIHelper } from 'helpers';

class ContentModel {
  getList(type, params) {
    console.log('api', type);
    return APIHelper.get('/content/' + type, params);
  }
  putList(type, params) {
    return APIHelper.put('/content/' + type, params);
  }
}

export default ContentModel;
