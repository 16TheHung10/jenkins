import React from 'react';
import PageNotFoundImg from 'images/404.png';

function NotFound(props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${PageNotFoundImg})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    ></div>
  );
}

export default NotFound;
