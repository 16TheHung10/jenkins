import { Checkbox, Col, Radio, Select, message } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import './styleModelGroupStore.scss'

import { DataContext } from "context/DataContext";

export default function ModelGroupStoreFix({ ...props }) {
    const { data } = useContext(DataContext);
    const { stores } = data;

    const [fcModel, setFcModel] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [storeOption, setStoreOption] = useState([]);
    const [storeShow, setStoreShow] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (props?.groupStore !== undefined) {
            if (props.mode !== undefined && props.mode === 'multiple') {
                setSelectedOption([props?.groupStore]);
            }
            else {
                setSelectedOption(props?.groupStore);
            }
        }
    }, [props?.groupStore]);

    useEffect(() => {
        if (!!stores) {
            let listStoreOpt = [];

            if (Object.keys(stores)?.length === 0) {
                let storeCode = JSON.parse(localStorage.getItem('profile'))?.storeCode;
                let storeName = storeCode + ' - ' + JSON.parse(localStorage.getItem('profile'))?.storeName;

                if (props.allowClear !== undefined && !props.allowClear) { }
                else {
                    listStoreOpt = [{ value: '', label: 'Select an option', isFranchise: null, openedDate: null }];
                }
                listStoreOpt.push({ value: storeCode, label: storeName, isFranchise: null, openedDate: null });
            }
            else {
                listStoreOpt = Object.values(stores)?.filter(el => el.status === 0 || el.status === 2)?.map(el => (
                    { value: el.storeCode, label: `${el.storeCode} - ${el.storeName}`, isFranchise: el.isFranchise, openedDate: el.openedDate }
                ));
                if (props.allowClear !== undefined && !props.allowClear) { }
                else {
                    listStoreOpt.unshift({ value: '', label: 'Select an option', isFranchise: null, openedDate: null });
                }

            }

            setStoreOption(listStoreOpt);
        }
    }, [stores]);

    useEffect(() => {
        if (storeOption?.length > 0) {
            const filteredOptionsFC = storeOption.filter(option => option.isFranchise == true);
            const filteredOptions = storeOption.filter(option => (option.isFranchise == null || option.isFranchise == false));

            if (fcModel !== '') {
                setStoreShow(filteredOptionsFC);

                if (props.setStoreOpt !== undefined) {
                    props.setStoreOpt(filteredOptionsFC)
                }
            }
            else {
                if (filteredOptions?.length == 0) {
                    setFcModel('F');
                    setStoreShow(filteredOptionsFC);
                    if (props.setStoreOpt !== undefined) {
                        props.setStoreOpt(filteredOptionsFC)
                    }
                }
                else {
                    setStoreShow(filteredOptions);
                    if (props.setStoreOpt !== undefined) {
                        props.setStoreOpt(filteredOptions)
                    }
                }
            }
        }
    }, [fcModel, storeOption,]);

    useEffect(() => {
        if (props?.groupStore !== undefined) {

            setSelectedOption(props?.groupStore);

            const isStoreFC = storeOption.filter(option => (option.value === props?.groupStore && props?.groupStore !== '' && option.isFranchise == true))
            // const isStoreFC = storeOption.filter(option => (option.value === props?.groupStore && props?.groupStore !== '' && option.fcModel == true))

            if (isStoreFC?.length > 0) {
                setFcModel('F');
            }
            else {
                setFcModel('');
            }
            // if (props.mode !== undefined && props.mode === 'multiple') {
            //     setSelectedOption([props?.groupStore]);
            // }
            // else {
            //     setSelectedOption(props?.groupStore);
            // }
        }
    }, [props?.groupStore]);

    const handleSelectAllChange = (e) => {
        const checked = e.target.checked;

        if (checked) {
            const allValues = storeShow.map(option => option.value).filter(val => val !== '');
            if (props.maxChoose !== undefined) {
                if (storeShow?.length <= props.maxChoose) {

                    setSelectedOption(allValues);
                    setSelectAll(checked);
                    if (props.setGroupStore !== undefined) {
                        props.setGroupStore(allValues);
                    }
                }
                else {
                    message.warning({ key: 'storeGroup', content: `Couldn't select more than ${props.maxChoose} stores` });
                }
            }
            else {
                setSelectedOption(allValues);
                setSelectAll(checked);
                if (props.setGroupStore !== undefined) {
                    props.setGroupStore(allValues);
                }
            }


        } else {
            setSelectedOption(['']);
            setSelectAll(checked);
            if (props.setGroupStore !== undefined) {
                props.setGroupStore(['']);
            }
        }
    };

    const configSelect = {
        maxWidth: '100%',
        width: '100%'
    }

    const handleRadioChange = (e) => {
        const val = e.target.value ?? '';
        setFcModel(val);
        if (props.mode !== undefined && props.mode === 'multiple') {
            setSelectedOption(['']);
            if (props.setGroupStore !== undefined) {
                props.setGroupStore(['']);
            }
        }
        else {
            setSelectedOption('');
            if (props.setGroupStore !== undefined) {
                props.setGroupStore('');
            }
        }
        setSelectAll(false);
        if (props.setStoreOpt !== undefined) {
            props.setStoreOpt(storeShow)
        }
    };

    const handleChangeStore = (value) => {
        // console.log(value)
        let data = (props.mode !== undefined && props.mode === 'multiple') ? (value[value?.length - 1] === '' ? '' : value.filter(el => el != '')) : (value === undefined ? '' : value);

        if (props.mode !== undefined && props.mode === 'multiple') {
            if (props.maxChoose !== undefined) {
                if (value?.length <= props.maxChoose) {
                }
                else {
                    message.warning({ key: 'storeGroup', content: `Couldn't select more than ${props.maxChoose} stores` });
                    data = value.filter(el => el != '').slice(0, -1);
                }
            }

            const allValues = storeShow.map(option => option.value).filter(val => val !== '');
            setSelectAll(data.length === allValues.length);

            if (value?.length === 0) {
                data = [''];
            }
        }

        setSelectedOption(data);

        if (props.setGroupStore !== undefined) {
            props.setGroupStore(data);
        }
        if (props.setStoreOpt !== undefined) {
            props.setStoreOpt(storeShow)
        }
    }

    const content = () => {
        return <>
            <label htmlFor="storeCode" className="w100pc">
                {props?.title !== undefined ? props.title : 'Store'}: &nbsp;&nbsp;
                {
                    props?.isLabel !== undefined && props?.isLabel === false ? '' :
                        <>
                            {
                                (stores && Object.keys(stores)?.length !== 0) &&
                                <Radio.Group onChange={handleRadioChange} value={fcModel}>
                                    <Radio value="">Direct</Radio>
                                    <Radio value="F">Franchise</Radio>
                                </Radio.Group>
                            }
                        </>
                }

                {
                    props.mode !== undefined && props.mode === 'multiple' ?
                        <Checkbox onChange={handleSelectAllChange} checked={selectAll}>
                            All
                        </Checkbox>
                        : null
                }
            </label>
            <Select
                mode={props.mode ? (props.mode !== 'multiple' ? props.mode : 'multiple') : ''}
                value={selectedOption}
                style={configSelect}
                options={storeShow}
                onChange={(value) => handleChangeStore(value)}
                showSearch
                filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || // Tìm kiếm theo label
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 // Tìm kiếm theo value
                }
                maxTagCount='responsive'
                allowClear={props.allowClear !== undefined && !props.allowClear ? props.allowClear : true}
                disabled={props.disabled ?? false}
            />
        </>
    }

    return <>{content()}</>;
}
