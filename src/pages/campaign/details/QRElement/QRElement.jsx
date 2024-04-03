import QRCode from 'qrcode.react';
import React from 'react';
import QRBACKGROUND from '../../../../images/logoCircle.png';
const QRElement = ({ data, id, logoWidth = 50, logoHeight = 50, ...props }) => {
  return (
    <QRCode
      imageSettings={{
        src: QRBACKGROUND,
        excavate: true,
        width: logoWidth,
        height: logoHeight,
      }}
      id={id}
      level={'H'}
      includeMargin={true}
      fgColor="#000"
      value={data || 'Empty data'}
      {...props}
    />
  );
};

export default QRElement;

