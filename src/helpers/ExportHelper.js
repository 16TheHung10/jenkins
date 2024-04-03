import { APIHelper } from 'helpers';
import Moment from 'moment';

import { AlertHelper, DateHelper } from 'helpers';

import DownloadModel from 'models/DownloadModel';
import ExportModel from 'models/ExportModel';
class ExportHelper {
  static instance = null;

  static createInstance() {
    var object = new ExportHelper();
    return object;
  }

  static getInstance() {
    if (!ExportHelper.instance) {
      ExportHelper.instance = ExportHelper.createInstance();
    }
    return ExportHelper.instance;
  }
  exportFileXLS(dataExport) {
    return APIHelper.post('/export/common', dataExport, 'https://api.gs25.com.vn:8091/ext/resources');
  }
}
export default ExportHelper;
export function handleExportAutoField(arrExport, nameFile, arrKeyDelete, arrKeyAddMore, typeCol) {
  if (arrExport.length === 0) {
    AlertHelper.showAlert('Please select the searching first');
    return false;
  }

  let arr = [];
  for (let k in arrExport) {
    let item = arrExport[k];

    if (arrKeyDelete && arrKeyDelete.length > 0) {
      for (let k2 in arrKeyDelete) {
        delete item[arrKeyDelete[k2]];
      }
    }

    if (arrKeyAddMore && arrKeyAddMore.length > 0) {
      for (let k3 in arrKeyAddMore) {
        let itemAdd = arrKeyAddMore[k3];

        for (let k4 in itemAdd) {
          item[k4] = itemAdd[k4];
        }
      }
    }

    let arrItemObjKey = Object.keys(item);

    for (let i in arrItemObjKey) {
      if (!item[arrItemObjKey[i]]) {
        if (!isNaN(item[arrItemObjKey[i]])) {
          item[arrItemObjKey[i]] = typeCol ? item[arrItemObjKey[i]] : item[arrItemObjKey[i]] == null ? '' : item[arrItemObjKey[i]].toString();
        } else {
          item[arrItemObjKey[i]] = typeCol ? 0 : '';
        }
      } else if (!isNaN(item[arrItemObjKey[i]])) {
        item[arrItemObjKey[i]] = typeCol ? item[arrItemObjKey[i]] : item[arrItemObjKey[i]] == null ? '' : item[arrItemObjKey[i]].toString();
      } else if (Date.parse(item[arrItemObjKey[i]].replaceAll(' ', '')) && Moment(item[arrItemObjKey[i]]).isValid()) {
        // item[arrItemObjKey[i]] = DateHelper.displayDateFormatMinus(item[arrItemObjKey[i]]);
        item[arrItemObjKey[i]] = DateHelper.displayDateTime24(item[arrItemObjKey[i]]);
      } else {
        item[arrItemObjKey[i]] = item[arrItemObjKey[i]];
      }
    }

    arr.push(item);
  }

  let params = {
    values: arr,
    type: nameFile,
  };

  if (typeCol) {
    params.metaHeader = typeCol;
  }

  let model = new ExportModel();
  model.exportAutoField(params).then((res) => {
    if (res.status) {
      let downloadModel = new DownloadModel();
      downloadModel.get(res.data.downloadUrl, null, null, '.xlsx');
    } else {
      AlertHelper.showAlert(res.message);
    }
  });
}
export function handleExportWorkspaces(type, params) {
  let model = new ExportModel();
  model.exportWorkspaces(type, params).then((res) => {
    if (res.status) {
      let downloadModel = new DownloadModel();
      downloadModel.get(res.data.downloadUrl, null, null, '.xlsx');
    } else {
      AlertHelper.showAlert(res.message);
    }
  });
}
export function handleExportWorkspacesDetail(type, params) {
  let model = new ExportModel();
  model.exportWorkspacesDetail(type, params).then((res) => {
    if (res.status) {
      let downloadModel = new DownloadModel();
      downloadModel.get(res.data.downloadUrl, null, null, '.xlsx');
    } else {
      AlertHelper.showAlert(res.message);
    }
  });
}

export function handleExportWorkspacesDetail2(type, params) {
  let model = new ExportModel();
  model.exportWorkspacesDetail2(type, params).then((res) => {
    if (res.status) {
      let downloadModel = new DownloadModel();
      downloadModel.get(res.data.downloadUrl, null, null, '.xlsx');
    } else {
      AlertHelper.showAlert(res.message);
    }
  });
}
