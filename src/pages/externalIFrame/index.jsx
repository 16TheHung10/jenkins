import React, { useMemo } from 'react';
import crypto from 'crypto-js';
import { useLocation, useParams } from 'react-router-dom';
import { HashingHelper, UrlHelper } from 'helpers';
const iframeStyle = {
  width: '100%',
  height: 'calc(100vh - 46px)',
  border: 'none',
};

export default function ExternalIFrame({ url, ...props }) {
  const location = useLocation();

  const searchObject = useMemo(() => {
    let params = UrlHelper.getSearchParamsObject();
    let linkDecrypt = HashingHelper.decrypt(params.link, 'gs25@internal!#');
    return { ...params, link: linkDecrypt };
  }, [location.search]);

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
  let dataEncrypted = Object.assign(
    { profile: null },
    {
      profile: newProfile,
    }
  );

  let dataCrypto = encrypt(dataEncrypted, secret);
  const title = props.title ?? '';
  const iframeUrl = `${searchObject?.link}?data=${dataCrypto}`;

  return <iframe className="bg-iframe" src={iframeUrl} style={iframeStyle} title={title}></iframe>;
}
