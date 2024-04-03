import { Col, Row, message } from 'antd';
import { EcommerceGroupApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import { scrollToTop } from 'components/mainContent/MainContent';
import { FieldsEcommerceGroupData } from 'data/render/form';
import { TableEcommerceGroupData } from 'data/render/table';
import { ObjectHelper, UrlHelper } from 'helpers';
import { useFormFields, usePagination } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import EcommerceGroupNav from '../nav';

const EcommerceGroupsSearch = () => {
  const [totalFCData, setTotalFCData] = useState(0);
  const { Pagination, pageSize, pageNumber, setValues: onResetPagination } = usePagination({ total: totalFCData });
  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
  } = useFormFields({
    fieldInputs: FieldsEcommerceGroupData.fieldsSearch(),
    onSubmit: () => {
      onResetPagination({ pageSize, pageNumber: 1 });
    },
  });

  const handleSetSearchParamsUrl = (params) => {
    const currentParams = UrlHelper.getSearchParamsObject();
    const newParams = { ...currentParams, ...params };
    UrlHelper.setSearchParamsFromObject(newParams);
  };

  const handleFetchFcData = async (value) => {
    const params = { ...value, pageSize, pageNumber };
    const res = await EcommerceGroupApi.getGroups(params);
    if (res.status) {
      return Object.values(res.data.groups || {})?.sort((a, b) => a.groupID - b.groupID);
    }
    message.error(res.message);
    return null;
  };

  useEffect(() => {
    const currentParams = UrlHelper.getSearchParamsObject();
    const { pageNumber, pageSize, ...restSearch } = currentParams;
    reset({ ...restSearch });
    if (!Number.isNaN(+currentParams?.pageSize) || !Number.isNaN(+currentParams?.pageNumber)) {
      onResetPagination({ pageSize: +currentParams.pageSize, pageNumber: +currentParams.pageNumber });
    }
  }, []);

  const ecommerceGroupsQuery = useQuery({
    queryKey: [
      'ecommerce/groups',
      {
        ...(ObjectHelper.removeAllNullValue(getValues()) || {}),
        pageSize: pageSize?.toString() || 30,
        pageNumber: pageNumber?.toString() || 1,
      },
    ],
    queryFn: () => handleFetchFcData(getValues()),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: Boolean(pageNumber) && Boolean(pageSize),
  });

  useEffect(() => {
    setTotalFCData(ecommerceGroupsQuery.data?.total);
  }, [ecommerceGroupsQuery.data?.total]);

  useEffect(() => {
    scrollToTop();
    handleSetSearchParamsUrl({
      ...getValues(),
      pageSize: pageSize?.toString() || 30,
      pageNumber: pageNumber?.toString() || 1,
    });
  }, [getValues('taxCode'), getValues('companyRepresentativeName'), getValues('modelFranchise'), pageSize, pageNumber]);
  return (
    <EcommerceGroupNav>
      <div className="mini_app_container">
        <div className="section-block mt-15">
          <form onSubmit={onSubmitHandler}>
            <Row gutter={[16, 0]}>
              <Col span={24}>
                <Row gutter={[16, 0]}>
                  <FieldList fields={fields} />
                </Row>
              </Col>
            </Row>
            <div className="flex items-center gap-10">
              <BaseButton htmlType="submit" iconName="search">
                Search
              </BaseButton>
            </div>
          </form>
        </div>
        <div className="table section-block mt-15 w-full">
          <div className="" style={{ maxHeight: 'calc(100vh - 275px)', overflow: 'auto' }}>
            <MainTable loading={ecommerceGroupsQuery.isLoading} className="w-full fixed_header" columns={TableEcommerceGroupData.columns()} dataSource={ecommerceGroupsQuery?.data} />
          </div>
          {/* <div className="w-full text-center paging">
            <Pagination showSizeChanger />
          </div> */}
        </div>
      </div>
    </EcommerceGroupNav>
  );
};

export default EcommerceGroupsSearch;

