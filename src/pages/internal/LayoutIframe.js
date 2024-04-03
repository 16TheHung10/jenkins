import React from 'react';
import crypto from 'crypto-js';
export default function LayoutIframe({ ...props }) {
  const iframeStyle = {
    width: '100%',
    height: 'calc(100vh - 46px)',
    border: 'none',
  };

  const encrypt = (word, key) => {
    try {
      let encJson = crypto.AES.encrypt(JSON.stringify(word), key).toString();
      let encData = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(encJson));
      return encData;
    } catch (error) {
      return { status: 0, error: error };
    }
  };

  const token = localStorage.getItem('accessToken');
  const profile = localStorage.getItem('profile');
  const secret = 'gs25@internal!#';

  let newProfile = JSON.parse(profile);
  newProfile.token = token;
  console.log({ newProfile });
  let dataEncrypted = Object.assign(
    { profile: null },
    {
      profile: newProfile,
    }
  );

  let dataCrypto = encrypt(dataEncrypted, secret);
  const url = props.urlRouter ?? '';
  const title = props.title ?? '';

  const domain = `${'https://internal.gs25.com.vn'}${url}?data=${dataCrypto}`;

  const iframeUrl = `${domain}`;

  return <iframe className="bg-iframe" src={iframeUrl} style={iframeStyle} title={title}></iframe>;
}
