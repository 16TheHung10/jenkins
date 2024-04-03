import { message } from 'antd';
import React from 'react'
import { fetchData } from 'helpers/FetchData';
import { decreaseDate } from 'helpers/FuncHelper';
import DateHelper from 'helpers/DateHelper';
import { useEffect } from 'react';
import { useState } from 'react';
import InventoryNoti from 'component/inventoryNoti';
import moment from 'moment';

export default function CheckInventory({ children }) {

    const [isShowCompInventoryComp, setIsShowCompInventoryComp] = useState(false);

    useEffect(() => {
        handleCheckStatusInventory();
    }, []);

    const handleCheckStatusInventory = async (valueDate, funcCallback) => {

        try {
            const params = {
                // date: DateHelper.displayDateFormatMinus(decreaseDate(1)) ?? ''
                date: moment().clone().startOf('month').format('YYYY-MM-DD') ?? ''
            }

            const url = `/inventory/storestatus/inventory/calculate`;
            const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_INVENTORY_REPORT_ROOT_URL);

            if (response?.status) {

                if (response?.data?.storeStatus) {

                    if (typeof funcCallback === 'function') {
                        funcCallback();
                    }

                    if (response.message) {
                        if (response.message !== "") {
                            message.error(response.message);
                        }
                    }
                }
                else {
                    setIsShowCompInventoryComp(true)
                }
            }

        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    return (
        <>
            {
                isShowCompInventoryComp ?
                    <InventoryNoti />
                    : children
            }
        </>
    )
}
