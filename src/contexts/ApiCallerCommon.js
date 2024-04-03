import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from './DataContext';
import { fetchData } from 'helpers/FetchData';
import { message } from 'antd';
import { AuthApi } from 'api/AuthApi';

export default function ApiCallerCommon() {
  const { setData } = useContext(DataContext);
  const token = localStorage.getItem('accessToken');
  const isLogin = localStorage.getItem('isLogin');

  const callApi = async () => {
    // const verCommon = 'common';
    // const storeKey =  'store';
    const verCommon = 'commonv2';

    const storeKey = 'storeuser';
    const urlStore = `/${verCommon}/object/types=${storeKey}`;
    const responseCommon2 = AuthApi.get(urlStore);

    const storeSalesKey = 'storesales';
    const urlStoreSales = `/${verCommon}/object/types=${storeSalesKey}`;
    const responseCommon2StoreSales = AuthApi.get(urlStoreSales);

    const url = `/common/object/types=supplier,division,categorytype,subclass,group,orderstatus,transmomotype,vouchertype,storereceive`;
    const responseCommon = AuthApi.get(url);
    const [res1, res2, res3] = await Promise.all([responseCommon, responseCommon2, responseCommon2StoreSales]);
    // const [res1] = await Promise.all([responseCommon]);

    if (res1?.status && res2?.status && res3?.status) {
      // if (res1?.status) {

      const jsonData = { ...res1.data, ...res2?.data, ...res3?.data };
      // const jsonData = { ...res1.data };
      setData(jsonData);

      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 5);
      const dataToStore = { data: jsonData, expirationTime: expirationTime.getTime() };
      localStorage.setItem('cachedData', JSON.stringify(dataToStore));
    } else {
      message.error('Cound not get menu list');
      localStorage.clear();
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        if (token && isLogin) {
          const cachedData = localStorage.getItem('cachedData');
          if (cachedData) {
            const { data, expirationTime } = JSON.parse(cachedData);
            const currentTime = new Date().getTime();
            if (currentTime < expirationTime) {
              setData(data);
            } else {
              callApi();
            }
          } else {
            callApi();
          }
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchApi();
  }, [setData, token, isLogin]);

  return null;
}

// export default function ApiCallerCommon() {
//     const { setData } = useContext(DataContext);
//     const [isDataLoaded, setIsDataLoaded] = useState(false);
//     const token = localStorage.getItem('accessToken');
//     const isLogin = localStorage.getItem('isLogin');

//     useEffect(() => {
//         const fetchApi = async () => {

//             try {
//                 if (!isDataLoaded && token && isLogin) {
//                     setIsDataLoaded(true);

//                     const url = '/common/object/types=store,supplier,division,orderstatus,transmomotype,vouchertype,storereceive';

//                     const response = await fetchData(url, 'GET', null, null, null, null, 'max-age=86400');

//                     if (response?.status) {
//                         const jsonData = response.data;
//                         setData(jsonData);
//                     }
//                 }

//             } catch (error) {
//                 console.error('Error fetching data: ', error);
//             }
//         }

//         fetchApi();
//     }, [isDataLoaded, setData, token, isLogin]);

//     return null;
// }
