import { Form } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import ItemMasterNav from 'components/mainContent/itemMaster/nav/ItemMasterNav';
import { TableItemByStoreData } from 'data/render/table';
import { useImportExcel } from 'hooks';
import ItemMasterByStoreSearchForm from 'pages/itemMaster/v2/store/form/ItemMasterByStoreSearchForm';
import React from 'react';

const ItemMasterByStore = () => {
  const { ComponentImport, dataImported } = useImportExcel();
  const [formSearch] = Form.useForm();
  return (
    <ItemMasterNav>
      <ItemMasterByStoreSearchForm form={formSearch} ImportButton={ComponentImport} />
      <Block>
        <MainTable className="mt-15" pagination={null} dataSource={[]} columns={TableItemByStoreData.columns({})} />
      </Block>
    </ItemMasterNav>
  );
};

export default ItemMasterByStore;
