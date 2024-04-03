import React from 'react'
import PageErrorImg from 'images/pageError.png';
import { message } from 'antd';

export default function ErrorTheme({ ...props }) {
    console.log(props)
    const renderMessage = () => {
        message.error({ key: 'errorMes', content: props.message });
    }

    return (
        <div style={{ width: '100%', height: '100%', backgroundImage: `url(${PageErrorImg})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            {props?.message && renderMessage()}
        </div>
    )
}