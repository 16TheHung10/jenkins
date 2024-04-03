import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { useImportExcel, useImportTargetKPIMutation } from 'hooks';
import moment from 'moment';
import React, { useMemo } from 'react';
import StoreTargetKPINav from '../nav';
import CONSTANT from 'constant';

const StoreTargetKPIImport = () => {
  const { ComponentImport, dataImported, setDataImported } = useImportExcel();
  const formatImporteData = useMemo(() => {
    return dataImported?.map((item) => {
      return {
        ...item,
        applyMonth: moment(item.applyMonth, 'DD/MM/YYYY'),
        fromDate: moment(item.applyMonth, 'DD/MM/YYYY').format(CONSTANT.FORMAT_DATE_PAYLOAD),
      };
    });
  }, [dataImported]);

  const importMutation = useImportTargetKPIMutation();

  return (
    <StoreTargetKPINav>
      <div className="mini_app_container">
        <div className="table section-block mt-15 w-full">
          <div className="flex gap-10 items-end mb-15">
            <ComponentImport linkDownload="https://api.gs25.com.vn:8091/storemanagement/share/template/store/StoreTargetKPI.xlsx" />
            <BaseButton
              loading={importMutation.isLoading}
              iconName="send"
              color="green"
              onClick={() => {
                const payload = formatImporteData?.map((item) => {
                  const { amount, storeCode, fromDate } = item;
                  return { amount, storeCode, fromDate };
                });
                importMutation.mutate({ value: payload });
                setDataImported([]);
              }}
            >
              Submit
            </BaseButton>
          </div>
          <div className=" w-full table-inner">
            <MainTable
              className="w-full"
              columns={[
                {
                  title: 'Store',
                  dataIndex: 'storeCode',
                  key: 'storeCode',
                  render: (text, record) => (text ? `${text}` : ' - '),
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (text, record) => (text ? text : ' - '),
                },
                {
                  title: 'Apply month',
                  dataIndex: 'applyMonth',
                  key: 'applyMonth',
                  render: (text, record) => (text ? text.format('MM/YYYY') : ' - '),
                },
              ]}
              dataSource={formatImporteData}
            />
          </div>
        </div>
      </div>
    </StoreTargetKPINav>
  );
};

export default StoreTargetKPIImport;
