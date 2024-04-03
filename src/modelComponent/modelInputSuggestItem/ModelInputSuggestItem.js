import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AutoComplete, Input } from 'antd';
import { fetchData } from 'helpers/FetchData';
const { Option } = AutoComplete;

export default function ModelInputSuggestItem({ resetKey, ...props }) {
    const [dataSource, setDataSource] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [apiData, setApiData] = useState({});
    const [apiCalled, setApiCalled] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    let timer = useRef(null);
    const MAX_INPUT_LENGTH = 30;
    // const [isApiCallPending, setIsApiCallPending] = useState(false);
    // const apiQueue = []; // Hàng đợi cho các API chưa được gọi

    useEffect(() => {
        setDataSource([]);
        setInputValue('');
        setSelectedItem(null);
    }, [resetKey])

    const callApi = async (value) => {
        if (value?.length >= 3) {
            if (!apiData[value]
                //  && !isApiCallPending
            ) {
                // setIsApiCallPending(true);
                const url = `/item/ItemSuggestion/filter/result`;
                let params = { keyword: value };
                try {
                    const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_EXT_ITEM_ROOT_URL);

                    if (response?.status) {
                        const data = response?.data?.items;

                        setApiData({ ...apiData, [value]: data });
                        setApiCalled({ ...apiCalled, [value]: true });

                        // const itemList = Object.keys(data).map((key) => ({ itemCode: data[key].itemCode, itemName: data[key].itemName }));
                        const itemList = data?.map((item) => ({ itemCode: item.barcode, itemName: item.itemName }));
                        setDataSource(itemList);
                    }

                } catch (error) {
                    console.log(`Error when calling ${url}`, error);
                } finally {
                    // setIsApiCallPending(false); // Đặt biến kiểm soát là false khi kết thúc gọi API

                    // Sau khi hoàn thành gọi API, kiểm tra xem còn API trong hàng đợi hay không
                    // if (apiQueue.length > 0) {
                    //     const nextApi = apiQueue.shift();
                    //     callApi(nextApi);
                    // }
                }
            }
            else {
                const data = apiData[value] || [];
                const itemList = data?.map((item) => ({ itemCode: item.barcode, itemName: item.itemName }));
                setDataSource(itemList);
            }
        }

    }

    const handleOnChange = (value) => {
        // console.log({ value })
        if (!value) {
            setDataSource([])
        }

        if (timer?.current) {
            clearTimeout(timer.current); // Hủy bỏ tiến trình timeout trước nếu có
        }

        let val = !value ? '' : value;

        if (val.length > MAX_INPUT_LENGTH) {
            val = val.substring(0, MAX_INPUT_LENGTH); // Cắt giá trị nếu vượt quá độ dài tối đa
        }

        setInputValue(val);


        if (props?.getBarcode) {
            // let objItem = { itemCode: val, itemName: dataSource?.find(item => item.itemCode === val)?.itemName };
            const itemCode = val;
            const itemName = dataSource?.find(item => item.itemCode === val)?.itemName ?? '';
            props.getBarcode(itemCode, itemName);
        }

        timer.current = setTimeout(() => {
            callApi(val);
        }, 1000);
    }

    const handleSelect = (value, option) => {
        const data = apiData[value];
        setSelectedItem(data);
    }

    const renderInputValue = () => {
        if (selectedItem) {
            return selectedItem.itemCode;
        }
        return inputValue;
    }

    const bodyContent = useCallback(() => {
        return <>
            <AutoComplete
                key={resetKey}
                dataSource={dataSource.map((item) => (
                    <Option key={item.itemCode} value={item.itemCode}>
                        {item.itemName}
                    </Option>
                ))}
                placeholder="Type here..."
                allowClear={true}
                value={renderInputValue()}
                onChange={handleOnChange}
                onSelect={handleSelect}
                style={{ width: '100%' }}
            >
                {/* <Input maxLength={5} /> */}
            </AutoComplete>
        </>
    }, [dataSource, inputValue, selectedItem, resetKey]);

    return bodyContent();
}
