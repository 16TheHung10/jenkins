import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Row, Col } from 'antd'

export default function DrawerPromo({ data, invoiceCode }) {

    const [item, setItem] = useState(null);

    useEffect(() => {
        if (invoiceCode != '' && data?.length > 0) {
            const itemfilter = data?.find(item => item.invoiceCode == invoiceCode);
            const filterList = (itemfilter != undefined) ? data?.filter(el => el.itemPromotionCode?.slice(0, 2) == 'DI' && el.invoiceCode == itemfilter.invoiceCode) : [];
            if (filterList?.length > 0) {
                setItem(filterList);
            }
            else {
                setItem(itemfilter)
            }
        }
    }, [invoiceCode, data]);

    const renderItem = (object) => {
        return <>
            {
                object != undefined && Object.keys(object)?.map((key, index) => <Fragment key={index}>
                    {key} - {object[key]}
                </Fragment>)
            }
        </>
    }

    const renderGroupItem = (object, type) => {
        return <>
            <Row gutter={[16, 8]}>
                <Col xl={6}><b>Item buy:</b></Col>
                <Col xl={18}>{renderItem(object['Buy'])}</Col>
            </Row>
            {type == 'BG' && <Row gutter={[16, 8]}>
                <Col xl={6}><b>Item gift:</b></Col>
                <Col xl={18}>{renderItem(object['Gift'])}</Col>
            </Row>}
            {type == 'BD' && <Row gutter={[16, 8]}>
                <Col xl={6}><b>Item discount:</b></Col>
                <Col xl={18}>{renderItem(object['Discount'])}</Col>
            </Row>}
        </>
    }

    const renderGroupCode = (object, promoCode) => {
        const type = promoCode.slice(0, 2);

        return <>
            {
                object != undefined && (type == 'BG' || type == 'BD') && Object.keys(object)?.map((key, index) => {
                    return <div key={index}>
                        <hr style={{ borderStyle: 'dashed', borderColor: '#000', margin: '2px 0 5px' }} />
                        <Row key={index} gutter={[16, 8]}>
                            <Col xl={6}><b>Group code:</b></Col>
                            <Col xl={18}>{key}</Col>
                        </Row>
                        {renderGroupItem(object[key], type)}
                    </div>
                })
            }
        </>
    }

    const renderPromoCode = (object) => {
        return Object.keys(object)?.map((key, index) => {
            const type = key.slice(0, 2);
            return <Fragment key={index}>
                {
                    (type == 'BG' || type == 'BD') ? <div className='section-block mrb-10' >
                        <Row key={index} gutter={[16, 8]}>
                            <Col xl={6}><b>Promotion code:</b></Col>
                            <Col xl={18}>{key}</Col>
                        </Row>
                        {renderGroupCode(object[key], key)}
                    </div> : null
                }
            </Fragment>
        })
    }

    const renderPromoCodeArr = (list) => {
        return <>
            {list?.map((item, index) => <div key={index} className='section-block mrb-10'>
                {renderItemArr(item)}
            </div>)}
        </>
    }

    const renderItemArr = (object) => {
        return <Row gutter={[16, 8]}>
            <Col xl={6}><b>Item :</b></Col>
            <Col xl={18}>{object.barcode} - {object.itemName}</Col>
        </Row>
    }

    const renderBody = useMemo(() => {
        return (
            <>
                {
                    item != null && item != undefined && typeof item === 'object' && item?.promoCode && renderPromoCode(item?.promoCode)
                }
                {
                    item != null && item != undefined && Array.isArray(item) && item?.length > 0 && renderPromoCodeArr(item)
                }
            </>
        )
    }, [invoiceCode, data, item]
    )

    return <>{renderBody}</>
}
