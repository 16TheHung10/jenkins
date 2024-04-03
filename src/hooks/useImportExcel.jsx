import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Upload, message } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { saveAs } from 'file-saver';
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
const useImportExcel = (props) => {
  const [data, setData] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (info) => {
    const isExcel =
      info.fileList[0].type === 'application/vnd.ms-excel' ||
      info.fileList[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
      message.error('You can only upload Excel file!');
      return null;
    }
    let fileList = [...info.fileList];
    // Limit the number of uploaded files
    fileList = fileList.slice(-1);

    // Read file and parse data
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result;
        const workbook = XLSX.read(fileData, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        setData(XLSX.utils.sheet_to_json(worksheet, { header: 1 }));
      };
      reader.readAsBinaryString(file.originFileObj);
      file.status = 'done';
    });

    setFileList(fileList);
  };

  const convertDataToExport = (source) => {
    let titleArray = []; // title of columns
    const valueArray = [];
    if (source && source.length > 0) {
      for (let i = 0; i < source.length; i++) {
        const keys = Object.keys(source[i] || {});
        if (titleArray.length < keys.length) titleArray = [...keys];
      }
    }

    if (source && source.length > 0) {
      source.map((item, index) => {
        let valueItem = [];
        for (let key of Object.keys(item)) {
          if (titleArray.includes(key)) {
            valueItem.push(item[key]);
          }
        }
        valueArray.push(valueItem);
      });
    }
    if (titleArray?.length > 0 && valueArray?.length > 0) {
      return [titleArray, ...valueArray];
    }
    return [];
  };

  const handleDownload = (dataSource) => {
    const data = convertDataToExport(dataSource);
    if (!data || data?.length === 0) {
      message.error('Nothing to export');
      return;
    }
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const filename = `dataExport${Date.now()}.xlsx`;
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, filename);
  };

  const propsUpload = {
    fileList,
    onChange: handleFileChange,
    showUploadList: true,
    showUploadList: false,
    // beforeUpload: (file) => {
    //     const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    //     if (!isExcel) {
    //         message.error('You can only upload Excel file!');
    //         return false;
    //     }
    //     return isExcel;
    // },
  };

  const convertArrayToObject = (keyArray, contentArray) => {
    const map = keyArray?.map((item, index) => {
      return {
        [item.toString().trim()]: contentArray[index],
      };
    });
    let res = {};
    for (let value of map) {
      res = { ...res, ...value };
    }

    return res;
  };

  const listData = useMemo(() => {
    if (data) {
      const thKeys = [...(data?.[0] || [])];
      const contentArray = [...data?.slice(1)?.filter((el) => el?.length > 0)];
      const res = [];
      for (let array of contentArray) {
        const element = convertArrayToObject(thKeys, array);
        if (element) res.push(element);
      }
      return res;
    }
    return [];
  }, [data]);
  return {
    ComponentImport: (componentImportProps) => {
      return (
        <div className="flex flex-col items-start">
          {componentImportProps?.linkDownload && (
            <a
              title="Download file xls"
              href={componentImportProps.linkDownload}
              target="_blank"
              style={{ lineHeight: '24px', fontSize: '14px' }}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
              Download File xls
            </a>
          )}
          <div className="" style={{ width: 'fit-content' }}>
            <Upload
              {...componentImportProps}
              {...propsUpload}
              className="w-full flex justify-center"
              accept=".xlsx,.xls"
            >
              <BaseButton
                loading={componentImportProps.loading}
                iconName="export"
                color={componentImportProps.color || 'primary'}
              >
                {componentImportProps.title || 'Import file Excel'}
              </BaseButton>
            </Upload>
          </div>
        </div>
      );
    },
    ComponentExport: ({ title, data, ...props }) => {
      return (
        <BaseButton color="green" iconName="export" onClick={() => handleDownload(data)} {...props}>
          {title || 'Export Excel'}
        </BaseButton>
      );
    },
    onExport: (data) => handleDownload(data),
    dataImported: listData,
    setDataImported: setData,
  };
};

export default useImportExcel;
