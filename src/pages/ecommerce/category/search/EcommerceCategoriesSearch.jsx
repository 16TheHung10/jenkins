import { Col, Row, message } from 'antd';
import { EcommerceCategoryApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import { scrollToTop } from 'components/mainContent/MainContent';
import { FieldsEcommerceCategoryData } from 'data/render/form';
import { TableEcommerceCategoryData } from 'data/render/table';
import { ObjectHelper, UrlHelper } from 'helpers';
import { useFormFields } from 'hooks';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import EcommerceCategoryNavWrapper from '../nav';

const EcommerceCategoriesSearch = () => {
  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
  } = useFormFields({
    fieldInputs: FieldsEcommerceCategoryData.fieldsSearch(),
    onSubmit: () => {},
  });

  const handleSetSearchParamsUrl = (params) => {
    const currentParams = UrlHelper.getSearchParamsObject();
    const newParams = { ...currentParams, ...params };
    UrlHelper.setSearchParamsFromObject(newParams);
  };

  const handleFetchEcommerceCategories = async (value) => {
    const params = { ...value };
    const res = await EcommerceCategoryApi.getCategories(params);
    if (res.status) {
      return res.data.categories?.sort((a, b) => a.categoryID - b.categoryID);
    }
    message.error(res.message);
    return null;
  };

  useEffect(() => {
    const currentParams = UrlHelper.getSearchParamsObject();
    const { ...restSearch } = currentParams;
    reset({ ...restSearch });
  }, []);

  const productQuery = useQuery({
    queryKey: [
      'ecommerce/categories',
      {
        ...(ObjectHelper.removeAllNullValue(getValues()) || {}),
      },
    ],
    queryFn: () => handleFetchEcommerceCategories(getValues()),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    scrollToTop();
    handleSetSearchParamsUrl({
      ...getValues(),
    });
  }, [getValues('taxCode'), getValues('companyRepresentativeName'), getValues('modelFranchise')]);

  return (
    <EcommerceCategoryNavWrapper>
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
          <div className=" w-full table-inner">
            <MainTable loading={productQuery.isLoading} className="w-full" columns={TableEcommerceCategoryData.columns()} dataSource={productQuery?.data} />
          </div>
        </div>
      </div>
    </EcommerceCategoryNavWrapper>
  );
};

export default EcommerceCategoriesSearch;

