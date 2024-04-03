import crypto from 'crypto-js';
const HashingHelper = {
  encrypt: (word, key = process.env.REACT_APP_ENCRYPT_KEY) => {
    try {
      let encJson = crypto.AES.encrypt(JSON.stringify(word), key).toString();
      let encData = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(encJson));
      return encData;
    } catch (error) {
      return { status: 0, error: error };
    }
  },
  decrypt(word, key = process.env.REACT_APP_ENCRYPT_KEY) {
    try {
      let decData = crypto.enc.Base64.parse(word).toString(crypto.enc.Utf8);
      let bytes = crypto.AES.decrypt(decData, key).toString(crypto.enc.Utf8);
      return JSON.parse(bytes);
    } catch (error) {
      return { status: 0, error: error };
    }
  },
};
export default HashingHelper;
