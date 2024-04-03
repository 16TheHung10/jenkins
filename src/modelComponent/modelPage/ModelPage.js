import React, { cloneElement, useContext, useRef, useState } from 'react'
import { Button, Col, Dropdown, Row, Space, Tabs, Tag, message } from 'antd';
import { useHistory } from 'react-router-dom';
import './style.scss';

export default function ModelPage({ ref, children, actions, onClickEvents, actionsBody, onClickEventsBody, ...rest }) {

    const [loading, setLoading] = useState({});
    const childRef = useRef(null);
    // const childRef = ref;
    const history = useHistory();
    const [actionsState, setActionsState] = useState(actions ?? []);
    const [actionsStateBody, setActionsStateBody] = useState(actionsBody ?? []);

    let timeout = null;


    const handleActionClick = async (action) => {

        console.log({ childRef, actionName: action.name })
        const updatedOnClickEvents = onClickEvents(childRef, history, loading);
        if (updatedOnClickEvents[action.name]) {

            setLoading({ ...loading, [action.name]: true });

            // if (action.timeout) {
            //     timeout = setTimeout(async () => {
            //         try {
            //             await updatedOnClickEvents[action.name](action.name);
            //             setLoading({ ...loading, [action.name]: false });
            //         } catch (error) {
            //             setLoading({ ...loading, [action.name]: false });
            //             console.log(error);
            //         }
            //     }, 500);
            // }
            // else {
            //     try {
            //         await updatedOnClickEvents[action.name](action.name);
            //         setLoading({ ...loading, [action.name]: false });
            //     } catch (error) {
            //         setLoading({ ...loading, [action.name]: false });
            //         console.log(error);
            //     }
            // }
            try {
                await updatedOnClickEvents[action.name](action.name);
                setLoading({ ...loading, [action.name]: false });
            } catch (error) {
                setLoading({ ...loading, [action.name]: false });
                console.log(error);
            }
        }
        else {
            message.warning({ key: 'noAction', content: 'Can found action' });
        }
    }

    const styleBoxShadow = {
        padding: '3px 0'
    }

    const colorButton = {
        'green': { background: '#52c41a', color: '#f6ffed', borderColor: '#b7eb8f' },
        'blue': { background: '#1890ff', color: '#e6f7ff', borderColor: '#e6f7ff' },
        'red': { background: '#ff4d4f', color: '#fff2f0', borderColor: '#ffccc7' },
        'orange': { background: '#faad14', color: '#fffbe6', borderColor: '#ffe58f' },
        'default': { background: '#000000d9', color: '#fafafa', borderColor: '#d9d9d9' }
    };

    const renderAction = () => {
        const actionLeft = actionsState?.filter(item => item.position === 'left' && item.hidden == false) ?? [];
        const actionRight = actionsState?.filter(item => item.position === 'right' && item.hidden == false) ?? [];

        // console.log({ actionsState, actionLeft })
        return (
            // <div style={{
            //     // height: '31px',
            //     // background: '#fff',
            //     // background: '#f6ffed',
            //     // padding: '0 15px',
            //     // boxShadow: 'rgba(0, 124, 255, 0.16) 0px 1px 3px, rgba(0, 124, 255, 0.23) 0px 1px 3px'
            //     // boxShadow: 'rgba(240, 242, 245, 1) 0px 3px 6px'
            // }
            // }>
            <Row gutter={[30, 24]} style={styleBoxShadow}>
                <Col xl={16}>
                    {
                        actionLeft?.length !== 0 ?
                            <>
                                <Space>
                                    {
                                        actionLeft?.map((action, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => handleActionClick(action)}
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: 10,
                                                    // height: 25,
                                                    padding: '2px 10px',
                                                    display: action.hidden ? 'none' : 'inline-block',
                                                    background: (action.color && colorButton[action.color]) ? colorButton[action.color].background : colorButton.default.background,
                                                    color: (action.color && colorButton[action.color]) ? colorButton[action.color].color : colorButton.default.color,
                                                    borderColor: (action.color && colorButton[action.color]) ? colorButton[action.color].borderColor : colorButton.default.borderColor,
                                                }}
                                                loading={loading[action.name]}
                                            >
                                                {action.label}
                                            </Button>
                                        ))
                                    }
                                </Space>
                            </>
                            : null
                    }
                </Col>

                <Col xl={8} className='text-right' >
                    {
                        actionRight?.length !== 0 ?
                            <>
                                <Space>
                                    {
                                        actionRight?.map((action, index) => (

                                            <Button
                                                key={action.name}
                                                onClick={() => handleActionClick(action)}
                                                style={{
                                                    display: action.hidden ? 'none' : 'inline-block',
                                                    marginLeft: 'auto',
                                                    fontWeight: 'bold',
                                                    fontSize: 10,
                                                    // height: 25,
                                                    padding: '2px 10px',
                                                    background: (action.color && colorButton[action.color]) ? colorButton[action.color].background : colorButton.default.background,
                                                    color: (action.color && colorButton[action.color]) ? colorButton[action.color].color : colorButton.default.color,
                                                    borderColor: (action.color && colorButton[action.color]) ? colorButton[action.color].borderColor : colorButton.default.borderColor,
                                                }}
                                                loading={loading[action.name]}
                                            >
                                                {action.label}
                                            </Button>

                                        ))
                                    }
                                </Space>
                            </>
                            : null
                    }
                </Col>
            </Row>
            // </div >
        );
    }

    const renderActionBody = () => {
        const action = actionsStateBody ?? [];

        return <>
            {
                action?.length > 0 ?
                    <Space size={'small'}>
                        {
                            action?.map((act, index) => (
                                <Button
                                    key={act.name}
                                    // onClick={() => handleActionBodyClick(act)}
                                    style={{
                                        display: act.hidden ? 'none' : 'inline-block',
                                        marginLeft: 'auto',
                                        fontWeight: 'bold',
                                        fontSize: 10,
                                        // height: 25,
                                        padding: '2px 10px',
                                        background: (act.color && colorButton[act.color]) ? colorButton[act.color].background : colorButton.default.background,
                                        color: (act.color && colorButton[act.color]) ? colorButton[act.color].color : colorButton.default.color,
                                        borderColor: (act.color && colorButton[act.color]) ? colorButton[act.color].borderColor : colorButton.default.borderColor,
                                    }}
                                    loading={loading[act.name]}
                                >
                                    {act.label}
                                </Button>
                            ))
                        }
                    </Space>
                    : null
            }
        </>
    }

    const updateActions = (newActions) => {
        // console.log({ newActions })
        let data = newActions;
        setActionsState(data);
    };

    const updateActionsBody = (newActions) => {
        // console.log({ newActions })
        let data = newActions;
        setActionsStateBody(data);
    };


    const renderChildren = () => {
        return cloneElement(children, { ref: childRef, actions: actionsState, updateActions, updateActionsBody, renderActionBody }, { ...rest });
    }

    const renderBody = () => {
        const actionLeft = actionsState?.filter(item => item.position === 'left') ?? [];
        const actionRight = actionsState?.filter(item => item.position === 'right') ?? [];
        let divHeight = (actionLeft.length > 0 || actionRight.length > 0) ? 'calc(100% - 38px)' : '100%';
        const isShow = actionsState.some(item => item.hidden === false);

        return (
            <>
                {(actionsState.length > 0 && isShow) && renderAction()}

                <div style={{
                    margin: '0 -15px',
                    // height: '100%', 
                    height: divHeight,
                    overflowY: 'auto'
                }}>

                    <div style={{
                        padding: '0 15px',
                        // overflowY: 'auto', 
                        // height: divHeight,
                        height: '100%',
                        background: 'rgba(240, 242, 245, .3)',

                    }}>

                        <Row gutter={[30, 8]} >
                            <Col xl={24} style={{ height: '100%' }}>
                                {renderChildren()}
                            </Col>
                        </Row>
                    </div>
                </div>

            </>
        )
    }

    return (
        <>{renderBody()}</>
    )
}
