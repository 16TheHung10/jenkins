import { Checkbox, Col, Radio, Select, message } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import './styleModelGroupSupplier.scss'
import { removeVietnameseDiacritics } from 'helpers/FuncHelper';

import { DataContext } from "context/DataContext";

export default function ModelGroupStore({ ...props }) {
    const { data } = useContext(DataContext);
    const { suppliers } = data;

    const [fcModel, setFcModel] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [supplierOption, setSupplierOption] = useState([]);
    const [supplierShow, setSupplierShow] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => { setFcModel(props.supplierModel) }, [props?.supplierModel]);

    useEffect(() => {
        if (props?.groupSupplier !== undefined) {
            if (props.mode !== undefined && props.mode === 'multiple') {
                setSelectedOption([props?.groupSupplier]);
            }
            else {
                setSelectedOption(props?.groupSupplier);
            }
            // console.log(props?.groupSupplier)
            if (props?.groupSupplier.startsWith('WH')) {
                setFcModel('F')
            }
            else {
                setFcModel('')
            }
        }
    }, [props?.groupSupplier]);

    useEffect(() => {
        if (!!suppliers) {
            let listOpt = [];

            // if (Object.keys(stores)?.length === 0) {
            //     let storeCode = JSON.parse(localStorage.getItem('profile'))?.storeCode;
            //     let storeName = storeCode + ' - ' + JSON.parse(localStorage.getItem('profile'))?.storeName;

            //     if (props.allowClear !== undefined && !props.allowClear) { }
            //     else {
            //         listOpt = [{ value: '', label: 'Select an option', fcModel: null, openedDate: null }];
            //     }
            //     listOpt.push({ value: storeCode, label: storeName, fcModel: null, openedDate: null });
            // }
            // else {
            // }
            listOpt = Object.values(suppliers)?.filter(el => el.status === 0)?.map(el => (
                { value: el.supplierCode, label: `${el.supplierCode} - ${el.supplierName}` }
            ));
            // if (props.allowClear !== undefined && !props.allowClear) { }
            // else {
            //     listOpt.unshift({ value: '', label: 'Select an option' });
            // }

            setSupplierOption(listOpt);
        }
    }, [suppliers]);

    useEffect(() => {
        if (fcModel !== '') {
            const filteredOptions = supplierOption.filter(option => option.value.startsWith('WH'))?.sort((a, b) => a.value >= b.value ? 1 : -1);
            setSupplierShow(filteredOptions);
            if (props.setSupplierOpt !== undefined) {
                props.setSupplierOpt(filteredOptions)
            }
        }
        else {
            const filteredOptions = supplierOption.filter(option => !option.value.startsWith('WH'))?.sort((a, b) => a.value >= b.value ? 1 : -1);
            setSupplierShow(filteredOptions);
            if (props.setSupplierOpt !== undefined) {
                props.setSupplierOpt(filteredOptions)
            }
        }
    }, [fcModel, supplierOption]);

    const handleSelectAllChange = (e) => {
        const checked = e.target.checked;

        if (checked) {
            const allValues = supplierShow.map(option => option.value).filter(val => val !== '');
            if (props.maxChoose !== undefined) {
                if (supplierShow?.length <= props.maxChoose) {

                    setSelectedOption(allValues);
                    setSelectAll(checked);
                    if (props.setGroupSupplier !== undefined) {
                        props.setGroupSupplier(allValues);
                    }
                }
                else {
                    message.warning({ key: 'supplierGroup', content: `Couldn't select more than ${props.maxChoose} suppliers` });
                }
            }
            else {
                setSelectedOption(allValues);
                setSelectAll(checked);
                if (props.setGroupSupplier !== undefined) {
                    props.setGroupSupplier(allValues);
                }
            }


        } else {
            setSelectedOption(['']);
            setSelectAll(checked);
            if (props.setGroupSupplier !== undefined) {
                props.setGroupSupplier(['']);
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
            if (props.setGroupSupplier !== undefined) {
                props.setGroupSupplier(['']);
            }
        }
        else {
            setSelectedOption('');
            if (props.setGroupSupplier !== undefined) {
                props.setGroupSupplier('');
            }
        }
        setSelectAll(false);
        if (props.setSupplierOpt !== undefined) {
            props.setSupplierOpt(supplierShow)
        }
    };

    const handleChangeSupplier = (value) => {
        // console.log(value)
        let data = (props.mode !== undefined && props.mode === 'multiple') ? (value[value?.length - 1] === '' ? '' : value.filter(el => el != '')) : (value === undefined ? '' : value);

        if (props.mode !== undefined && props.mode === 'multiple') {
            if (props.maxChoose !== undefined) {
                if (value?.length <= props.maxChoose) {
                }
                else {
                    message.warning({ key: 'supplierGroup', content: `Couldn't select more than ${props.maxChoose} suppliers` });
                    data = value.filter(el => el != '').slice(0, -1);
                }
            }

            const allValues = supplierShow.map(option => option.value).filter(val => val !== '');
            setSelectAll(data.length === allValues.length);

            if (value?.length === 0) {
                data = [''];
            }
        }

        setSelectedOption(data);

        if (props.setGroupSupplier !== undefined) {
            props.setGroupSupplier(data);
        }
        if (props.setSupplierOpt !== undefined) {
            props.setSupplierOpt(supplierShow)
        }
    }

    const content = () => {
        // console.log({ supplierModel: props.supplierModel, fcModel })
        return <>
            <label htmlFor="supplierCode" className="w100pc">
                {/* {props?.title !== undefined ? props.title : 'Supplier'}: &nbsp;&nbsp; */}
                {
                    props?.isLabel !== undefined && props?.isLabel === false ? '' :
                        <>
                            {
                                (suppliers && Object.keys(suppliers)?.length !== 0) &&
                                <Radio.Group onChange={handleRadioChange} value={fcModel} disabled={props.disabled ?? false}>
                                    <Radio value="">Supplier</Radio>
                                    <Radio value="F">Warehouse</Radio>
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
                options={supplierShow}
                onChange={(value) => handleChangeSupplier(value)}
                showSearch
                filterOption={(input, option) =>
                    removeVietnameseDiacritics(option.label.toLowerCase()).indexOf(removeVietnameseDiacritics(input.toLowerCase())) >= 0 || // Tìm kiếm theo label
                    removeVietnameseDiacritics(option.value.toLowerCase()).indexOf(removeVietnameseDiacritics(input.toLowerCase())) >= 0 // Tìm kiếm theo value
                }
                maxTagCount='responsive'
                allowClear={props.allowClear !== undefined && !props.allowClear ? props.allowClear : true}
                disabled={props.disabled ?? false}
            />
        </>
    }

    return <>{content()}</>;
}
