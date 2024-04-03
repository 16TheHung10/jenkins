import { Drawer, Form, Select } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import CONSTANT from 'constant';
import { TableDigitalSignageTVITReportData } from 'data/render/table';
import { ArrayHelper, UrlHelper } from 'helpers';
import { usePagination } from 'hooks';
import moment from 'moment';
import useMediaQuery from 'pages/digitalSignage/media/hooks/useMediaQuery';
import DigitalSignageDailyLogFormSearch from 'pages/digitalSignage/tvITReport/form/search';
import useDailyLogQuery from 'pages/digitalSignage/tvLog/hooks/useDailyLogQuery';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NotifyDigitalSignageITNav from '../tvNotify/nav';
import useTVsQuery from 'pages/digitalSignage/tv/hooks/useTVsQuery';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';

const initialValueSearchForm = {
  date: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
};

const DigitalSignageDailyLogIT = () => {
  const [searchFormValue, setSearchFormValue] = useState({});
  const [filterFormValue, setFilterFormValue] = useState({});
  const [formSearch] = Form.useForm();
  const appVersionOptionsRef = useRef({});
  const logsQuery = useDailyLogQuery({
    searchFormValue: {
      date: [searchFormValue.startDate, searchFormValue.endDate],
      storeCode: searchFormValue.storeCode,
      tvCode: searchFormValue.tvCode,
      pageSize: 10000,
      pageNumber: 1,
    },
    role: 'admin',
  });
  const mediaQuery = useMediaQuery({});

  const tvsQuery = useTVsQuery({ searchFormValue, setTotalValue: () => {} });

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

  useEffect(() => {
    let resetValues = {};
    if (Object.keys(searchFormValue || {}).length > 0) {
      const { ...restParmas } = searchFormValue;
      resetValues = {
        ...restParmas,
        startDate: moment(searchFormValue.startDate).format(CONSTANT.FORMAT_DATE_PAYLOAD),
        endDate: moment(searchFormValue.startDate).format(CONSTANT.FORMAT_DATE_PAYLOAD),
      };
    }
    UrlHelper.setSearchParamsFromObject({ ...resetValues });
  }, [searchFormValue]);

  useEffect(() => {
    let currentUrlParams = UrlHelper.getSearchParamsObject() || {};
    currentUrlParams.startDate =
      moment(currentUrlParams.startDate).diff(moment(), 'days') < 0
        ? moment(currentUrlParams.startDate)
        : moment().subtract(1, 'day');
    currentUrlParams.endDate =
      moment(currentUrlParams.endDate).diff(moment(), 'days') < 0
        ? moment(currentUrlParams.startDate)
        : moment().subtract(1, 'day');

    const startDate = currentUrlParams.startDate;
    const endDate = currentUrlParams.startDate;
    currentUrlParams = {
      ...currentUrlParams,
      startDate,
      endDate,
    };

    const { pageSize, pageNumber, ...restParams } = currentUrlParams;
    formSearch.setFieldsValue({
      ...restParams,
    });

    setSearchFormValue((prev) => ({
      ...(prev || {}),
      ...restParams,
    }));
  }, []);

  const flatingTVsData = (data, filter) => {
    const res = [];
    for (let store of Object.values(data || {})) {
      let index = 0;
      for (let tv of store?.sort((a, b) => b.active - a.active)) {
        tv = {
          ...tv,
          key: tv.tvCode,
        };
        if (index === 0) {
          res.push({
            ...tv,
            rowSelection: false,
            rowSpan: data[tv.storeCode]?.length,
            colSpan: 1,
          });
        } else {
          res.push({ ...tv, rowSelection: false, rowSpan: 1, colSpan: 0 });
        }
        index++;
      }
    }
    return res;
  };

  const dataSource = useMemo(() => {
    const tvs = flatingTVsData(tvsQuery.data, filterFormValue);
    const logObjectByTVCode = ArrayHelper.convertArrayToObject(logsQuery.data?.logs, 'tvCode');
    const mappedData = tvs?.map((item) => {
      const logOfTV = logObjectByTVCode?.[item.tvCode];
      return {
        ...item,
        ...logOfTV?.version,
        videoDownload: logOfTV?.videoDownload || JSON.stringify([]),
        errorLog: logOfTV?.errorLog,
        isReport: Boolean(logOfTV),
        version: logOfTV?.version,
        logs: logOfTV,
      };
    });
    let res = mappedData.filter((el) => {
      return (
        (filterFormValue.reportType === null ||
          filterFormValue.reportType === undefined ||
          el.isReport === filterFormValue.reportType) &&
        (filterFormValue.appVersion === null ||
          filterFormValue.appVersion === undefined ||
          el.version === filterFormValue.appVersion)
      );
    });
    appVersionOptionsRef.current =
      Object.values(ArrayHelper.convertArrayToObject(res, 'version') || {})
        ?.filter((el) => el.version)
        ?.map((item) => {
          return { value: item.version, label: item.version };
        }) || [];
    return res;
  }, [tvsQuery.data, filterFormValue, logsQuery.data?.logs]);

  console.log({ dataSource });

  const handleFilter = (value) => {
    setFilterFormValue(value);
  };
  return (
    <NotifyDigitalSignageITNav>
      <Block id="dailyLogSearchForm">
        <DigitalSignageDailyLogFormSearch
          versionOptions={appVersionOptionsRef.current}
          form={formSearch}
          onSetValue={onSetSearchFormValue}
          onFilterReportType={handleFilter}
        />
      </Block>
      <Block id="dailyLogSearchResult" className="w-fit">
        <div style={{ maxHeight: 'calc(100vh - 335px)', overflow: 'auto' }}>
          <MainTable
            className="w-fit fixed_header"
            loading={logsQuery.isLoading}
            columns={TableDigitalSignageTVITReportData.columns({ mediaObject })}
            dataSource={dataSource}
          />
        </div>
      </Block>
    </NotifyDigitalSignageITNav>
  );
};

export default DigitalSignageDailyLogIT;
