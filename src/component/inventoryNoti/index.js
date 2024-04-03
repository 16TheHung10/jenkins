import { Button, Image, Tag } from 'antd';
import React from 'react'
import { useHistory } from 'react-router-dom';
import ImageWaiting from 'images/Waiting-bro.png';

export default function InventoryNoti() {
    const history = useHistory();

    const navigateToHome = () => {
        history.push('/');
    };

    return (
        <div style={{ padding: '10px 0' }}>
            <h6 className="cl-red pos-relative" style={{ padding: '0 15px' }}>
                Dữ liệu đang được cập nhật, vui lòng quay lại sau. <Tag color='error' onClick={navigateToHome} className="cursor h-30" style={{ lineHeight: '30px' }}>Back</Tag>
            </h6>
            <Image
                width={400}
                src={ImageWaiting}
            />
        </div>
    )
}
