import { Checkbox, Col, Radio, Select, message } from 'antd'
import React, { useState, useEffect, useContext } from 'react'

import { DataContext } from "context/DataContext";

export default function ModelGroupCategory({ ...props }) {
    const { data } = useContext(DataContext);
    const { groups } = data;

    const [selectedOption, setSelectedOption] = useState('');
    const [categoryOption, setCategoryOption] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (props?.groupCategory !== undefined) {
            if (props.mode !== undefined && props.mode === 'multiple') {
                setSelectedOption([props?.groupCategory]);
            }
            else {
                setSelectedOption(props?.groupCategory);
            }

        }
    }, [props?.groupCategory]);

    useEffect(() => {
        if (!!groups) {
            let listOpt = [];

            listOpt = Object.values(groups)?.map(el => (
                { value: el.groupCode, label: `${el.groupName}` }
            ))?.sort((a, b) => a.value >= b.value ? 1 : -1);

            setCategoryOption(listOpt);
        }
    }, [groups]);


    const handleSelectAllChange = (e) => {
        const checked = e.target.checked;

        if (checked) {
            const allValues = categoryOption.map(option => option.value).filter(val => val !== '');
            if (props.maxChoose !== undefined) {
                if (categoryOption?.length <= props.maxChoose) {

                    setSelectedOption(allValues);
                    setSelectAll(checked);
                    if (props.setGroupCategory !== undefined) {
                        props.setGroupCategory(allValues);
                    }
                }
                else {
                    message.warning({ key: 'categoryGroup', content: `Couldn't select more than ${props.maxChoose} category` });
                }
            }
            else {
                setSelectedOption(allValues);
                setSelectAll(checked);
                if (props.setGroupCategory !== undefined) {
                    props.setGroupCategory(allValues);
                }
            }


        } else {
            setSelectedOption(['']);
            setSelectAll(checked);
            if (props.setGroupCategory !== undefined) {
                props.setGroupCategory(['']);
            }
        }
    };

    const configSelect = {
        maxWidth: '100%',
        width: '100%'
    }


    const handleChangeCategory = (value) => {
        let data = (props.mode !== undefined && props.mode === 'multiple') ? (value[value?.length - 1] === '' ? '' : value.filter(el => el != '')) : (value === undefined ? '' : value);

        if (props.mode !== undefined && props.mode === 'multiple') {
            if (props.maxChoose !== undefined) {
                if (value?.length <= props.maxChoose) {
                }
                else {
                    message.warning({ key: 'categoryGroup', content: `Couldn't select more than ${props.maxChoose} category` });
                    data = value.filter(el => el != '').slice(0, -1);
                }
            }

            const allValues = categoryOption.map(option => option.value).filter(val => val !== '');
            setSelectAll(data.length === allValues.length);

            if (value?.length === 0) {
                data = [''];
            }
        }

        setSelectedOption(data);

        if (props.setGroupCategory !== undefined) {
            props.setGroupCategory(data);
        }
        if (props.setCategoryOpt !== undefined) {
            props.setCategoryOpt(categoryOption)
        }
    }

    const content = () => {
        return <>
            <label htmlFor="groupCode" className="w100pc">
                {props?.title !== undefined ? props.title : 'Category'}: &nbsp;&nbsp;
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
                options={categoryOption}
                onChange={(value) => handleChangeCategory(value)}
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
