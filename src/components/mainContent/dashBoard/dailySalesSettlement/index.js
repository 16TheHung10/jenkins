import { Row, Tabs } from 'antd';
import React from 'react'
import Yesterday from './Yesterday';
import Disposal from './Disposal';
import DetailMonth from './DetailMonth';
import SalesByStore from './SalesByStore';
import SalesByCategory from './SalesByCategory';
import SalesByTime from './SalesByTimeDaily';

export default function DailySalesSettlement({ ...props }) {
    // console.log({ props })
    const renderTab = () => {
        const tabList = [
            {
                label: (
                    <span>
                        Yesterday
                    </span>
                ),
                key: '1',
                children: <div className="container-table pd-0">
                    {/* <BreadCrumb data={dataBreadCrumb} /> */}
                    <div className="col-md-12">
                        <Yesterday />
                    </div>
                </div>
            },
            {
                label: (
                    <span>
                        Disposal
                    </span>
                ),
                key: '2',
                children:
                    <div className="container-table pd-0">
                        <div className='col-md-12'>
                            <Disposal isStore={true} />
                        </div>
                    </div >
            },
            {
                label: (
                    <span>
                        Detail (2 months)
                    </span>
                ),
                key: '3',
                children: <div className="container-table pd-0">
                    <div className='col-md-12'>
                        <DetailMonth />
                    </div>
                </div>
            },
            {
                label: (
                    <span>
                        Sales by store
                    </span>
                ),
                key: '4',
                children: <div className="container-table pd-0">
                    <div className='col-md-12'>
                        <SalesByStore />
                    </div>
                </div>
            },
            {
                label: (
                    <span>
                        Sales by category
                    </span>
                ),
                key: '5',
                children: <div className="container-table pd-0">
                    <div className='col-md-12'>
                        <SalesByCategory />
                    </div>
                </div>
            },
            {
                label: (
                    <span>
                        Sales by shift
                    </span>
                ),
                key: '6',
                children: <div className="container-table pd-0">
                    <div className='col-md-12'>
                        <SalesByTime />
                    </div>
                </div>
            }
        ];

        return <>

            <Row gutter={30}>
                {/* <Col xl={24}> */}
                <div className="card-container" style={{ width: '100%' }}>
                    <Tabs
                        defaultActiveKey="1"
                        items={tabList}
                        type="card"
                    />
                </div >
                {/* </Col> */}
            </Row >
        </>
    }
    return (
        <>{renderTab()}</>
    )
}
