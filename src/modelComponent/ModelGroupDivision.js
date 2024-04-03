import { Checkbox, Col, Radio, Select, message } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import './styleModelGroupDivision.scss'

import { DataContext } from "context/DataContext";

export default function ModelGroupDivision({ ...props }) {
    const { data } = useContext(DataContext);
    const { divisions } = data;

    const [selectedOption, setSelectedOption] = useState('');
    const [divisionOption, setDivisionOption] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (props?.groupDivision !== undefined) {
            if (props.mode !== undefined && props.mode === 'multiple') {
                setSelectedOption([props?.groupDivision]);
            }
            else {
                setSelectedOption(props?.groupDivision);
            }

        }
    }, [props?.groupDivision]);

    useEffect(() => {
        if (!!divisions) {
            let listOpt = [];

            listOpt = Object.values(divisions)?.map(el => (
                { value: el.divisionCode, label: `${el.divisionName}` }
            ))?.sort((a, b) => a.value >= b.value ? 1 : -1);

            setDivisionOption(listOpt);
        }
    }, [divisions]);


    const handleSelectAllChange = (e) => {
        const checked = e.target.checked;

        if (checked) {
            const allValues = divisionOption.map(option => option.value).filter(val => val !== '');
            if (props.maxChoose !== undefined) {
                if (divisionOption?.length <= props.maxChoose) {

                    setSelectedOption(allValues);
                    setSelectAll(checked);
                    if (props.setGroupDivision !== undefined) {
                        props.setGroupDivision(allValues);
                    }
                }
                else {
                    message.warning({ key: 'divisionGroup', content: `Couldn't select more than ${props.maxChoose} division` });
                }
            }
            else {
                setSelectedOption(allValues);
                setSelectAll(checked);
                if (props.setGroupDivision !== undefined) {
                    props.setGroupDivision(allValues);
                }
            }


        } else {
            setSelectedOption(['']);
            setSelectAll(checked);
            if (props.setGroupDivision !== undefined) {
                props.setGroupDivision(['']);
            }
        }
    };

    const configSelect = {
        maxWidth: '100%',
        width: '100%'
    }


    const handleChangeDivision = (value) => {
        let data = (props.mode !== undefined && props.mode === 'multiple') ? (value[value?.length - 1] === '' ? '' : value.filter(el => el != '')) : (value === undefined ? '' : value);

        if (props.mode !== undefined && props.mode === 'multiple') {
            if (props.maxChoose !== undefined) {
                if (value?.length <= props.maxChoose) {
                }
                else {
                    message.warning({ key: 'divisionGroup', content: `Couldn't select more than ${props.maxChoose} division` });
                    data = value.filter(el => el != '').slice(0, -1);
                }
            }

            const allValues = divisionOption.map(option => option.value).filter(val => val !== '');
            setSelectAll(data.length === allValues.length);

            if (value?.length === 0) {
                data = [''];
            }
        }

        setSelectedOption(data);

        if (props.setGroupDivision !== undefined) {
            props.setGroupDivision(data);
        }
        if (props.setDivisionOpt !== undefined) {
            props.setDivisionOpt(divisionOption)
        }
    }

    const content = () => {
        return <>
            <label htmlFor="divisionCode" className="w100pc">
                {props?.title !== undefined ? props.title : 'Division'}: &nbsp;&nbsp;
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
                options={divisionOption}
                onChange={(value) => handleChangeDivision(value)}
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
