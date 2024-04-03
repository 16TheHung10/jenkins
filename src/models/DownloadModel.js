import BaseModel from 'models/BaseModel';
import APIHelper from 'helpers/APIHelper';

class DownloadModel extends BaseModel {
  get(url, params = null, rootUrl = null, type = null) {
    let filename = url.split('/').pop();
    APIHelper.download(url, filename, (params = null), type);
  }

  async getTxt(url, params = null, rootUrl = null, type = null) {
    let filename = url.split('/').pop();
    let result = {};
    result.value = await APIHelper.downloadTxt(url, filename, (params = null), type);
    result.name = filename;
    return result;
  }
}

export default DownloadModel;
