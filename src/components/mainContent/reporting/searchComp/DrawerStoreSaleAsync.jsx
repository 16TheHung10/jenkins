import React, { useEffect } from 'react';
import ReportingModel from 'models/ReportingModel';
import { message } from 'antd';
import moment from 'moment';
import { DateHelper } from 'helpers';
import { useQuery } from 'react-query';
import { decreaseDate, mapData } from 'helpers/FuncHelper';

const DrawerStoreSaleAsync = ({ selectedDate, allStoreItems, counters }) => {
  const handleSum = (obj) => {
    let newSum = {
      storeOpen: 0,
      success: 0,
      process: 0,
      unknow: 0,
    };

    for (let k in obj) {
      let item = obj[k];

      if (item.statusStore === 0) {
        newSum.storeOpen += 1;
      }

      if (item.status === 1) {
        newSum.success += 1;
      } else {
        if (item.status === undefined) {
          if (item.statusStore === 0) {
            newSum.unknow += 1;
          }
        } else {
          newSum.process += 1;
        }
      }
    }

    return newSum;
  };

  const handleGetStoreSalesAsyncByDay = async (date) => {
    let model = new ReportingModel();
    let page = '/storestatus/comparesale';
    const res = await model.getAllSummary(page, { date });
    if (res.status) {
      let data = res.data.compareSale;

      data.sort((a, b) => (a['storeCode'] <= b['storeCode'] ? -1 : 1));

      let newList = mapData(allStoreItems, data, 'storeCode', ['status', 'dateKey', 'updatedDate', 'note']);
      data = newList?.map((item) => {
        return { ...item, counters: counters?.[item.storeCode] || null };
      });
      return handleSum(data);
    } else {
      throw new Error(res.message);
    }
  };
  const handleFetchDate = async () => {
    const firstDay = moment(selectedDate).startOf('month');
    const lastDay = moment(selectedDate).endOf('month');

    const allDays = [];
    let currentDay = firstDay.clone();
    while (currentDay.isSameOrBefore(lastDay, 'day')) {
      allDays.push(currentDay.format('YYYY-MM-DD'));
      currentDay.add(1, 'day');
    }
    const res = await Promise.all(
      (Array.isArray(allDays) ? allDays : []).map(async (item) => {
        const data = await handleGetStoreSalesAsyncByDay(item);
        return data;
      })
    );
    return res;
  };

  const storeQuery = useQuery({
    queryKey: ['allStoreFC', moment(selectedDate).format('YYYY-MM-DD')],
    queryFn: handleFetchDate,
    enabled: Boolean(selectedDate),
  });
  console.log({ storeQuery });
  return <div></div>;
};

export default DrawerStoreSaleAsync;
