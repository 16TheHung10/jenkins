import { Button, Col, Input, Row, Select } from 'antd';
import React from 'react';
import { useMemo } from 'react';
import SelectBox from "utils/selectBox";

const HeaderActions = ({ fields, onSubmit }) => {
    const renderField = useMemo(() => {
        const html = [];
        for (let field of fields) {
            switch (field.type) {
                case "input_number":
                    html.push(
                        <Col span={8} key={field.id}>
                            <label htmlFor="storeCode" className="w100pc">
                                {field.label}
                            </label>
                            <Input onChange={field.onChange} style={{ width: "100%" }} placeholder={field.placeholder} />
                        </Col>)
                    break;
                case "select":
                    html.push(<Col span={8} key={field.id}>
                        <label htmlFor="storeCode" className="w100pc">
                            {field.label}
                        </label>
                        <Select
                            defaultValue={null}
                            style={{ width: "100%" }}
                            onChange={field.onChange}
                            options={field.options}
                        />
                    </Col>)
                    break;
                default: break
            }
        }
        return html;
    }, [fields])
    return (
        <Row>
            {renderField}
            <Col span={24} onClick={onSubmit}><Button>Search</Button></Col>
        </Row >
    );
};

export default HeaderActions;