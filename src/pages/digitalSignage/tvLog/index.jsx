import { Form, message } from 'antd';
import { DigitalSignageTVApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import CONSTANT from 'constant';
import TableDigitalSignageTVDailyLogData from 'data/render/digitalSignage/table/TableDigitalSignageTVDailyLogData';
import { UrlHelper } from 'helpers';
import { usePagination } from 'hooks';
import AppMessage from 'message/reponse.message';
import DownloadModel from 'models/DownloadModel';
import moment from 'moment';
import useMediaQuery from 'pages/digitalSignage/media/hooks/useMediaQuery';
import DigitalSignageDailyLogFormSearch from 'pages/digitalSignage/tvLog/form/search';
import useDailyLogQuery from 'pages/digitalSignage/tvLog/hooks/useDailyLogQuery';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DigitalSignageNav from '../nav';

const initialValueSearchForm = {
  date: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
};

const DigitalSignageDailyLog = () => {
  const [searchFormValue, setSearchFormValue] = useState(null);
  const [formSearch] = Form.useForm();
  const logsQuery = useDailyLogQuery({ searchFormValue });
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  const mediaQuery = useMediaQuery({});
  const mediaObject = useMemo(() => {
    const obj = {};
    for (let item of mediaQuery.data || []) {
      obj[item.mediaCode] = item;
    }
    return obj;
  }, [mediaQuery.data]);
  const onSetSearchFormValue = useCallback(
    (value) => {
      setSearchFormValue((prev) => ({ ...prev, ...value }));
    },
    [searchFormValue]
  );
  const {
    Pagination,
    pageSize,
    pageNumber,
    setValues: onResetPagination,
  } = usePagination({ total: mediaQuery.data?.total || 0 });

  useEffect(() => {
    setSearchFormValue((prev) => ({ ...prev, pageSize, pageNumber }));
  }, [pageSize, pageNumber]);
  useEffect(() => {
    let resetValues = {};
    if (searchFormValue) {
      const { date, ...restParmas } = searchFormValue;
      resetValues = {
        startDate: searchFormValue?.date?.[0]
          ? moment(searchFormValue.date?.[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD)
          : null,
        endDate: searchFormValue?.date?.[1]
          ? moment(searchFormValue.date?.[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD)
          : null,
        ...restParmas,
      };
    }
    UrlHelper.setSearchParamsFromObject({ ...resetValues });
  }, [searchFormValue]);

  useEffect(() => {
    let currentUrlParams = UrlHelper.getSearchParamsObject() || {};
    currentUrlParams = {
      ...currentUrlParams,
      date:
        currentUrlParams.startDate && currentUrlParams.endDate
          ? [moment(currentUrlParams.startDate), moment(currentUrlParams.endDate)]
          : initialValueSearchForm.date,
    };
    const { startDate, endDate, pageSize, pageNumber, ...restParams } = currentUrlParams;
    formSearch.setFieldsValue({ ...restParams });
    setSearchFormValue((prev) => ({ ...(prev || {}), ...restParams }));
    onResetPagination({ pageSize: pageSize ? +pageSize : 30, pageNumber: pageNumber ? +pageNumber : 1 });
  }, []);

  const handleGetLinkExport = async () => {
    setIsLoadingExport(true);
    if (logsQuery.data?.logs?.length > 0) {
      if (searchFormValue.date?.length > 0) {
        const { date, ...restParams } = searchFormValue;
        const startDate = searchFormValue.date?.[0]
          ? moment(searchFormValue.date?.[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD)
          : null;
        const endDate = searchFormValue.date?.[1]
          ? moment(searchFormValue.date?.[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD)
          : null;
        const model = new DownloadModel();
        const res = await DigitalSignageTVApi.getLinkExportDailyLog({
          ...restParams,
          startDate,
          endDate,
          fileName: 'tvDailyReport.xlsx',
        });
        if (res.data?.downloadUrl) {
          const resDownload = await model.get(res.data?.downloadUrl, null, null, '');
          setIsLoadingExport(false);
        } else {
          setIsLoadingExport(false);
          message.error(res.message);
        }
      }
    } else {
      setIsLoadingExport(false);
      AppMessage.info('Nothing to export');
    }
    setIsLoadingExport(false);
  };
  return (
    <DigitalSignageNav>
      <Block id="dailyLogSearchForm">
        <DigitalSignageDailyLogFormSearch
          form={formSearch}
          onSetValue={onSetSearchFormValue}
          onGetLinkExport={handleGetLinkExport}
          loadingExport={isLoadingExport}
        />
      </Block>
      <Block id="dailyLogSearchResult">
        <div style={{ maxHeight: 'calc(100vh - 335px)', overflow: 'auto' }}>
          <MainTable
            className="w-full fixed_header"
            loading={logsQuery.isLoading}
            columns={TableDigitalSignageTVDailyLogData.columns({ mediaObject })}
            dataSource={logsQuery.data?.logs}
          />
        </div>
        <Pagination showSizeChanger />
      </Block>
    </DigitalSignageNav>
  );
};

export default DigitalSignageDailyLog;
