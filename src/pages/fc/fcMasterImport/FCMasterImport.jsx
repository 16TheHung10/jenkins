import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Select, message } from 'antd';
import { FcApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import { TableFcMasterManagementData } from 'data/render/table';
import { useImportExcel } from 'hooks';
import { useAppContext } from 'contexts';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import FcMasterNav from '../fcMasterNav/FcMasterNav';
import './style.scss';
import { useEffect } from 'react';
const FCMasterImport = () => {
  const queryClient = useQueryClient();
  const { ComponentImport, dataImported } = useImportExcel();
  const { state: AppState, onGetModelTypes } = useAppContext();
  useEffect(() => {
    onGetModelTypes();
  }, []);
  const dataPayload = useMemo(() => {
    return dataImported.map((item) => {
      return {
        ...item,
        companyRepresentativeBirthday: moment(item.companyRepresentativeBirthday).format('YYYY-MM-DD'),
        startDay: moment('1899-12-30').add(+item.startDay, 'days').format('YYYY-MM-DD'),
        openFranchise: moment('1899-12-30').add(+item.openFranchise, 'days').format('YYYY-MM-DD'),
        endFranchise: moment('1899-12-30').add(+item.endFranchise, 'days').format('YYYY-MM-DD'),
        adS3Month: item['ADS 3 month before Handover'],
        acreage: item['Acreage (m2)'],
      };
    });
  }, [dataImported]);

  const handleImportFC = async () => {
    if (!dataImported || dataImported?.length === 0) return null;
    const res = await FcApi.importFC(dataPayload);
    if (res.status) {
      return dataImported;
    } else {
      throw new Error(res.message);
    }
  };
  const fcImportMutation = useMutation(handleImportFC, {
    onSuccess: (data) => {
      message.success('Import data successfully');
      queryClient.invalidateQueries(['fc']);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const formatedDataImport = useMemo(() => {
    const res = [];
    if (dataImported) {
      for (let item of dataImported) {
        let newObject = {};
        const keys = Object.keys(item);
        for (let key of keys) {
          if (['ADS 3 month before Handover'].includes(key)) {
            newObject = {
              ...newObject,
              ['adS3Month']: item['ADS 3 month before Handover'],
            };
          } else if (['Acreage (m2)'].includes(key)) {
            newObject = { ...newObject, ['acreage']: item['Acreage (m2)'] };
          } else {
            newObject = { ...newObject, [key]: item[key] };
          }
        }
        res.push(newObject);
      }
    }
    return res.map((item) => {
      return {
        ...item,
        companyRepresentativeBirthday: moment(item.companyRepresentativeBirthday).format('YYYY-MM-DD'),
        startDay: moment('1899-12-30').add(+item.startDay, 'days').format('YYYY-MM-DD'),
        openFranchise: moment('1899-12-30').add(+item.openFranchise, 'days').format('YYYY-MM-DD'),
        endFranchise: moment('1899-12-30').add(+item.endFranchise, 'days').format('YYYY-MM-DD'),
      };
    });
  }, [dataImported]);
  return (
    <FcMasterNav>
      <div className="section-block mt-15">
        <div className="flex flex-col items-start  mb-15">
          <ComponentImport
            loading={fcImportMutation.isLoading}
            linkDownload="https://api.gs25.com.vn:8091/storemanagement/share/template/fc/FCMasterTemplate.xlsx"
          />
        </div>
        <MainTable
          scroll={{
            x: 1500,
            y: 600,
          }}
          loading={fcImportMutation.isLoading}
          className="w-fit th-center"
          columns={TableFcMasterManagementData.columns(true)}
          dataSource={formatedDataImport}
        />
        <BaseButton className="mt-15" onClick={fcImportMutation.mutate}>
          SUBMIT
        </BaseButton>
      </div>
    </FcMasterNav>
  );
};

export default FCMasterImport;
