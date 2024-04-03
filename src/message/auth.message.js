import { message } from 'antd';

const AuthMessage = {
  Unauthorized: () => message.error({ content: 'Permission denined', duration: 3000, key: '401' }),
  403: () => message.error('Please wait'),
};
export default AuthMessage;
