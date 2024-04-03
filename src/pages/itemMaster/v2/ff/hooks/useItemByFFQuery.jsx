import { message } from 'antd';
import { DigitalSignageTVApi, ReportApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';

const useItemByFFQuery = ({ params }) => {
  const handleGetTVs = async () => {
    params = { ...params, date: moment(params.date).format(CONSTANT.FORMAT_DATE_PAYLOAD) };
    const res = await ReportApi.getItemFFReport(params);
    if (res.status) {
      return res.data?.logs;
    } else {
      AppMessage.error(res.message);
      return [];
    }
  };

  const tvQuery = useQuery({
    queryKey: ['report/item/ff', params],
    queryFn: handleGetTVs,
    enabled: Boolean(params?.date),
  });
  return tvQuery;
};

export default useItemByFFQuery;
