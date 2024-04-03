import * as XLSX from 'xlsx';

let FileHelper = {
  isBase64(str) {
    const base64Regex = /^(data:){0,1}([a-zA-Z0-9+/]+={0,2})(.{1,}){0,1}$/;
    return base64Regex.test(str);
  },
  convertToBase64: async (file, ratio) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        if (ratio) {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const width = img.width;
            const height = img.height;
            const aspectRatio = width / height;
            if (aspectRatio !== Number(ratio.split('/')?.[0] / ratio.split('/')?.[1])) {
              reject(new Error('Image aspect ratio must be ' + ratio));
            }
            resolve(reader.result);
          };
        } else {
          resolve(reader.result);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  },
  uploadFiles(e, callback) {
    // Check for the various File API support.
    if (window.FileReader) {
      var reader = new FileReader();
      // FileReader are supported.
      if (e.target.files[0] !== undefined) {
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function (event) {
          let csv = event.target.result;
          let allTextLines = csv.split(/\r\n|\n|\r/).slice(1);
          let clearEmpty = allTextLines.filter(Boolean);

          callback(clearEmpty);
        };
        reader.onerror = FileHelper.errorHandler;
      }
    }
  },

  uploadCsvFiles(e, callback) {
    if (window.FileReader) {
      var reader = new FileReader();
      if (e.target.files[0] !== undefined) {
        reader.readAsText(e.target.files[0]);
        reader.onload = function (event) {
          var csv = event.target.result;
          var allTextLines = csv.split(/\r\n|\n|\r/).slice(1);
          var clearEmpty = allTextLines.filter(Boolean);
          var ret = [];
          var numberCol = 0;
          var errorNumber = 0;
          for (var key in clearEmpty) {
            var splitItems = clearEmpty[key].split(',');
            if (numberCol == 0) {
              numberCol = splitItems.length;
            }

            if (numberCol == splitItems.length) {
              ret.push(splitItems);
              numberCol = splitItems.length;
            } else {
              errorNumber = parseInt(key, 10) + 1;
              break;
            }
          }
          if (errorNumber != 0) {
            callback(null, 'File csv is invalid at row ' + errorNumber);
          } else {
            callback(ret);
          }
        };
        reader.onerror = FileHelper.errorHandler;
      }
    }
  },

  uploadExcelFiles(e, callback) {
    if (window.FileReader) {
      if (e.target.files[0] !== undefined) {
        var reader = new FileReader();
        var f = e.target.files[0];
        reader.onload = function (event) {
          var data = event.target.result;
          let readedData = XLSX.read(data, { type: 'binary' });
          const wsname = readedData.SheetNames[0];
          const ws = readedData.Sheets[wsname];
          const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
          var ret = [];
          if (dataParse) {
            for (var item in dataParse) {
              if (dataParse[item] != null && dataParse[item].length != 0) {
                ret.push(dataParse[item]);
              }
            }
            callback(ret);
          } else {
            callback(null, 'File excel is invalid');
          }
        };
        reader.readAsBinaryString(f);
        reader.onerror = FileHelper.errorHandler;
      }
    }
  },

  errorHandler(event) {
    if (event.target.error.name === 'NotReadableError') {
      alert('Cannot read file!');
    }
  },

  uploadXlsxFile(e, callback) {
    if (window.FileReader) {
      var reader = new FileReader();
      var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
      if (regex.test(e.target.value.toLowerCase())) {
        if (e.target.files[0] !== undefined) {
          if (reader.readAsBinaryString) {
            reader.onload = (e) => {
              var result = FileHelper.processExcel(reader.result);
              if (result && result.length > 0) {
                callback(result);
              }
            };
            reader.readAsBinaryString(e.target.files[0]);
            reader.onerror = FileHelper.errorHandler;
            return true;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  processExcel(data) {
    const workbook = XLSX.read(data, { type: 'binary' });

    const firstSheet = workbook.SheetNames[0];
    const excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet], { defval: '' });

    return excelRows;
  },
};

export default FileHelper;
