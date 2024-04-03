import { Col, Row, message } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
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
import FieldList from 'components/common/fieldList/FieldList';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

const EcommerceItemsSearch = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const [totalItemsData, setTotalItemsData] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { Pagination, pageSize, pageNumber, setValues: onResetPagination } = usePagination({ total: totalItemsData });
  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
  } = useFormFields({
    fieldInputs: FieldsEcommerceItemData.fieldsSearch({ categoryOptions }),
    onSubmit: () => {
      onResetPagination({ pageSize, pageNumber: 1 });
    },
  });

  const handleGetCategory = async () => {
    const res = await EcommerceCategoryApi.getCategories();
    if (res.status) {
      const options = res.data.categories
        ?.sort((a, b) => a.categoryID - b.categoryID)
        ?.map((item) => {
          return { value: item.categoryID, label: `${item.categoryID} - ${item.categoryName}` };
        });
      setCategoryOptions(options);
    } else {
      message.error(res.message);
    }
  };

  const handleSetSearchParamsUrl = (params) => {
    const currentParams = UrlHelper.getSearchParamsObject();
    const newParams = { ...currentParams, ...params };
    UrlHelper.setSearchParamsFromObject(newParams);
  };

  const handleFetchEcommerceItems = async (value) => {
    const params = { ...value, pageSize, pageNumber };
    const res = await EcommerceItemApi.getItems(params);
    if (res.status) {
      return res.data;
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

  const handleUpdateStatus = async ({ itemCode, active, index }) => {
    console.log({ itemCode, active, index });
    const res = await EcommerceItemApi.updateItemStatus(itemCode, active);
    if (res.status) {
      return { itemCode, active, index };
    } else {
      throw new Error(res.message);
    }
  };
  const productQuery = useQuery({
    queryKey: [
      'ecommerce/items',
      {
        ...(ObjectHelper.removeAllNullValue(getValues()) || {}),
        pageSize: pageSize?.toString() || 30,
        pageNumber: pageNumber?.toString() || 1,
      },
    ],
    queryFn: () => handleFetchEcommerceItems(getValues()),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: Boolean(pageNumber) && Boolean(pageSize),
  });
  const productStatusMutation = useMutation(handleUpdateStatus, {
    onSuccess: (data) => {
      message.success('Update status successfully');
      queryClient.invalidateQueries('ecommerce/items');
    },
    onError: (err) => {
      message.error(err.message);
    },
  });
  console.log({ productStatusMutation });
  useEffect(() => {
    setTotalItemsData(productQuery.data?.total);
  }, [productQuery.data?.total]);

  useEffect(() => {
    scrollToTop();
    handleSetSearchParamsUrl({
      ...getValues(),
      pageSize: pageSize?.toString() || 30,
      pageNumber: pageNumber?.toString() || 1,
    });
  }, [getValues('searchKeyword'), getValues('typeID'), getValues('active'), pageSize, pageNumber]);

  useEffect(() => {
    handleGetCategory();
  }, []);
  const handle = useFullScreenHandle();

  return (
    <ComponentNav>
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
            <div style={{ maxHeight: 'calc(100vh - 325px)', overflow: 'auto' }}>
              <MainTable
                loading={productQuery.isLoading}
                className="w-full fixed_header"
                columns={TableEcommerceItemData.columns({ mutation: productStatusMutation })}
                dataSource={productQuery?.data?.items}
              />
            </div>
            <div className="w-full text-center paging">
              <Pagination showSizeChanger />
            </div>
          </div>
        </div>
      </div>
    </ComponentNav>
  );
};

export default EcommerceItemsSearch;
