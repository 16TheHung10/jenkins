import { Form } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import { scrollToTop } from 'components/mainContent/MainContent';
import CONSTANT from 'constant';
import { TablePromotionMixABMatchCSearchData } from 'data/render/table';
import { UrlHelper } from 'helpers';
import { useGetiMixABMatchCQuery, usePagination } from 'hooks';
import moment from 'moment';
import PromotionMixABMatchCSearchForm from 'pages/promotion/mixABMatchC/search/form';
import React, { useCallback, useEffect, useState } from 'react';
import PromotionMixABMatchCNav from '../nav';

const PromotionMixABMatchCSearch = () => {
  const [searchParams, setSearchParams] = useState({});
  const [isFormReady, setIsFormReady] = useState(false);
  const [totalPromotions, setTotalPromotions] = useState(0);

  const [searchForm] = Form.useForm();
  const { Pagination, pageSize, pageNumber } = usePagination({ total: totalPromotions });
  const promotionQuery = useGetiMixABMatchCQuery({ searchParams, onSetTotalData: setTotalPromotions });

  const handleSetSearchParamsUrl = (params) => {
    UrlHelper.setSearchParamsFromObject({ ...params });
  };

  const handleSubmitForm = useCallback(
    (formValues) => {
      setSearchParams(formValues);
    },
    [searchParams]
  );

  // Initial data search when reload page
  useEffect(() => {
    let currentParams = UrlHelper.getSearchParamsObject();
    if (currentParams.startDate) {
      currentParams = {
        ...currentParams,
        status: Number.isNaN(+currentParams.status) ? null : +currentParams.status,
        date: currentParams.startDate
          ? [moment(currentParams.startDate, 'YYYY-MM-DD'), moment(currentParams.endDate, 'YYYY-MM-DD')]
          : null,
      };
      searchForm.setFieldsValue({ ...currentParams });
      setIsFormReady(true);
    }
  }, []);
  useEffect(() => {
    console.log({ isFormReady });
    if (isFormReady)
      setTimeout(() => {
        searchForm.submit();
      }, 0);
  }, [isFormReady, searchForm]);
  // Update search url params when click search
  useEffect(() => {
    const { date, ...restParams } = searchParams;
    scrollToTop();
    handleSetSearchParamsUrl({
      ...restParams,
      status: Number.isNaN(+searchParams.status) ? '' : +searchParams.status,
      startDate: searchParams?.date?.[0] ? moment(searchParams?.date?.[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD) : null,
      endDate: searchParams?.date?.[1] ? moment(searchParams?.date?.[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD) : null,
    });
  }, [searchParams]);

  // Update pageSize and pageNumber to searchParams
  useEffect(() => {
    setSearchParams((prev) => ({ ...prev, pageSize, pageNumber }));
  }, [pageSize, pageNumber]);

  return (
    <PromotionMixABMatchCNav>
      <div className="mini_app_container">
        <Block id="form">
          <PromotionMixABMatchCSearchForm onSubmit={handleSubmitForm} form={searchForm} />
        </Block>

        <Block id="table_result">
          <MainTable
            loading={promotionQuery.isLoading}
            className="w-full"
            columns={TablePromotionMixABMatchCSearchData.columns()}
            dataSource={promotionQuery?.data?.promotions}
          />
          <div className="text-center w-full">
            <Pagination showSizeChange />
          </div>
        </Block>
      </div>
    </PromotionMixABMatchCNav>
  );
};

export default PromotionMixABMatchCSearch;
