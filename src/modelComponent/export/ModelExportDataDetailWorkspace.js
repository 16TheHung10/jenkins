import { Col, Row, DatePicker, Tag, message, Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import SelectboxAndCheckbox from "utils/selectboxAndCheckbox";
import { DataContext } from "context/DataContext";
import DrawerComp from 'utils/drawer';
import moment from 'moment';
import { FileSearchOutlined } from '@ant-design/icons';
import DateHelper from 'helpers/DateHelper';
import { fetchData, downloadFile } from 'helpers/FetchData';
import ModelGroupDate from 'modelComponent/ModelGroupDate';
import ModelGroupStore from 'modelComponent/ModelGroupStore';

const { MonthPicker } = DatePicker;

export default function ModelExportDataDetailWorkspace({ ...props }) {
    const [groupStore, setGroupStore] = useState('');
    const [groupDate, setGroupDate] = useState(moment().subtract(1, 'days'));
    const [dateModel, setDateModel] = useState('week');

    const { data } = useContext(DataContext);
    const { stores } = data;
    const [storeOpt, setStoreOpt] = useState([]);

    const [storeCode, setStoreCode] = useState('');
    const [date, setDate] = useState(moment(new Date(), 'MM/YYYY'));

    const [isOpenDrawerExport, setIsOpenDrawerExport] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [maxChoose, setMaxChoose] = useState(10);

    useEffect(() => {
        if (props.maxChoose) {
            setMaxChoose(props.maxChoose)
        }
    }, [props.maxChoose]);

    useEffect(() => {
        if (props.isOpenDrawerExport) {
            setIsOpenDrawerExport(props.isOpenDrawerExport)
        }
    }, [props.isOpenDrawerExport]);

    useEffect(() => {
        if (props?.updateIsOpen) {
            props.updateIsOpen(isOpenDrawerExport)
        }
    }, [isOpenDrawerExport]);


    useEffect(() => {
        if (!!stores) {
            let listStoreOpt = [];

            if (Object.keys(stores)?.length === 0) {
                let storeCode = JSON.parse(localStorage.getItem('profile'))?.storeCode;
                let storeName = storeCode + ' - ' + JSON.parse(localStorage.getItem('profile'))?.storeName;

                listStoreOpt = [{ value: storeCode, label: storeName }];

            }
            else {
                listStoreOpt = Object.values(stores)?.map(el => ({ value: el.storeCode, label: `${el.storeCode} - ${el.storeName}`, openedDate: el.openedDate }));
            }

            setStoreOpt(listStoreOpt);
        }

    }, [stores]);

    const onSearch = async () => {
        if (isLoading) {
            message.warning({ key: 'search', content: 'Please await...' })
            return false;
        }
        // let dateCur = new Date(date);
        // const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // const firstDateOfMonth = new Date(dateCur.getFullYear(), dateCur.getMonth(), 1);
        // const formattedCurrentDate = dateCur.toLocaleDateString(undefined, options);
        // const formattedFirstDate = firstDateOfMonth.toLocaleDateString(undefined, options);
        // const monthSearch = dateCur.getMonth();

        // let lastDateOfMonth;
        let storeCode = groupStore;
        let start = groupDate;
        let date = groupDate;

        if (storeCode === '' || storeCode?.length === 0 || storeCode[0] === '') {
            message.warning("Please choose store to export");
            return false;
        }

        if (groupDate?.length == 1 && (groupDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))) {
            message.warning({ key: 'search', content: 'Vui lòng không chọn ngày hiện tại.' });
            return false;
        }

        if (dateModel === 'week') {
            start = groupDate.clone().startOf('week');
            date = groupDate.week() == moment().week() ? moment().subtract(1, 'days') : groupDate.clone().endOf('week');
        } else if (dateModel === 'month') {
            start = groupDate.clone().startOf('month');
            date = groupDate.month() == moment().month() ? moment().subtract(1, 'days') : groupDate.clone().endOf('month');
        }
        else {
            start = groupDate;
            date = groupDate;
        }

        const formatDate = 'YYYY-MM-DD';

        if (groupDate.month() > moment().month() && groupDate.year() > moment().year()) {
            message.warning('There is no data available for this month');
            return false;
        }
        setIsLoading(true);
        try {
            let params = {
                // type: props?.type,
                // method: 'email',
                start: start?.format(formatDate) === date?.format(formatDate) ? '' : start?.format(formatDate),
                date: date?.format(formatDate),
                storeCode: storeCode?.toString(),
            };

            const url = `/export/${props?.type}`;
            const response = await fetchData(url, 'POST', params, null);
            if (response?.status) {
                // return response.data;
                const url = response?.data?.downloadUrl;
                message.success("File sent successfully");
                downloadFile(url, '.csv');

                setIsLoading(false);
            }
            else {
                setIsLoading(false);
                return null;
            }
        } catch (error) {
            console.log('Error fetching data: ', error);
            message.error('Unable to export file, please contact IT');
            setIsLoading(false);
            return null;
        }
    }

    const onChangeMonth = (date, dateString) => {
        setDate(moment(date), 'MM/YYYY')
    }

    const disabledDate = current => {
        const today = moment();

        if (current.isAfter(today, 'month')) {
            return true;
        }

        const yearDisable = moment('2023-01-01', 'YYYY-MM-DD');
        return current.isBefore(yearDisable, 'month');
    };

    const handleUpdateShowHide = (val) => {
        setIsOpenDrawerExport(val)
    }

    return (
        <div>
            <DrawerComp width={400}
                isOpen={isOpenDrawerExport} keyFilter={'isOpenDrawerExport'} updateFilter={(val) => handleUpdateShowHide(val)}
            >
                <Row gutter={[16, 16]}>
                    <Col xl={24} >
                        <ModelGroupStore
                            // groupStore={groupStore}
                            setGroupStore={setGroupStore}
                            mode='multiple'
                        // maxChoose={maxChoose}
                        />

                    </Col>
                    <Col xl={24} >
                        <ModelGroupDate
                            groupDate={groupDate}
                            setGroupDate={setGroupDate}
                            dateModel={dateModel}
                            setDateModel={setDateModel}
                            isCurrentDate={false}
                        />

                    </Col>
                </Row>
                <Row gutter={16} className='mrt-10'>
                    <Col>
                        {/* <Tag className="h-30 icon-search" onClick={onSearch}>
                            <FileSearchOutlined /> <span className="icon-search-detail">Send</span>
                        </Tag> */}
                        <Button
                            onClick={onSearch}
                            style={{
                                background: '#007cff', color: '#f6ffed', borderColor: '#b7eb8f',
                                fontWeight: 'bold',
                                fontSize: 10,
                                padding: '2px 10px',
                            }}
                            loading={isLoading}
                        >
                            <FileSearchOutlined style={{ fontSize: 12 }} /> Send
                        </Button>
                    </Col>
                </Row>
            </DrawerComp >
        </div>
    )
}
{/* <ExportDataPopup type='detail/disposal' isOpenDrawerExport={this.isOpenDrawerExport} updateIsOpen={this.handleUpdateIsOpen}></ExportDataPopup> */ }