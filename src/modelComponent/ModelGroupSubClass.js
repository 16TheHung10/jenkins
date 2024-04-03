import { Checkbox, Col, Radio, Select, message } from 'antd'
import React, { useState, useEffect, useContext } from 'react'

import { DataContext } from "context/DataContext";

export default function ModelGroupSubClass({ ...props }) {
    const { data } = useContext(DataContext);
    const { subclasses } = data;

    const [selectedOption, setSelectedOption] = useState('');
    const [subclassesOption, setSubclassesOption] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (props?.groupSubclasses !== undefined) {
            if (props.mode !== undefined && props.mode === 'multiple') {
                setSelectedOption([props?.groupSubclasses]);
            }
            else {
                setSelectedOption(props?.groupSubclasses);
            }

        }
    }, [props?.groupSubclasses]);

    useEffect(() => {
        if (!!subclasses) {
            let listOpt = [];

            listOpt = Object.values(subclasses)?.map(el => (
                { value: el.subClassCode, label: `${el.subClassName}`, groupCode: el.groupCode }
            ))?.sort((a, b) => a.value >= b.value ? 1 : -1);

            setSubclassesOption(listOpt);
        }
    }, [subclasses]);


    const handleSelectAllChange = (e) => {
        const checked = e.target.checked;

        if (checked) {
            const allValues = subclassesOption.map(option => option.value).filter(val => val !== '');
            if (props.maxChoose !== undefined) {
                if (subclassesOption?.length <= props.maxChoose) {

                    setSelectedOption(allValues);
                    setSelectAll(checked);
                    if (props.setGroupSubclasses !== undefined) {
                        props.setGroupSubclasses(allValues);
                    }
                }
                else {
                    message.warning({ key: 'subclassesGroup', content: `Couldn't select more than ${props.maxChoose} subclasses` });
                }
            }
            else {
                setSelectedOption(allValues);
                setSelectAll(checked);
                if (props.setGroupSubclasses !== undefined) {
                    props.setGroupSubclasses(allValues);
                }
            }


        } else {
            setSelectedOption(['']);
            setSelectAll(checked);
            if (props.setGroupSubclasses !== undefined) {
                props.setGroupSubclasses(['']);
            }
        }
    };

    const configSelect = {
        maxWidth: '100%',
        width: '100%'
    }


    const handleChangeSubclasses = (value) => {
        let data = (props.mode !== undefined && props.mode === 'multiple') ? (value[value?.length - 1] === '' ? '' : value.filter(el => el != '')) : (value === undefined ? '' : value);

        if (props.mode !== undefined && props.mode === 'multiple') {
            if (props.maxChoose !== undefined) {
                if (value?.length <= props.maxChoose) {
                }
                else {
                    message.warning({ key: 'subclassesGroup', content: `Couldn't select more than ${props.maxChoose} subclasses` });
                    data = value.filter(el => el != '').slice(0, -1);
                }
            }

            const allValues = subclassesOption.map(option => option.value).filter(val => val !== '');
            setSelectAll(data.length === allValues.length);

            if (value?.length === 0) {
                data = [''];
            }
        }

        setSelectedOption(data);

        if (props.setGroupSubclasses !== undefined) {
            props.setGroupSubclasses(data);
        }
        if (props.setSubclassesOpt !== undefined) {
            props.setSubclassesOpt(subclassesOption)
        }
    }

    const content = () => {
        return <>
            <label htmlFor="subclassesCode" className="w100pc">
                {props?.title !== undefined ? props.title : 'Sub category'}: &nbsp;&nbsp;
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
                options={subclassesOption}
                onChange={(value) => handleChangeSubclasses(value)}
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
