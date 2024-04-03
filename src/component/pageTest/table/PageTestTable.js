import { Space, Table, Tag } from 'antd';
import React from 'react';
import { useMemo } from 'react';

const PageTestTable = ({ dataTable, th }) => {



    const renderColumns = useMemo(() => {
        const keys = Object.keys(dataTable?.[0] || {});
        if (dataTable?.length > 0) {
            console.log("cccccccccccccccccccccccc")
            return keys.map((item, index) => {
                console.log({ item })
                return {
                    title: th?.[index] || item,
                    dataIndex: item,
                    key: index,
                }
            })
        }
        return th.map((item, index) => ({
            title: item,
            key: `th-${index}`
        }))

    }, [dataTable, th])
    console.log({ renderColumns })
    const renderData = useMemo(() => {
        return dataTable?.map((item, index) => {
            const keys = Object.keys(dataTable?.[0]);
            let row = {};
            for (let key of keys) {
                row = { ...row, [key]: item[key], key: `row-${index}` }
            }
            return row
        })
    }, [dataTable])


    return (
        <div>
            <Table style={{ width: "fit-content" }} columns={renderColumns} dataSource={renderData} />
        </div>
    );
};

export default PageTestTable;