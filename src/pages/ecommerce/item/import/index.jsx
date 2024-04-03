import { Col, Row, message } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import { scrollToTop } from 'components/mainContent/MainContent';
import { FieldsEcommerceItemData } from 'data/render/form';
import { TableEcommerceItemData } from 'data/render/table';
import { ObjectHelper, UrlHelper } from 'helpers';
import { useFormFields, usePagination } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { EcommerceCategoryApi, EcommerceItemApi } from 'api';
import ComponentNav from '../nav';
import { useImportExcel } from 'hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const EcommerceItemsImport = () => {
  const [data, setData] = useState([]);
  const { ComponentImport, dataImported } = useImportExcel();
  const handleSetImportData = async (dataImport) => {
    for (let item of dataImport) {
      if (!item.itemCode || !item.categoryName || !item.itemSalePrice || !item.attribute || !item.description) {
        console.log({ item });
        message.error('Missing data, please check your data and try again');
        return;
      }
    }
    const res = await EcommerceItemApi.checkImportItems({ items: dataImport });
    if (res.status) {
      setData(res.data);
    } else {
      message.error(res.message);
    }
  };

  const handleImportData = async () => {
    const res = await EcommerceItemApi.importItems({ items: data.items });
    if (res.status) {
      message.success('Import item successfully');
      setData([]);
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    const dataMap = new Map();
    for (let data of dataImported) {
      if (dataMap.has(data.itemCode)) {
        continue;
      } else {
        dataMap.set(data.itemCode, data);
      }
    }

    handleSetImportData(Object.values(Object.fromEntries(dataMap) || {}));
  }, [dataImported]);
  console.log({ data });
  return (
    <ComponentNav>
      <div className="mini_app_container">
        <div className="section-block mt-15">
          <ComponentImport linkDownload="https://api.gs25.com.vn:8091/storemanagement/share/template/itemMaster/MasterCostChange.xls" />
          <p className="cl-red m-0">
            {!data?.isValid && data?.items?.length > 0 ? 'Invalid data, please check your data and import again' : ''}
          </p>
        </div>
        <div className="table section-block mt-15 w-full">
          <div className=" w-full table-inner">
            <div style={{ maxHeight: 'calc(100vh - 325px)', overflow: 'auto' }}>
              <MainTable
                className="w-full fixed_header"
                columns={TableEcommerceItemData.columnsImport()}
                dataSource={[...(data?.items || [])]}
              />
            </div>
            {data?.isValid ? (
              <div className="w-full text-center mt-15 center">
                <BaseButton htmlType="submit" iconName="send" onClick={handleImportData}>
                  Submit
                </BaseButton>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </ComponentNav>
  );
};

export default EcommerceItemsImport;
